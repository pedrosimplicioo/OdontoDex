const firebaseConfig = {
  apiKey: "AIzaSyBGYluL3f0yuaZnpc-fX8sIQhlCeVo6bwk",
  authDomain: "guia-odonto-a24ed.firebaseapp.com",
  projectId: "guia-odonto-a24ed",
  storageBucket: "guia-odonto-a24ed.firebasestorage.app",
  messagingSenderId: "822223061470",
  appId: "1:822223061470:web:8b1447dcfb37e7eeda1d4f"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let charts = {};
let dadosUsuarios = [];
let usuariosFiltrados = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = { field: 'usos', order: 'desc' };
let searchTerm = '';
let filtroStatus = '';
let currentSection = 'dashboard';
let cachedDados = null;
let cachedLandingStats = null;
let cachedMetricasProduto = null;
let adminDataLoadError = "";
let contentEditorType = "protocol";
let contentEditorId = "";
let contentEditorSearch = "";
let contentEditorProtocolAction = "review";

const ADMIN_EMAILS = ["pedrosimplicio.sousa@gmail.com"];

// ========== SISTEMA DE IGNORAR USUÃRIOS ==========
let usuariosIgnorados = [];

function carregarIgnorados() {
  try {
    const saved = localStorage.getItem('admin_usuarios_ignorados');
    if (saved) {
      usuariosIgnorados = JSON.parse(saved);
      console.log('âœ… Ignorados carregados:', usuariosIgnorados);
    } else {
      usuariosIgnorados = [];
      console.log('ðŸ“‹ Nenhum ignorado encontrado, lista vazia');
    }
  } catch(e) { 
    console.error('Erro ao carregar ignorados:', e);
    usuariosIgnorados = []; 
  }
}

function salvarIgnorados() {
  try {
    localStorage.setItem('admin_usuarios_ignorados', JSON.stringify(usuariosIgnorados));
    console.log('ðŸ’¾ Ignorados salvos:', usuariosIgnorados);
  } catch(e) {
    console.error('Erro ao salvar ignorados:', e);
  }
}

function isUsuarioIgnorado(userId) {
  return usuariosIgnorados.includes(userId);
}

async function toggleIgnorarUsuario(userId) {
  console.log('ðŸ”˜ toggleIgnorarUsuario chamado para:', userId);
  console.log('ðŸ“‹ Lista atual:', usuariosIgnorados);
  
  const index = usuariosIgnorados.indexOf(userId);
  if (index === -1) {
    usuariosIgnorados.push(userId);
    mostrarToastAdmin('ðŸ‘¤ UsuÃ¡rio ignorado das estatÃ­sticas', 'warning');
    console.log('âž• Adicionado Ã  lista');
  } else {
    usuariosIgnorados.splice(index, 1);
    mostrarToastAdmin('âœ… UsuÃ¡rio reincluÃ­do nas estatÃ­sticas', 'success');
    console.log('âž– Removido da lista');
  }
  
  salvarIgnorados();
  
  try {
    console.log('ðŸ”„ Recarregando dados...');
    await carregarDados();
    renderizarSecaoAtual();
    console.log('âœ… Dados recarregados com sucesso');
  } catch (error) {
    console.error('âŒ Erro ao recarregar:', error);
  }
}

function mostrarToastAdmin(mensagem, tipo) {
  const toast = document.createElement('div');
  toast.textContent = mensagem;
  let cor = '#3B82F6';
  if (tipo === 'success') cor = '#10B981';
  if (tipo === 'warning') cor = '#F59E0B';
  if (tipo === 'error') cor = '#EF4444';
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${cor};color:white;padding:10px 18px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;animation:fadeInOutAdmin 2s ease;font-family:'Inter',sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.15)`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ========== LOGIN ==========
async function doAdminLogin() {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  const errorDiv = document.getElementById('login-error');
  try {
    const res = await auth.signInWithEmailAndPassword(email, password);
    currentUser = res.user;
    if (!ADMIN_EMAILS.includes(currentUser.email)) {
      await auth.signOut();
      errorDiv.textContent = "Acesso negado. VocÃª nÃ£o Ã© administrador.";
      return;
    }
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'flex';
    await carregarDados();
    renderizarSecaoAtual();
  } catch(e) {
    errorDiv.textContent = "Email ou senha incorretos";
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('expanded')) {
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');
  } else {
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('expanded');
  }
  setTimeout(() => {
    if (currentSection === 'graficos' && charts.horas) {
      if (charts.horas) charts.horas.resize();
      if (charts.dias) charts.dias.resize();
      if (charts.mensal) charts.mensal.resize();
    }
    if (currentSection === 'landing' && charts.landingVisitas) {
      if (charts.landingVisitas) charts.landingVisitas.resize();
    }
  }, 300);
}

// ========== CARREGAR DADOS DO APP (COM FILTRO DE IGNORADOS) ==========
async function carregarDados() {
  try {
    adminDataLoadError = "";
    const agora = new Date();
    const mesAtual = agora.toISOString().split('T')[0].substring(0, 7);
    const usersSnapshot = await db.collection('users').get({source: 'server'});
    const usuarios = [];
    let totalPremium = 0, totalFree = 0;
    
    // Primeiro, coletar todos os usuÃ¡rios
    usersSnapshot.forEach(doc => {
      const userId = doc.id;
      const isIgnorado = isUsuarioIgnorado(userId);
      const userData = doc.data();
      const isPremium = userData.premium === true;
      
      // SÃ³ conta para os totais se NÃƒO for ignorado
      if (!isIgnorado) {
        if (isPremium) totalPremium++;
        else totalFree++;
      }
      
    usuarios.push({
        id: userId, 
        email: userData.email || '', 
        nome: userData.nome || userData.displayName || '-',
        premium: isPremium, 
        criadoEm: userData.criadoEm || userData.criado_em || null,
        dataPrimeiroAcesso: userData.dataPrimeiroAcesso || null,
        ultimoAcesso: userData.ultimoAcesso || null,
        acessosPorDia: userData.acessosPorDia || {}, 
        usos: 0, 
        ignorado: isIgnorado,
        premiumExpira: userData.premiumExpira || null,
        premiumAtivadoEm: userData.premiumAtivadoEm || null,
        ultimoPagamentoId: userData.ultimoPagamentoId || null,
        trialAtivado: userData.trialAtivado || false
      });
    });
    
    const noventaDiasAtras = new Date();
    noventaDiasAtras.setDate(noventaDiasAtras.getDate() - 90);
    const analyticsSnapshot = await db.collection('analytics_uso_protocolos')
      .where('timestamp', '>=', noventaDiasAtras).get();
    
    const analytics = {
      protocolos: {}, usuariosCount: {}, porMes: {},
      porHora: Array(24).fill(0), porDiaSemana: Array(7).fill(0),
      total: 0, usuariosAtivosMes: new Set()
    };
    
    analyticsSnapshot.forEach(doc => {
      const data = doc.data();
      const userId = data.usuarioId;
      
      // Pular analytics de usuÃ¡rios ignorados
      if (userId && isUsuarioIgnorado(userId)) return;
      
      analytics.total++;
      if (data.protocoloTitulo) analytics.protocolos[data.protocoloTitulo] = (analytics.protocolos[data.protocoloTitulo] || 0) + 1;
      if (userId) analytics.usuariosCount[userId] = (analytics.usuariosCount[userId] || 0) + 1;
      if (data.mes === mesAtual && userId) analytics.usuariosAtivosMes.add(userId);
      if (data.mes) analytics.porMes[data.mes] = (analytics.porMes[data.mes] || 0) + 1;
      if (data.hora !== undefined) analytics.porHora[data.hora]++;
      if (data.diaSemana !== undefined) analytics.porDiaSemana[data.diaSemana]++;
    });
    
    // Atualizar usos apenas para usuÃ¡rios NÃƒO ignorados
    usuarios.forEach(user => { 
      if (!user.ignorado) {
        user.usos = analytics.usuariosCount[user.id] || 0;
      } else {
        user.usos = 0;
      }
    });
    
    // Filtrar usuÃ¡rios ignorados para os cards do dashboard
    const usuariosNaoIgnorados = usuarios.filter(u => !u.ignorado);
    const totalUsuarios = usuariosNaoIgnorados.length;
    const totalPremiumCount = usuariosNaoIgnorados.filter(u => u.premium).length;
    const totalFreeCount = totalUsuarios - totalPremiumCount;
    const taxaConversao = totalUsuarios > 0 ? Math.round((totalPremiumCount / totalUsuarios) * 100) : 0;
    
    const protocolosArray = Object.entries(analytics.protocolos).map(([nome, count]) => ({ nome, count, percentual: analytics.total > 0 ? (count / analytics.total) * 100 : 0 })).sort((a,b) => b.count - a.count);
    const topProtocolos = protocolosArray.slice(0, 10);
    const lowProtocolos = protocolosArray.filter(p => p.percentual < 5).slice(0, 10);
    // --- Novos cÃ¡lculos para cards do dashboard ---
    const agora2 = new Date();
    const inicioDia = new Date(agora2); inicioDia.setHours(0,0,0,0);
    const inicioMes = new Date(agora2.getFullYear(), agora2.getMonth(), 1);
    const em7dias = new Date(agora2); em7dias.setDate(em7dias.getDate() + 7);

    let totalTrial = 0, totalPremiumPago = 0, totalFreeReal = 0;
    let abrirHoje = 0, novosHoje = 0, novosMes = 0;
    let assinaramMes = 0, expiramEm7 = 0, churnMes = 0;
    let nuncaUsaram = 0;

    usuariosNaoIgnorados.forEach(u => {
      const expira = u.premiumExpira?.toDate ? u.premiumExpira.toDate() : null;
      const pagou = !!u.ultimoPagamentoId;
      const expirado = expira ? expira < agora2 : true;

      // ClassificaÃ§Ã£o Trial / Premium / Free
      if (!expirado && pagou)  totalPremiumPago++;
      else if (!expirado && !pagou) totalTrial++;
      else totalFreeReal++;

      // Abriram hoje
      const ultimo = u.ultimoAcesso?.toDate ? u.ultimoAcesso.toDate() : null;
      if (ultimo && ultimo >= inicioDia) abrirHoje++;

      // Novos hoje e no mÃªs
      const primeiro = u.dataPrimeiroAcesso?.toDate ? u.dataPrimeiroAcesso.toDate() : null;
      if (primeiro && primeiro >= inicioDia) novosHoje++;
      if (primeiro && primeiro >= inicioMes) novosMes++;

      // Assinaram no mÃªs (pagou E premiumAtivadoEm dentro do mÃªs)
      const ativadoEm = u.premiumAtivadoEm?.toDate ? u.premiumAtivadoEm.toDate() : null;
      if (ativadoEm && ativadoEm >= inicioMes) assinaramMes++;

      // Expiram em 7 dias (premium ativo, expira entre hoje e hoje+7)
      if (expira && !expirado && expira <= em7dias) expiramEm7++;

      // Churn no mÃªs: expirou dentro deste mÃªs e nÃ£o renovou
      if (expira && expira >= inicioMes && expira < agora2 && expirado) churnMes++;
      if ((analytics.usuariosCount[u.id] || 0) === 0) nuncaUsaram++;
    });
    // --- fim novos cÃ¡lculos ---
    cachedDados = {
      usuarios: usuariosNaoIgnorados,
      analytics, 
      totalUsuarios, 
      totalPremium: totalPremiumCount, 
      totalFree: totalFreeCount,
      taxaConversao, 
      topProtocolos, 
      lowProtocolos, 
      totalUsos: analytics.total,
      usosMes: analytics.porMes[mesAtual] || 0, 
      usuariosAtivosMes: analytics.usuariosAtivosMes.size,
      topProtocoloNome: topProtocolos[0]?.nome || '-', 
      topProtocoloCount: topProtocolos[0]?.count || 0,
      topProtocoloPercentual: topProtocolos[0]?.percentual || 0, 
      porHora: analytics.porHora,
      porDiaSemana: analytics.porDiaSemana, 
      porMes: analytics.porMes,
      totalTrial,
      totalPremiumPago,
      totalFreeReal,
      abrirHoje,
      novosHoje,
      novosMes,
      assinaramMes,
      expiramEm7,
      churnMes,
      nuncaUsaram
    };
    dadosUsuarios = [...usuarios];
    aplicarFiltroOrdenacao();
  } catch (error) { 
    console.error("Erro ao carregar dados:", error); 
    adminDataLoadError = error?.message || "Erro ao carregar dados do Firestore";
    cachedDados = null;
    dadosUsuarios = [];
    usuariosFiltrados = [];
  }
}

// ========== CARREGAR MÃ‰TRICAS DE PRODUTO (COM FILTRO DE IGNORADOS) ==========
async function carregarMetricasProduto() {
  try {
    const usersSnapshot = await db.collection('users').get();
    const usuarios = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      usuarios.push({
        id: doc.id, 
        dataPrimeiroAcesso: userData.dataPrimeiroAcesso?.toDate() || null,
        ultimoAcesso: userData.ultimoAcesso?.toDate() || null,
        acessosPorDia: userData.acessosPorDia || {}, 
        premium: userData.premium === true
      });
    });
    
    const noventaDiasAtras = new Date();
    noventaDiasAtras.setDate(noventaDiasAtras.getDate() - 90);
    const actionsSnapshot = await db.collection('user_actions').where('timestamp', '>=', noventaDiasAtras).get();
    
    const userActions = {};
    actionsSnapshot.forEach(doc => {
      const data = doc.data();
      const userId = data.userId;
      // Pular aÃ§Ãµes de usuÃ¡rios ignorados
      if (userId && isUsuarioIgnorado(userId)) return;
      if (!userActions[userId]) userActions[userId] = [];
      userActions[userId].push({ actionType: data.actionType, timestamp: data.timestamp?.toDate() || new Date() });
    });
    
    const metricas = {
      totalNovosUltimos30: 0, ativadosUltimos30: 0, taxaAtivacao: 0,
      acaoAtivacao: { open_protocol: 0, search: 0, favorite: 0, forceps: 0, diagnostico: 0 },
      coortes: {}, primeiroAcaoRetornantes: {}, scores: [],
      tipoUso: { passivo: 0, hibrido: 0, interativo: 0 }
    };
    
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    
    for (const user of usuarios) {
      if (isUsuarioIgnorado(user.id)) continue;
      
      if (user.dataPrimeiroAcesso && user.dataPrimeiroAcesso >= trintaDiasAtras) {
        metricas.totalNovosUltimos30++;
        const userActionsList = userActions[user.id] || [];
        const usouProtocolo = userActionsList.some(a => a.actionType === 'open_protocol');
        const usouBusca = userActionsList.some(a => a.actionType === 'search');
        const ativado = usouProtocolo || usouBusca;
        if (ativado) {
          metricas.ativadosUltimos30++;
          if (usouProtocolo) metricas.acaoAtivacao.open_protocol++;
          if (usouBusca) metricas.acaoAtivacao.search++;
          if (userActionsList.some(a => a.actionType === 'favorite')) metricas.acaoAtivacao.favorite++;
          if (userActionsList.some(a => a.actionType === 'forceps')) metricas.acaoAtivacao.forceps++;
          if (userActionsList.some(a => a.actionType === 'diagnostico')) metricas.acaoAtivacao.diagnostico++;
        }
      }
      
      if (user.dataPrimeiroAcesso) {
        const coorteKey = `${user.dataPrimeiroAcesso.getFullYear()}-${user.dataPrimeiroAcesso.getMonth()+1}`;
        if (!metricas.coortes[coorteKey]) metricas.coortes[coorteKey] = { total: 0, d1: 0, d7: 0, d30: 0 };
        metricas.coortes[coorteKey].total++;
        
        const acessoDias = Object.keys(user.acessosPorDia).map(d => new Date(d));
        const diaSeguinte = new Date(user.dataPrimeiroAcesso); diaSeguinte.setDate(diaSeguinte.getDate() + 1);
        if (acessoDias.some(d => d.toDateString() === diaSeguinte.toDateString())) metricas.coortes[coorteKey].d1++;
        const dia7 = new Date(user.dataPrimeiroAcesso); dia7.setDate(dia7.getDate() + 7);
        if (acessoDias.some(d => d.toDateString() === dia7.toDateString())) metricas.coortes[coorteKey].d7++;
        const dia30 = new Date(user.dataPrimeiroAcesso); dia30.setDate(dia30.getDate() + 30);
        if (acessoDias.some(d => d.toDateString() === dia30.toDateString())) metricas.coortes[coorteKey].d30++;
      }
      
      if (user.ultimoAcesso && user.dataPrimeiroAcesso && user.ultimoAcesso > user.dataPrimeiroAcesso) {
        const userActionsList = (userActions[user.id] || []).sort((a,b) => a.timestamp - b.timestamp);
        const primeiraAcao = userActionsList[0];
        if (primeiraAcao) metricas.primeiroAcaoRetornantes[primeiraAcao.actionType] = (metricas.primeiroAcaoRetornantes[primeiraAcao.actionType] || 0) + 1;
      }
      
      const userActionsList = userActions[user.id] || [];
      const protocolosCount = userActionsList.filter(a => a.actionType === 'open_protocol').length;
      const buscasCount = userActionsList.filter(a => a.actionType === 'search').length;
      const favoritosCount = userActionsList.filter(a => a.actionType === 'favorite').length;
      const forcepsCount = userActionsList.filter(a => a.actionType === 'forceps').length;
      const diagnosticoCount = userActionsList.filter(a => a.actionType === 'diagnostico').length;
      
      let score = 0;
      if (protocolosCount >= 5) score += 20;
      if (protocolosCount >= 10) score += 20;
      if (buscasCount >= 3) score += 15;
      if (favoritosCount >= 3) score += 15;
      if (forcepsCount >= 1) score += 15;
      if (diagnosticoCount >= 1) score += 15;
      metricas.scores.push(score);
      
      const temInterativo = buscasCount > 0 || favoritosCount > 0 || forcepsCount > 0 || diagnosticoCount > 0;
      const temPassivo = protocolosCount > 0;
      if (temPassivo && !temInterativo) metricas.tipoUso.passivo++;
      else if (temPassivo && temInterativo) metricas.tipoUso.hibrido++;
      else if (!temPassivo && temInterativo) metricas.tipoUso.interativo++;
    }
    
    metricas.taxaAtivacao = metricas.totalNovosUltimos30 > 0 ? Math.round((metricas.ativadosUltimos30 / metricas.totalNovosUltimos30) * 100) : 0;
    metricas.mediaProfundidade = metricas.scores.length > 0 ? Math.round(metricas.scores.reduce((a,b) => a+b, 0) / metricas.scores.length) : 0;
    metricas.distribuicaoProfundidade = {
      baixo: metricas.scores.filter(s => s <= 30).length,
      medio: metricas.scores.filter(s => s > 30 && s <= 70).length,
      alto: metricas.scores.filter(s => s > 70).length
    };
    
    let ahaCampeao = '', ahaMax = 0;
    for (const [acao, count] of Object.entries(metricas.primeiroAcaoRetornantes)) {
      if (count > ahaMax) { ahaMax = count; ahaCampeao = acao; }
    }
    metricas.ahaCampeao = ahaCampeao;
    metricas.ahaPercentual = ahaMax > 0 ? Math.round((ahaMax / Object.values(metricas.primeiroAcaoRetornantes).reduce((a,b) => a+b, 0)) * 100) : 0;
    
    cachedMetricasProduto = metricas;
  } catch (error) {
    console.error("Erro ao carregar mÃ©tricas:", error);
    cachedMetricasProduto = {
      totalNovosUltimos30: 0, ativadosUltimos30: 0, taxaAtivacao: 0, acaoAtivacao: {},
      coortes: {}, primeiroAcaoRetornantes: {}, scores: [],
      tipoUso: { passivo: 0, hibrido: 0, interativo: 0 }, mediaProfundidade: 0,
      distribuicaoProfundidade: { baixo: 0, medio: 0, alto: 0 }, ahaCampeao: '', ahaPercentual: 0
    };
  }
}

// ========== CARREGAR DADOS DA LANDING PAGE ==========
async function carregarLandingStats() {
  try {
    const snapshot = await db.collection('landing_stats').orderBy('timestamp', 'desc').limit(10000).get();
    const stats = {
      totalVisitas: 0, visitasUnicas: new Set(), eventos: {}, eventosPorDia: {},
      cliquesPorCta: {}, scrollDepth: { 25:0, 50:0, 75:0, 100:0 },
      sources: {}, devices: {}, tempoMedio: 0, temposTotais: [], secoesVistas: {},
      timerClicks: { total: 0, tempos: [] }, bounces: 0
    };
    let eventosPorData = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const dataStr = data.timestamp?.toDate?.()?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
      if (data.event === 'page_view') {
        stats.totalVisitas++;
        stats.visitasUnicas.add(data.sessionId);
        if (!eventosPorData[dataStr]) eventosPorData[dataStr] = {};
        eventosPorData[dataStr].visitas = (eventosPorData[dataStr].visitas || 0) + 1;
        if (data.source) stats.sources[data.source] = (stats.sources[data.source] || 0) + 1;
        if (data.deviceType) stats.devices[data.deviceType] = (stats.devices[data.deviceType] || 0) + 1;
      }
      stats.eventos[data.event] = (stats.eventos[data.event] || 0) + 1;
      if (data.event && data.event.startsWith('click_')) {
        stats.cliquesPorCta[data.event] = (stats.cliquesPorCta[data.event] || 0) + 1;
        if (!eventosPorData[dataStr]) eventosPorData[dataStr] = {};
        eventosPorData[dataStr].cliques = (eventosPorData[dataStr].cliques || 0) + 1;
      }
      if (data.event === 'scroll_25') stats.scrollDepth[25]++;
      if (data.event === 'scroll_50') stats.scrollDepth[50]++;
      if (data.event === 'scroll_75') stats.scrollDepth[75]++;
      if (data.event === 'scroll_100') stats.scrollDepth[100]++;
      if (data.event === 'section_view' && data.section) stats.secoesVistas[data.section] = (stats.secoesVistas[data.section] || 0) + 1;
      if (data.event === 'exit' && data.timeOnPageSeconds) stats.temposTotais.push(data.timeOnPageSeconds);
      if (data.event === 'timer_click' && data.timeToClickSeconds) { stats.timerClicks.total++; stats.timerClicks.tempos.push(data.timeToClickSeconds); }
      if (data.event === 'bounce_detected') stats.bounces++;
    });
    
    if (stats.temposTotais.length > 0) stats.tempoMedio = Math.round(stats.temposTotais.reduce((a,b)=>a+b,0) / stats.temposTotais.length);
    if (stats.timerClicks.tempos.length > 0) stats.timerClicks.tempoMedio = Math.round(stats.timerClicks.tempos.reduce((a,b)=>a+b,0) / stats.timerClicks.tempos.length);
    
    const cliquesAssinar = stats.cliquesPorCta['click_assinar_premium'] || 0;
    stats.taxaConversaoLanding = stats.totalVisitas > 0 ? Math.round((cliquesAssinar / stats.totalVisitas) * 100) : 0;
    const totalCliques = Object.values(stats.cliquesPorCta).reduce((a,b)=>a+b,0);
    stats.cliquesPorVisita = stats.totalVisitas > 0 ? (totalCliques / stats.totalVisitas).toFixed(2) : 0;
    stats.taxaRejeicao = stats.totalVisitas > 0 ? Math.round((stats.bounces / stats.totalVisitas) * 100) : 0;
    stats.visitasPorDia = Object.entries(eventosPorData).map(([data,valores]) => ({ data, visitas: valores.visitas || 0, cliques: valores.cliques || 0 })).sort((a,b)=>a.data.localeCompare(b.data)).slice(-30);
    stats.usuariosUnicos = stats.visitasUnicas.size;
    cachedLandingStats = stats;
  } catch(error) {
    console.error("Erro ao carregar landing stats:", error);
    cachedLandingStats = { totalVisitas:0, usuariosUnicos:0, eventos:{}, cliquesPorCta:{}, scrollDepth:{25:0,50:0,75:0,100:0}, sources:{}, devices:{}, tempoMedio:0, secoesVistas:{}, timerClicks:{total:0,tempoMedio:0}, taxaConversaoLanding:0, cliquesPorVisita:0, taxaRejeicao:0, bounces:0, visitasPorDia:[] };
  }
}

function aplicarFiltroOrdenacao() {
  let filtered = [...dadosUsuarios];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(u => u.email.toLowerCase().includes(term) || u.nome.toLowerCase().includes(term));
  }
  if (filtroStatus) {
    const agora = new Date();
    filtered = filtered.filter(u => {
      const expira = u.premiumExpira?.toDate ? u.premiumExpira.toDate() : null;
      const pagou = !!u.ultimoPagamentoId;
      const expirado = expira ? expira < agora : true;
      const isLivre = u.premium === false;
      const em7dias = expira ? (expira - agora) / (1000*60*60*24) <= 7 && !expirado : false;
      if (filtroStatus === 'premium') return !isLivre && !expirado && pagou;
      if (filtroStatus === 'trial') return !isLivre && !expirado && !pagou;
      if (filtroStatus === 'free') return isLivre || expirado;
      if (filtroStatus === 'expira7') return em7dias;
      if (filtroStatus === 'nunca') return (u.usos || 0) === 0;
      return true;
    });
  }
  filtered.sort((a,b) => {
    let valA = a[currentSort.field], valB = b[currentSort.field];
    if (currentSort.field === 'usos') { valA = valA || 0; valB = valB || 0; }
    if (typeof valA === 'boolean') return currentSort.order === 'desc' ? (valA === valB ? 0 : valA ? -1 : 1) : (valA === valB ? 0 : valA ? 1 : -1);
    if (valA < valB) return currentSort.order === 'desc' ? 1 : -1;
    if (valA > valB) return currentSort.order === 'desc' ? -1 : 1;
    return 0;
  });
  usuariosFiltrados = filtered;
}
function changeSort(field) {
  if (currentSort.field === field) currentSort.order = currentSort.order === 'desc' ? 'asc' : 'desc';
  else { currentSort.field = field; currentSort.order = 'desc'; }
  aplicarFiltroOrdenacao();
  currentPage = 1;
  renderizarSecaoAtual();
}

function getPaginatedUsers() { const start = (currentPage-1)*itemsPerPage; return usuariosFiltrados.slice(start, start+itemsPerPage); }
const totalPages = () => Math.ceil(usuariosFiltrados.length / itemsPerPage);
function mudarPagina(page) { currentPage = Math.max(1, Math.min(page, totalPages())); renderizarSecaoAtual(); }
function buscarUsuarios(termo) { searchTerm = termo; aplicarFiltroOrdenacao(); currentPage = 1; renderizarSecaoAtual(); }

function renderizarSecaoAtual() {
  const area = document.getElementById('content-area');
  if (!area) return;
  switch(currentSection) {
    case 'dashboard': area.innerHTML = renderDashboard(); break;
    case 'metricas': area.innerHTML = renderMetricasProduto(); break;
    case 'usuarios': area.innerHTML = renderUsuarios(); break;
    case 'conteudo': area.innerHTML = renderConteudoClinico(); setTimeout(() => { adminInitContentEditorInteractions(); adminUpdateContentPreview(); }, 0); break;
    case 'parceiros': area.innerHTML = renderParceiros(); renderizarSecaoAtual.parceirosCarregado = false; carregarParceiros(); break;
    case 'rankings': area.innerHTML = renderRankings(); break;
    case 'landing': area.innerHTML = renderLandingPage(); setTimeout(() => renderLandingCharts(), 100); break;
    case 'graficos': area.innerHTML = renderGraficos(); setTimeout(() => renderGraficosChart(), 100); break;
    case 'exportar': area.innerHTML = renderExportar(); break;
  }
}

function renderDashboard() {
  if (adminDataLoadError) return `<div class="section" style="border-left:4px solid #EF4444;"><h3>Erro ao carregar dados</h3><p style="color:#64748B;font-size:13px;line-height:1.5;">${adminDataLoadError}</p><p style="color:#64748B;font-size:12px;line-height:1.5;">Verifique se o usuÃ¡rio logado tem permissÃ£o para listar a coleÃ§Ã£o users no Firestore.</p></div>`;
  if (!cachedDados) return '<div class="section">Carregando...</div>';
  const d = cachedDados;

  // Badge para top protocolo
  let topBadge = '';
  if (d.topProtocoloPercentual > 20) topBadge = '<span class="ranking-badge badge-hot">ðŸ”¥ MUITO POPULAR</span>';
  else if (d.topProtocoloPercentual > 10) topBadge = '<span class="ranking-badge badge-popular">ðŸ‘ POPULAR</span>';
  else if (d.topProtocoloPercentual > 5) topBadge = '<span class="ranking-badge badge-normal">ðŸ‘Œ NORMAL</span>';
  else topBadge = '<span class="ranking-badge badge-low">âš ï¸ BAIXO</span>';

  // Alert de expiraÃ§Ã£o
  const alertExpira = d.expiramEm7 > 0 ? `
    <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;">
      <span style="font-size:18px">âš ï¸</span>
      <div>
        <div style="font-size:12px;font-weight:700;color:#92400E">${d.expiramEm7} usuÃ¡rio(s) expiram nos prÃ³ximos 7 dias</div>
        <div style="font-size:11px;color:#B45309;margin-top:1px">Considere entrar em contato para conversÃ£o</div>
      </div>
    </div>` : '';

  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
      <div>
        <h1 style="font-size:20px;font-weight:800;color:#0F172A">ðŸ“Š Dashboard</h1>
        <p style="font-size:12px;color:#94A3B8;margin-top:2px">VisÃ£o geral do OdontoDex</p>
      </div>
      <button onclick="refreshData()" style="background:#F1F5F9;border:none;padding:8px 16px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;color:#475569">âŸ³ Atualizar</button>
    </div>

    <div style="display:flex;gap:4px;background:#E2E8F0;padding:4px;border-radius:12px;width:fit-content;margin-bottom:20px;">
      <button onclick="showDashTab('usuarios',this)" id="dtab-usuarios" style="padding:8px 18px;border-radius:9px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:#fff;color:#7C3FA0;box-shadow:0 1px 4px rgba(0,0,0,0.1)">ðŸ‘¥ UsuÃ¡rios</button>
      <button onclick="showDashTab('atividade',this)" id="dtab-atividade" style="padding:8px 18px;border-radius:9px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:#64748B">ðŸ“… Atividade</button>
      <button onclick="showDashTab('alertas',this)" id="dtab-alertas" style="padding:8px 18px;border-radius:9px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:#64748B">âš ï¸ Alertas</button>
      <button onclick="showDashTab('protocolos',this)" id="dtab-protocolos" style="padding:8px 18px;border-radius:9px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:#64748B">ðŸ“‹ Protocolos</button>
    </div>

    <div id="dpanel-usuarios">
      <div class="stats-grid">
        <div class="stat-card card-users" style="display:flex;align-items:center;gap:14px;padding:16px 18px;cursor:pointer" onclick="irParaUsuariosFiltrado('')">
          <div style="width:40px;height:40px;border-radius:10px;background:#EDE9FE;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ‘¥</div>
          <div><div style="font-size:22px;font-weight:800;color:#0F172A">${d.totalUsuarios}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Total de usuÃ¡rios</div></div>
        </div>
        <div class="stat-card card-premium" style="display:flex;align-items:center;gap:14px;padding:16px 18px;cursor:pointer" onclick="irParaUsuariosFiltrado('premium')">
          <div style="width:40px;height:40px;border-radius:10px;background:#DCFCE7;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ’Ž</div>
          <div><div style="font-size:22px;font-weight:800;color:#10B981">${d.totalPremiumPago}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Premium (pagantes)</div></div>
        </div>
        <div class="stat-card" style="border-left:3px solid #F59E0B;display:flex;align-items:center;gap:14px;padding:16px 18px;cursor:pointer" onclick="irParaUsuariosFiltrado('trial')">
          <div style="width:40px;height:40px;border-radius:10px;background:#FEF9C3;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">â³</div>
          <div><div style="font-size:22px;font-weight:800;color:#F59E0B">${d.totalTrial}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Em Trial</div></div>
        </div>
        <div class="stat-card card-free" style="display:flex;align-items:center;gap:14px;padding:16px 18px;cursor:pointer" onclick="irParaUsuariosFiltrado('free')">
          <div style="width:40px;height:40px;border-radius:10px;background:#F1F5F9;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ†“</div>
          <div><div style="font-size:22px;font-weight:800;color:#94A3B8">${d.totalFreeReal}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Free (expirados)</div></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title"><span>ðŸ“Š</span> DistribuiÃ§Ã£o de planos</div>
        <div style="display:flex;height:12px;border-radius:8px;overflow:hidden;gap:2px;margin-bottom:10px">
          <div style="flex:${d.totalPremiumPago};background:#10B981;min-width:${d.totalPremiumPago>0?'4px':'0'}"></div>
          <div style="flex:${d.totalTrial};background:#F59E0B;min-width:${d.totalTrial>0?'4px':'0'}"></div>
          <div style="flex:${d.totalFreeReal};background:#E2E8F0;min-width:${d.totalFreeReal>0?'4px':'0'}"></div>
        </div>
        <div style="display:flex;gap:16px">
          <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#64748B"><span style="width:8px;height:8px;background:#10B981;border-radius:2px;display:inline-block"></span>Premium ${d.totalUsuarios>0?Math.round(d.totalPremiumPago/d.totalUsuarios*100):0}%</div>
          <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#64748B"><span style="width:8px;height:8px;background:#F59E0B;border-radius:2px;display:inline-block"></span>Trial ${d.totalUsuarios>0?Math.round(d.totalTrial/d.totalUsuarios*100):0}%</div>
          <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#64748B"><span style="width:8px;height:8px;background:#E2E8F0;border-radius:2px;display:inline-block"></span>Free ${d.totalUsuarios>0?Math.round(d.totalFreeReal/d.totalUsuarios*100):0}%</div>
        </div>
      </div>
    </div>

    <div id="dpanel-atividade" style="display:none">
      <div class="stats-grid">
        <div class="stat-card" style="display:flex;align-items:center;gap:14px;padding:16px 18px">
          <div style="width:40px;height:40px;border-radius:10px;background:#DBEAFE;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸŸ¢</div>
          <div><div style="font-size:22px;font-weight:800;color:#3B82F6">${d.abrirHoje}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Abriram hoje</div></div>
        </div>
        <div class="stat-card" style="display:flex;align-items:center;gap:14px;padding:16px 18px">
          <div style="width:40px;height:40px;border-radius:10px;background:#DBEAFE;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ†•</div>
          <div><div style="font-size:22px;font-weight:800;color:#3B82F6">${d.novosHoje}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Novos hoje</div></div>
        </div>
        <div class="stat-card card-month" style="display:flex;align-items:center;gap:14px;padding:16px 18px">
          <div style="width:40px;height:40px;border-radius:10px;background:#EDE9FE;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ“…</div>
          <div><div style="font-size:22px;font-weight:800;color:#7C3FA0">${d.novosMes}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Novos no mÃªs</div></div>
        </div>
        <div class="stat-card card-conversion" style="display:flex;align-items:center;gap:14px;padding:16px 18px">
          <div style="width:40px;height:40px;border-radius:10px;background:#DCFCE7;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ’°</div>
          <div><div style="font-size:22px;font-weight:800;color:#10B981">${d.assinaramMes}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Assinaram no mÃªs</div></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title"><span>ðŸ‘¥</span> Ativos no mÃªs</div>
        <div style="font-size:28px;font-weight:800;color:#7C3FA0">${d.usuariosAtivosMes} <span style="font-size:13px;color:#64748B;font-weight:500">usuÃ¡rios usaram o app este mÃªs</span></div>
      </div>
    </div>

    <div id="dpanel-alertas" style="display:none">
      ${alertExpira}
      <div class="stats-grid">
       <div class="stat-card" style="border-left:3px solid #F97316;display:flex;align-items:center;gap:14px;padding:16px 18px;cursor:pointer" onclick="irParaUsuariosFiltrado('expira7')">
          <div style="width:40px;height:40px;border-radius:10px;background:#FFEDD5;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">âš ï¸</div>
          <div><div style="font-size:22px;font-weight:800;color:#F97316">${d.expiramEm7}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Expiram em 7 dias</div></div>
        </div>
        <div class="stat-card" style="border-left:3px solid #EF4444;display:flex;align-items:center;gap:14px;padding:16px 18px">
          <div style="width:40px;height:40px;border-radius:10px;background:#FEE2E2;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ“‰</div>
          <div><div style="font-size:22px;font-weight:800;color:#EF4444">${d.churnMes}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Churn no mÃªs</div></div>
        </div>
        <div class="stat-card" style="border-left:3px solid #94A3B8;display:flex;align-items:center;gap:14px;padding:16px 18px;cursor:pointer" onclick="irParaUsuariosFiltrado('nunca')">
          <div style="width:40px;height:40px;border-radius:10px;background:#F1F5F9;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ˜´</div>
          <div><div style="font-size:22px;font-weight:800;color:#94A3B8">${d.nuncaUsaram}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Nunca usaram</div></div>
        </div>
        <div class="stat-card card-active" style="display:flex;align-items:center;gap:14px;padding:16px 18px">
          <div style="width:40px;height:40px;border-radius:10px;background:#DCFCE7;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ‘¥</div>
          <div><div style="font-size:22px;font-weight:800;color:#10B981">${d.usuariosAtivosMes}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Ativos no mÃªs</div></div>
        </div>
        <div class="stat-card card-total" style="display:flex;align-items:center;gap:14px;padding:16px 18px">
          <div style="width:40px;height:40px;border-radius:10px;background:#EDE9FE;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">ðŸ“‹</div>
          <div><div style="font-size:22px;font-weight:800;color:#7C3FA0">${d.totalUsos.toLocaleString()}</div><div style="font-size:11px;color:#64748B;font-weight:500;margin-top:2px">Protocolos (90d)</div></div>
        </div>
      </div>
    </div>

    <div id="dpanel-protocolos" style="display:none">
      <div class="section">
        <div class="section-title"><span>ðŸ†</span> Top 5 Protocolos Mais Usados</div>
        ${d.topProtocolos.slice(0,5).map((p,i) => {
          let badge='';
          if(p.percentual>20) badge='<span class="ranking-badge badge-hot">ðŸ”¥ MUITO POPULAR</span>';
          else if(p.percentual>10) badge='<span class="ranking-badge badge-popular">ðŸ‘ POPULAR</span>';
          else if(p.percentual>5) badge='<span class="ranking-badge badge-normal">ðŸ‘Œ NORMAL</span>';
          else badge='<span class="ranking-badge badge-low">âš ï¸ BAIXO</span>';
          return `<div class="ranking-item"><div class="ranking-header"><span class="ranking-name">${i+1}. ${p.nome}</span><span class="ranking-stats">${p.count} usos Â· ${p.percentual.toFixed(1)}% ${badge}</span></div><div class="ranking-bar"><div class="ranking-fill" style="width:${Math.min(p.percentual*2,100)}%;background:#7C3FA0;height:6px;border-radius:4px"></div></div></div>`;
        }).join('')}
      </div>
      ${d.lowProtocolos.length>0?`<div class="alert-card"><div class="alert-title">âš ï¸ Protocolos com baixa representatividade (&lt;5%)</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">${d.lowProtocolos.slice(0,6).map(p=>`<span style="background:#F1F5F9;padding:4px 10px;border-radius:16px;font-size:11px;">ðŸ“Œ ${p.nome} (${p.count} usos)</span>`).join('')}</div></div>`:''}
    </div>
  `;
}
  function showDashTab(tab, el) {
  ['usuarios','atividade','alertas','protocolos'].forEach(t => {
    document.getElementById('dpanel-'+t).style.display = t===tab ? 'block' : 'none';
    document.getElementById('dtab-'+t).style.background = t===tab ? '#fff' : 'transparent';
    document.getElementById('dtab-'+t).style.color = t===tab ? '#7C3FA0' : '#64748B';
    document.getElementById('dtab-'+t).style.boxShadow = t===tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none';
  });
}
window.showDashTab = showDashTab;
  function irParaUsuariosFiltrado(status) {
  filtroStatus = status;
  currentSection = 'usuarios';
  currentPage = 1;
  aplicarFiltroOrdenacao();
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.querySelector('[data-section="usuarios"]').classList.add('active');
  renderizarSecaoAtual();
}
window.irParaUsuariosFiltrado = irParaUsuariosFiltrado;

function adminEscapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function adminClinicalSource() {
  return {
    data: typeof INITIAL_DATA !== "undefined" ? INITIAL_DATA : null,
    cards: typeof QUICK_CONDUCT_CARDS !== "undefined" ? QUICK_CONDUCT_CARDS : null
  };
}

function adminClone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function adminProtocolLocation(protocolId) {
  const { data } = adminClinicalSource();
  if (!data) return "-";
  for (const [situationId, procedures] of Object.entries(data.procedures || {})) {
    if (!Array.isArray(procedures) || !procedures.some(p => p.id === protocolId)) continue;
    for (const [categoryId, situations] of Object.entries(data.situations || {})) {
      const situation = (situations || []).find(s => s.id === situationId);
      if (!situation) continue;
      const category = (data.categories || []).find(c => c.id === categoryId);
      return `${category?.label || categoryId} > ${situation.label}`;
    }
  }
  return "Sem categoria localizada";
}


function adminProtocolProcedureRefs() {
  const { data } = adminClinicalSource();
  const refs = new Set();
  Object.values(data?.procedures || {}).forEach(procedures => {
    (procedures || []).forEach(procedure => refs.add(procedure.id));
  });
  return refs;
}

function adminProtocolRouteStatus(protocolId) {
  const { data } = adminClinicalSource();
  if (!data?.protocols?.[protocolId]) return "missing";
  return adminProtocolProcedureRefs().has(protocolId) ? "active" : "orphan";
}
function adminContentItems(type) {
  const { data, cards } = adminClinicalSource();
  if (type === "card") {
    return Object.entries(cards || {}).map(([id, card]) => ({
      id,
      title: card.title || id,
      subtitle: "Conduta rápida",
      meta: `${(card.protocols || []).length} protocolo(s) · ${(card.related || []).length} relacionado(s)`
    }));
  }
  return Object.entries(data?.protocols || {}).map(([id, protocol]) => {
    const routeStatus = adminProtocolRouteStatus(id);
    return {
      id,
      title: protocol.title || id,
      subtitle: routeStatus === "orphan" ? "Sem caminho no app" : adminProtocolLocation(id),
      meta: `${protocol.free ? "Free" : "Premium"} · ${(protocol.steps || []).length} passo(s)`,
      routeStatus
    };
  });
}

function adminContentTemplate(type) {
  if (type === "card") {
    return {
      id: "novo-card",
      card: {
        id: "novo-card",
        title: "Título pesquisável",
        intent: "Intenção clínica do card",
        synonyms: [],
        quick: "Achado clínico → provável causa → conduta geral",
        changes: [],
        behind: [],
        protocols: [],
        related: []
      }
    };
  }
  return {
    id: "novo-protocolo",
    location: "Categoria > Situação",
    procedureLabel: "Nome exibido na lista",
    procedureFree: true,
    protocol: {
      title: "Título do protocolo",
      time: "15 min",
      level: "fácil",
      free: true,
      steps: [],
      errors: [],
      decisions: [],
      panic: [],
      crises: []
    }
  };
}

function adminContentEditorValue(type, id) {
  const { data, cards } = adminClinicalSource();
  if (!id || id === "__new__") return adminContentTemplate(type);
  if (type === "card") {
    const card = cards?.[id];
    return card ? { id, card: adminClone(card) } : adminContentTemplate("card");
  }
  const protocol = data?.protocols?.[id];
  return protocol ? {
    id,
    location: adminProtocolLocation(id),
    routeStatus: adminProtocolRouteStatus(id),
    decision: adminProtocolRouteStatus(id) === "orphan" ? contentEditorProtocolAction : "active",
    procedureLabel: protocol.title || id,
    procedureFree: protocol.free === true,
    protocol: adminClone(protocol)
  } : adminContentTemplate("protocol");
}

function adminGetEditorJson() {
  const textarea = document.getElementById("content-editor-json");
  if (!textarea) return null;
  return JSON.parse(textarea.value);
}

function adminValidateContentObject(payload, type) {
  const { data, cards } = adminClinicalSource();
  const errors = [];
  const warnings = [];
  if (!payload || typeof payload !== "object") errors.push("JSON inválido ou vazio.");
  const id = String(payload?.id || "").trim();
  if (!id) errors.push("Informe um id.");
  if (!/^[a-z0-9_-]+$/.test(id)) warnings.push("Prefira ids em minúsculas, sem acento, usando hífen.");

  if (type === "card") {
    const card = payload?.card || {};
    ["title", "intent", "quick"].forEach(field => {
      if (!String(card[field] || "").trim()) errors.push(`Card: campo ${field} é obrigatório.`);
    });
    ["synonyms", "changes", "behind", "protocols", "related"].forEach(field => {
      if (!Array.isArray(card[field])) errors.push(`Card: ${field} deve ser uma lista.`);
    });
    (card.protocols || []).forEach(item => {
      if (!item.id || !data?.protocols?.[item.id]) errors.push(`Como resolver aponta para protocolo inexistente: ${item.id || "(sem id)"}`);
    });
    (card.related || []).forEach(item => {
      if (!item.id || !cards?.[item.id]) errors.push(`Problema relacionado aponta para card inexistente: ${item.id || "(sem id)"}`);
    });
    if (!errors.length && !(card.protocols || []).length) warnings.push("Card sem protocolo em Como resolver. Pode ser intencional, mas vale revisar.");
  } else {
    const protocol = payload?.protocol || {};
    ["title", "time", "level"].forEach(field => {
      if (!String(protocol[field] || "").trim()) errors.push(`Protocolo: campo ${field} é obrigatório.`);
    });
    ["steps", "errors", "decisions", "panic", "crises"].forEach(field => {
      if (!Array.isArray(protocol[field])) errors.push(`Protocolo: ${field} deve ser uma lista.`);
    });
    (protocol.decisions || []).forEach((item, index) => {
      if (!item.if || !item.then) errors.push(`Decisão rápida #${index + 1} precisa ter if e then.`);
    });
    (protocol.panic || []).forEach((item, index) => {
      if (!item.problem || !item.solution) errors.push(`Modo pânico #${index + 1} precisa ter problem e solution.`);
    });
    if (payload?.routeStatus === "orphan") {
      warnings.push("Este protocolo existe no arquivo, mas não tem caminho em categorias/situações do app.");
    }
    if (!errors.length && !(protocol.steps || []).length) warnings.push("Protocolo sem passos. Verifique antes de publicar.");
  }
  return { errors, warnings };
}

