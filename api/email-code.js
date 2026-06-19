const crypto = require("crypto");
const { admin, db, setCors, verifyFirebaseToken, sendAuthError } = require("./_auth");

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function codeHash(uid, email, code) {
  const secret = process.env.EMAIL_CODE_SECRET || process.env.RESEND_API_KEY || "odontodex-email-code";
  return crypto.createHash("sha256").update(`${uid}:${email}:${code}:${secret}`).digest("hex");
}

function generateCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

function timestampFromNow(ms) {
  return admin.firestore.Timestamp.fromDate(new Date(Date.now() + ms));
}

async function sendWithResend({ to, code }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const err = new Error("RESEND_API_KEY nao configurada");
    err.statusCode = 500;
    throw err;
  }

  const from = process.env.RESEND_FROM_EMAIL || "OdontoDex <verificacao@odontodex.com.br>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Seu código de verificação do OdontoDex",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
          <h1 style="font-size:22px;margin:0 0 12px">Código de verificação OdontoDex</h1>
          <p style="font-size:15px;margin:0 0 16px">Digite este código no app para liberar seus 7 dias de Premium grátis:</p>
          <div style="font-size:32px;font-weight:800;letter-spacing:6px;background:#F5EEFB;color:#7C3FA0;border-radius:14px;padding:18px 20px;text-align:center">${code}</div>
          <p style="font-size:13px;color:#64748B;margin:16px 0 0">Este código expira em 10 minutos. Se você não solicitou este acesso, ignore este email.</p>
        </div>
      `,
      text: `Seu código de verificação do OdontoDex é ${code}. Ele expira em 10 minutos.`,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.message || data?.error || "Falha ao enviar email pelo Resend");
    err.statusCode = response.status;
    throw err;
  }
  return data;
}

async function handleSendCode(req, res, decodedToken) {
  const uid = decodedToken.uid;
  const authUser = await admin.auth().getUser(uid);
  const email = normalizeEmail(authUser.email || decodedToken.email);
  if (!email) return res.status(400).json({ ok: false, error: "Email ausente" });
  if (authUser.emailVerified === true) return res.status(200).json({ ok: true, status: "already_verified" });

  const codeRef = db.collection("emailVerificationCodes").doc(uid);
  const existing = await codeRef.get();
  const existingData = existing.exists ? existing.data() || {} : {};
  const resendAvailableAt = existingData.resendAvailableAt?.toDate?.();
  if (resendAvailableAt && resendAvailableAt > new Date()) {
    const seconds = Math.ceil((resendAvailableAt.getTime() - Date.now()) / 1000);
    return res.status(429).json({ ok: false, status: "cooldown", seconds, error: `Aguarde ${seconds}s para reenviar.` });
  }

  const code = generateCode();
  await codeRef.set({
    uid,
    email,
    codeHash: codeHash(uid, email, code),
    attempts: 0,
    expiresAt: timestampFromNow(CODE_TTL_MS),
    resendAvailableAt: timestampFromNow(RESEND_COOLDOWN_MS),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  await sendWithResend({ to: email, code });
  return res.status(200).json({ ok: true, status: "sent", resendSeconds: 60, expiresMinutes: 10 });
}

async function handleVerifyCode(req, res, decodedToken) {
  const uid = decodedToken.uid;
  const submittedCode = String(req.body?.code || "").replace(/\D/g, "");
  if (!/^\d{6}$/.test(submittedCode)) {
    return res.status(400).json({ ok: false, status: "invalid_code", error: "Digite o código de 6 dígitos." });
  }

  const authUser = await admin.auth().getUser(uid);
  const email = normalizeEmail(authUser.email || decodedToken.email);
  if (!email) return res.status(400).json({ ok: false, error: "Email ausente" });
  if (authUser.emailVerified === true) return res.status(200).json({ ok: true, status: "already_verified" });

  const codeRef = db.collection("emailVerificationCodes").doc(uid);
  const codeDoc = await codeRef.get();
  if (!codeDoc.exists) {
    return res.status(404).json({ ok: false, status: "code_missing", error: "Solicite um novo código." });
  }

  const data = codeDoc.data() || {};
  const expiresAt = data.expiresAt?.toDate?.();
  if (!expiresAt || expiresAt <= new Date()) {
    return res.status(410).json({ ok: false, status: "expired", error: "Código expirado. Solicite um novo código." });
  }
  if ((data.attempts || 0) >= MAX_ATTEMPTS) {
    return res.status(429).json({ ok: false, status: "too_many_attempts", error: "Muitas tentativas. Solicite um novo código." });
  }

  const matches = data.email === email && data.codeHash === codeHash(uid, email, submittedCode);
  if (!matches) {
    await codeRef.update({
      attempts: admin.firestore.FieldValue.increment(1),
      lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(400).json({ ok: false, status: "wrong_code", error: "Codigo incorreto." });
  }

  await admin.auth().updateUser(uid, { emailVerified: true });
  await db.collection("users").doc(uid).set({
    emailVerificado: true,
    emailVerificadoEm: admin.firestore.FieldValue.serverTimestamp(),
    emailNormalizado: email,
  }, { merge: true });
  await codeRef.delete();

  return res.status(200).json({ ok: true, status: "verified" });
}

module.exports = async (req, res) => {
  if (setCors(req, res, "https://www.odontodex.com.br")) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let decodedToken;
  try {
    decodedToken = await verifyFirebaseToken(req);
  } catch (e) {
    return sendAuthError(res, e);
  }

  try {
    const action = req.body?.action;
    if (action === "send") return await handleSendCode(req, res, decodedToken);
    if (action === "verify") return await handleVerifyCode(req, res, decodedToken);
    return res.status(400).json({ ok: false, error: "Acao invalida" });
  } catch (e) {
    console.error("email-code error", e);
    return res.status(e.statusCode || 500).json({ ok: false, error: e.message || "Erro ao processar código" });
  }
};
