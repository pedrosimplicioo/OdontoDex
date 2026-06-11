// ==================== FUNÇÕES PRESCRIÇÕES ====================
const FILTROS_LABELS = {
  padrao: "Sem restrições",
  alergia: "Alergia à penicilina",
  gravida: "Grávida / Lactante",
  asmatico: "Asmático",
  crianca: "Criança",
  "incapaz-oral": "Incapaz via oral",
  "incapaz-oral-alergia": "Incapaz + alergia",
  leve: "Grau leve",
  severo: "Grau severo",
  queilite: "Queilite angular",
  moderada: "Infecção moderada",
  grave: "Infecção grave",
};

let abaAtivaPrescricao = 'situacoes';
let filtroAtivoPrescricao = 'padrao';
let prescricaoAtualId = '';

function syncPrescricaoTabs() {
  const tabs = {
    situacoes: document.getElementById('tab-situacoes'),
    especiais: document.getElementById('tab-especiais'),
    anestesicos: document.getElementById('tab-anestesicos'),
  };
  Object.keys(tabs).forEach(tabId => {
    const tab = tabs[tabId];
    if(!tab) return;
    const active = tabId === abaAtivaPrescricao;
    tab.style.borderBottom = active ? '2px solid #7C3FA0' : '2px solid transparent';
    tab.style.color = active ? '#7C3FA0' : '#94A3B8';
  });
}

function switchPrescricaoTab(aba) {
  abaAtivaPrescricao = aba;
  syncPrescricaoTabs();
  renderPrescricoesList();
}

function renderPrescricoesList() {
  const list = document.getElementById('prescricoes-list');
  if(!list) return;
  syncPrescricaoTabs();
  list.innerHTML = '';

  const aviso = document.createElement('div');
  aviso.className = 'rx-legal-note';
  aviso.innerHTML = abaAtivaPrescricao === 'anestesicos' ? ANESTESICOS_AVISO_HTML : AVISO_LEGAL_HTML;
  list.appendChild(aviso);

  if(abaAtivaPrescricao === 'situacoes') {
    PRESCRICOES_LIST.forEach(rx => {
      const locked = !rx.free && !window.userIsPremium;
      const btn = document.createElement('button');
      btn.className = 'list-btn';
      btn.innerHTML = `
      <span class="rx-list-icon">${rx.icon}</span>
        <div style="flex:1;text-align:left;">
          <div class="list-txt">${rx.label}</div>
        </div>
        ${locked ? '<span class="prem-tag"><i class="ti ti-lock"></i>Premium</span>' : '<span class="arr">›</span>'}
      `;
      btn.onclick = () => {
        if(locked) { showUpgradeModal(null); return; }
        abrirPrescricao(rx.id);
      };
      list.appendChild(btn);
    });
  } else if(abaAtivaPrescricao === 'especiais') {
    const grid = document.createElement('div');
    grid.className = 'patient-special-grid';
    PACIENTES_ESPECIAIS_LIST.forEach(pe => {
      const locked = !pe.free && !window.userIsPremium;
      const btn = document.createElement('button');
      btn.className = 'patient-special-card' + (locked ? ' locked' : '');
      btn.innerHTML = `
        <span class="patient-special-icon">${pe.icon}</span>
        <span class="patient-special-label">${pe.label}</span>
        ${locked ? '<span class="patient-special-lock"><i class="ti ti-lock"></i></span>' : ''}
      `;
      btn.onclick = () => {
        if(locked) { showUpgradeModal(null); return; }
        abrirPacienteEspecial(pe.id);
      };
      grid.appendChild(btn);
    });
    list.appendChild(grid);
  } else if(abaAtivaPrescricao === 'anestesicos') {
    const grid = document.createElement('div');
    grid.className = 'patient-special-grid';
    ANESTESICOS_LIST.forEach(item => {
      const locked = !item.free && !window.userIsPremium;
      const btn = document.createElement('button');
      btn.className = 'patient-special-card anesthetic-card' + (locked ? ' locked' : '');
      btn.innerHTML = `
        <span class="patient-special-icon">${item.icon}</span>
        <span class="patient-special-label">${item.label}</span>
        ${locked ? '<span class="patient-special-lock"><i class="ti ti-lock"></i></span>' : ''}
      `;
      btn.onclick = () => {
        if(locked) { showUpgradeModal(null); return; }
        abrirAnestesico(item.id);
      };
      grid.appendChild(btn);
    });
    list.appendChild(grid);
  }
}

function setPrescricaoFavButtonVisible(visible) {
  const btn = document.getElementById('fav-btn-prescricao');
  if(!btn) return;
  btn.style.display = 'grid';
  btn.style.visibility = visible ? 'visible' : 'hidden';
  btn.style.pointerEvents = visible ? 'auto' : 'none';
}