function adminGeneratedContentCode(payload, type) {
  if (!payload) return "";
  const id = String(payload.id || "").trim();
  if (type === "card") {
    const card = adminClone(payload.card || {});
    card.id = id;
    return `"${id}": ${JSON.stringify(card, null, 2)}`;
  }
  const decision = payload.decision || (payload.routeStatus === "orphan" ? "review" : "active");
  const decisionNotes = {
    active: "// Decisão: ativar no app. Escolha a categoria/situação correta e adicione em INITIAL_DATA.procedures.",
    remove: "// Decisão: excluir. Remover este item de INITIAL_DATA.protocols se o conteúdo não fizer mais sentido.",
    relate: "// Decisão: relacionar a card. Adicionar este protocolo ao campo protocols de um card de conduta existente.",
    review: "// Decisão: manter em revisão. Não publicar até definir categoria, card ou exclusão."
  };
  return [
    decisionNotes[decision] || decisionNotes.review,
    payload.routeStatus === "orphan" ? "// Atenção: protocolo sem caminho visual no app neste momento." : "// Protocolo com caminho no app.",
    "",
    `// Em INITIAL_DATA.procedures[ID_DA_SITUACAO], adicionar:`,
    JSON.stringify({ id, label: payload.procedureLabel || payload.protocol?.title || id, free: payload.procedureFree !== false }, null, 2),
    "",
    `// Em INITIAL_DATA.protocols, adicionar/atualizar:`,
    `"${id}": ${JSON.stringify(payload.protocol || {}, null, 2)}`
  ].join("\n");
}

