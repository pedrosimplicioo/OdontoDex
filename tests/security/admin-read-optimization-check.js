const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const source = fs.readFileSync(path.join(root, 'src', 'scripts', 'admin.js'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(!source.includes('.onSnapshot('), 'Admin nao deve usar onSnapshot.');
assert(source.includes('const ADMIN_CACHE_TTL_MS = 2 * 60 * 1000'), 'Cache de dois minutos ausente.');
assert(source.includes("startAfter(lastUsersCursor)"), 'Paginacao de usuarios com startAfter ausente.');
assert(source.includes('window.carregarMaisUsuarios=carregarMaisUsuarios'), 'Botao Carregar mais nao esta exposto.');
assert(source.includes('startAfter(lastCouponsCursor)'), 'Paginacao de cupons com startAfter ausente.');
assert(source.includes('window.carregarMaisParceiros = carregarMaisParceiros'), 'Botao Carregar mais cupons nao esta exposto.');

const querySegments = [];
let cursor = 0;
while ((cursor = source.indexOf('db.collection(', cursor)) !== -1) {
  const getIndex = source.indexOf('.get(', cursor);
  assert(getIndex !== -1, `Consulta sem get localizada perto do indice ${cursor}.`);
  const segment = source.slice(cursor, getIndex);
  querySegments.push(segment);
  cursor = getIndex + 5;
}

assert(querySegments.length > 0, 'Nenhuma consulta Firestore encontrada no Admin.');
querySegments.forEach((segment, index) => {
  assert(segment.includes('.limit('), `Consulta Firestore ${index + 1} nao possui limit.`);
});

const authStart = source.indexOf('auth.onAuthStateChanged');
const authEnd = source.indexOf('window.doAdminLogin', authStart);
const authBlock = source.slice(authStart, authEnd);
assert(!authBlock.includes('carregarLandingStats('), 'Landing nao pode carregar ao autenticar.');
assert(!authBlock.includes('carregarMetricasProduto('), 'Metricas nao podem carregar ao autenticar.');
assert(authBlock.includes('renderizarSecaoAtual()'), 'Abertura deve carregar somente a aba atual.');

assert(
  source.includes("case 'parceiros': area.innerHTML = renderParceiros(); break;"),
  'Render de parceiros nao deve disparar consulta diretamente.'
);
assert(source.includes('await renderizarSecaoAtual({ force: true })'), 'Atualizacao manual deve forcar apenas a aba atual.');

console.log(`OK: ${querySegments.length} consultas administrativas possuem limit, lazy loading, cache e paginacao.`);
