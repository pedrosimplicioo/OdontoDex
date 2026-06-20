function renderForcepsWidget(inputId, confirmId, resultId, alertId, passo6Id){
  var val = document.getElementById(inputId).value.replace(/[^0-9]/g,'');
  var n = parseInt(val);
  var confirm = document.getElementById(confirmId);
  var result = document.getElementById(resultId);
  var p6 = document.getElementById(passo6Id);

  const validPermanent = (n >= 11 && n <= 48);
  const validDeciduous = (n >= 51 && n <= 85);

  if(val.length < 2 || !n || (!validPermanent && !validDeciduous)){
    if(typeof hideInternalShow === "function") {
      hideInternalShow(confirm);
      hideInternalShow(result);
    } else {
      confirm.classList.remove('show');
      result.classList.remove('show');
    }
    if(p6){ p6.className='step-txt'; p6.textContent='Selecione o dente acima para ver o fórceps indicado'; }
    return;
  }
  var f = FORCEPS_DB[n];
  if(!f){
    if(typeof hideInternalShow === "function") {
      hideInternalShow(confirm);
      hideInternalShow(result);
    } else {
      confirm.classList.remove('show');
      result.classList.remove('show');
    }
    return;
  }

  document.getElementById(confirmId+'-txt').textContent = 'Dente ' + n + ' — ' + f.nome;
  confirm.classList.add('show');
  if(typeof playInternalExpand === "function") playInternalExpand(confirm);
  result.innerHTML =
    '<div class="fw-sec"><div class="fw-sec-label">Fórceps indicado</div><div class="fw-sec-value">' + f.forceps + '</div><div class="fw-sec-sub">' + f.tipo + '</div><span class="fw-tecnica-tag">' + f.tecnica + '</span></div>' +
    (f.alerta ? '<div class="fw-widget-alert show"><span class="protocol-inline-icon"><i class="ti ti-alert-triangle"></i></span>' + f.alerta + '</div>' : '');
  result.classList.add('show');
  if(typeof playInternalExpand === "function") playInternalExpand(result);

  if(p6){ p6.className='step-txt'; p6.style.color='#6B2F8E'; p6.style.fontWeight='700'; p6.innerHTML='<span class="protocol-inline-icon"><i class="ti ti-target"></i></span>Usar ' + f.forceps + ' — ' + f.tecnica; }
  
  // NOVO: Registrar uso do fórceps
  if(currentUser && f) {
    registrarAcaoUsuario(currentUser.uid, 'forceps', { 
      dente: n, 
      forceps: f.forceps,
      nome: f.nome
    });
  }
}

function renderCorteIcon(icon){
  const map = {'✂️':'ti-cut','➡️':'ti-arrow-right','🔧':'ti-tool','📐':'ti-ruler-measure'};
  const iconClass = map[icon];
  return iconClass ? '<i class="ti ' + iconClass + '"></i>' : icon;
}

function renderOdontoWidget(inputId, confirmId, resultId, passo7Id){
  var val = document.getElementById(inputId).value.replace(/[^0-9]/g,'');
  var n = parseInt(val);
  var confirm = document.getElementById(confirmId);
  var result = document.getElementById(resultId);
  var p7 = document.getElementById(passo7Id);

  if(val.length < 2 || !n || n < 11 || n > 48){
    if(typeof hideInternalShow === "function") {
      hideInternalShow(confirm);
      hideInternalShow(result);
    } else {
      confirm.classList.remove('show');
      result.classList.remove('show');
    }
    if(p7){ p7.className='step-txt'; p7.textContent='Digite o número do dente para ver a odontosecção'; }
    return;
  }
  var f = ODONTO_DB[n];
  if(!f){
    if(typeof hideInternalShow === "function") {
      hideInternalShow(confirm);
      hideInternalShow(result);
    } else {
      confirm.classList.remove('show');
      result.classList.remove('show');
    }
    return;
  }

  document.getElementById(confirmId+'-txt').textContent = 'Dente ' + n + ' — ' + f.nome;
  confirm.classList.add('show');
  if(typeof playInternalExpand === "function") playInternalExpand(confirm);

  var cortesHtml = f.corte.map(function(c){
    return '<div class="fw-corte-card' + (c.active?' active':'') + '"><div class="fw-corte-icon">' + renderCorteIcon(c.icon) + '</div><div class="fw-corte-label">' + c.label + '</div><div class="fw-corte-sub">' + c.sub + '</div></div>';
  }).join('');

  result.innerHTML =
    '<div class="fw-sec"><div class="fw-sec-label">Anatomia radicular</div><div class="fw-sec-value">' + f.raizes + '</div><div class="fw-sec-sub">' + f.raizesSub + '</div></div>' +
    '<div class="fw-sec"><div class="fw-sec-label">Técnica de odontosecção</div><div class="fw-sec-value">' + f.tecnica + '</div><div class="fw-corte-visual">' + cortesHtml + '</div></div>' +
    '<div class="fw-sec"><div class="fw-sec-label">Fórceps após secção</div><div class="fw-sec-value">' + f.forceps + '</div></div>' +
    (f.alerta ? '<div class="fw-widget-alert show"><span class="protocol-inline-icon"><i class="ti ti-alert-triangle"></i></span>' + f.alerta + '</div>' : '');
  result.classList.add('show');
  if(typeof playInternalExpand === "function") playInternalExpand(result);

  if(p7){ p7.className='step-txt'; p7.style.color='#6B2F8E'; p7.style.fontWeight='700'; p7.innerHTML='<span class="protocol-inline-icon"><i class="ti ti-cut"></i></span>' + f.tecnica; }
}

