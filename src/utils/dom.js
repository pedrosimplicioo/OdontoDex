// ==================== UTILS ====================
function showToast(msg,type){
  const t=document.getElementById("toast");
  if(!t)return;
  t.textContent=msg;
  t.style.backgroundColor=type==="success"?"#059669":"#DC2626";
  t.classList.add("active");
  setTimeout(()=>t.classList.remove("active"),2500);
}
function showLoading(){const el=document.getElementById("loading-overlay");if(el)el.classList.add("active");}
function hideLoading(){const el=document.getElementById("loading-overlay");if(el)el.classList.remove("active");}
// ── CONFIGURAÇÕES ──────────────────────────────────────────────────────────
let editTratSelected = '';

function atualizarSaudacao(){
  var nomeEl = document.getElementById('hdr-nome');
  if(!nomeEl) return;
  var nome = localStorage.getItem('guiaNome') || '';
  var trat = localStorage.getItem('guiaTratamento') ?? '';
  var perfil = localStorage.getItem('guiaPerfil') || 'dentista';
  
  if(nome){
    if(perfil === 'estudante'){
      nomeEl.textContent = 'Olá, ' + nome + '!';
    } else {
      var t = trat ? trat + ' ' : '';
      nomeEl.textContent = 'Olá, ' + t + nome + '!';
    }
  } else {
    nomeEl.textContent = 'Olá!';
  }
  
  // Lógica para recriar o banner se o perfil mudou para estudante
  if (perfil === 'estudante') {
    const bannerFechado = localStorage.getItem('studentBannerDismissed');
    if (bannerFechado === 'true') {
      const bannerExistente = document.getElementById('student-banner');
      if (!bannerExistente && document.getElementById('screen-app').classList.contains('active')) {
        localStorage.removeItem('studentBannerDismissed');
        if (typeof adicionarBannerEstudante === 'function') {
          adicionarBannerEstudante();
        }
      }
    }
  }
}

function renderSettings(){
  // Esconde linha de tratamento se for estudante
  var perfil = localStorage.getItem('guiaPerfil') || 'dentista';
  var tratRow = document.getElementById('cfg-trat-row');
  if(tratRow) tratRow.style.display = perfil==='estudante' ? 'none' : 'flex';

  if(!currentUser) return;
const rawDn = currentUser.displayName || currentUser.email.split('@')[0] || '';
const dn = perfil === 'estudante'
  ? rawDn.replace(/^(Dr\.|Dra\.)\s*/i, '').trim()
  : rawDn;
const dnFmt = dn.split(' ').map(function(p){return p.charAt(0).toUpperCase()+p.slice(1);}).join(' ');
  const av = document.getElementById('cfg-avatar');
  if(av){
    av.className = window.userIsPremium ? 'cfg-plan-icon premium' : 'cfg-plan-icon';
    av.innerHTML = window.userIsPremium ? '<i class="ti ti-crown"></i>' : '<i class="ti ti-user"></i>';
  }
 const planBadge = document.getElementById('cfg-plan-badge');
if(planBadge){
  if(window.userIsPremium){
    planBadge.innerHTML = '<i class="ti ti-crown"></i> Premium';
    planBadge.className = 'cfg-plan-badge premium';
  } else {
    planBadge.textContent = 'Gratuito';
    planBadge.className = 'cfg-plan-badge';
  }
}
  const cn = document.getElementById('cfg-user-name');
  if(cn) cn.textContent = dnFmt;
  const ce = document.getElementById('cfg-user-email');
  if(ce) ce.textContent = currentUser.email;
  const cv = document.getElementById('cfg-nome-val');
  if(cv) cv.textContent = localStorage.getItem('guiaNome') || 'Nao definido';
  // Tratamento salvo
  const tratSalvo = localStorage.getItem('guiaTratamento') ?? '';
  const ctv = document.getElementById('cfg-trat-val');
  if(ctv) ctv.textContent = tratSalvo || 'Sem título';
  // Dark mode
  const isDark = document.body.classList.contains('dark');
  const darkIcon = document.getElementById('cfg-dark-icon');
  const darkLabel = document.getElementById('cfg-dark-label');
  const darkToggle = document.getElementById('cfg-dark-toggle');
  const darkKnob = document.getElementById('cfg-dark-knob');
  if(darkIcon) darkIcon.innerHTML = isDark ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon-stars"></i>';
  if(darkLabel) darkLabel.textContent = isDark ? 'Ativar modo claro' : 'Ativar modo escuro';
  if(darkToggle) darkToggle.style.background = isDark ? '#7C3FA0' : '#CBD5E1';
  if(darkKnob) darkKnob.style.left = isDark ? '21px' : '3px';
}