function adminRenderContentPreview(payload, type) {
  if (!payload) return '<div class="content-preview-empty">Edite o JSON para visualizar.</div>';
  if (type === "card") {
    const card = payload.card || {};
    return `
      <div class="content-preview-card">
        <div class="content-preview-kicker">Conduta rápida</div>
        <h3>${adminEscapeHtml(card.title || payload.id)}</h3>
        <p>${adminEscapeHtml(card.intent || "Sem intenção clínica preenchida.")}</p>
        <div class="content-preview-block"><strong>Resposta rápida</strong><span>${adminEscapeHtml(card.quick || "-")}</span></div>
        <div class="content-preview-grid">
          <span>${(card.synonyms || []).length} sinônimo(s)</span>
          <span>${(card.protocols || []).length} protocolo(s)</span>
          <span>${(card.related || []).length} relacionado(s)</span>
        </div>
      </div>
    `;
  }
  const protocol = payload.protocol || {};
  return `
    <div class="content-preview-card">
      <div class="content-preview-kicker">Protocolo</div>
      <h3>${adminEscapeHtml(protocol.title || payload.id)}</h3>
      <p>${adminEscapeHtml(payload.location || "Categoria não definida")}</p>
      <div class="content-preview-grid">
        <span>${adminEscapeHtml(protocol.time || "-")}</span>
        <span>${adminEscapeHtml(protocol.level || "-")}</span>
        <span>${protocol.free ? "Free" : "Premium"}</span>
        <span>${payload.routeStatus === "orphan" ? "Sem caminho no app" : "Com caminho no app"}</span>
      </div>
      <div class="content-preview-block"><strong>Passos</strong><span>${(protocol.steps || []).slice(0, 4).map(adminEscapeHtml).join(" · ") || "-"}</span></div>
    </div>
  `;
}