let currentClinicalToolId = "";
let clinicalToolPulpiteRespostas = [];
let clinicalToolPulpiteAtual = 0;

const CLINICAL_TOOLS = {
  "anesthetic-technique": {
    title: "Técnica anestésica",
    free: true
  },
  forceps: {
    title: "Fórceps por dente",
    free: true
  },
  odontosection: {
    title: "Odontosecção por dente",
    free: false
  },
  pulpite: {
    title: "Assistente de Pulpite",
    free: true
  }
};

const ANESTHETIC_TECHNIQUE_BY_REGION = [
  {
    id: "maxila-anteriores-premolares",
    label: "Maxila — anteriores e pré-molares",
    teeth: [11, 12, 13, 14, 15, 21, 22, 23, 24, 25],
    primary: "Infiltração supraperiostal / vestibular na região apical do dente.",
    complements: [
      "Se houver manipulação palatina → complementar com anestesia palatina.",
      "Se envolver região anterior do palato → nasopalatino.",
      "Se envolver região posterior do palato → palatino maior."
    ],
    attention: [],
    failure: ["Reforçar infiltração na região do dente-alvo e reavaliar latência."]
  },
  {
    id: "maxila-molares",
    label: "Maxila — molares superiores",
    teeth: [16, 17, 18, 26, 27, 28],
    primary: "Infiltração supraperiostal / vestibular na região do molar.",
    complements: [
      "Se precisar de maior cobertura → considerar bloqueio do nervo alveolar superior posterior.",
      "Se houver manipulação palatina → complementar com palatino maior."
    ],
    attention: ["No 1º molar superior, a raiz mésio-vestibular pode exigir reforço infiltrativo."],
    failure: ["Reforçar infiltração na raiz/região sensível ou considerar NASP conforme o caso."]
  },
  {
    id: "mandibula-anteriores-premolares",
    label: "Mandíbula — anteriores e pré-molares inferiores",
    teeth: [31, 32, 33, 34, 35, 41, 42, 43, 44, 45],
    primary: "Infiltrativa, mentoniana/incisiva ou bloqueio alveolar inferior, conforme extensão do procedimento.",
    complements: [
      "Se o procedimento for restrito à região anterior/pré-molar → mentoniana/incisiva pode ser suficiente.",
      "Se o procedimento for mais extenso → considerar bloqueio alveolar inferior."
    ],
    attention: [],
    failure: ["Reforçar com bloqueio alveolar inferior ou técnica suplementar conforme dor."]
  },
  {
    id: "mandibula-molares",
    label: "Mandíbula — molares inferiores",
    teeth: [36, 37, 38, 46, 47, 48],
    primary: "Bloqueio do nervo alveolar inferior + lingual.",
    complements: ["Se for cirurgia em molar inferior → complementar com bloqueio do nervo bucal."],
    attention: [],
    failure: [
      "Se o lábio não dormiu → refazer o bloqueio corrigindo técnica.",
      "Se o lábio dormiu, mas o dente continua doendo → não repetir o mesmo bloqueio; usar reforço infiltrativo, intraligamentar, intraósseo ou intrapulpar conforme o caso."
    ]
  }
];