function openEditName(){
  const inp = document.getElementById('edit-name-input');
  if(inp && currentUser){
    const dn = currentUser.displayName || '';
    inp.value = localStorage.getItem('guiaNome') || '';
  }
  showOverlay('edit-name-overlay');
  setTimeout(function(){document.getElementById('edit-name-input').focus();}, 100);
}

async function saveEditName(){
  var val = document.getElementById('edit-name-input').value.trim();
  if(!val){showToast('Digite um nome','error');return;}
  var primeiro = val.split(' ').map(function(p){return p.charAt(0).toUpperCase()+p.slice(1).toLowerCase();}).join(' ');
  localStorage.setItem('guiaNome', primeiro);
  if(currentUser){
    try{
      await db.collection('users').doc(currentUser.uid).update({nome: primeiro});
    }catch(e){console.log('Firestore indisponível',e);}
  }
  hideOverlay('edit-name-overlay');
  atualizarSaudacao();
  showToast('Nome atualizado!','success');
  renderSettings();
}

function openEditTratamento(){
  const perfil = localStorage.getItem('guiaPerfil') || 'dentista';
  if(perfil === 'estudante') return;
  
  const trat = localStorage.getItem('guiaTratamento') ?? 'Dr.';
  editTratSelected = trat;
  document.getElementById('trat-dr').className = 'cfg-sel-btn'+(trat==='Dr.'?' selected':'');
  document.getElementById('trat-dra').className = 'cfg-sel-btn'+(trat==='Dra.'?' selected':'');
  document.getElementById('trat-none').className = 'cfg-sel-btn'+(trat===''?' selected':'');
  showOverlay('edit-trat-overlay');
}

function selectTratEdit(t){
  editTratSelected = t;
  document.getElementById('trat-dr').className = 'cfg-sel-btn'+(t==='Dr.'?' selected':'');
  document.getElementById('trat-dra').className = 'cfg-sel-btn'+(t==='Dra.'?' selected':'');
  document.getElementById('trat-none').className = 'cfg-sel-btn'+(t===''?' selected':'');
}

async function saveEditTratamento(){
  localStorage.setItem('guiaTratamento', editTratSelected);
  if(currentUser){
    try{
      const nome = localStorage.getItem('guiaNome') || (currentUser.displayName||'').split(' ').filter(function(p){return p!=='Dr.'&&p!=='Dra.';}).join(' ').split(' ')[0] || '';
      const novoDisplay = editTratSelected ? editTratSelected+' '+nome : nome;
      await currentUser.updateProfile({displayName: novoDisplay});
    }catch(e){console.log(e);}
  }
  hideOverlay('edit-trat-overlay');
  atualizarSaudacao();
  showToast('Tratamento atualizado!','success');
  renderSettings();
}

function toggleDarkMode(){document.body.classList.toggle("dark");const btn=document.getElementById("dark-toggle");if(btn)btn.innerHTML=document.body.classList.contains("dark")?'<i class="ti ti-sun"></i>':'<i class="ti ti-moon-stars"></i>';localStorage.setItem("darkMode",document.body.classList.contains("dark"));}
function initDarkMode(){const btn=document.getElementById("dark-toggle");if(localStorage.getItem("darkMode")==="true"){document.body.classList.add("dark");if(btn)btn.innerHTML='<i class="ti ti-sun"></i>';}else if(btn){btn.innerHTML='<i class="ti ti-moon-stars"></i>';}}
function hideOverlay(id){const el=document.getElementById(id);if(el)el.classList.remove("active");}
function showOverlay(id){
  const el=document.getElementById(id);
  if(!el) return;
  el.classList.add("active");
  const scrollables=[el, ...el.querySelectorAll(".modal,.prem-modal")];
  scrollables.forEach(node=>{ if(node) node.scrollTop=0; });
  window.scrollTo(0,0);
}
function uid(){return Math.random().toString(36).slice(2,8);}