function renderConteudoClinico() {
  const { data, cards } = adminClinicalSource();
  if (!data || !cards) {
    return `
      <div class="content-header"><h1>Conteúdo Clínico</h1><p>Editor de rascunhos para protocolos e cards.</p></div>
      <div class="section" style="border-left:4px solid #EF4444;">
        <h3>Dados clínicos não carregados</h3>
        <p style="color:#64748B;font-size:13px;line-height:1.5;">Verifique se src/data/clinical-data.js foi carregado antes do admin.js.</p>
      </div>
    `;
  }
  const protocolsCount = Object.keys(data.protocols || {}).length;
  const cardsCount = Object.keys(cards || {}).length;
  const orphanProtocolsCount = adminContentItems("protocol").filter(item => item.routeStatus === "orphan").length;
  const items = adminContentItems(contentEditorType)
    .filter(item => {
      const term = contentEditorSearch.trim().toLowerCase();
      if (!term) return true;
      return `${item.id} ${item.title} ${item.subtitle}`.toLowerCase().includes(term);
    })
    .sort((a, b) => a.title.localeCompare(b.title));
  if (!contentEditorId && items[0]) contentEditorId = items[0].id;
  return `
    <div class="content-header">
      <h1>Conteúdo Clínico</h1>
      <p>Visualize, edite rascunhos, valide relações e gere blocos para implementação.</p>
    </div>
    <div class="content-note">
      Este editor não publica no app e não altera o Firestore. Ele serve para criar rascunhos revisáveis antes da implementação.
      ${orphanProtocolsCount ? `<strong>${orphanProtocolsCount} protocolo(s) sem caminho no app foram sinalizados.</strong>` : ""}
    </div>
    <div class="content-editor-shell">
      <aside class="content-editor-list">
        <div class="content-editor-tabs">
          <button type="button" class="${contentEditorType === "protocol" ? "active" : ""}" data-content-action="switch" data-content-type="protocol">Protocolos <span>${protocolsCount}</span></button>
          <button type="button" class="${contentEditorType === "card" ? "active" : ""}" data-content-action="switch" data-content-type="card">Cards <span>${cardsCount}</span></button>
        </div>
        <input class="content-search-input" value="${adminEscapeHtml(contentEditorSearch)}" data-content-action="search" placeholder="Buscar por nome ou id...">
        <button type="button" class="content-new-btn" data-content-action="new">Criar novo rascunho</button>
        <div class="content-item-list">
          ${items.map(item => `
            <button type="button" class="content-item ${item.id === contentEditorId ? "active" : ""} ${item.routeStatus === "orphan" ? "orphan" : ""}" data-content-action="open" data-content-type="${adminEscapeHtml(contentEditorType)}" data-content-id="${adminEscapeHtml(item.id)}">
              <strong>${adminEscapeHtml(item.title)}${item.routeStatus === "orphan" ? '<b class="content-orphan-badge">Sem caminho</b>' : ""}</strong>
              <small>${adminEscapeHtml(item.id)}</small>
              <span>${adminEscapeHtml(item.subtitle)}</span>
              <em>${adminEscapeHtml(item.meta)}</em>
            </button>
          `).join("") || '<div class="content-preview-empty">Nenhum item encontrado.</div>'}
        </div>
      </aside>
      <section class="content-editor-main content-editor-empty">
        <div class="content-editor-kicker">Editor visual</div>
        <h2>Abra um item para visualizar e editar como no app.</h2>
        <p>
          Clique em um protocolo ou card na lista. Ele abre em um modal com prévia estilo mobile,
          campos editáveis, seleção de protocolos em “Como resolver” e seleção de cards em “Problemas relacionados”.
        </p>
        <div class="content-editor-empty-actions">
          <button type="button" data-content-action="new">Criar novo rascunho</button>
        </div>
        <div class="content-editor-empty-note">
          ${orphanProtocolsCount ? `${orphanProtocolsCount} protocolo(s) existem no arquivo, mas ainda não aparecem em nenhuma rota do app. Eles estão marcados como “Sem caminho”.` : "Todos os protocolos encontrados possuem caminho no app."}
        </div>
      </section>
    </div>
  `;
}

function adminSwitchContentType(type) {
  contentEditorType = type === "card" ? "card" : "protocol";
  contentEditorId = "";
  contentEditorSearch = "";
  renderizarSecaoAtual();
}

function adminOpenContentItem(type, id) {
  contentEditorType = type === "card" ? "card" : "protocol";
  contentEditorId = id;
  adminOpenContentModal(adminContentEditorValue(contentEditorType, contentEditorId), contentEditorType);
}

function adminSearchContent(value) {
  contentEditorSearch = value;
  contentEditorId = "";
  renderizarSecaoAtual();
}

function adminNewContentDraft() {
  contentEditorId = "__new__";
  adminOpenContentModal(adminContentEditorValue(contentEditorType, contentEditorId), contentEditorType);
}

function adminUpdateContentPreview() {
  const validationEl = document.getElementById("content-validation-result");
  const previewEl = document.getElementById("content-preview-result");
  const codeEl = document.getElementById("content-generated-code");
  if (!validationEl || !previewEl || !codeEl) return;
  try {
    const payload = adminGetEditorJson();
    const decisionSelect = document.getElementById("content-orphan-action");
    if (decisionSelect && payload && contentEditorType === "protocol") {
      contentEditorProtocolAction = decisionSelect.value;
      payload.decision = contentEditorProtocolAction;
    }
    const result = adminValidateContentObject(payload, contentEditorType);
    const okHtml = '<div class="content-validation-ok">Estrutura válida para rascunho.</div>';
    const errorHtml = result.errors.map(error => `<div class="content-validation-error">${adminEscapeHtml(error)}</div>`).join("");
    const warningHtml = result.warnings.map(warning => `<div class="content-validation-warning">${adminEscapeHtml(warning)}</div>`).join("");
    validationEl.innerHTML = (result.errors.length ? errorHtml : okHtml) + warningHtml;
    previewEl.innerHTML = adminRenderContentPreview(payload, contentEditorType);
    codeEl.textContent = adminGeneratedContentCode(payload, contentEditorType);
  } catch (error) {
    validationEl.innerHTML = `<div class="content-validation-error">JSON inválido: ${adminEscapeHtml(error.message)}</div>`;
    previewEl.innerHTML = '<div class="content-preview-empty">Corrija o JSON para visualizar.</div>';
    codeEl.textContent = "";
  }
}

async function adminCopyGeneratedContent() {
  adminUpdateContentPreview();
  const code = document.getElementById("content-generated-code")?.textContent || "";
  if (!code.trim()) {
    mostrarToastAdmin("Nada para copiar", "warning");
    return;
  }
  try {
    await navigator.clipboard.writeText(code);
    mostrarToastAdmin("Bloco copiado para implementação", "success");
  } catch (error) {
    mostrarToastAdmin("Não foi possível copiar automaticamente", "error");
  }
}

function adminTextareaList(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function adminListFromTextarea(value) {
  return String(value || "")
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);
}

function adminPairsToTextarea(items, leftKey, rightKey) {
  return (items || []).map(item => `${item[leftKey] || ""} | ${item[rightKey] || ""}`).join("\n");
}

function adminPairsFromTextarea(value, leftKey, rightKey) {
  return String(value || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [left, ...rest] = line.split("|");
      return {
        [leftKey]: (left || "").trim(),
        [rightKey]: rest.join("|").trim()
      };
    })
    .filter(item => item[leftKey] || item[rightKey]);
}

function adminSelectedOptions(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return [];
  return Array.from(select.selectedOptions).map(option => ({
    id: option.value,
    label: option.textContent.trim()
  }));
}

function adminRenderProtocolSelect(selected) {
  const selectedIds = new Set((selected || []).map(item => item.id));
  return adminContentItems("protocol")
    .map(item => `<option value="${adminEscapeHtml(item.id)}" ${selectedIds.has(item.id) ? "selected" : ""}>${adminEscapeHtml(item.title)}</option>`)
    .join("");
}

function adminRenderCardSelect(selected) {
  const selectedIds = new Set((selected || []).map(item => item.id));
  return adminContentItems("card")
    .map(item => `<option value="${adminEscapeHtml(item.id)}" ${selectedIds.has(item.id) ? "selected" : ""}>${adminEscapeHtml(item.title)}</option>`)
    .join("");
}

function adminOpenContentModal(payload, type) {
  let modal = document.getElementById("content-modal-layer");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "content-modal-layer";
    document.body.appendChild(modal);
  }
  modal.className = "content-modal-layer open";
  modal.innerHTML = adminRenderContentModal(payload, type);
  adminInitContentModalInteractions(modal);
  adminUpdateModalPreview();
}

function adminRenderContentModal(payload, type) {
  const isCard = type === "card";
  const item = isCard ? (payload.card || {}) : (payload.protocol || {});
  return `
    <div class="content-modal-backdrop" data-content-modal-action="close"></div>
    <section class="content-modal">
      <div class="content-modal-header">
        <div>
          <span>${isCard ? "Card de conduta" : "Protocolo"}</span>
          <h2>${adminEscapeHtml(item.title || payload.id || "Novo rascunho")}</h2>
        </div>
        <button type="button" data-content-modal-action="close" aria-label="Fechar">×</button>
      </div>
      ${!isCard && payload.routeStatus === "orphan" ? `
        <div class="content-orphan-panel modal">
          <div><strong>Sem caminho no app</strong><span>Este protocolo existe no arquivo, mas não aparece em categorias/situações.</span></div>
          <select id="modal-decision" data-content-modal-field="decision">
            <option value="review" ${payload.decision === "review" ? "selected" : ""}>Manter em revisão</option>
            <option value="active" ${payload.decision === "active" ? "selected" : ""}>Ativar em uma categoria</option>
            <option value="relate" ${payload.decision === "relate" ? "selected" : ""}>Relacionar a um card</option>
            <option value="remove" ${payload.decision === "remove" ? "selected" : ""}>Excluir depois de revisar</option>
          </select>
        </div>
      ` : ""}
      <div class="content-modal-grid">
        <div class="content-modal-preview">
          <div class="content-phone-preview" id="content-modal-preview"></div>
        </div>
        <form class="content-modal-form" id="content-modal-form" data-content-type="${adminEscapeHtml(type)}">
          <input type="hidden" id="modal-route-status" value="${adminEscapeHtml(payload.routeStatus || "active")}">
          <label>Id<input id="modal-id" value="${adminEscapeHtml(payload.id || "")}"></label>
          ${isCard ? adminRenderCardForm(item) : adminRenderProtocolForm(item, payload)}
          <div class="content-modal-validation" id="content-modal-validation"></div>
          <div class="content-modal-actions">
            <button type="button" data-content-modal-action="validate">Validar</button>
            <button type="button" data-content-modal-action="copy">Copiar bloco gerado</button>
          </div>
          <pre id="content-modal-code"></pre>
        </form>
      </div>
    </section>
  `;
}

function adminRenderCardForm(card) {
  return `
    <label>Título<input id="modal-card-title" value="${adminEscapeHtml(card.title || "")}"></label>
    <label>Intenção clínica<textarea id="modal-card-intent">${adminEscapeHtml(card.intent || "")}</textarea></label>
    <label>Sinônimos de busca <small>um por linha</small><textarea id="modal-card-synonyms">${adminEscapeHtml(adminTextareaList(card.synonyms))}</textarea></label>
    <label>Resposta rápida<textarea id="modal-card-quick">${adminEscapeHtml(card.quick || "")}</textarea></label>
    <label>Quando isso muda? <small>um tópico por linha</small><textarea id="modal-card-changes">${adminEscapeHtml(adminTextareaList(card.changes))}</textarea></label>
    <label>O que costuma estar por trás disso? <small>um tópico por linha</small><textarea id="modal-card-behind">${adminEscapeHtml(adminTextareaList(card.behind))}</textarea></label>
    <label>Como resolver <small>escolha protocolos existentes</small><select id="modal-card-protocols" multiple>${adminRenderProtocolSelect(card.protocols || [])}</select></label>
    <label>Problemas relacionados <small>escolha cards existentes</small><select id="modal-card-related" multiple>${adminRenderCardSelect(card.related || [])}</select></label>
  `;
}

function adminRenderProtocolForm(protocol, payload) {
  return `
    <label>Título<input id="modal-protocol-title" value="${adminEscapeHtml(protocol.title || "")}"></label>
    <div class="content-modal-row">
      <label>Tempo<input id="modal-protocol-time" value="${adminEscapeHtml(protocol.time || "")}"></label>
      <label>Nível<input id="modal-protocol-level" value="${adminEscapeHtml(protocol.level || "")}"></label>
      <label>Plano<select id="modal-protocol-free"><option value="true" ${protocol.free ? "selected" : ""}>Free</option><option value="false" ${!protocol.free ? "selected" : ""}>Premium</option></select></label>
    </div>
    <label>Categoria / situação desejada <small>para o bloco gerado</small><input id="modal-protocol-location" value="${adminEscapeHtml(payload.location || "")}"></label>
    <label>Nome exibido na lista<input id="modal-procedure-label" value="${adminEscapeHtml(payload.procedureLabel || protocol.title || "")}"></label>
    <label>Passo a passo <small>um passo por linha</small><textarea id="modal-protocol-steps">${adminEscapeHtml(adminTextareaList(protocol.steps))}</textarea></label>
    <label>Erros que ferram <small>um erro por linha</small><textarea id="modal-protocol-errors">${adminEscapeHtml(adminTextareaList(protocol.errors))}</textarea></label>
    <label>Decisão rápida <small>formato: Se | Então</small><textarea id="modal-protocol-decisions">${adminEscapeHtml(adminPairsToTextarea(protocol.decisions, "if", "then"))}</textarea></label>
    <label>Modo pânico <small>formato: Problema | Solução</small><textarea id="modal-protocol-panic">${adminEscapeHtml(adminPairsToTextarea(protocol.panic, "problem", "solution"))}</textarea></label>
  `;
}