function findAnestheticTechniqueByTooth(tooth) {
  return ANESTHETIC_TECHNIQUE_BY_REGION.find(region => region.teeth.includes(tooth)) || null;
}

function renderClinicalToolList(items) {
  return (items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderClinicalToolBlock(label, content, className) {
  return `
    <section class="clinical-tool-result-block ${className || ""}">
      <div class="clinical-tool-block-label">${escapeHtml(label)}</div>
      <div class="clinical-tool-block-body">${content}</div>
    </section>
  `;
}

function openClinicalTool(id) {
  const tool = CLINICAL_TOOLS[id];
  if(!tool) return;
  if(!tool.free && !window.userIsPremium) {
    showUpgradeModal(null);
    return;
  }
  currentClinicalToolId = id;
  renderClinicalToolDetail();
  goScreen("clinical-tool-detail");
}

function renderClinicalToolDetail() {
  const tool = CLINICAL_TOOLS[currentClinicalToolId];
  const title = document.getElementById("clinical-tool-title");
  const body = document.getElementById("clinical-tool-body");
  if(!tool || !title || !body) return;
  title.textContent = tool.title;

  if(currentClinicalToolId === "anesthetic-technique") {
    renderAnestheticTechniqueTool(body);
  } else if(currentClinicalToolId === "forceps") {
    renderForcepsTool(body);
  } else if(currentClinicalToolId === "odontosection") {
    renderOdontosectionTool(body);
  } else if(currentClinicalToolId === "pulpite") {
    renderPulpiteClinicalTool(body);
  }
  body.scrollTop = 0;
}

function renderAnestheticTechniqueTool(body) {
  body.innerHTML = `
    <div class="fw-widget">
      <div class="fw-widget-label"><span class="protocol-inline-icon"><i class="ti ti-needle"></i></span>Técnica anestésica por dente</div>
      <input class="fw-widget-input" id="clinical-tool-anesthetic-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="Digite o nº do dente" oninput="renderAnestheticTechniqueResult()">
      <div class="fw-confirm" id="clinical-tool-anesthetic-confirm"><span class="protocol-inline-icon"><i class="ti ti-dental"></i></span><span class="fw-confirm-txt" id="clinical-tool-anesthetic-confirm-txt"></span><span class="fw-confirm-ok">✓</span></div>
      <div class="fw-result" id="clinical-tool-anesthetic-result"></div>
    </div>
    <div class="clinical-tool-note">Antes de anestesiar, consulte a aba Anestésicos conforme o perfil do paciente.<br><br>A técnica indicada é uma referência clínica de apoio. Ajuste conforme anatomia, procedimento, infecção, resposta anestésica e condição sistêmica do paciente.</div>
  `;
}

function renderAnestheticTechniqueResult() {
  const input = document.getElementById("clinical-tool-anesthetic-input");
  const confirm = document.getElementById("clinical-tool-anesthetic-confirm");
  const confirmTxt = document.getElementById("clinical-tool-anesthetic-confirm-txt");
  const result = document.getElementById("clinical-tool-anesthetic-result");
  if(!input || !confirm || !confirmTxt || !result) return;
  const raw = input.value.replace(/[^0-9]/g, "").slice(0, 2);
  input.value = raw;

  if(raw.length < 2) {
    if(typeof hideInternalShow === "function") {
      hideInternalShow(confirm);
      hideInternalExpand(result, () => {
        result.classList.remove("show");
        result.innerHTML = "";
      });
    } else {
      confirm.classList.remove("show");
      result.classList.remove("show");
      result.innerHTML = "";
    }
    return;
  }

  const tooth = Number(raw);
  const data = findAnestheticTechniqueByTooth(tooth);
  if(!data) {
    confirm.classList.add("show");
    confirmTxt.textContent = "Dente " + tooth + " — região não mapeada";
    result.innerHTML = '<div class="fw-widget-alert show"><span class="protocol-inline-icon"><i class="ti ti-alert-triangle"></i></span>Use um dente permanente entre 11 e 48 que esteja mapeado neste widget.</div>';
    result.classList.add("show");
    if(typeof playInternalExpand === "function") playInternalExpand(result);
    return;
  }

  confirmTxt.textContent = "Dente " + tooth + " — " + data.label;
  confirm.classList.add("show");
  if(typeof playInternalExpand === "function") playInternalExpand(confirm);
  result.innerHTML =
    renderClinicalToolBlock("Técnica principal", `<p>${escapeHtml(data.primary)}</p>`, "primary") +
    renderClinicalToolBlock("Complemento se necessário", `<ul>${renderClinicalToolList(data.complements)}</ul>`, "") +
    (data.attention.length ? renderClinicalToolBlock("Atenção", `<ul>${renderClinicalToolList(data.attention)}</ul>`, "alert") : "") +
    renderClinicalToolBlock("Se falhar", `<ul>${renderClinicalToolList(data.failure)}</ul>`, "fail");
  result.classList.add("show");
  if(typeof playInternalExpand === "function") playInternalExpand(result);
}

function renderForcepsTool(body) {
  body.innerHTML = `
    <div class="fw-widget">
      <div class="fw-widget-label"><span class="protocol-inline-icon"><i class="ti ti-target"></i></span>Fórceps por dente</div>
      <input class="fw-widget-input" id="clinical-tool-forceps-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="Digite o nº do dente" oninput="renderForcepsWidget('clinical-tool-forceps-input','clinical-tool-forceps-confirm','clinical-tool-forceps-result','clinical-tool-forceps-alert','clinical-tool-forceps-step')">
      <div class="fw-confirm" id="clinical-tool-forceps-confirm"><span class="protocol-inline-icon"><i class="ti ti-dental"></i></span><span class="fw-confirm-txt" id="clinical-tool-forceps-confirm-txt"></span><span class="fw-confirm-ok">✓</span></div>
      <div class="fw-result" id="clinical-tool-forceps-result"></div>
      <div id="clinical-tool-forceps-step" style="display:none;"></div>
    </div>
  `;
}

function renderOdontosectionTool(body) {
  body.innerHTML = `
    <div class="fw-widget">
      <div class="fw-widget-label"><span class="protocol-inline-icon"><i class="ti ti-cut"></i></span>Odontosecção por dente</div>
      <input class="fw-widget-input" id="clinical-tool-odonto-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="Digite o nº do dente" oninput="renderOdontoWidget('clinical-tool-odonto-input','clinical-tool-odonto-confirm','clinical-tool-odonto-result','clinical-tool-odonto-step')">
      <div class="fw-confirm" id="clinical-tool-odonto-confirm"><span class="protocol-inline-icon"><i class="ti ti-dental"></i></span><span class="fw-confirm-txt" id="clinical-tool-odonto-confirm-txt"></span><span class="fw-confirm-ok">✓</span></div>
      <div class="fw-result" id="clinical-tool-odonto-result"></div>
      <div id="clinical-tool-odonto-step" style="display:none;"></div>
    </div>
  `;
}

function renderPulpiteClinicalTool(body) {
  body.innerHTML = `
    <div class="fw-widget">
      <div class="fw-widget-label"><span class="protocol-inline-icon"><i class="ti ti-brain"></i></span>Assistente de Pulpite</div>
      <div id="clinical-tool-pulpite-quiz">
        <div style="display:flex;gap:4px;margin-bottom:8px;" id="clinical-tool-pulpite-progress"></div>
        <div class="fw-confirm show" style="margin-bottom:8px;">
          <span class="fw-confirm-txt" id="clinical-tool-pulpite-perg-num" style="font-size:10px;letter-spacing:0.5px;"></span>
        </div>
        <div style="font-size:14px;font-weight:700;color:var(--color-text-primary);margin-bottom:10px;line-height:1.4;" id="clinical-tool-pulpite-perg-text"></div>
        <div style="display:flex;flex-direction:column;gap:6px;" id="clinical-tool-pulpite-opcoes"></div>
      </div>
      <div id="clinical-tool-pulpite-resultado" style="display:none;"></div>
    </div>
  `;
  initClinicalToolPulpite();
}

function initClinicalToolPulpite() {
  clinicalToolPulpiteRespostas = [];
  clinicalToolPulpiteAtual = 0;
  const q = document.getElementById("clinical-tool-pulpite-quiz");
  const r = document.getElementById("clinical-tool-pulpite-resultado");
  if(q) q.style.display = "block";
  if(r) r.style.display = "none";
  if(typeof playInternalExpand === "function") playInternalExpand(q);
  renderClinicalToolPulpitePergunta();
}

function renderClinicalToolPulpitePergunta() {
  if(typeof PULPITE_PERGUNTAS === "undefined") return;
  const p = PULPITE_PERGUNTAS[clinicalToolPulpiteAtual];
  const numEl = document.getElementById("clinical-tool-pulpite-perg-num");
  const textEl = document.getElementById("clinical-tool-pulpite-perg-text");
  const opcoesEl = document.getElementById("clinical-tool-pulpite-opcoes");
  const progEl = document.getElementById("clinical-tool-pulpite-progress");
  if(!p || !numEl || !textEl || !opcoesEl || !progEl) return;
  numEl.textContent = "PERGUNTA " + (clinicalToolPulpiteAtual + 1) + " DE " + PULPITE_PERGUNTAS.length;
  textEl.textContent = p.texto;
  opcoesEl.innerHTML = "";
  p.opcoes.forEach(op => {
    const btn = document.createElement("button");
    btn.className = "fw-confirm show";
    btn.style.cssText = "cursor:pointer;width:100%;text-align:left;border:0.5px solid #475569;border-radius:10px;background:none;padding:8px 10px;font-family:inherit;margin-bottom:2px;";
    btn.innerHTML = '<span class="protocol-inline-icon"><i class="ti ti-dental"></i></span><span class="fw-confirm-txt" style="font-size:13px;">' + escapeHtml(op.label) + '</span><span class="fw-confirm-ok">›</span>';
    btn.onclick = () => responderClinicalToolPulpite(op.valor);
    opcoesEl.appendChild(btn);
  });
  progEl.innerHTML = "";
  for(let i = 0; i < PULPITE_PERGUNTAS.length; i++) {
    const d = document.createElement("div");
    d.style.cssText = "height:3px;flex:1;border-radius:3px;background:" + (i < clinicalToolPulpiteAtual ? "#7C3FA0" : i === clinicalToolPulpiteAtual ? "#D9B8F0" : "#E2E8F0") + ";";
    progEl.appendChild(d);
  }
}

function responderClinicalToolPulpite(valor) {
  clinicalToolPulpiteRespostas.push(valor);
  if(typeof PULPITE_PERGUNTAS !== "undefined" && clinicalToolPulpiteAtual < PULPITE_PERGUNTAS.length - 1) {
    clinicalToolPulpiteAtual++;
    renderClinicalToolPulpitePergunta();
  } else {
    mostrarResultadoClinicalToolPulpite();
  }
}

function mostrarResultadoClinicalToolPulpite() {
  const r = clinicalToolPulpiteRespostas;
  let tipo = "reversivel";
  if(r[0] === "espontanea" || r[2] === "frioAlivio" || r[3] === "sim") tipo = "irreversivel";
  else if(r[1] === "longa" || r[2] === "frioPiora") tipo = "transicao";
  const configs = {
    reversivel: {badge:"Pulpite reversível", title:"Polpa com potencial de recuperação", body:"Remover fator causal + proteção pulpar. Não indica endodontia agora — acompanhar em 1–2 semanas.", proto:"pulpite-reversivel"},
    transicao: {badge:"Fase de transição", title:"Entre reversível e irreversível", body:"Conduta conservadora. Acompanhar em 2–4 semanas. Se piorar: endodontia.", proto:"pulpite-reversivel"},
    irreversivel: {badge:"Pulpite irreversível", title:"Endodontia indicada", body:"Abertura de urgência para alívio da dor + encaminhar endodontista.", proto:"pulpite-irreversivel"}
  };
  const c = configs[tipo];
  const quiz = document.getElementById("clinical-tool-pulpite-quiz");
  const res = document.getElementById("clinical-tool-pulpite-resultado");
  if(!quiz || !res) return;
  quiz.style.display = "none";
  res.style.display = "block";
  res.innerHTML = `
    <div class="fw-result show">
      <div class="fw-sec">
        <div class="fw-sec-label">${escapeHtml(c.badge)}</div>
        <div class="fw-sec-value">${escapeHtml(c.title)}</div>
        <div class="fw-sec-sub">${escapeHtml(c.body)}</div>
      </div>
      <div class="fw-sec">
        <button onclick="openProto('${c.proto}')" style="width:100%;background:#7C3FA0;color:#fff;border:none;border-radius:24px;padding:12px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px;">Ver protocolo</button>
        <button onclick="initClinicalToolPulpite()" style="width:100%;background:none;border:0.5px solid #E2E8F0;border-radius:24px;padding:10px;font-size:12px;font-weight:750;color:#94A3B8;cursor:pointer;font-family:inherit;">Recomeçar</button>
      </div>
    </div>
  `;
  if(typeof playInternalExpand === "function") playInternalExpand(res);
}
