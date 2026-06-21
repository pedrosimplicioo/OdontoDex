const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = {
  console,
  window: { userIsPremium: false },
  document: {},
  sessionStorage: { getItem: () => null, setItem: () => {} },
};
context.globalThis = context;
vm.createContext(context);

[
  "src/data/clinical-data.js",
  "src/data/search-intents.js",
  "src/scripts/clinical-intent-engine.js",
].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});
vm.runInContext("var DATA = INITIAL_DATA;", context);

const runSearch = query => vm.runInContext(
  `clinicalIntentSearch(${JSON.stringify(query)}, { limit: 8 })`,
  context
);

const cases = [
  { query: "coroa caiu", firstId: "coroa-caiu", searchMode: "problem", minConfidence: "medium" },
  { query: "protocolo de recimentacao", firstType: "protocol", searchMode: "protocol", anyIds: ["recimentar-metal", "recimentar-ceramica", "recimentacao-coroa-pino-nucleo"], minConfidence: "medium" },
  { query: "fio dental nao passa", firstId: "fio-dental-nao-passa", searchMode: "problem", minConfidence: "medium" },
  { query: "como fazer acabamento proximal", firstId: "acabamento-proximal-restauracao", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "anestesia nao pega", firstId: "dente-nao-anestesia", searchMode: "problem", minConfidence: "medium" },
  { query: "tecnica anestesica mandibular", firstId: "anestesico-perfil-paciente", searchMode: "protocol", minConfidence: "medium" },
  { query: "restauracao alta", firstId: "restauracao-ficou-alta", searchMode: "problem", minConfidence: "medium", forbiddenIds: ["cardiopatas"] },
  { query: "ajuste oclusal protocolo", firstId: "ajuste-oclusal-restauracao", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "gestante pode tomar nimesulida", anyIds: ["gestantes", "abscesso-periapical", "abscesso-periodontal"], searchMode: "mixed", minConfidence: "medium" },
  { query: "gravida com dor e abscesso", anyIds: ["gestantes", "abscesso-periapical", "drenagem-abscesso", "infeccao-odontogenica-sinais-sistemicos"], searchMode: "mixed", minConfidence: "medium" },
  { query: "paciente anticoagulado sangramento", anyIds: ["coagulopatas", "hemostasia", "hemorragias"], searchMode: "mixed", minConfidence: "medium" },
  { query: "hipertenso anestesia", anyIds: ["cardiopatas"], searchMode: "profile", minConfidence: "medium" },
  { query: "crianca abscesso", anyIds: ["odontopediatria", "abscesso-periapical"], minConfidence: "medium" },
  { query: "dentadura caindo", firstId: "protese-total-caindo", searchMode: "problem", minConfidence: "medium" },
  { query: "pino soltou", firstId: "pino-nucleo-soltou", searchMode: "problem", minConfidence: "medium" },
  { query: "coroa nao entra", anyIds: ["coroa-nao-entra-card", "coroa-nao-entra"], minConfidence: "medium" },
  { query: "banana", confidence: "none", noBest: true, forbiddenIds: ["ppr-machuca-balanca", "nova-pprg", "nova-protese-total"] },
  { query: "asdfg", confidence: "none", noBest: true, forbiddenIds: ["coroa-caiu", "pino-nucleo-soltou"] },
  { query: "motor de carro", confidence: "none", noBest: true, forbiddenIds: ["cardiopatas"] },
  { query: "mordida alta", firstId: "restauracao-ficou-alta", searchMode: "problem", minConfidence: "medium", forbiddenIds: ["cardiopatas"] },
  { query: "pressao alta", anyIds: ["cardiopatas"], searchMode: "profile", minConfidence: "medium", forbiddenIds: ["restauracao-ficou-alta"] },
  { query: "pa elevada", anyIds: ["cardiopatas"], minConfidence: "medium" },
  { query: "dente doendo", anyIds: ["pulpite-irreversivel", "endo-urgencia", "pulpite-reversivel"], searchMode: "problem", minConfidence: "medium" },
  { query: "dor forte no dente", anyIds: ["dente-sensivel", "dor-ao-mastigar", "endo-urgencia", "pulpite-irreversivel"], searchMode: "problem", minConfidence: "medium" },
  { query: "abscesso", anyIds: ["drenagem-abscesso", "abscesso-perio", "abscesso-periapical"], searchMode: "problem", minConfidence: "medium" },
  { query: "rosto inchado", firstId: "inchaco-rosto", searchMode: "problem", minConfidence: "medium" },
  { query: "fistula na gengiva", firstId: "fistula-gengiva", searchMode: "problem", minConfidence: "medium" },
  { query: "fio desfia", firstId: "fio-dental-nao-passa", searchMode: "problem", minConfidence: "medium" },
  { query: "fio rasga", firstId: "fio-dental-nao-passa", searchMode: "problem", minConfidence: "medium" },
  { query: "pino caiu", firstId: "pino-nucleo-soltou", searchMode: "problem", minConfidence: "medium" },
  { query: "paciente sangrando", anyIds: ["hemostasia", "hemorragias", "coagulopatas"], searchMode: "problem", minConfidence: "medium" },
  { query: "sangramento nao para", anyIds: ["hemostasia", "hemorragias", "coagulopatas"], minConfidence: "medium" },
  { query: "anticoagulado extracao", anyIds: ["coagulopatas", "hemostasia", "extracao-simples"], searchMode: "mixed", minConfidence: "medium" },
  { query: "gestante dor", anyIds: ["gestantes", "dor-ao-mastigar", "abscesso-periapical"], searchMode: "mixed", minConfidence: "medium" },
  { query: "gestante abscesso", anyIds: ["gestantes", "abscesso-periapical", "drenagem-abscesso"], searchMode: "mixed", minConfidence: "medium" },
  { query: "crianca dor de dente", anyIds: ["odontopediatria", "endo-urgencia", "pulpite-irreversivel"], searchMode: "mixed", minConfidence: "medium" },
  { query: "diabetico infeccao", anyIds: ["diabeticos", "infeccao-odontogenica-sinais-sistemicos", "abscesso-periapical"], searchMode: "mixed", minConfidence: "medium" },
  { query: "como drenar abscesso", firstId: "drenagem-abscesso", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "protocolo drenagem abscesso", firstId: "drenagem-abscesso", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "protocolo restauracao classe II", firstId: "restauracao-proximal-classe-ii", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "como fazer restauracao classe II", firstId: "restauracao-proximal-classe-ii", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "restauracao classe II", firstId: "restauracao-proximal-classe-ii", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "como regularizar espicula ossea", firstId: "remocao-espicula-ossea", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "osso espetando", firstId: "remocao-espicula-ossea", firstType: "protocol", minConfidence: "medium" },
  { query: "alveolite", anyIds: ["alveolite", "alveolite-seca", "alveolite-umida"], minConfidence: "medium" },
  { query: "dor apos extracao", firstId: "dor-apos-extracao", searchMode: "problem", minConfidence: "medium" },
  { query: "siso inflamado", anyIds: ["extracao-cirurgica", "extracao-simples", "dor-apos-extracao"], minConfidence: "medium" },
  { query: "extracao simples", firstId: "extracao-simples", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "como fazer sutura", firstId: "sutura-tecnica", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "protocolo sutura", firstId: "sutura-tecnica", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "moldagem funcional", firstId: "nova-protese-total", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "nova protese total passo a passo", firstId: "nova-protese-total", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "protese machuca", firstId: "protese-total-machuca", searchMode: "problem", minConfidence: "medium" },
  { query: "protese quebrada", anyIds: ["protese-quebrada-lab", "nova-protese-total", "nova-pprg"], minConfidence: "medium" },
  { query: "dente mole", firstId: "mobilidade-dental", searchMode: "problem", minConfidence: "medium" },
  { query: "mobilidade dental", firstId: "mobilidade-dental", searchMode: "problem", minConfidence: "medium" },
  { query: "sensibilidade no gelado", firstId: "dente-sensivel", searchMode: "problem", minConfidence: "medium" },
  { query: "clareamento sensibilidade", firstId: "dente-sensivel", searchMode: "problem", minConfidence: "medium" },
  { query: "pino de fibra passo a passo", firstId: "pino-nucleo", firstType: "protocol", searchMode: "protocol", minConfidence: "medium" },
  { query: "como cimentar pino de fibra", firstType: "protocol", searchMode: "protocol", anyIds: ["recimentacao-coroa-pino-nucleo", "pino-nucleo"], minConfidence: "medium" },
];