function adminModalPayloadFromForm() {
  const form = document.getElementById("content-modal-form");
  if (!form) return null;
  const type = form.dataset.contentType;
  const id = document.getElementById("modal-id").value.trim();
  if (type === "card") {
    return {
      id,
      card: {
        id,
        title: document.getElementById("modal-card-title").value.trim(),
        intent: document.getElementById("modal-card-intent").value.trim(),
        synonyms: adminListFromTextarea(document.getElementById("modal-card-synonyms").value),
        quick: document.getElementById("modal-card-quick").value.trim(),
        changes: adminListFromTextarea(document.getElementById("modal-card-changes").value),
        behind: adminListFromTextarea(document.getElementById("modal-card-behind").value),
        protocols: adminSelectedOptions("modal-card-protocols"),
        related: adminSelectedOptions("modal-card-related")
      }
    };
  }
  return {
    id,
    location: document.getElementById("modal-protocol-location").value.trim(),
    routeStatus: document.getElementById("modal-route-status").value,
    decision: document.getElementById("modal-decision")?.value || "active",
    procedureLabel: document.getElementById("modal-procedure-label").value.trim(),
    procedureFree: document.getElementById("modal-protocol-free").value === "true",
    protocol: {
      title: document.getElementById("modal-protocol-title").value.trim(),
      time: document.getElementById("modal-protocol-time").value.trim(),
      level: document.getElementById("modal-protocol-level").value.trim(),
      free: document.getElementById("modal-protocol-free").value === "true",
      steps: adminListFromTextarea(document.getElementById("modal-protocol-steps").value),
      errors: adminListFromTextarea(document.getElementById("modal-protocol-errors").value),
      decisions: adminPairsFromTextarea(document.getElementById("modal-protocol-decisions").value, "if", "then"),
      panic: adminPairsFromTextarea(document.getElementById("modal-protocol-panic").value, "problem", "solution"),
      crises: []
    }
  };
}

function adminUpdateModalPreview() {
  const form = document.getElementById("content-modal-form");
  const preview = document.getElementById("content-modal-preview");
  const validation = document.getElementById("content-modal-validation");
  const code = document.getElementById("content-modal-code");
  if (!form || !preview || !validation || !code) return;
  const type = form.dataset.contentType;
  const payload = adminModalPayloadFromForm();
  const result = adminValidateContentObject(payload, type);
  preview.innerHTML = type === "card" ? adminRenderCardAppPreview(payload.card || {}) : adminRenderProtocolAppPreview(payload.protocol || {});
  validation.innerHTML = result.errors.map(error => `<div class="content-validation-error">${adminEscapeHtml(error)}</div>`).join("") || '<div class="content-validation-ok">Rascunho válido.</div>';
  validation.innerHTML += result.warnings.map(warning => `<div class="content-validation-warning">${adminEscapeHtml(warning)}</div>`).join("");
  code.textContent = adminGeneratedContentCode(payload, type);
}

function adminRenderCardAppPreview(card) {
  return `
    <div class="app-preview-kind">Conduta rápida</div>
    <h2>${adminEscapeHtml(card.title || "Novo card")}</h2>
    <div class="app-preview-section primary"><strong>Resposta rápida</strong><p>${adminEscapeHtml(card.quick || "-")}</p></div>
    <div class="app-preview-section alert"><strong>Quando isso muda?</strong>${adminPreviewList(card.changes)}</div>
    <div class="app-preview-section"><strong>O que costuma estar por trás disso?</strong>${adminPreviewList(card.behind)}</div>
    <div class="app-preview-section"><strong>Como resolver</strong>${adminPreviewLinks(card.protocols)}</div>
    <div class="app-preview-section"><strong>Problemas relacionados</strong>${adminPreviewLinks(card.related)}</div>
  `;
}

function adminRenderProtocolAppPreview(protocol) {
  return `
    <div class="app-preview-kind">${protocol.free ? "Free" : "Premium"}</div>
    <h2>${adminEscapeHtml(protocol.title || "Novo protocolo")}</h2>
    <div class="app-preview-meta"><span>${adminEscapeHtml(protocol.time || "-")}</span><span>${adminEscapeHtml(protocol.level || "-")}</span></div>
    <div class="app-preview-section"><strong>Passo a passo</strong>${adminPreviewNumbered(protocol.steps)}</div>
    <div class="app-preview-section alert"><strong>Erros que ferram</strong>${adminPreviewList(protocol.errors)}</div>
    <div class="app-preview-section"><strong>Decisão rápida</strong>${adminPreviewPairs(protocol.decisions, "if", "then")}</div>
    <div class="app-preview-section panic"><strong>Modo pânico</strong>${adminPreviewPairs(protocol.panic, "problem", "solution")}</div>
  `;
}

function adminPreviewList(items) {
  return `<ul>${(items || []).map(item => `<li>${adminEscapeHtml(item)}</li>`).join("") || "<li>-</li>"}</ul>`;
}

function adminPreviewNumbered(items) {
  return `<ol>${(items || []).map(item => `<li>${adminEscapeHtml(item)}</li>`).join("") || "<li>-</li>"}</ol>`;
}

function adminPreviewPairs(items, leftKey, rightKey) {
  return `<div class="app-preview-pairs">${(items || []).map(item => `<div><b>${adminEscapeHtml(item[leftKey] || "-")}</b><span>${adminEscapeHtml(item[rightKey] || "-")}</span></div>`).join("") || "<div><b>-</b><span>-</span></div>"}</div>`;
}

function adminPreviewLinks(items) {
  return `<div class="app-preview-links">${(items || []).map(item => `<button type="button">${adminEscapeHtml(item.label || item.id)}</button>`).join("") || "<span>-</span>"}</div>`;
}

async function adminCopyModalGeneratedContent() {
  adminUpdateModalPreview();
  const code = document.getElementById("content-modal-code")?.textContent || "";
  if (!code.trim()) return mostrarToastAdmin("Nada para copiar", "warning");
  try {
    await navigator.clipboard.writeText(code);
    mostrarToastAdmin("Bloco copiado para implementação", "success");
  } catch (error) {
    mostrarToastAdmin("Não foi possível copiar automaticamente", "error");
  }
}

function adminCloseContentModal() {
  const modal = document.getElementById("content-modal-layer");
  if (modal) modal.remove();
}

function adminInitContentModalInteractions(modal) {
  if (!modal || modal.dataset.ready === "1") return;
  modal.dataset.ready = "1";
  modal.addEventListener("click", event => {
    const target = event.target.closest("[data-content-modal-action]");
    if (!target) return;
    const action = target.dataset.contentModalAction;
    if (action === "close") adminCloseContentModal();
    if (action === "validate") adminUpdateModalPreview();
    if (action === "copy") adminCopyModalGeneratedContent();
  });
  modal.addEventListener("input", event => {
    if (event.target.closest("#content-modal-form")) adminUpdateModalPreview();
  });
  modal.addEventListener("change", event => {
    if (event.target.closest("#content-modal-form")) adminUpdateModalPreview();
  });
}

function adminInitContentEditorInteractions() {
  const area = document.getElementById("content-area");
  if (!area || area.dataset.contentEditorReady === "1") return;
  area.dataset.contentEditorReady = "1";
  area.addEventListener("click", event => {
    const target = event.target.closest("[data-content-action]");
    if (!target) return;
    const action = target.dataset.contentAction;
    if (action === "switch") adminSwitchContentType(target.dataset.contentType);
    if (action === "open") adminOpenContentItem(target.dataset.contentType, target.dataset.contentId);
    if (action === "new") adminNewContentDraft();
    if (action === "validate") adminUpdateContentPreview();
    if (action === "copy") adminCopyGeneratedContent();
  });
  area.addEventListener("input", event => {
    const target = event.target.closest("[data-content-action='search']");
    if (!target) return;
    contentEditorSearch = target.value;
    contentEditorId = "";
    renderizarSecaoAtual();
  });
  area.addEventListener("change", event => {
    const target = event.target.closest("[data-content-action='decision']");
    if (!target) return;
    contentEditorProtocolAction = target.value;
    adminUpdateContentPreview();
  });
}

