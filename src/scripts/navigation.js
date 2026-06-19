// =================== NAVEGAÇÃO ====================
// Lógica única e definitiva: goScreen empilha, goBack desempilha.
// Cada tela sabe de onde voltou. Sem race condition, sem tela branca.

function scrollScreenToTop(id) {
  const screenId = (id === "home") ? "app" : id;
  const sc = document.getElementById("screen-" + screenId);
  if(!sc) return;
  const scrollables = [sc, ...sc.querySelectorAll(".body,.payment-screen-body")];
  scrollables.forEach(el => { if(el) el.scrollTop = 0; });
  window.scrollTo(0, 0);
}

function scheduleScreenTop(id) {
  scrollScreenToTop(id);
  requestAnimationFrame(() => scrollScreenToTop(id));
  setTimeout(() => scrollScreenToTop(id), 80);
}

function _activateScreen(id) {
  const screenId = (id === "home") ? "app" : id;
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const sc = document.getElementById("screen-" + screenId);
  if(sc) { sc.classList.add("active"); scrollScreenToTop(id); }

  // Telas que mostram a nav
  const navScreens = ["home", "favorites", "search"];
  const nav = document.getElementById("bottom-nav");
  if(nav) nav.className = navScreens.includes(id) ? "bottom-nav visible" : "bottom-nav";

  // Marca aba ativa
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
  const tab = document.getElementById("nav-" + id);
  if(tab) tab.classList.add("active");
}

function markForwardNavigationMotion() {
  document.body.classList.remove("nav-back");
  clearTimeout(window.__backNavMotionTimer);
  document.body.classList.add("nav-forward");
  clearTimeout(window.__forwardNavMotionTimer);
  window.__forwardNavMotionTimer = setTimeout(() => {
    document.body.classList.remove("nav-forward");
  }, 520);
}

function markBackNavigationMotion() {
  document.body.classList.remove("nav-forward");
  clearTimeout(window.__forwardNavMotionTimer);
  document.body.classList.add("nav-back");
  clearTimeout(window.__backNavMotionTimer);
  window.__backNavMotionTimer = setTimeout(() => {
    document.body.classList.remove("nav-back");
  }, 440);
}

const HOME_PRESS_TARGET_SELECTOR = [
  ".gear-btn",
  ".home-favorite-chip",
  ".home-favorite-empty",
  ".cat-horizontal",
  ".quick-btn",
  ".home-tool-card",
  ".home-prescricoes-card",
  ".home-prescricoes-item",
  ".quick-conduct-card"
].join(",");

function getHomePressTarget(event) {
  const home = document.getElementById("screen-app");
  if(!home || !home.classList.contains("active")) return null;
  const target = event.target?.closest?.(HOME_PRESS_TARGET_SELECTOR);
  return target && home.contains(target) ? target : null;
}

function releaseHomePressTarget(target) {
  if(!target) return;
  setTimeout(() => target.classList.remove("home-pressing"), 120);
}

document.addEventListener("pointerdown", event => {
  const target = getHomePressTarget(event);
  if(!target) return;
  target.classList.add("home-pressing");
}, {passive:true});

["pointerup", "pointercancel", "pointerleave"].forEach(type => {
  document.addEventListener(type, event => {
    releaseHomePressTarget(getHomePressTarget(event));
  }, {passive:true});
});

document.addEventListener("click", event => {
  const target = getHomePressTarget(event);
  if(!target) return;
  target.classList.add("home-pressing");
  releaseHomePressTarget(target);
}, true);