function abrirPrescricao(id) {
  prescricaoAtualId = id;
  const data = PRESCRICOES_DATA[id];
  if(!data) return;
  setPrescricaoFavButtonVisible(true);
  if(data.filtros && data.filtros.length > 0) {
    filtroAtivoPrescricao = data.filtros[0];
  } else {
    filtroAtivoPrescricao = 'padrao';
  }
  document.getElementById('prescricao-detalhe-titulo').textContent = data.titulo;
  updatePrescricaoFavButton();
  renderPrescricaoDetalhe();
  goScreen('prescricao-detalhe');
  setTimeout(() => {
    const els = document.querySelectorAll('#screen-prescricao-detalhe, #screen-prescricao-detalhe .body, #prescricao-detalhe-body');
    els.forEach(el => { if(el) el.scrollTop = 0; });
    window.scrollTo(0, 0);
  }, 100);
}

function updatePrescricaoFavButton(){
  const btn = document.getElementById('fav-btn-prescricao');
  if(!btn || !prescricaoAtualId) return;
  const active = typeof isFavorite === "function" && isFavorite("prescription", prescricaoAtualId);
  btn.dataset.favId = prescricaoAtualId;
  btn.classList.toggle("active", active);
  btn.innerHTML = active ? '<i class="ti ti-star-filled"></i>' : '<i class="ti ti-star"></i>';
}

function abrirPacienteEspecial(id) {
  const data = PACIENTES_ESPECIAIS_DATA[id];
  if(!data) return;
  prescricaoAtualId = '';
  setPrescricaoFavButtonVisible(false);
  document.getElementById('prescricao-detalhe-titulo').textContent = data.titulo;
  renderPacienteEspecialDetalhe(id);
  goScreen('prescricao-detalhe');
}

function abrirAnestesico(id) {
  const data = ANESTESICOS_DATA[id];
  if(!data) return;
  prescricaoAtualId = '';
  setPrescricaoFavButtonVisible(false);
  document.getElementById('prescricao-detalhe-titulo').textContent = data.titulo;
  renderAnestesicoDetalhe(id);
  goScreen('prescricao-detalhe');
  setTimeout(() => {
    const els = document.querySelectorAll('#screen-prescricao-detalhe, #screen-prescricao-detalhe .body, #prescricao-detalhe-body');
    els.forEach(el => { if(el) el.scrollTop = 0; });
    window.scrollTo(0, 0);
  }, 100);
}

function renderPacienteEspecialDetalhe(id) {
  const body = document.getElementById('prescricao-detalhe-body');
  if(!body) return;
  const data = PACIENTES_ESPECIAIS_DATA[id];
  if(!data) return;

  let blocosHtml = '';
  data.blocos.forEach(bloco => {
    const isAlerta = bloco.secao.includes('⚠️');
    const blockClass = isAlerta ? 'rx-block alert' : 'rx-block';

    blocosHtml += `<div class="${blockClass}">
      <div class="rx-block-head">
        <div class="rx-block-label">${bloco.secao}</div>
      </div>
      <div class="rx-block-body">`;
    bloco.itens.forEach(item => {
      blocosHtml += `<div class="rx-item"><span class="rx-dot">•</span><span>${item}</span></div>`;
    });
    blocosHtml += `</div></div>`;
  });

  const avisoHtml = `<div class="rx-legal-note" style="margin-bottom:12px;font-size:11px;">${AVISO_LEGAL_HTML}</div>`;
  const btnHtml = `
    <button onclick="copiarPacienteEspecial('${id}')" style="width:100%;background:#7C3FA0;color:#fff;border:none;border-radius:24px;padding:14px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:16px;">
      <i class="ti ti-clipboard"></i> Copiar prescrição
    </button>`;

  body.innerHTML = blocosHtml + avisoHtml + btnHtml;
  body.scrollTop = 0;
}

function renderAnestesicoDetalhe(id) {
  const body = document.getElementById('prescricao-detalhe-body');
  if(!body) return;
  const data = ANESTESICOS_DATA[id];
  if(!data) return;

  let blocosHtml = '';
  data.blocos.forEach(bloco => {
    const secao = bloco.secao || '';
    const secaoNormalizada = secao.toLowerCase();
    const isCuidado = secaoNormalizada.includes('evitar');
    const isInfo = secaoNormalizada.includes('atenção') || secaoNormalizada.includes('recomenda');
    const blockClass = isCuidado ? 'rx-block alert' : isInfo ? 'rx-block info' : 'rx-block';

    blocosHtml += `<div class="${blockClass}">
      <div class="rx-block-head">
        <div class="rx-block-label">${bloco.secao}</div>
      </div>
      <div class="rx-block-body">`;
    bloco.itens.forEach(item => {
      blocosHtml += `<div class="rx-item"><span class="rx-dot">•</span><span>${item}</span></div>`;
    });
    blocosHtml += `</div></div>`;
  });

  const avisoHtml = `<div class="rx-legal-note" style="margin-bottom:12px;font-size:11px;">${ANESTESICOS_AVISO_HTML}</div>`;
  const btnHtml = `
    <button onclick="copiarAnestesicos('${id}')" style="width:100%;background:#7C3FA0;color:#fff;border:none;border-radius:24px;padding:14px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:16px;">
      <i class="ti ti-clipboard"></i> Copiar anestésicos
    </button>`;

  body.innerHTML = avisoHtml + blocosHtml + btnHtml;
  body.scrollTop = 0;
}