function renderMetricasProduto() {
  if (!cachedMetricasProduto) return '<div class="section">Carregando...</div>';
  const m = cachedMetricasProduto;
  const formatTipoAcao = (acao) => { const map = { 'open_protocol':'ðŸ“– Abriu protocolo', 'search':'ðŸ” Usou busca', 'favorite':'â­ Favoritou', 'forceps':'ðŸ¦· FÃ³rceps dinÃ¢mico', 'diagnostico':'ðŸ©º DiagnÃ³stico guiado' }; return map[acao] || acao; };
  const tipoUsoTotal = m.tipoUso.passivo + m.tipoUso.hibrido + m.tipoUso.interativo;
  const passivoPercent = tipoUsoTotal>0 ? Math.round((m.tipoUso.passivo/tipoUsoTotal)*100) : 0;
  const hibridoPercent = tipoUsoTotal>0 ? Math.round((m.tipoUso.hibrido/tipoUsoTotal)*100) : 0;
  const interativoPercent = tipoUsoTotal>0 ? Math.round((m.tipoUso.interativo/tipoUsoTotal)*100) : 0;
  const totalRetornantes = Object.values(m.primeiroAcaoRetornantes).reduce((a,b)=>a+b,0);
  return `
    <div class="content-header"><h1>ðŸ“ˆ MÃ©tricas de Produto</h1><p>AnÃ¡lise de comportamento e retenÃ§Ã£o</p></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">ðŸš€</div><div class="stat-number">${m.taxaAtivacao}%</div><div class="stat-label">Taxa de AtivaÃ§Ã£o</div></div>
      <div class="stat-card"><div class="stat-icon">ðŸ”„</div><div class="stat-number">${Object.keys(m.coortes).length} coortes</div><div class="stat-label">Coortes analisadas</div></div>
      <div class="stat-card"><div class="stat-icon">âš¡</div><div class="stat-number">${m.ahaPercentual}%</div><div class="stat-label">AHA: ${formatTipoAcao(m.ahaCampeao)}</div></div>
      <div class="stat-card"><div class="stat-icon">ðŸ“Š</div><div class="stat-number">${m.mediaProfundidade}</div><div class="stat-label">Score mÃ©dio de profundidade</div></div>
    </div>
    <div class="graficos-grid">
      <div class="section"><div class="section-title"><span>ðŸš€</span> ATIVAÃ‡ÃƒO (Ãºltimos 30 dias)</div><div class="stats-grid" style="grid-template-columns:1fr 1fr;margin-bottom:0;"><div><div class="stat-number" style="font-size:20px;">${m.totalNovosUltimos30}</div><div class="stat-label">Novos usuÃ¡rios</div></div><div><div class="stat-number" style="font-size:20px;color:#10B981;">${m.ativadosUltimos30}</div><div class="stat-label">Ativados</div></div></div><div class="ranking-bar" style="margin:12px 0;"><div class="ranking-fill fill-normal" style="width:${m.taxaAtivacao}%;background:#10B981;"></div></div><div style="font-size:12px;color:#64748B;">O que fez ativar?</div><div class="click-chart" style="margin-top:8px;">${Object.entries(m.acaoAtivacao).map(([acao,count])=>`<div class="click-bar"><div class="click-bar-label">${formatTipoAcao(acao)}</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${Math.min((count/m.ativadosUltimos30)*100,100)}%;background:#10B981;">${count}</div></div></div>`).join('')}</div></div>
      <div class="section"><div class="section-title"><span>ðŸŽ®</span> TIPO DE USO DO APP</div><div class="click-chart"><div class="click-bar"><div class="click-bar-label">ðŸ“– Passivo (sÃ³ protocolos)</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${passivoPercent}%;background:#64748B;">${passivoPercent}%</div></div></div><div class="click-bar"><div class="click-bar-label">ðŸ”„ HÃ­brido</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${hibridoPercent}%;background:#F59E0B;">${hibridoPercent}%</div></div></div><div class="click-bar"><div class="click-bar-label">âš¡ Interativo (busca/favoritos/ferramentas)</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${interativoPercent}%;background:#7C3FA0;">${interativoPercent}%</div></div></div></div>${interativoPercent<30?`<div class="warning-card"><div class="warning-title">ðŸ’¡ Insight</div><div class="insight-text">Apenas ${interativoPercent}% dos usuÃ¡rios usam ferramentas interativas. Considere destacar a busca e o fÃ³rceps dinÃ¢mico na home.</div></div>`:''}</div>
    </div>
    <div class="graficos-grid">
      <div class="section"><div class="section-title"><span>ðŸ“Š</span> PROFUNDIDADE DE USO</div><div class="click-chart"><div class="click-bar"><div class="click-bar-label">ðŸŸ¡ Superficial (0-30)</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${Math.min((m.distribuicaoProfundidade.baixo/m.scores.length)*100,100)}%;background:#EF4444;">${m.distribuicaoProfundidade.baixo}</div></div></div><div class="click-bar"><div class="click-bar-label">ðŸŸ  MÃ©dio (31-70)</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${Math.min((m.distribuicaoProfundidade.medio/m.scores.length)*100,100)}%;background:#F59E0B;">${m.distribuicaoProfundidade.medio}</div></div></div><div class="click-bar"><div class="click-bar-label">ðŸŸ¢ Profundo (71-100)</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${Math.min((m.distribuicaoProfundidade.alto/m.scores.length)*100,100)}%;background:#10B981;">${m.distribuicaoProfundidade.alto}</div></div></div></div><div class="insight-card"><div class="insight-title">ðŸ“Š Score mÃ©dio: ${m.mediaProfundidade}</div><div class="insight-text">Meta: 60 atÃ© Jun/2025</div></div></div>
      <div class="section"><div class="section-title"><span>âš¡</span> MOMENTO "AHA"</div><div class="click-chart">${Object.entries(m.primeiroAcaoRetornantes).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([acao,count])=>{const percent=totalRetornantes>0?Math.round((count/totalRetornantes)*100):0; return `<div class="click-bar"><div class="click-bar-label">${formatTipoAcao(acao)}</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${percent}%;background:#7C3FA0;">${percent}%</div></div></div>`;}).join('')}</div><div class="insight-card"><div class="insight-title">ðŸ† Funcionalidade campeÃ£: ${formatTipoAcao(m.ahaCampeao)}</div><div class="insight-text">${m.ahaPercentual}% dos usuÃ¡rios que voltaram no D1 comeÃ§aram por esta funcionalidade.</div></div></div>
    </div>
    <div class="section"><div class="section-title"><span>ðŸ”„</span> RETENÃ‡ÃƒO POR COORTE (D1 / D7 / D30)</div><div class="table-wrapper"><table><thead><tr><th>MÃªs</th><th>UsuÃ¡rios</th><th>D1</th><th>D7</th><th>D30</th></tr></thead><tbody>${Object.entries(m.coortes).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,6).map(([mes,coorte])=>{const d1Percent=coorte.total>0?Math.round((coorte.d1/coorte.total)*100):0; const d7Percent=coorte.total>0?Math.round((coorte.d7/coorte.total)*100):0; const d30Percent=coorte.total>0?Math.round((coorte.d30/coorte.total)*100):0; return `<tr><td>${mes}</td><td>${coorte.total}</td><td>${coorte.d1} (${d1Percent}%)</td><td>${coorte.d7} (${d7Percent}%)</td><td>${coorte.d30} (${d30Percent}%)</td></tr>`;}).join('')}${Object.keys(m.coortes).length===0?'<tr><td colspan="5" style="text-align:center;">Nenhuma coorte disponÃ­vel ainda</td></tr>':''}</tbody></table></div></div>
  `;
}

function renderUsuarios() {
  if (adminDataLoadError) {
    return `
      <div class="content-header"><h1>ðŸ‘¥ UsuÃ¡rios</h1><p>Gerencie os usuÃ¡rios do OdontoDex</p></div>
      <div class="section" style="border-left:4px solid #EF4444;">
        <h3 style="margin-bottom:8px;color:#0F172A;">Erro ao carregar usuÃ¡rios</h3>
        <p style="color:#64748B;font-size:13px;line-height:1.5;margin-bottom:12px;">${adminDataLoadError}</p>
        <button class="login-btn" style="width:auto;padding:10px 16px;" onclick="refreshData()">Tentar novamente</button>
      </div>
    `;
  }
  const paginated = getPaginatedUsers();
  const total = totalPages();
  return `
    <div class="content-header"><h1>ðŸ‘¥ UsuÃ¡rios</h1><p>Gerencie os usuÃ¡rios do OdontoDex</p></div>
    <div class="section"><div class="search-box"><input type="text" class="search-input" id="search-usuario" placeholder="ðŸ” Buscar por nome ou email..." oninput="buscarUsuarios(this.value)"></div>
    <div class="table-wrapper"><table><thead><tr><th onclick="changeSort('nome')">Nome ${currentSort.field==='nome'?(currentSort.order==='desc'?'â†“':'â†‘'):''}</th><th onclick="changeSort('email')">Email ${currentSort.field==='email'?(currentSort.order==='desc'?'â†“':'â†‘'):''}</th><th onclick="changeSort('premium')">Status ${currentSort.field==='premium'?(currentSort.order==='desc'?'â†“':'â†‘'):''}</th><th onclick="changeSort('usos')">Usos ${currentSort.field==='usos'?(currentSort.order==='desc'?'â†“':'â†‘'):''}</th><th>Cadastro</th><th>Expira em</th><th>AÃ§Ã£o</th></tr></thead>
    <tbody>${paginated.map(user => `<tr class="usuario-row" onclick="abrirDrawer('${user.id}')"><td>${user.nome}${user.ignorado?'<span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:12px;font-size:10px;margin-left:8px;">âŠ˜ Ignorado</span>':''}${user.email === 'pedrosimplicio.sousa@gmail.com' ? '<span style="background:#DBEAFE;color:#1E40AF;padding:2px 8px;border-radius:12px;font-size:10px;margin-left:8px;">ðŸ‘‘ Admin</span>' : ''}</td><td>${user.email}</td><td>${(()=>{const expira=user.premiumExpira?.toDate?user.premiumExpira.toDate():null;const pagou=!!user.ultimoPagamentoId;const expirado=expira?expira<new Date():true;const isLivrePorPremium=user.premium===false;if(!isLivrePorPremium&&!expirado&&pagou)return'<span class="badge-premium">ðŸ’Ž Premium</span>';if(!isLivrePorPremium&&!expirado&&!pagou)return'<span style="background:#FEF9C3;color:#92400E;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;display:inline-block">â³ Trial</span>';return'<span class="badge-free">ðŸ†“ Free</span>';})()}</td><td><strong>${user.usos}</strong> ${user.usos===0?'âš ï¸':user.usos>50?'ðŸ”¥':''}</td><td>${user.criadoEm?new Date(user.criadoEm).toLocaleDateString():'-'}</td><td>${(()=>{const expira=user.premiumExpira?.toDate?user.premiumExpira.toDate():null;if(!expira)return'-';const hoje=new Date();const diff=Math.ceil((expira-hoje)/(1000*60*60*24));if(diff<0)return'<span style="color:#EF4444;font-size:11px;font-weight:600">Expirado</span>';if(diff<=7)return`<span style="color:#F97316;font-weight:600;font-size:11px">âš ï¸ ${diff}d</span>`;return`<span style="color:#64748B;font-size:11px">${expira.toLocaleDateString()}</span>`;})()}</td><td><button onclick="toggleIgnorarUsuario('${user.id}')" style="background:${user.ignorado?'#10B981':'#EF4444'};color:white;border:none;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;opacity:0.8;transition:opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">${user.ignorado?'âœ“ Incluir':'âŠ˜ Ignorar'}</button></td></tr>`).join('')}${paginated.length===0?'<tr><td colspan="6" style="text-align:center;">Nenhum usuÃ¡rio encontrado</td></tr>':''}</tbody></table></div>
    <div class="pagination"><button class="page-btn" onclick="mudarPagina(1)" ${currentPage===1?'disabled':''}>Â«</button><button class="page-btn" onclick="mudarPagina(${currentPage-1})" ${currentPage===1?'disabled':''}>â€¹</button>${(()=>{const totalP=total; let buttons=[]; if(totalP<=5){for(let i=1;i<=totalP;i++)buttons.push(i)}else{if(currentPage<=3){for(let i=1;i<=5;i++)buttons.push(i)}else if(currentPage>=totalP-2){for(let i=totalP-4;i<=totalP;i++)buttons.push(i)}else{for(let i=currentPage-2;i<=currentPage+2;i++)buttons.push(i)}} return buttons.map(p=>`<button class="page-btn ${p===currentPage?'active':''}" onclick="mudarPagina(${p})">${p}</button>`).join('');})()}<button class="page-btn" onclick="mudarPagina(${currentPage+1})" ${currentPage===total||total===0?'disabled':''}>â€º</button><button class="page-btn" onclick="mudarPagina(${total})" ${currentPage===total||total===0?'disabled':''}>Â»</button></div>
    <div style="text-align:center;margin-top:14px;font-size:11px;color:#64748B;">Mostrando ${Math.min(itemsPerPage,usuariosFiltrados.length)} de ${usuariosFiltrados.length} usuÃ¡rios</div></div>
  `;
}

function renderRankings() {
  if (!cachedDados) return '<div class="section">Carregando...</div>';
  const d = cachedDados;
  return `
    <div class="content-header"><h1>ðŸ† Rankings</h1><p>AnÃ¡lise de uso dos protocolos</p></div>
    <div class="stats-grid"><div class="stat-card"><div class="stat-icon">ðŸ“Š</div><div class="stat-number">${d.totalUsos.toLocaleString()}</div><div class="stat-label">Total de usos (90 dias)</div></div><div class="stat-card"><div class="stat-icon">ðŸ”¥</div><div class="stat-number" style="font-size:14px;">${d.topProtocolos[0]?.nome.substring(0,20)||'-'}</div><div class="stat-label">Mais usado Â· ${d.topProtocolos[0]?.percentual.toFixed(1)}% do total</div></div></div>
    <div class="section"><div class="section-title"><span>ðŸ”¥</span> TOP 10 MAIS USADOS</div>${d.topProtocolos.map((p,i)=>{let fillClass='',badge=''; if(p.percentual>20){fillClass='fill-hot';badge='<span class="ranking-badge badge-hot">ðŸ”¥ MUITO POPULAR</span>'}else if(p.percentual>10){fillClass='fill-popular';badge='<span class="ranking-badge badge-popular">ðŸ‘ POPULAR</span>'}else if(p.percentual>5){fillClass='fill-normal';badge='<span class="ranking-badge badge-normal">ðŸ‘Œ NORMAL</span>'}else{fillClass='fill-low';badge='<span class="ranking-badge badge-low">âš ï¸ BAIXO</span>'}; return `<div class="ranking-item"><div class="ranking-header"><span class="ranking-name">${i+1}. ${p.nome}</span><span class="ranking-stats">${p.count} usos Â· ${p.percentual.toFixed(1)}% do total ${badge}</span></div><div class="ranking-bar"><div class="ranking-fill ${fillClass}" style="width:${Math.min(p.percentual*2,100)}%"></div></div></div>`;}).join('')}</div>
    <div class="section"><div class="section-title"><span>âš ï¸</span> PROTOCOLOS COM BAIXA REPRESENTATIVIDADE (&lt;5% do total)</div>${d.lowProtocolos.length>0?d.lowProtocolos.map(p=>`<div class="ranking-item"><div class="ranking-header"><span class="ranking-name">ðŸ“Œ ${p.nome}</span><span class="ranking-stats">${p.count} usos Â· ${p.percentual.toFixed(1)}% do total</span></div><div class="ranking-bar"><div class="ranking-fill fill-low" style="width:${Math.min(p.percentual*2,100)}%"></div></div></div>`).join(''):'<p style="color:#64748B;">Nenhum protocolo com baixa representatividade!</p>'}</div>
    ${d.lowProtocolos.some(p=>p.count===0)?`<div class="alert-card"><div class="alert-title">â“ PROTOCOLOS COM ZERO USOS</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">${d.lowProtocolos.filter(p=>p.count===0).map(p=>`<span style="background:#FEF2F2;color:#DC2626;padding:4px 10px;border-radius:16px;font-size:11px;">ðŸ“Œ ${p.nome}</span>`).join('')}</div><div style="font-size:11px;color:#64748B;margin-top:10px;">ðŸ’¡ <strong>SugestÃ£o:</strong> Estes protocolos NUNCA foram usados. Considere removÃª-los ou reposicionÃ¡-los.</div></div>`:''}
  `;
}

function renderLandingPage() {
  if (!cachedLandingStats) return '<div class="section">Carregando dados da Landing Page...</div>';
  const l = cachedLandingStats;
  const sortedClicks = Object.entries(l.cliquesPorCta).sort((a,b)=>b[1]-a[1]);
  const sortedSources = Object.entries(l.sources).sort((a,b)=>b[1]-a[1]);
  const formatTime = (seconds) => { if(!seconds) return '0s'; const mins=Math.floor(seconds/60); const secs=seconds%60; return mins>0?`${mins}m ${secs}s`:`${secs}s`; };
  return `
    <div class="content-header"><h1>ðŸŒ Landing Page Analytics</h1><p>MÃ©tricas de performance da pÃ¡gina de vendas</p></div>
    <div class="landing-stats-grid"><div class="stat-card"><div class="stat-icon">ðŸ‘ï¸</div><div class="stat-number">${l.totalVisitas}</div><div class="stat-label">Total de Visitas</div></div><div class="stat-card"><div class="stat-icon">ðŸ†”</div><div class="stat-number">${l.usuariosUnicos}</div><div class="stat-label">UsuÃ¡rios Ãšnicos</div></div><div class="stat-card"><div class="stat-icon">ðŸ’°</div><div class="stat-number">${l.taxaConversaoLanding}%</div><div class="stat-label">Taxa de ConversÃ£o</div></div><div class="stat-card"><div class="stat-icon">ðŸ–±ï¸</div><div class="stat-number">${l.cliquesPorVisita}</div><div class="stat-label">Cliques por Visita</div></div><div class="stat-card"><div class="stat-icon">ðŸ“‰</div><div class="stat-number">${l.taxaRejeicao}%</div><div class="stat-label">Taxa de RejeiÃ§Ã£o</div></div></div>
    <div class="section"><div class="section-title"><span>ðŸ–±ï¸</span> CLIQUE NOS CTAs</div>${sortedClicks.length>0?`<div class="click-chart">${sortedClicks.map(([cta,count])=>{const maxCount=sortedClicks[0][1]; const width=maxCount>0?(count/maxCount)*100:0; let ctaLabel=cta.replace('click_','').replace(/_/g,' '); return `<div class="click-bar"><div class="click-bar-label">ðŸ“Œ ${ctaLabel}</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${width}%">${count}</div></div></div>`;}).join('')}</div>`:'<p style="color:#64748B;">Nenhum clique registrado ainda.</p>'}</div>
    <div class="graficos-grid"><div class="section"><div class="section-title"><span>ðŸ“±</span> DISPOSITIVOS</div><div class="click-chart">${Object.entries(l.devices).map(([device,count])=>{const maxCount=Math.max(...Object.values(l.devices),1); const width=(count/maxCount)*100; const icons={desktop:'ðŸ–¥ï¸',mobile:'ðŸ“±',tablet:'ðŸ“Ÿ'}; return `<div class="click-bar"><div class="click-bar-label">${icons[device]||'ðŸ’»'} ${device}</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${width}%">${count}</div></div></div>`;}).join('')}</div></div>
    <div class="section"><div class="section-title"><span>ðŸŒ</span> FONTE DE TRÃFEGO</div><div class="click-chart">${sortedSources.slice(0,5).map(([source,count])=>{const maxCount=sortedSources[0][1]; const width=maxCount>0?(count/maxCount)*100:0; const icons={direct:'ðŸ”—',google:'ðŸ”',facebook:'ðŸ“˜',instagram:'ðŸ“¸',linkedin:'ðŸ’¼',referrer:'â†ªï¸'}; return `<div class="click-bar"><div class="click-bar-label">${icons[source]||'ðŸŒ'} ${source}</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${width}%">${count}</div></div></div>`;}).join('')}</div></div></div>
    <div class="graficos-grid"><div class="section"><div class="section-title"><span>ðŸ“œ</span> SCROLL DEPTH</div><div class="click-chart">${[25,50,75,100].map(p=>{const count=l.scrollDepth[p]||0; const percent=l.totalVisitas>0?Math.round((count/l.totalVisitas)*100):0; return `<div class="click-bar"><div class="click-bar-label">ðŸ“ ${p}% da pÃ¡gina</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${percent}%">${percent}%</div></div></div>`;}).join('')}</div>${l.scrollDepth[25]===0?`<div class="warning-card"><div class="warning-title">âš ï¸ Alerta</div><div class="insight-text">Nenhum usuÃ¡rio rolou atÃ© 25% da pÃ¡gina. O conteÃºdo acima da dobra pode nÃ£o estar atraente.</div></div>`:''}</div>
    <div class="section"><div class="section-title"><span>â°</span> TIMER DA OFERTA</div><div class="click-chart"><div class="click-bar"><div class="click-bar-label">â±ï¸ Cliques durante oferta</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${Math.min(l.timerClicks.total*5,100)}%">${l.timerClicks.total}</div></div></div>${l.timerClicks.tempoMedio?`<div class="click-bar"><div class="click-bar-label">âš¡ Tempo mÃ©dio atÃ© clicar</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${Math.min((l.timerClicks.tempoMedio/60)*100,100)}%">${formatTime(l.timerClicks.tempoMedio)}</div></div></div>`:''}</div></div></div>
    <div class="section"><div class="section-title"><span>ðŸ“Š</span> VISITAS E CLiques POR DIA (Ãšltimos 30 dias)</div><canvas id="grafico-landing-visitas" height="200"></canvas></div>
    <div class="section"><div class="section-title"><span>ðŸŽ¯</span> SEÃ‡Ã•ES MAIS VISUALIZADAS</div><div class="click-chart">${Object.entries(l.secoesVistas).sort((a,b)=>b[1]-a[1]).map(([secao,count])=>{const maxCount=Math.max(...Object.values(l.secoesVistas),1); const width=(count/maxCount)*100; const icons={problema:'â“',solucao:'ðŸ’¡',planos:'ðŸ’°',faq:'â”'}; return `<div class="click-bar"><div class="click-bar-label">${icons[secao]||'ðŸ“Œ'} ${secao}</div><div class="click-bar-fill"><div class="click-bar-progress" style="width:${width}%">${count}</div></div></div>`;}).join('')}</div></div>
    <div class="insight-card"><div class="insight-title">ðŸ’¡ Insights da Landing Page</div><div class="insight-text">${l.taxaRejeicao>50?'ðŸ”´ Taxa de rejeiÃ§Ã£o alta (>50%). Revise o CTA acima da dobra.<br>':''}${l.scrollDepth[50]<20?'ðŸŸ¡ Poucos usuÃ¡rios chegam a 50% da pÃ¡gina. O conteÃºdo pode nÃ£o estar engajando.<br>':''}${l.timerClicks.total===0?'ðŸŸ¡ NinguÃ©m clicou na oferta com timer. Considere destacar mais o botÃ£o.':''}</div></div>
  `;
}