function _renderScreen(id) {
  if(id === "home")        {
    if(!document.getElementById("categories-scroll")) { setTimeout(()=>_renderScreen("home"),80); return; }
    const savedHomeSearchValue = (typeof persistedHomeSearchValue !== "undefined") ? persistedHomeSearchValue : "";
    const homeSearchValue = document.getElementById("home-search-input")?.value || savedHomeSearchValue || "";
    renderHome();
    if(homeSearchValue.length > 0 && typeof restoreHomeSearch === "function") restoreHomeSearch(homeSearchValue);
  }
  if(id === "settings")    { renderSettings(); }
  if(id === "favorites")   renderFavs();
  if(id === "situations")  renderSituations();
  if(id === "procedures")  renderProcedures();
  if(id === "prescricoes") renderPrescricoesList();
  if(id === "clinical-tool-detail" && typeof renderClinicalToolDetail === "function") renderClinicalToolDetail();
  if(id === "conduta" && currentCondutaId) renderQuickConduct(currentCondutaId);
  if(id === "protocol" && currentProtoId) renderProtocol(currentProtoId);
  if(id === "search") {
    const si=document.getElementById("search-input"); if(si) si.value="";
    const res=document.getElementById("search-results");
    if(res) res.innerHTML='<p class="empty-msg">Digite pelo menos 2 letras</p>';
  }
}

// Navega para uma tela empilhando a atual
function goScreen(id) {
  // "screen-app" é a home — normaliza para "home" antes de empilhar
  const rawCurrent = document.querySelector(".screen.active")?.id?.replace("screen-","");
  const current = (rawCurrent === "app") ? "home" : rawCurrent;
  if(current && current !== id && current !== "login") markForwardNavigationMotion();
  if(current && current !== id && current !== "login") {
    navigationHistory.push(current);
  }
  _activateScreen(id);
  _renderScreen(id);
  scheduleScreenTop(id);
}

// Volta para a tela anterior da pilha
function goBackToLastScreen() {
  if(navigationHistory.length > 0) {
    const last = navigationHistory.pop();
    // "home" e "app" são a mesma tela
    const target = (last === "app") ? "home" : last;
    markBackNavigationMotion();
    _activateScreen(target);
    _renderScreen(target);
    scheduleScreenTop(target);
  } else {
    markBackNavigationMotion();
    _activateScreen("home");
    _renderScreen("home");
    scheduleScreenTop("home");
  }
}

// Atalho usado por botões da bottom nav e links internos
function voltarParaHome() {
  navigationHistory = [];
  _activateScreen("home");
  _renderScreen("home");
  scheduleScreenTop("home");
}


