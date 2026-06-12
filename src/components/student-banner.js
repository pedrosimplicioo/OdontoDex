// ==================== AVISO PARA ESTUDANTES ====================
function adicionarBannerEstudante() {
  if (window._suspenderBannerEstudante) return;
  const perfil = localStorage.getItem('guiaPerfil') || 'dentista';
  
  const avisoExistente = document.getElementById('student-banner');
  if (avisoExistente) return;
  
  if (perfil !== 'estudante') return;
  
  const bannerFechado = localStorage.getItem('studentBannerDismissed');
  if (bannerFechado === 'true') return;

  const outroModalAberto = document.querySelector('.overlay.active:not(#student-banner)');
  if (outroModalAberto) {
    setTimeout(adicionarBannerEstudante, 700);
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'student-banner';
  overlay.className = 'overlay active';
  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()" style="text-align:center;max-width:390px;">
      <div class="modal-icon" style="margin-bottom:4px;color:#F59E0B;"><i class="ti ti-alert-triangle"></i></div>
      <h2 class="modal-title" style="font-size:20px;">Aviso para estudantes</h2>
      <p class="modal-sub" style="margin:8px 0 16px;">Os protocolos clínicos exibidos no OdontoDex refletem práticas gerais da odontologia.</p>
      <div style="background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.28);border-radius:16px;padding:14px 16px;margin-bottom:18px;text-align:left;width:100%;">
        <div style="font-size:13px;font-weight:800;color:#B45309;margin-bottom:8px;"><i class="ti ti-info-circle"></i> Importante</div>
        <div style="font-size:13px;color:inherit;line-height:1.8;">
          Cada faculdade ou universidade pode adotar técnicas, materiais ou fluxos diferentes.<br><br>
          Este conteúdo não substitui a orientação do seu professor.<br>
          Não execute procedimentos sem supervisão adequada.<br>
          Em caso de dúvida, consulte seu supervisor.
        </div>
      </div>
      <button class="btn-primary" onclick="fecharBannerEstudante()">
        <i class="ti ti-check"></i> Entendi
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}

function fecharBannerEstudante() {
  localStorage.setItem('studentBannerDismissed', 'true');
  const aviso = document.getElementById('student-banner');
  if (aviso) aviso.remove();
}
