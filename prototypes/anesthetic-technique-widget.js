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
    failure: [
      "Reforçar infiltração na região do dente-alvo e reavaliar latência."
    ]
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
    attention: [
      "No 1º molar superior, a raiz mésio-vestibular pode exigir reforço infiltrativo."
    ],
    failure: [
      "Reforçar infiltração na raiz/região sensível ou considerar NASP conforme o caso."
    ]
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
    failure: [
      "Reforçar com bloqueio alveolar inferior ou técnica suplementar conforme dor."
    ]
  },
  {
    id: "mandibula-molares",
    label: "Mandíbula — molares inferiores",
    teeth: [36, 37, 38, 46, 47, 48],
    primary: "Bloqueio do nervo alveolar inferior + lingual.",
    complements: [
      "Se for cirurgia em molar inferior → complementar com bloqueio do nervo bucal."
    ],
    attention: [],
    failure: [
      "Se o lábio não dormiu → refazer o bloqueio corrigindo técnica.",
      "Se o lábio dormiu, mas o dente continua doendo → não repetir o mesmo bloqueio; usar reforço infiltrativo, intraligamentar, intraósseo ou intrapulpar conforme o caso."
    ]
  }
];

function findTechniqueByTooth(tooth) {
  return ANESTHETIC_TECHNIQUE_BY_REGION.find(region => region.teeth.includes(tooth)) || null;
}

function renderList(target, items) {
  target.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}

function renderTechnique() {
  const input = document.getElementById("tooth-input");
  const empty = document.getElementById("state-empty");
  const invalid = document.getElementById("state-invalid");
  const result = document.getElementById("result");
  const raw = input.value.replace(/[^0-9]/g, "").slice(0, 2);
  input.value = raw;

  if(!raw) {
    empty.hidden = false;
    invalid.hidden = true;
    result.hidden = true;
    return;
  }

  const tooth = Number(raw);
  const data = findTechniqueByTooth(tooth);
  if(!data) {
    empty.hidden = true;
    invalid.hidden = false;
    result.hidden = true;
    return;
  }

  document.getElementById("region-label").textContent = `Dente ${tooth} • ${data.label}`;
  document.getElementById("primary-technique").textContent = data.primary;
  renderList(document.getElementById("complements"), data.complements);
  renderList(document.getElementById("failure"), data.failure);

  const attentionBlock = document.getElementById("attention-block");
  if(data.attention.length) {
    renderList(document.getElementById("attention"), data.attention);
    attentionBlock.hidden = false;
  } else {
    attentionBlock.hidden = true;
  }

  empty.hidden = true;
  invalid.hidden = true;
  result.hidden = false;
}

document.getElementById("tooth-input").addEventListener("input", renderTechnique);
document.getElementById("clear-btn").addEventListener("click", () => {
  document.getElementById("tooth-input").value = "";
  renderTechnique();
  document.getElementById("tooth-input").focus();
});
renderTechnique();