// ── DADOS FÓRCEPS E ODONTOSECÇÃO ──────────────────────────────────────────
const FORCEPS_DB = {
  11:{nome:'Incisivo central superior',forceps:'Fórceps nº 1',tipo:'Universal superior',tecnica:'Rotação + tração',alerta:null},
  12:{nome:'Incisivo lateral superior',forceps:'Fórceps nº 1',tipo:'Universal superior',tecnica:'Rotação + tração',alerta:null},
  13:{nome:'Canino superior',forceps:'Fórceps nº 1',tipo:'Universal superior',tecnica:'Luxação V-L prolongada',alerta:'Raiz longa — luxar bastante antes de traccionar'},
  14:{nome:'Pré-molar superior',forceps:'Fórceps nº 150',tipo:'Universal superior',tecnica:'Movimentos V-L suaves',alerta:'Raiz frágil — alto risco de fratura'},
  15:{nome:'Pré-molar superior',forceps:'Fórceps nº 150',tipo:'Universal superior',tecnica:'Movimentos V-L suaves',alerta:'Raiz frágil — alto risco de fratura'},
  16:{nome:'Molar superior direito',forceps:'Fórceps nº 18R',tipo:'superior direito',tecnica:'Posicionar pontas nas furças',alerta:'3 raízes — risco elevado de fratura radicular'},
  17:{nome:'Molar superior direito',forceps:'Fórceps nº 18R',tipo:'superior direito',tecnica:'Posicionar pontas nas furças',alerta:'3 raízes — risco elevado de fratura radicular'},
  18:{nome:'Siso superior direito',forceps:'Fórceps nº 65',tipo:'Baioneta — raízes e fragmentos',tecnica:'Acesso limitado — cuidado redobrado',alerta:'Avaliar indicação cirúrgica antes'},
  21:{nome:'Incisivo central superior',forceps:'Fórceps nº 1',tipo:'Universal superior',tecnica:'Rotação + tração',alerta:null},
  22:{nome:'Incisivo lateral superior',forceps:'Fórceps nº 1',tipo:'Universal superior',tecnica:'Rotação + tração',alerta:null},
  23:{nome:'Canino superior',forceps:'Fórceps nº 1',tipo:'Universal superior',tecnica:'Luxação V-L prolongada',alerta:'Raiz longa — luxar bastante antes de traccionar'},
  24:{nome:'Pré-molar superior',forceps:'Fórceps nº 150',tipo:'Universal superior',tecnica:'Movimentos V-L suaves',alerta:'Raiz frágil — alto risco de fratura'},
  25:{nome:'Pré-molar superior',forceps:'Fórceps nº 150',tipo:'Universal superior',tecnica:'Movimentos V-L suaves',alerta:'Raiz frágil — alto risco de fratura'},
  26:{nome:'Molar superior esquerdo',forceps:'Fórceps nº 18L',tipo:'superior esquerdo',tecnica:'Posicionar pontas nas furças',alerta:'3 raízes — risco elevado de fratura radicular'},
  27:{nome:'Molar superior esquerdo',forceps:'Fórceps nº 18L',tipo:'superior esquerdo',tecnica:'Posicionar pontas nas furças',alerta:'3 raízes — risco elevado de fratura radicular'},
  28:{nome:'Siso superior esquerdo',forceps:'Fórceps nº 65',tipo:'Baioneta — raízes e fragmentos',tecnica:'Acesso limitado — cuidado redobrado',alerta:'Avaliar indicação cirúrgica antes'},
  31:{nome:'Incisivo inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Movimentos V-L + leve rotação',alerta:null},
  32:{nome:'Incisivo inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Movimentos V-L + leve rotação',alerta:null},
  33:{nome:'Canino inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Luxação V-L intensa',alerta:'Raiz longa e cônica — luxar com calma'},
  34:{nome:'Pré-molar inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Movimentos V-L',alerta:null},
  35:{nome:'Pré-molar inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Movimentos V-L',alerta:null},
  36:{nome:'Molar inferior',forceps:'Fórceps nº 17 ou 16 ',tipo:'Molar inferior',tecnica:'Movimentos V-L progressivos',alerta:'2 raízes divergentes — luxar bem antes de traccionar'},
  37:{nome:'Molar inferior',forceps:'Fórceps nº 17 ou 16',tipo:'Molar inferior',tecnica:'Movimentos V-L progressivos',alerta:'2 raízes divergentes — luxar bem antes de traccionar'},
  38:{nome:'Siso inferior',forceps:'Fórceps nº 222',tipo:'Terceiro molar inferior',tecnica:'Acesso limitado — movimentos suaves',alerta:'Avaliar indicação cirúrgica antes'},
  41:{nome:'Incisivo inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Movimentos V-L + leve rotação',alerta:null},
  42:{nome:'Incisivo inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Movimentos V-L + leve rotação',alerta:null},
  43:{nome:'Canino inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Luxação V-L intensa',alerta:'Raiz longa e cônica — luxar com calma'},
  44:{nome:'Pré-molar inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Movimentos V-L',alerta:null},
  45:{nome:'Pré-molar inferior',forceps:'Fórceps nº 151',tipo:'Universal inferior',tecnica:'Movimentos V-L',alerta:null},
  46:{nome:'Molar inferior',forceps:'Fórceps nº 17 ou 16',tipo:'Molar inferior',tecnica:'Movimentos V-L progressivos',alerta:'2 raízes divergentes — luxar bem antes de traccionar'},
  47:{nome:'Molar inferior',forceps:'Fórceps nº 17 ou 16',tipo:'Molar inferior',tecnica:'Movimentos V-L progressivos',alerta:'2 raízes divergentes — luxar bem antes de traccionar'},
  48:{nome:'Siso inferior',forceps:'Fórceps nº 222',tipo:'Terceiro molar inferior',tecnica:'Acesso limitado — movimentos suaves',alerta:'Avaliar indicação cirúrgica antes'},
  51:{nome:'Incisivo central sup. decíduo',forceps:'Fórceps infantil nº 1 ou 2',tipo:'Pediátrico superior',tecnica:'Rotação suave + tração',alerta:'🧒 Decíduo — raízes em reabsorção'},
  52:{nome:'Incisivo lateral sup. decíduo',forceps:'Fórceps infantil nº 1 ou 2',tipo:'Pediátrico superior',tecnica:'Rotação suave + tração',alerta:'🧒 Decíduo — raízes em reabsorção'},
  53:{nome:'Canino sup. decíduo',forceps:'Fórceps infantil nº 1 ou 2',tipo:'Pediátrico superior',tecnica:'Luxação V-L suave',alerta:'🧒 Decíduo — raiz longa, reabsorção variável'},
  54:{nome:'Primeiro molar sup. decíduo',forceps:'Fórceps infantil nº 3 ou 4',tipo:'Pediátrico — raízes superiores',tecnica:'Movimentos V-L suaves',alerta:'🧒 Decíduo — raízes divergentes, risco de fratura'},
  55:{nome:'Segundo molar sup. decíduo',forceps:'Fórceps infantil nº 3 ou 4',tipo:'Pediátrico — raízes superiores',tecnica:'Movimentos V-L suaves',alerta:'🧒 Decíduo — raízes divergentes, risco de fratura'},
  61:{nome:'Incisivo central sup. decíduo',forceps:'Fórceps infantil nº 1 ou 2',tipo:'Pediátrico superior',tecnica:'Rotação suave + tração',alerta:'🧒 Decíduo — raízes em reabsorção'},
  62:{nome:'Incisivo lateral sup. decíduo',forceps:'Fórceps infantil nº 1 ou 2',tipo:'Pediátrico superior',tecnica:'Rotação suave + tração',alerta:'🧒 Decíduo — raízes em reabsorção'},
  63:{nome:'Canino sup. decíduo',forceps:'Fórceps infantil nº 1 ou 2',tipo:'Pediátrico superior',tecnica:'Luxação V-L suave',alerta:'🧒 Decíduo — raiz longa, reabsorção variável'},
  64:{nome:'Primeiro molar sup. decíduo',forceps:'Fórceps infantil nº 3 ou 4',tipo:'Pediátrico — raízes superiores',tecnica:'Movimentos V-L suaves',alerta:'🧒 Decíduo — raízes divergentes, risco de fratura'},
  65:{nome:'Segundo molar sup. decíduo',forceps:'Fórceps infantil nº 3 ou 4',tipo:'Pediátrico — raízes superiores',tecnica:'Movimentos V-L suaves',alerta:'🧒 Decíduo — raízes divergentes, risco de fratura'},
  71:{nome:'Incisivo central inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Movimentos V-L + leve rotação',alerta:'🧒 Decíduo — raízes em reabsorção'},
  72:{nome:'Incisivo lateral inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Movimentos V-L + leve rotação',alerta:'🧒 Decíduo — raízes em reabsorção'},
  73:{nome:'Canino inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Luxação V-L suave',alerta:'🧒 Decíduo — raiz longa, reabsorção variável'},
  74:{nome:'Primeiro molar inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Movimentos V-L — balanço M-D suave',alerta:'🧒 Decíduo — raízes divergentes, risco de fratura'},
  75:{nome:'Segundo molar inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Movimentos V-L — balanço M-D suave',alerta:'🧒 Decíduo — raízes divergentes, risco de fratura'},
  81:{nome:'Incisivo central inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Movimentos V-L + leve rotação',alerta:'🧒 Decíduo — raízes em reabsorção'},
  82:{nome:'Incisivo lateral inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Movimentos V-L + leve rotação',alerta:'🧒 Decíduo — raízes em reabsorção'},
  83:{nome:'Canino inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Luxação V-L suave',alerta:'🧒 Decíduo — raiz longa, reabsorção variável'},
  84:{nome:'Primeiro molar inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Movimentos V-L — balanço M-D suave',alerta:'🧒 Decíduo — raízes divergentes, risco de fratura'},
  85:{nome:'Segundo molar inf. decíduo',forceps:'Fórceps infantil nº 5 ou 6',tipo:'Pediátrico inferior',tecnica:'Movimentos V-L — balanço M-D suave',alerta:'🧒 Decíduo — raízes divergentes, risco de fratura'},
};