const confidenceRank = { none: 0, low: 1, medium: 2, high: 3 };
let failed = 0;

cases.forEach(test => {
  const result = runSearch(test.query);
  const ids = (result.all || []).map(item => item.id);
  const types = (result.all || []).map(item => item.type);
  const first = ids[0] || null;
  const firstType = types[0] || null;
  const errors = [];

  if (test.firstId && first !== test.firstId) {
    errors.push(`esperado primeiro "${test.firstId}", recebeu "${first}"`);
  }
  if (test.anyIds && !test.anyIds.some(id => ids.includes(id))) {
    errors.push(`esperado um de [${test.anyIds.join(", ")}], recebeu [${ids.join(", ")}]`);
  }
  if (test.firstType && firstType !== test.firstType) {
    errors.push(`tipo esperado primeiro "${test.firstType}", recebeu "${firstType}"`);
  }
  if (test.firstTypes && !test.firstTypes.includes(firstType)) {
    errors.push(`tipo esperado primeiro um de [${test.firstTypes.join(", ")}], recebeu "${firstType}"`);
  }
  if (test.searchMode && result.searchMode !== test.searchMode) {
    errors.push(`searchMode esperado "${test.searchMode}", recebeu "${result.searchMode}"`);
  }
  if (test.confidence && result.confidence !== test.confidence) {
    errors.push(`confidence esperado "${test.confidence}", recebeu "${result.confidence}"`);
  }
  if (test.minConfidence && confidenceRank[result.confidence] < confidenceRank[test.minConfidence]) {
    errors.push(`confidence minimo "${test.minConfidence}", recebeu "${result.confidence}"`);
  }
  if (test.noBest && result.best && result.best.length) {
    errors.push(`nao deveria ter Comece por aqui, recebeu "${result.best[0].id}"`);
  }
  (test.forbiddenIds || []).forEach(id => {
    if (ids.includes(id)) errors.push(`resultado proibido apareceu: "${id}"`);
  });

  if (errors.length) {
    failed += 1;
    console.error(`FAIL ${test.query}: ${errors.join("; ")}`);
  } else {
    console.log(`OK   ${test.query}: ${result.searchMode || "-"} / ${result.confidence} -> ${ids.slice(0, 4).join(", ")}`);
  }
});

if (failed) {
  console.error(`\n${failed} teste(s) falharam.`);
  process.exit(1);
}

console.log("\nTodos os testes de busca passaram.");