function renderLandingCharts() {
  if (!cachedLandingStats) return;
  const l = cachedLandingStats;
  const ctxVisitas = document.getElementById('grafico-landing-visitas')?.getContext('2d');
  if (ctxVisitas) {
    if (charts.landingVisitas) charts.landingVisitas.destroy();
    charts.landingVisitas = new Chart(ctxVisitas, {
      type: 'line',
      data: { labels: l.visitasPorDia.map(d=>d.data.substring(5)), datasets: [{ label:'Visitas', data:l.visitasPorDia.map(d=>d.visitas), borderColor:'#7C3FA0', backgroundColor:'rgba(124,63,160,0.1)', fill:true, tension:0.3 }, { label:'Cliques', data:l.visitasPorDia.map(d=>d.cliques), borderColor:'#F59E0B', backgroundColor:'rgba(245,158,11,0.1)', fill:true, tension:0.3 }] },
      options: { responsive: true, maintainAspectRatio: true }
    });
  }
}

function renderGraficos() {
  return `<div class="content-header"><h1>ðŸ“ˆ GrÃ¡ficos</h1><p>VisualizaÃ§Ã£o de uso do app</p></div><div class="graficos-grid"><div class="section"><div class="section-title"><span>â°</span> USO POR HORA DO DIA</div><canvas id="grafico-horas" height="200"></canvas></div><div class="section"><div class="section-title"><span>ðŸ“…</span> USO POR DIA DA SEMANA</div><canvas id="grafico-dias" height="200"></canvas></div></div><div class="section"><div class="section-title"><span>ðŸ“ˆ</span> EVOLUÃ‡ÃƒO MENSAL</div><canvas id="grafico-mensal" height="200"></canvas></div>`;
}

function renderGraficosChart() {
  if (!cachedDados) return;
  const d = cachedDados;
  if (charts.horas) charts.horas.destroy();
  if (charts.dias) charts.dias.destroy();
  if (charts.mensal) charts.mensal.destroy();
  const ctxHoras = document.getElementById('grafico-horas')?.getContext('2d');
  if (ctxHoras) charts.horas = new Chart(ctxHoras, { type:'bar', data:{ labels:Array.from({length:24},(_,i)=>`${i}h`), datasets:[{ label:'Usos', data:d.porHora, backgroundColor:'#7C3FA0', borderRadius:6 }] }, options:{ responsive:true, maintainAspectRatio:true } });
  const ctxDias = document.getElementById('grafico-dias')?.getContext('2d');
  if (ctxDias) charts.dias = new Chart(ctxDias, { type:'bar', data:{ labels:['Dom','Seg','Ter','Qua','Qui','Sex','SÃ¡b'], datasets:[{ label:'Usos', data:d.porDiaSemana, backgroundColor:'#7C3FA0', borderRadius:6 }] }, options:{ responsive:true, maintainAspectRatio:true } });
  const mesesOrdenados = Object.entries(d.porMes).sort();
  const ctxMensal = document.getElementById('grafico-mensal')?.getContext('2d');
  if (ctxMensal) charts.mensal = new Chart(ctxMensal, { type:'line', data:{ labels:mesesOrdenados.map(m=>m[0]), datasets:[{ label:'Usos por mÃªs', data:mesesOrdenados.map(m=>m[1]), borderColor:'#7C3FA0', backgroundColor:'rgba(124,63,160,0.1)', fill:true, tension:0.3 }] }, options:{ responsive:true, maintainAspectRatio:true } });
}

function renderExportar() {
  return `<div class="content-header"><h1>ðŸ“¥ Exportar Dados</h1><p>Exporte os dados do OdontoDex</p></div><div class="section"><div class="section-title"><span>ðŸ“„</span> Exportar Analytics</div><div class="export-buttons"><button class="export-btn" onclick="exportarCSV()">ðŸ“„ Exportar CSV</button><button class="export-btn json" onclick="exportarJSON()" style="background:#3B82F6;color:white;">ðŸ“¦ Exportar JSON</button><button class="export-btn" onclick="exportarUsuariosCSV()" style="background:#7C3FA0;color:white;">ðŸ‘¥ Exportar UsuÃ¡rios</button><button class="export-btn" onclick="exportarLandingCSV()" style="background:#10B981;color:white;">ðŸŒ Exportar Landing Stats</button><button class="export-btn" onclick="exportarMetricasCSV()" style="background:#F59E0B;color:white;">ðŸ“ˆ Exportar MÃ©tricas</button><button class="export-btn refresh-btn" onclick="refreshData()">âŸ³ Atualizar Dados</button></div></div><div class="section"><div class="section-title"><span>â„¹ï¸</span> Sobre os dados</div><p style="color:#64748B;font-size:13px;">Os dados incluem todos os protocolos abertos nos Ãºltimos 90 dias. As mÃ©tricas de produto sÃ£o calculadas em tempo real.</p></div>`;
}