const ODONTO_DB = {
  11:{nome:'Incisivo central superior',raizes:'1 raiz cônica',raizesSub:'Raiz única, trajetória reta',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 1',alerta:null},
  12:{nome:'Incisivo lateral superior',raizes:'1 raiz cônica',raizesSub:'Pode ter curvatura apical',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 1',alerta:'Verificar curvatura apical no RX'},
  13:{nome:'Canino superior',raizes:'1 raiz longa',raizesSub:'Raiz mais longa da arcada',tecnica:'Sem odontosecção — luxação intensa',corte:[{icon:'➡️',label:'Extração direta',sub:'Luxação prolongada V-L',active:true}],forceps:'Fórceps nº 1',alerta:'Raiz muito longa — risco de fratura do processo alveolar'},
  14:{nome:'Pré-molar superior',raizes:'1-2 raízes',raizesSub:'Pode ter bifurcação no terço médio',tecnica:'Secção V-L se 2 raízes',corte:[{icon:'✂️',label:'Corte V-L',sub:'Separa raiz V e palatina',active:true},{icon:'➡️',label:'Direto',sub:'Se raiz única no RX',active:false}],forceps:'Fórceps nº 150 por fragmento',alerta:'Confirmar nº de raízes no RX antes'},
  15:{nome:'Pré-molar superior',raizes:'1-2 raízes',raizesSub:'Pode ter bifurcação no terço médio',tecnica:'Secção V-L se 2 raízes',corte:[{icon:'✂️',label:'Corte V-L',sub:'Separa raiz V e palatina',active:true},{icon:'➡️',label:'Direto',sub:'Se raiz única no RX',active:false}],forceps:'Fórceps nº 150 por fragmento',alerta:'Confirmar nº de raízes no RX antes'},
  16:{nome:'Molar superior direito',raizes:'3 raízes',raizesSub:'MV, DV e palatina — divergentes',tecnica:'Trisecção: separar MV + DV + palatina',corte:[{icon:'✂️',label:'Corte M-D',sub:'Separa MV da DV',active:true},{icon:'✂️',label:'Corte V-P',sub:'Isola palatina',active:true},{icon:'🔧',label:'3 fragmentos',sub:'Cada raiz separada',active:false}],forceps:'Alavanca + fórceps nº 18R por fragmento',alerta:'3 raízes divergentes — trisecção obrigatória'},
  17:{nome:'Molar superior direito',raizes:'3 raízes',raizesSub:'MV, DV e palatina — divergentes',tecnica:'Trisecção: separar MV + DV + palatina',corte:[{icon:'✂️',label:'Corte M-D',sub:'Separa MV da DV',active:true},{icon:'✂️',label:'Corte V-P',sub:'Isola palatina',active:true},{icon:'🔧',label:'3 fragmentos',sub:'Cada raiz separada',active:false}],forceps:'Alavanca + fórceps nº 18R por fragmento',alerta:'3 raízes divergentes — trisecção obrigatória'},
  18:{nome:'Siso superior',raizes:'1-3 raízes fundidas',raizesSub:'Geralmente fundidas — mais simples',tecnica:'Secção coronal se necessário',corte:[{icon:'➡️',label:'Direto',sub:'Frequentemente sem secção',active:true},{icon:'✂️',label:'Corte se necessário',sub:'Raízes divergentes no RX',active:false}],forceps:'Fórceps nº 222',alerta:'Acesso limitado — verificar espaço antes'},
  21:{nome:'Incisivo central superior',raizes:'1 raiz cônica',raizesSub:'Raiz única, trajetória reta',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 1',alerta:null},
  22:{nome:'Incisivo lateral superior',raizes:'1 raiz cônica',raizesSub:'Pode ter curvatura apical',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 1',alerta:'Verificar curvatura apical no RX'},
  23:{nome:'Canino superior',raizes:'1 raiz longa',raizesSub:'Raiz mais longa da arcada',tecnica:'Sem odontosecção — luxação intensa',corte:[{icon:'➡️',label:'Extração direta',sub:'Luxação prolongada V-L',active:true}],forceps:'Fórceps nº 1',alerta:'Raiz muito longa — risco de fratura do processo alveolar'},
  24:{nome:'Pré-molar superior',raizes:'1-2 raízes',raizesSub:'Pode ter bifurcação no terço médio',tecnica:'Secção V-L se 2 raízes',corte:[{icon:'✂️',label:'Corte V-L',sub:'Separa raiz V e palatina',active:true},{icon:'➡️',label:'Direto',sub:'Se raiz única no RX',active:false}],forceps:'Fórceps nº 150 por fragmento',alerta:'Confirmar nº de raízes no RX antes'},
  25:{nome:'Pré-molar superior',raizes:'1-2 raízes',raizesSub:'Pode ter bifurcação no terço médio',tecnica:'Secção V-L se 2 raízes',corte:[{icon:'✂️',label:'Corte V-L',sub:'Separa raiz V e palatina',active:true},{icon:'➡️',label:'Direto',sub:'Se raiz única no RX',active:false}],forceps:'Fórceps nº 150 por fragmento',alerta:'Confirmar nº de raízes no RX antes'},
  26:{nome:'Molar superior esquerdo',raizes:'3 raízes',raizesSub:'MV, DV e palatina — divergentes',tecnica:'Trisecção: separar MV + DV + palatina',corte:[{icon:'✂️',label:'Corte M-D',sub:'Separa MV da DV',active:true},{icon:'✂️',label:'Corte V-P',sub:'Isola palatina',active:true},{icon:'🔧',label:'3 fragmentos',sub:'Cada raiz separada',active:false}],forceps:'Alavanca + fórceps nº 18L por fragmento',alerta:'3 raízes divergentes — trisecção obrigatória'},
  27:{nome:'Molar superior esquerdo',raizes:'3 raízes',raizesSub:'MV, DV e palatina — divergentes',tecnica:'Trisecção: separar MV + DV + palatina',corte:[{icon:'✂️',label:'Corte M-D',sub:'Separa MV da DV',active:true},{icon:'✂️',label:'Corte V-P',sub:'Isola palatina',active:true},{icon:'🔧',label:'3 fragmentos',sub:'Cada raiz separada',active:false}],forceps:'Alavanca + fórceps nº 18L por fragmento',alerta:'3 raízes divergentes — trisecção obrigatória'},
  28:{nome:'Siso superior',raizes:'1-3 raízes fundidas',raizesSub:'Geralmente fundidas — mais simples',tecnica:'Secção coronal se necessário',corte:[{icon:'➡️',label:'Direto',sub:'Frequentemente sem secção',active:true},{icon:'✂️',label:'Corte se necessário',sub:'Raízes divergentes no RX',active:false}],forceps:'Fórceps nº 222',alerta:'Acesso limitado — verificar espaço antes'},
  31:{nome:'Incisivo inferior',raizes:'1 raiz',raizesSub:'Raiz única achatada M-D',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 16',alerta:null},
  32:{nome:'Incisivo inferior',raizes:'1 raiz',raizesSub:'Raiz única achatada M-D',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 16',alerta:null},
  33:{nome:'Canino inferior',raizes:'1 raiz longa',raizesSub:'Raiz longa e cônica',tecnica:'Sem odontosecção — luxação intensa',corte:[{icon:'➡️',label:'Extração direta',sub:'Luxação V-L prolongada',active:true}],forceps:'Fórceps nº 16',alerta:'Raiz longa e cônica — luxar com calma'},
  34:{nome:'Pré-molar inferior',raizes:'1 raiz',raizesSub:'Raiz única — trajetória variável',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 16',alerta:null},
  35:{nome:'Pré-molar inferior',raizes:'1 raiz',raizesSub:'Raiz única — trajetória variável',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 16',alerta:null},
  36:{nome:'Molar inferior',raizes:'2 raízes',raizesSub:'Mesial e distal — divergentes',tecnica:'Bissecção M-D na furca',corte:[{icon:'✂️',label:'Corte M-D',sub:'Corta na furca',active:true},{icon:'🔧',label:'2 fragmentos',sub:'Mesial e distal separados',active:false}],forceps:'Fórceps nº 17 ou alavanca por fragmento',alerta:'Raízes divergentes — bissecção reduz risco de fratura mandibular'},
  37:{nome:'Molar inferior',raizes:'2 raízes',raizesSub:'Mesial e distal — divergentes',tecnica:'Bissecção M-D na furca',corte:[{icon:'✂️',label:'Corte M-D',sub:'Corta na furca',active:true},{icon:'🔧',label:'2 fragmentos',sub:'Mesial e distal separados',active:false}],forceps:'Fórceps nº 17 ou alavanca por fragmento',alerta:'Raízes divergentes — bissecção reduz risco de fratura mandibular'},
  38:{nome:'Siso inferior',raizes:'2-3 raízes variáveis',raizesSub:'Anatomia imprevisível — avaliar RX',tecnica:'Depende da posição e angulação',corte:[{icon:'📐',label:'Vertical',sub:'Corte M-D',active:true},{icon:'📐',label:'Mesioangular',sub:'Corte da coroa primeiro',active:false},{icon:'📐',label:'Horizontal',sub:'Corte em L',active:false}],forceps:'Alavanca Potts — evitar fórceps',alerta:'Tomografia recomendada — próximo ao nervo alveolar inferior'},
  41:{nome:'Incisivo inferior',raizes:'1 raiz',raizesSub:'Raiz única achatada M-D',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 16',alerta:null},
  42:{nome:'Incisivo inferior',raizes:'1 raiz',raizesSub:'Raiz única achatada M-D',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 16',alerta:null},
  43:{nome:'Canino inferior',raizes:'1 raiz longa',raizesSub:'Raiz longa e cônica',tecnica:'Sem odontosecção — luxação intensa',corte:[{icon:'➡️',label:'Extração direta',sub:'Luxação V-L prolongada',active:true}],forceps:'Fórceps nº 16',alerta:'Raiz longa e cônica — luxar com calma'},
  44:{nome:'Pré-molar inferior',raizes:'1 raiz',raizesSub:'Raiz única — trajetória variável',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 16',alerta:null},
  45:{nome:'Pré-molar inferior',raizes:'1 raiz',raizesSub:'Raiz única — trajetória variável',tecnica:'Sem odontosecção',corte:[{icon:'➡️',label:'Extração direta',sub:'Sem corte necessário',active:true}],forceps:'Fórceps nº 16',alerta:null},
  46:{nome:'Molar inferior',raizes:'2 raízes',raizesSub:'Mesial e distal — divergentes',tecnica:'Bissecção M-D na furca',corte:[{icon:'✂️',label:'Corte M-D',sub:'Corta na furca',active:true},{icon:'🔧',label:'2 fragmentos',sub:'Mesial e distal separados',active:false}],forceps:'Fórceps nº 17 ou alavanca por fragmento',alerta:'Raízes divergentes — bissecção reduz risco de fratura mandibular'},
  47:{nome:'Molar inferior',raizes:'2 raízes',raizesSub:'Mesial e distal — divergentes',tecnica:'Bissecção M-D na furca',corte:[{icon:'✂️',label:'Corte M-D',sub:'Corta na furca',active:true},{icon:'🔧',label:'2 fragmentos',sub:'Mesial e distal separados',active:false}],forceps:'Fórceps nº 17 ou alavanca por fragmento',alerta:'Raízes divergentes — bissecção reduz risco de fratura mandibular'},
  48:{nome:'Siso inferior',raizes:'2-3 raízes variáveis',raizesSub:'Anatomia imprevisível — avaliar RX',tecnica:'Depende da posição e angulação',corte:[{icon:'📐',label:'Vertical',sub:'Corte M-D',active:true},{icon:'📐',label:'Mesioangular',sub:'Corte da coroa primeiro',active:false},{icon:'📐',label:'Horizontal',sub:'Corte em L',active:false}],forceps:'Alavanca Potts — evitar fórceps',alerta:'Tomografia recomendada — próximo ao nervo alveolar inferior'},
};
