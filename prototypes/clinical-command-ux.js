const DATA = [
  {
    id: "dor",
    title: "Dor ao mastigar",
    kind: "Conduta rápida",
    terms: ["dor ao mastigar", "dor ao morder", "restauração alta", "dente dói mastigando"],
    main: "Contato prematuro, trinca ou dor pulpar. Primeiro separe se vem da mordida ou do próprio dente.",
    alerts: [
      "Dor começou após restauração recente.",
      "Dor acontece em cúspide específica ou ao aliviar a mordida.",
      "Dor permanece, lateja ou aparece sozinha."
    ],
    paths: ["Ajuste Oclusal em Restauração", "Pulpite Reversível", "Pulpite Irreversível"]
  },
  {
    id: "fio",
    title: "Fio dental não passa",
    kind: "Conduta rápida",
    terms: ["fio dental não passa", "fio prende", "fio rasga", "contato apertado", "overhang"],
    main: "Descubra se o fio apenas trava ou se existe irregularidade cortando/desfiando o fio.",
    alerts: [
      "Se rasga sempre no mesmo ponto, investigue excesso, cálculo, cárie ou margem irregular.",
      "Se passa frouxo e prende alimento, pense em contato proximal aberto."
    ],
    paths: ["Acabamento Proximal em Restauração", "Raspagem Supragengival", "Coroa não entra"]
  },
  {
    id: "sensivel",
    title: "Dente sensível",
    kind: "Conduta rápida",
    terms: ["dente sensível", "sensibilidade", "água gelada", "dor no frio", "raiz exposta"],
    main: "Diferencie dentina exposta, pulpite, hiperoclusão e trinca pela duração e pelo gatilho da dor.",
    alerts: [
      "Dor curta e localizada sugere hipersensibilidade.",
      "Dor espontânea, noturna ou prolongada pede investigação pulpar.",
      "Sensibilidade após restauração pede checagem de oclusão."
    ],
    paths: ["Sensibilidade Cervical por Recessão", "Pulpite Reversível", "Ajuste Oclusal"]
  },
  {
    id: "coroa",
    title: "A coroa caiu",
    kind: "Conduta rápida",
    terms: ["coroa caiu", "coroa soltou", "jaqueta caiu", "coroa descolou"],
    main: "Se a peça está íntegra e adapta bem, recimentar pode ser o caminho mais rápido. Se não, replaneje.",
    alerts: [
      "Cárie, fratura do remanescente ou adaptação ruim mudam a conduta.",
      "Preparo sem retenção tende a soltar de novo."
    ],
    paths: ["Recimentar coroa", "Planejar Nova Coroa", "Moldagem para Coroa/Ponte"]
  },
  {
    id: "gestante",
    title: "Gestante e medicamento",
    kind: "Alerta importante",
    terms: ["grávida pode tomar", "gestante", "lactante", "nimesulida", "amamentando"],
    main: "A intenção é segurança medicamentosa. Priorize alerta de perfil antes de prescrição.",
    alerts: [
      "Evite sugerir medicamento antes de identificar perfil e risco.",
      "Quando houver dúvida, o app deve puxar primeiro o alerta de gestante."
    ],
    paths: ["Pacientes Gestantes e Lactantes", "Prescrições seguras", "Contato com obstetra"]
  }
];

const input = document.getElementById("clinical-search");
const results = document.getElementById("results");
const clearBtn = document.getElementById("clear-search");
const layer = document.getElementById("sheet-layer");
const closeBtn = document.getElementById("sheet-close");
const backBtn = document.getElementById("sheet-back");
const backdrop = document.getElementById("backdrop");

function normalize(value){
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function score(item, query){
  const q = normalize(query);
  if(!q) return 0;
  const hay = normalize([item.title, item.kind, ...item.terms].join(" "));
  if(normalize(item.title) === q) return 100;
  if(hay.includes(q)) return 70;
  return q.split(/\s+/).reduce((sum, token) => sum + (hay.includes(token) ? 18 : 0), 0);
}

function renderResults(){
  const q = input.value;
  const found = DATA
    .map(item => ({...item, score: score(item, q)}))
    .filter(item => item.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, 5);

  results.innerHTML = "";
  if(q.length < 2){
    results.classList.remove("active");
    return;
  }

  results.classList.add("active");
  const best = found[0];
  if(best){
    results.insertAdjacentHTML("beforeend", '<div class="group-title">Caminho mais provável</div>');
    results.appendChild(resultButton(best));
  }

  const related = found.slice(1);
  if(related.length){
    results.insertAdjacentHTML("beforeend", '<div class="group-title">Sugestões relacionadas</div>');
    related.forEach(item => results.appendChild(resultButton(item)));
  }

  if(!found.length){
    results.insertAdjacentHTML("beforeend", '<div class="group-title">Sugestões relacionadas</div>');
    DATA.slice(0,4).forEach(item => results.appendChild(resultButton(item)));
  }
}

function resultButton(item){
  const btn = document.createElement("button");
  btn.className = "result-row";
  btn.type = "button";
  btn.innerHTML = `<strong>${item.title}</strong><span>${item.kind}</span>`;
  btn.onclick = () => openSheet(item);
  return btn;
}

function openSheet(item){
  document.getElementById("sheet-kind").textContent = item.kind;
  document.getElementById("sheet-title").textContent = item.title;
  document.getElementById("sheet-main").textContent = item.main;
  document.getElementById("sheet-alerts").innerHTML = item.alerts.map(alert => `<li>${alert}</li>`).join("");
  document.getElementById("sheet-paths").innerHTML = item.paths.map(path => `<button type="button">${path}</button>`).join("");
  layer.classList.add("active");
  layer.setAttribute("aria-hidden", "false");
  results.classList.remove("active");
}

function closeSheet(){
  layer.classList.remove("active");
  layer.setAttribute("aria-hidden", "true");
  input.focus();
  renderResults();
}

input.addEventListener("input", renderResults);
input.addEventListener("focus", renderResults);
clearBtn.addEventListener("click", () => {
  input.value = "";
  renderResults();
  input.focus();
});
[closeBtn, backBtn, backdrop].forEach(btn => btn.addEventListener("click", closeSheet));

document.querySelectorAll("[data-query]").forEach(btn => {
  btn.addEventListener("click", () => {
    input.value = btn.dataset.query;
    renderResults();
    input.focus();
  });
});

document.getElementById("resume-case").addEventListener("click", () => {
  input.value = "dente sensível";
  renderResults();
  openSheet(DATA.find(item => item.id === "sensivel"));
});

renderResults();