async function exportarCSV() {
  const snapshot = await db.collection('analytics_uso_protocolos').orderBy('timestamp','desc').limit(10000).get();
  const headers = ['Data','Protocolo','UsuÃ¡rio','Hora'];
  const rows = [headers];
  snapshot.forEach(doc=>{const d=doc.data(); rows.push([d.data||'',d.protocoloTitulo||'',d.usuarioEmail||'',d.hora!==undefined?`${d.hora}h`:'']);});
  const csv=rows.map(row=>row.join(',')).join('\n');
  const blob=new Blob(["\uFEFF"+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=`odontodex_analytics_${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url);
}
async function exportarJSON() {
  const snapshot=await db.collection('analytics_uso_protocolos').orderBy('timestamp','desc').limit(10000).get();
  const dados=[]; snapshot.forEach(doc=>dados.push({id:doc.id,...doc.data()}));
  const json=JSON.stringify(dados,null,2);
  const blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=`odontodex_analytics_${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url);
}
async function exportarUsuariosCSV() {
  const headers=['Email','Nome','Status','Cadastro','Protocolos Abertos'];
  const rows=[headers];
  dadosUsuarios.forEach(user=>{rows.push([user.email,user.nome,user.premium?'Premium':'Free',user.criadoEm?new Date(user.criadoEm).toLocaleDateString():'-',user.usos]);});
  const csv=rows.map(row=>row.join(',')).join('\n');
  const blob=new Blob(["\uFEFF"+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=`odontodex_usuarios_${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url);
}
async function exportarLandingCSV() {
  const snapshot=await db.collection('landing_stats').orderBy('timestamp','desc').limit(10000).get();
  const headers=['Data','Evento','SessionId','Dispositivo','Fonte','Detalhes'];
  const rows=[headers];
  snapshot.forEach(doc=>{const d=doc.data(); const dataStr=d.timestamp?.toDate?.()?.toLocaleString()||'-'; let detalhes=''; if(d.event==='click_cta')detalhes=d.elementText||''; if(d.event==='section_view')detalhes=d.section||''; if(d.event==='exit')detalhes=`${d.timeOnPageSeconds}s na pÃ¡gina`; if(d.event==='timer_click')detalhes=`${d.timeToClickSeconds}s atÃ© clicar`; rows.push([dataStr,d.event||'-',d.sessionId||'-',d.deviceType||'-',d.source||'-',detalhes]);});
  const csv=rows.map(row=>row.join(',')).join('\n');
  const blob=new Blob(["\uFEFF"+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=`odontodex_landing_${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url);
}
async function exportarMetricasCSV() {
  if(!cachedMetricasProduto)return;
  const m=cachedMetricasProduto;
  const headers=['MÃ©trica','Valor'];
  const rows=[headers];
  rows.push(['Taxa de AtivaÃ§Ã£o (Ãºltimos 30 dias)',`${m.taxaAtivacao}%`]);
  rows.push(['Novos usuÃ¡rios (Ãºltimos 30 dias)',m.totalNovosUltimos30]);
  rows.push(['UsuÃ¡rios ativados',m.ativadosUltimos30]);
  rows.push(['Score mÃ©dio de profundidade',m.mediaProfundidade]);
  rows.push(['UsuÃ¡rios superficiais (0-30)',m.distribuicaoProfundidade.baixo]);
  rows.push(['UsuÃ¡rios mÃ©dios (31-70)',m.distribuicaoProfundidade.medio]);
  rows.push(['UsuÃ¡rios profundos (71-100)',m.distribuicaoProfundidade.alto]);
  rows.push(['Tipo de uso - Passivo',m.tipoUso.passivo]);
  rows.push(['Tipo de uso - HÃ­brido',m.tipoUso.hibrido]);
  rows.push(['Tipo de uso - Interativo',m.tipoUso.interativo]);
  rows.push(['Momento AHA campeÃ£o',m.ahaCampeao]);
  rows.push(['Percentual do AHA',`${m.ahaPercentual}%`]);
  for(const[mes,coorte]of Object.entries(m.coortes)){rows.push([`Coorte ${mes} - Total`,coorte.total]); rows.push([`Coorte ${mes} - D1`, `${coorte.d1} (${Math.round((coorte.d1/coorte.total)*100)}%)`]); rows.push([`Coorte ${mes} - D7`, `${coorte.d7} (${Math.round((coorte.d7/coorte.total)*100)}%)`]); rows.push([`Coorte ${mes} - D30`, `${coorte.d30} (${Math.round((coorte.d30/coorte.total)*100)}%)`]);}
  const csv=rows.map(row=>row.join(',')).join('\n');
  const blob=new Blob(["\uFEFF"+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=`odontodex_metricas_${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url);
}
async function refreshData() { await carregarDados(); renderizarSecaoAtual(); }
function logout() { auth.signOut(); document.getElementById('login-container').style.display='flex'; document.getElementById('dashboard-container').style.display='none'; }
function initMenu() { document.querySelectorAll('.sidebar-item').forEach(item=>{item.addEventListener('click',()=>{document.querySelectorAll('.sidebar-item').forEach(i=>i.classList.remove('active')); item.classList.add('active'); currentSection=item.getAttribute('data-section'); renderizarSecaoAtual();});}); }

auth.onAuthStateChanged(async(user)=>{
  if(user && ADMIN_EMAILS.includes(user.email)){
    currentUser=user;
    carregarIgnorados();
    document.getElementById('login-container').style.display='none';
    document.getElementById('dashboard-container').style.display='flex';
    initMenu();
    await carregarDados();
    await carregarLandingStats();
    await carregarMetricasProduto();
    renderizarSecaoAtual();
  } else if(user){
    await auth.signOut();
    document.getElementById('login-container').style.display='flex';
    document.getElementById('dashboard-container').style.display='none';
  }
});

window.doAdminLogin=doAdminLogin;
window.toggleSidebar=toggleSidebar;
window.mudarPagina=mudarPagina;
window.buscarUsuarios=buscarUsuarios;
window.changeSort=changeSort;
window.exportarCSV=exportarCSV;
window.exportarJSON=exportarJSON;
window.exportarUsuariosCSV=exportarUsuariosCSV;
window.exportarLandingCSV=exportarLandingCSV;
window.exportarMetricasCSV=exportarMetricasCSV;
window.refreshData=refreshData;
window.logout=logout;
window.toggleIgnorarUsuario = toggleIgnorarUsuario;
window.adminSwitchContentType = adminSwitchContentType;
window.adminOpenContentItem = adminOpenContentItem;
window.adminSearchContent = adminSearchContent;
window.adminNewContentDraft = adminNewContentDraft;
window.adminUpdateContentPreview = adminUpdateContentPreview;
window.adminCopyGeneratedContent = adminCopyGeneratedContent;
  let drawerUsuarioAtual = null;

function abrirDrawer(userId) {
  const user = dadosUsuarios.find(u => u.id === userId);
  if (!user) return;
  drawerUsuarioAtual = user;

  const expira = user.premiumExpira?.toDate ? user.premiumExpira.toDate() : null;
  const pagou = !!user.ultimoPagamentoId;
  const expirado = expira ? expira < new Date() : true;
  const hoje = new Date();

  let statusLabel = '';
  const isLivrePorPremium = user.premium === false;
  if (!isLivrePorPremium && !expirado && pagou) statusLabel = 'ðŸ’Ž Premium (pagante)';
  else if (!isLivrePorPremium && !expirado && !pagou) statusLabel = 'â³ Trial';
  else statusLabel = 'ðŸ†“ Free (expirado)';

  let expiraLabel = '-';
  if (expira) {
    const diff = Math.ceil((expira - hoje) / (1000*60*60*24));
    if (diff < 0) expiraLabel = `Expirado hÃ¡ ${Math.abs(diff)} dias`;
    else if (diff === 0) expiraLabel = 'Expira hoje';
    else expiraLabel = `${expira.toLocaleDateString()} (${diff} dias)`;
  }

  document.getElementById('drawer-nome').textContent = user.nome || '-';
  document.getElementById('di-email').textContent = user.email || '-';
  document.getElementById('di-status').textContent = statusLabel;
  document.getElementById('di-perfil').textContent = user.perfil || '-';
  document.getElementById('di-cadastro').textContent = user.criadoEm ? new Date(user.criadoEm).toLocaleDateString() : '-';
  document.getElementById('di-primeiro').textContent = user.dataPrimeiroAcesso?.toDate ? user.dataPrimeiroAcesso.toDate().toLocaleDateString() : '-';
  document.getElementById('di-ultimo').textContent = user.ultimoAcesso?.toDate ? user.ultimoAcesso.toDate().toLocaleString() : '-';
  document.getElementById('di-expira').textContent = expiraLabel;
  document.getElementById('di-usos').textContent = user.usos ?? '-';
  document.getElementById('di-pagamento').textContent = user.ultimoPagamentoId || 'Nenhum';

  const acoes = document.getElementById('drawer-acoes-conteudo');
  document.getElementById('drawer-feedback').className = 'drawer-feedback';
  document.getElementById('drawer-feedback').textContent = '';

  if (!expirado && pagou) {
    acoes.innerHTML = `
      <button class="drawer-action-btn btn-remover" onclick="acaoPremium('remover')">
        ðŸš« Remover Premium
      </button>`;
  } else {
    acoes.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <input type="number" class="dias-input" id="dias-premium" value="30" min="1" max="365">
        <button class="drawer-action-btn btn-ativar" style="margin:0;flex:1" onclick="acaoPremium('premium')">
          ðŸ’Ž Ativar Premium
        </button>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <input type="number" class="dias-input" id="dias-trial" value="7" min="1" max="30">
        <button class="drawer-action-btn btn-trial" style="margin:0;flex:1" onclick="acaoPremium('trial')">
          â³ Dar Trial
        </button>
      </div>`;
  }

  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('user-drawer').classList.add('open');
}

function fecharDrawer() {
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('user-drawer').classList.remove('open');
  drawerUsuarioAtual = null;
}

async function adminAuthHeaders() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('SessÃ£o admin expirada. FaÃ§a login novamente.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

async function acaoPremium(tipo) {
  if (!drawerUsuarioAtual) return;
  const feedback = document.getElementById('drawer-feedback');
  const btns = document.querySelectorAll('.drawer-action-btn');
  btns.forEach(b => b.disabled = true);
  feedback.className = 'drawer-feedback';
  feedback.textContent = 'Processando...';
  feedback.style.display = 'block';

  try {
    let body = { uid: drawerUsuarioAtual.id };
    if (tipo === 'remover') {
      body.premium = false;
    } else if (tipo === 'premium') {
      body.premium = true;
      body.dias = parseInt(document.getElementById('dias-premium').value) || 30;
    } else if (tipo === 'trial') {
      body.premium = true;
      body.dias = parseInt(document.getElementById('dias-trial').value) || 7;
    }

    const res = await fetch('https://www.odontodex.com.br/api/set-premium', {
      method: 'POST',
      headers: await adminAuthHeaders(),
      body: JSON.stringify(body)
    });
    const data = await res.json();

       if (data.ok) {
      feedback.className = 'drawer-feedback ok';
      feedback.textContent = 'âœ“ Atualizado com sucesso! Recarregando...';
     setTimeout(async () => {
        fecharDrawer();
        cachedDados = null;
        dadosUsuarios = [];
        await carregarDados();
        renderizarSecaoAtual();
      }, 2500);
    } else {
      throw new Error(data.error || 'Erro desconhecido');
    }
  } catch (e) {
    feedback.className = 'drawer-feedback err';
    feedback.textContent = 'âœ— Erro: ' + e.message;
    btns.forEach(b => b.disabled = false);
  }
}
// ========== PARCEIROS ==========
let cachedParceiros = null;

async function carregarParceiros() {
  try {
    const agora = new Date();
    const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}`;

    const [cuponsSnap, conversoesSnap, repassesSnap] = await Promise.all([
      db.collection('CUPONS').get(),
      db.collection('conversoes_cupom').get(),
      db.collection('repasses').get()
    ]);

    const repasses = {};
    repassesSnap.forEach(doc => { repasses[doc.id] = doc.data(); });

    const conversoesPorCupomMes = {};
    const conversoesPorCupomTotal = {};
    conversoesSnap.forEach(doc => {
      const d = doc.data();
      const cupom = d.cupom;
      if (!cupom) return;
      conversoesPorCupomTotal[cupom] = (conversoesPorCupomTotal[cupom] || 0) + 1;
      const ts = d.timestamp?.toDate ? d.timestamp.toDate() : null;
      if (ts) {
        const mes = `${ts.getFullYear()}-${String(ts.getMonth()+1).padStart(2,'0')}`;
        if (mes === mesAtual) {
          conversoesPorCupomMes[cupom] = (conversoesPorCupomMes[cupom] || 0) + 1;
        }
      }
    });

    const cupons = [];
    cuponsSnap.forEach(doc => {
      const d = doc.data();
      const codigo = doc.id;
      const convMes = conversoesPorCupomMes[codigo] || 0;
      const convTotal = conversoesPorCupomTotal[codigo] || 0;
      const valorRepasse = d.valorRepasse || 3.00;
      const valorMes = convMes * valorRepasse;
      const repasseId = `${codigo}_${mesAtual}`;
      const repasse = repasses[repasseId];
      const repasseStatus = repasse?.status || 'pendente';

      cupons.push({
        codigo,
        nome: d.nome || '-',
        email: d.email || null,
        ativo: d.ativo !== false,
        pixKey: d.pixKey || null,
        valorRepasse,
        conversoes: d.conversoes || 0,
        convMes,
        convTotal,
        valorMes,
        repasseStatus,
        criadoem: d.criadoem || '-'
      });
    });

    cupons.sort((a, b) => b.convMes - a.convMes);
    cachedParceiros = { cupons, mesAtual };
    document.getElementById('content-area').innerHTML = renderParceiros();
  } catch(e) {
    console.error('Erro ao carregar parceiros:', e);
  }
}

function renderParceiros() {
  if (!cachedParceiros) return '<div class="section">Carregando parceiros...</div>';
  const { cupons, mesAtual } = cachedParceiros;
  const totalConvMes = cupons.reduce((a, c) => a + c.convMes, 0);
  const totalValorMes = cupons.reduce((a, c) => a + c.valorMes, 0);
  const pendentes = cupons.filter(c => c.convMes > 0 && c.repasseStatus === 'pendente');

  return `
    <div class="content-header"><h1>ðŸ¤ Parceiros</h1><p>GestÃ£o de cupons e repasses â€” ${mesAtual}</p></div>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">ðŸŽŸï¸</div><div class="stat-number" style="color:#7C3FA0">${cupons.length}</div><div class="stat-label">Cupons ativos</div></div>
      <div class="stat-card"><div class="stat-icon">ðŸ”„</div><div class="stat-number" style="color:#10B981">${totalConvMes}</div><div class="stat-label">ConversÃµes no mÃªs</div></div>
      <div class="stat-card"><div class="stat-icon">ðŸ’°</div><div class="stat-number" style="color:#F59E0B">R$ ${totalValorMes.toFixed(2)}</div><div class="stat-label">A repassar no mÃªs</div></div>
      <div class="stat-card" style="border-top:3px solid #EF4444"><div class="stat-icon">â³</div><div class="stat-number" style="color:#EF4444">${pendentes.length}</div><div class="stat-label">Repasses pendentes</div></div>
    </div>

    <div class="section">
      <div class="section-title"><span>ðŸ†</span> RANKING DO MÃŠS â€” ${mesAtual}</div>
      ${cupons.filter(c => c.convMes > 0).length === 0 ? '<p style="color:#64748B;font-size:13px;">Nenhuma conversÃ£o este mÃªs ainda.</p>' : ''}
      ${cupons.filter(c => c.convMes > 0).map((c, i) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #F1F5F9;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:18px;font-weight:800;color:#7C3FA0;width:24px">${i+1}</span>
            <div>
              <div style="font-weight:700;font-size:13px">${c.nome} <span style="background:#F1F5F9;color:#475569;padding:2px 8px;border-radius:8px;font-size:11px">${c.codigo}</span></div>
              <div style="font-size:11px;color:#64748B;margin-top:2px">${c.convMes} conversÃµes Â· R$ ${c.valorMes.toFixed(2)} a repassar${c.pixKey ? ` Â· Pix: ${c.pixKey}` : ' Â· âš ï¸ Sem chave Pix'}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${c.repasseStatus === 'pago'
              ? '<span style="background:#DCFCE7;color:#166534;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600">âœ“ Pago</span>'
              : `<button onclick="marcarRepasse('${c.codigo}')" style="background:#7C3FA0;color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer">Marcar pago</button>`
            }
          </div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <div class="section-title"><span>ðŸŽŸï¸</span> TODOS OS CUPONS</div>
      <div class="table-wrapper"><table>
        <thead><tr>
          <th>CÃ³digo</th><th>Nome</th><th>Email</th><th>Status</th><th>Conv. mÃªs</th><th>Conv. total</th><th>Repasse/conv.</th><th>Receita gerada</th><th>ComissÃ£o paga</th><th>Chave Pix</th><th>AÃ§Ãµes</th>
        </tr></thead>
        <tbody>
    ${cupons.map(c => `
            <tr id="row-${c.codigo}">
              <td><strong>${c.codigo}</strong></td>
              <td id="nome-${c.codigo}">${c.nome}</td>
              <td style="font-size:11px;color:#64748B">${c.email || '-'}</td>
              <td><span style="background:${c.ativo?'#DCFCE7':'#F1F5F9'};color:${c.ativo?'#166534':'#64748B'};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600">${c.ativo?'âœ“ Ativo':'âœ— Inativo'}</span></td>
              <td>${c.convMes}</td>
              <td>${c.convTotal}</td>
              <td>R$ ${c.valorRepasse.toFixed(2)}</td>
              <td style="font-weight:700;color:#10B981">R$ ${(c.convTotal * 9.90).toFixed(2)}</td>
              <td style="font-weight:700;color:#EF4444">R$ ${(c.convTotal * c.valorRepasse).toFixed(2)}</td>
              <td style="font-size:11px;color:#64748B">${c.pixKey || '-'}</td>
              <td style="display:flex;gap:6px;flex-wrap:wrap">
                <button onclick="editarCupom('${c.codigo}')" style="background:#E2E8F0;color:#0F172A;border:none;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer">âœï¸ Editar</button>
                <button onclick="toggleCupom('${c.codigo}', ${!c.ativo})" style="background:${c.ativo?'#FEE2E2':'#DCFCE7'};color:${c.ativo?'#991B1B':'#166534'};border:none;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer">${c.ativo?'Desativar':'Ativar'}</button>
              </td>
            </tr>
            <tr id="edit-${c.codigo}" style="display:none">
              <td colspan="11" style="background:#F8FAFC;padding:16px;border-radius:12px">
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:12px">
                  <div><label style="font-size:11px;font-weight:600;color:#64748B">Nome</label><input id="edit-nome-${c.codigo}" value="${c.nome}" style="width:100%;padding:8px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;margin-top:4px"></div>
                  <div><label style="font-size:11px;font-weight:600;color:#64748B">Email</label><input id="edit-email-${c.codigo}" value="${c.email||''}" placeholder="email@parceiro.com" style="width:100%;padding:8px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;margin-top:4px"></div>
                  <div><label style="font-size:11px;font-weight:600;color:#64748B">Chave Pix</label><input id="edit-pix-${c.codigo}" value="${c.pixKey||''}" placeholder="CPF, email ou chave" style="width:100%;padding:8px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;margin-top:4px"></div>
                  <div><label style="font-size:11px;font-weight:600;color:#64748B">Valor repasse (R$)</label><input id="edit-valor-${c.codigo}" type="number" value="${c.valorRepasse}" step="0.01" style="width:100%;padding:8px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;margin-top:4px"></div>
                </div>
                <div style="display:flex;gap:8px">
                  <button onclick="salvarEdicaoCupom('${c.codigo}')" style="background:#7C3FA0;color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">ðŸ’¾ Salvar</button>
                  <button onclick="cancelarEdicao('${c.codigo}')" style="background:#E2E8F0;color:#0F172A;border:none;padding:8px 20px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">Cancelar</button>
                  <span id="feedback-${c.codigo}" style="font-size:12px;font-weight:600;padding:8px;display:none"></span>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>
    </div>

    <div class="section">
      <div class="section-title"><span>âž•</span> CRIAR NOVO CUPOM</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:16px">
        <div><label style="font-size:11px;font-weight:600;color:#64748B">CÃ³digo</label><input id="novo-codigo" placeholder="Ex: PEDRO10" style="width:100%;padding:8px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;margin-top:4px;text-transform:uppercase"></div>
        <div><label style="font-size:11px;font-weight:600;color:#64748B">Nome do parceiro</label><input id="novo-nome" placeholder="Ex: Dr. Pedro" style="width:100%;padding:8px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;margin-top:4px"></div>
        <div><label style="font-size:11px;font-weight:600;color:#64748B">Email do parceiro</label><input id="novo-email" placeholder="email@parceiro.com" style="width:100%;padding:8px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;margin-top:4px"></div>
        <div><label style="font-size:11px;font-weight:600;color:#64748B">Chave Pix</label><input id="novo-pix" placeholder="CPF, email ou chave" style="width:100%;padding:8px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;margin-top:4px"></div>
        <div><label style="font-size:11px;font-weight:600;color:#64748B">Valor repasse (R$)</label><input id="novo-valor" type="number" value="3.00" step="0.01" style="width:100%;padding:8px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;margin-top:4px"></div>
      <button onclick="criarCupom()" style="background:#7C3FA0;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer">âž• Criar Cupom</button>
      <span id="feedback-criar" style="font-size:12px;font-weight:600;padding:8px;margin-left:8px;display:none"></span>
    </div>
  `;
}

async function marcarRepasse(codigo) {
  const { mesAtual } = cachedParceiros;
  try {
    const res = await fetch('https://www.odontodex.com.br/api/set-repasse', {
      method: 'POST',
      headers: await adminAuthHeaders(),
      body: JSON.stringify({ cupom: codigo, mes: mesAtual, status: 'pago' })
    });
    const data = await res.json();
    if (data.ok) {
      await carregarParceiros();
    } else {
      alert('Erro: ' + data.error);
    }
  } catch(e) {
    alert('Erro: ' + e.message);
  }
}

function editarCupom(codigo) {
  document.getElementById(`edit-${codigo}`).style.display = 'table-row';
}

function cancelarEdicao(codigo) {
  document.getElementById(`edit-${codigo}`).style.display = 'none';
}

async function salvarEdicaoCupom(codigo) {
  const nome = document.getElementById(`edit-nome-${codigo}`).value;
  const email = document.getElementById(`edit-email-${codigo}`).value;
  const pixKey = document.getElementById(`edit-pix-${codigo}`).value;
  const valorRepasse = parseFloat(document.getElementById(`edit-valor-${codigo}`).value);
  const feedback = document.getElementById(`feedback-${codigo}`);
  feedback.style.display = 'inline';
  feedback.style.color = '#64748B';
  feedback.textContent = 'Salvando...';
  try {
    const res = await fetch('https://www.odontodex.com.br/api/update-cupom', {
      method: 'POST',
      headers: await adminAuthHeaders(),
      body: JSON.stringify({ codigo, nome, email, pixKey, valorRepasse })
    });
    const data = await res.json();
    if (data.ok) {
      feedback.style.color = '#166534';
      feedback.textContent = 'âœ“ Salvo!';
      setTimeout(() => carregarParceiros(), 1000);
    } else {
      feedback.style.color = '#991B1B';
      feedback.textContent = 'âœ— Erro: ' + data.error;
    }
  } catch(e) {
    feedback.style.color = '#991B1B';
    feedback.textContent = 'âœ— Erro: ' + e.message;
  }
}

async function toggleCupom(codigo, novoAtivo) {
  try {
    const res = await fetch('https://www.odontodex.com.br/api/update-cupom', {
      method: 'POST',
      headers: await adminAuthHeaders(),
      body: JSON.stringify({ codigo, ativo: novoAtivo })
    });
    const data = await res.json();
    if (data.ok) await carregarParceiros();
    else alert('Erro: ' + data.error);
  } catch(e) {
    alert('Erro: ' + e.message);
  }
}

async function criarCupom() {
  const codigo = document.getElementById('novo-codigo').value.trim().toUpperCase();
  const nome = document.getElementById('novo-nome').value.trim();
  const email = document.getElementById('novo-email').value.trim();
  const pixKey = document.getElementById('novo-pix').value.trim();
  const valorRepasse = parseFloat(document.getElementById('novo-valor').value);
  const feedback = document.getElementById('feedback-criar');

  if (!codigo || !nome) {
    feedback.style.display = 'inline';
    feedback.style.color = '#991B1B';
    feedback.textContent = 'âœ— CÃ³digo e nome sÃ£o obrigatÃ³rios';
    return;
  }

  feedback.style.display = 'inline';
  feedback.style.color = '#64748B';
  feedback.textContent = 'Criando...';

  try {
    const res = await fetch('https://www.odontodex.com.br/api/create-cupom', {
      method: 'POST',
      headers: await adminAuthHeaders(),
      body: JSON.stringify({ codigo, nome, email, pixKey, valorRepasse })
    });
    const data = await res.json();
    if (data.ok) {
      feedback.style.color = '#166534';
      feedback.textContent = 'âœ“ Cupom criado!';
      document.getElementById('novo-codigo').value = '';
      document.getElementById('novo-nome').value = '';
      document.getElementById('novo-pix').value = '';
      document.getElementById('novo-valor').value = '3.00';
      setTimeout(() => carregarParceiros(), 1000);
    } else {
      feedback.style.color = '#991B1B';
      feedback.textContent = 'âœ— Erro: ' + data.error;
    }
  } catch(e) {
    feedback.style.color = '#991B1B';
    feedback.textContent = 'âœ— Erro: ' + e.message;
  }
}

window.marcarRepasse = marcarRepasse;
window.editarCupom = editarCupom;
window.cancelarEdicao = cancelarEdicao;
window.salvarEdicaoCupom = salvarEdicaoCupom;
window.toggleCupom = toggleCupom;
window.criarCupom = criarCupom;
// ========== FIM PARCEIROS ==========
window.abrirDrawer = abrirDrawer;
window.fecharDrawer = fecharDrawer;
window.acaoPremium = acaoPremium;
window.carregarIgnorados = carregarIgnorados;
window.salvarIgnorados = salvarIgnorados;