function renderPrescricaoDetalhe() {
  const body = document.getElementById('prescricao-detalhe-body');
  if(!body) return;
  const data = PRESCRICOES_DATA[prescricaoAtualId];
  if(!data) return;

  const filtroAtual = filtroAtivoPrescricao;
  const blocos = data.blocos[filtroAtual] || data.blocos[data.filtros[0]] || data.blocos['padrao'];

  let filtrosHtml = '';
  if(data.filtros && data.filtros.length > 0) {
    filtrosHtml = `<div style="margin-bottom:16px;">
      <div class="rx-filter-label">PERFIL DO PACIENTE</div>
      <div class="rx-filter-row">`;
    data.filtros.forEach(f => {
      const ativo = f === filtroAtual;
      filtrosHtml += `<button onclick="selecionarFiltro('${f}')" class="rx-filter-btn${ativo ? ' active' : ''}">${FILTROS_LABELS[f] || f}</button>`;
    });
    filtrosHtml += `</div></div>`;
  }

  let blocosHtml = '';
  blocos.forEach(bloco => {
    const isAlerta = bloco.secao.includes('⚠️');
    const isInfo = bloco.secao.includes('ℹ️');
    const blockClass = isAlerta ? 'rx-block alert' : isInfo ? 'rx-block info' : 'rx-block';

    blocosHtml += `<div class="${blockClass}">
      <div class="rx-block-head">
        <div class="rx-block-label">${bloco.secao}</div>
      </div>
      <div class="rx-block-body">`;
    bloco.itens.forEach(item => {
      blocosHtml += `<div class="rx-item"><span class="rx-dot">•</span><span>${item}</span></div>`;
    });
    blocosHtml += `</div></div>`;
  });

  const avisoHtml = `<div class="rx-legal-note" style="margin-bottom:12px;font-size:11px;">${AVISO_LEGAL_HTML}</div>`;
  const btnHtml = `
    <button onclick="copiarPrescricao()" style="width:100%;background:#7C3FA0;color:#fff;border:none;border-radius:24px;padding:14px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px;">
      <i class="ti ti-clipboard"></i> Copiar prescrição
    </button>
    <div style="font-size:11px;color:#94A3B8;text-align:center;line-height:1.5;margin-bottom:16px;">Ao copiar, confirmo que sou profissional habilitado e que adaptei a prescrição conforme o paciente.</div>
  `;

  body.innerHTML = filtrosHtml + blocosHtml + avisoHtml + btnHtml;
  body.scrollTop = 0;
}

function selecionarFiltro(id) {
  filtroAtivoPrescricao = id;
  renderPrescricaoDetalhe();
}

function copiarPrescricao() {
  const data = PRESCRICOES_DATA[prescricaoAtualId];
  if(!data) return;
  const filtroLabel = FILTROS_LABELS[filtroAtivoPrescricao] || 'Sem restrições';
  const blocos = data.blocos[filtroAtivoPrescricao] || data.blocos[data.filtros[0]] || data.blocos['padrao'];

  let texto = `PRESCRIÇÃO — ${data.titulo}\n`;
  texto += `Perfil: ${filtroLabel}\n\n`;
  blocos.forEach(bloco => {
    texto += `${bloco.secao}:\n`;
    bloco.itens.forEach(item => { texto += `• ${item}\n`; });
    texto += `\n`;
  });
  texto += `---\n${AVISO_LEGAL}`;

  navigator.clipboard.writeText(texto).catch(() => {});
  showToast('Prescrição copiada!', 'success');
}

function copiarPacienteEspecial(id) {
  const data = PACIENTES_ESPECIAIS_DATA[id];
  if(!data) return;

  let texto = `PRESCRIÇÃO — ${data.titulo}\n\n`;
  data.blocos.forEach(bloco => {
    texto += `${bloco.secao}:\n`;
    bloco.itens.forEach(item => { texto += `• ${item}\n`; });
    texto += `\n`;
  });
  texto += `---\n${AVISO_LEGAL}`;

  navigator.clipboard.writeText(texto).catch(() => {});
  showToast('Prescrição copiada!', 'success');
}

function copiarAnestesicos(id) {
  const data = ANESTESICOS_DATA[id];
  if(!data) return;

  let texto = `ANESTÉSICOS — ${data.titulo}\n\n`;
  data.blocos.forEach(bloco => {
    texto += `${bloco.secao}:\n\n`;
    bloco.itens.forEach(item => { texto += `• ${item}\n`; });
    texto += `\n`;
  });
  texto += `---\n${ANESTESICOS_AVISO}`;

  navigator.clipboard.writeText(texto).catch(() => {});
  showToast('Anestésicos copiados!', 'success');
}
