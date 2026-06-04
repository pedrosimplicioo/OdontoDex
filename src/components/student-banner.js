// ==================== BANNER PARA ESTUDANTES ====================
function adicionarBannerEstudante() {
  const perfil = localStorage.getItem('guiaPerfil') || 'dentista';
  
  // Remove banner antigo se existir
  const bannerExistente = document.getElementById('student-banner');
  if (bannerExistente) bannerExistente.remove();
  
  // Só mostra se for estudante
  if (perfil !== 'estudante') return;
  
  // Verifica se o usuário já fechou o banner
  const bannerFechado = localStorage.getItem('studentBannerDismissed');
  if (bannerFechado === 'true') return;
  
  const header = document.getElementById('main-header');
  if (!header) return;
  
  const banner = document.createElement('div');
  banner.id = 'student-banner';
  banner.style.cssText = `
    background-color: #FFF3CD;
    border-left: 4px solid #FFC107;
    padding: 8px 24px 8px 12px;
    width: 100%;
    position: relative;
    margin: 8px 0;
    font-size: 11px;
    line-height: 1.4;
    border-radius: 4px;
  `;
  banner.innerHTML = `
    <button class="student-banner-close" onclick="fecharBannerEstudante()" style="
      position: absolute;
      top: 4px;
      right: 6px;
      background: none;
      border: none;
      font-size: 12px;
      cursor: pointer;
      color: #856404;
      padding: 2px 4px;
      line-height: 1;
    ">✕</button>
    <div style="margin-bottom: 4px;">
      <strong><i class="ti ti-alert-triangle"></i> ATENÇÃO ESTUDANTE:</strong>
    </div>
    <div style="margin-bottom: 6px;">
      Os protocolos clínicos exibidos neste app refletem práticas gerais da odontologia.
      Cada faculdade ou universidade pode adotar técnicas, materiais ou fluxos diferentes.
    </div>
    <div>
      <strong><i class="ti ti-alert-triangle"></i> PORTANTO:</strong><br>
      • Este conteúdo NÃO substitui a orientação do seu professor<br>
      • NÃO execute procedimentos sem supervisão adequada<br>
      • Em caso de dúvida, CONSULTE seu supervisor
    </div>
  `;
  
  // Insere o banner entre o .hdr-nome e o .hdr-pergunta
  const nomeEl = header.querySelector('.hdr-nome');
  const perguntaEl = header.querySelector('.hdr-pergunta');
  
  if (nomeEl && perguntaEl) {
    // Insere o banner entre o nome e a pergunta
    header.insertBefore(banner, perguntaEl);
  } else {
    // Fallback: adiciona no final do header
    header.appendChild(banner);
  }
}

function fecharBannerEstudante() {
  const banner = document.getElementById('student-banner');
  if (banner) banner.remove();
}
