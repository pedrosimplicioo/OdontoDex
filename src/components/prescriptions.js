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

function switchPrescricaoTab(aba) {
  abaAtivaPrescricao = aba;
  const tabSit = document.getElementById('tab-situacoes');
  const tabEsp = document.getElementById('tab-especiais');
  if(aba === 'situacoes') {
    tabSit.style.borderBottom = '2px solid #7C3FA0';
    tabSit.style.color = '#7C3FA0';
    tabEsp.style.borderBottom = '2px solid transparent';
    tabEsp.style.color = '#94A3B8';
  } else {
    tabEsp.style.borderBottom = '2px solid #7C3FA0';
    tabEsp.style.color = '#7C3FA0';
    tabSit.style.borderBottom = '2px solid transparent';
    tabSit.style.color = '#94A3B8';
  }
  renderPrescricoesList();
}

function renderPrescricoesList() {
  const list = document.getElementById('prescricoes-list');
  if(!list) return;
  list.innerHTML = '';

  const aviso = document.createElement('div');
  aviso.className = 'rx-legal-note';
  aviso.innerHTML = AVISO_LEGAL_HTML;
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
  } else {
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
  }
}

function abrirPrescricao(id) {
  prescricaoAtualId = id;
  const data = PRESCRICOES_DATA[id];
  if(!data) return;
  if(data.filtros && data.filtros.length > 0) {
    filtroAtivoPrescricao = data.filtros[0];
  } else {
    filtroAtivoPrescricao = 'padrao';
  }
  document.getElementById('prescricao-detalhe-titulo').textContent = data.titulo;
  renderPrescricaoDetalhe();
  goScreen('prescricao-detalhe');
  setTimeout(() => {
    const els = document.querySelectorAll('#screen-prescricao-detalhe, #screen-prescricao-detalhe .body, #prescricao-detalhe-body');
    els.forEach(el => { if(el) el.scrollTop = 0; });
    window.scrollTo(0, 0);
  }, 100);
}

function abrirPacienteEspecial(id) {
  const data = PACIENTES_ESPECIAIS_DATA[id];
  if(!data) return;
  document.getElementById('prescricao-detalhe-titulo').textContent = data.titulo;
  renderPacienteEspecialDetalhe(id);
  goScreen('prescricao-detalhe');
}

function renderPacienteEspecialDetalhe(id) {
  const body = document.getElementById('prescricao-detalhe-body');
  if(!body) return;
  const data = PACIENTES_ESPECIAIS_DATA[id];
  if(!data) return;

  let blocosHtml = '';
  data.blocos.forEach(bloco => {
    const isAlerta = bloco.secao.includes('⚠️');
    const bgColor = isAlerta ? '#FEF2F2' : '#fff';
    const borderColor = isAlerta ? '#FECACA' : '#E2E8F0';
    const labelColor = isAlerta ? '#DC2626' : '#64748B';

    blocosHtml += `<div style="border:0.5px solid ${borderColor};border-radius:16px;overflow:hidden;margin-bottom:10px;background:${bgColor};">
      <div style="padding:10px 14px;border-bottom:0.5px solid ${borderColor};">
        <div style="font-size:11px;font-weight:700;color:${labelColor};letter-spacing:1px;">${bloco.secao}</div>
      </div>
      <div style="padding:12px 16px;">`;
    bloco.itens.forEach(item => {
      blocosHtml += `<div style="font-size:13px;color:#1E293B;line-height:1.6;margin-bottom:6px;display:flex;gap:8px;align-items:flex-start;"><span style="flex-shrink:0;color:#7C3FA0;">•</span><span>${item}</span></div>`;
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
      <div style="font-size:11px;font-weight:700;color:#64748B;letter-spacing:1px;margin-bottom:8px;">PERFIL DO PACIENTE</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">`;
    data.filtros.forEach(f => {
      const ativo = f === filtroAtual;
      filtrosHtml += `<button onclick="selecionarFiltro('${f}')" style="border-radius:20px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;border:${ativo ? '1.5px solid #7C3FA0' : '0.5px solid #E2E8F0'};background:${ativo ? '#F5EEFB' : '#F8FAFC'};color:${ativo ? '#7C3FA0' : '#64748B'};font-family:inherit;">${FILTROS_LABELS[f] || f}</button>`;
    });
    filtrosHtml += `</div></div>`;
  }

  let blocosHtml = '';
  blocos.forEach(bloco => {
    const isAlerta = bloco.secao.includes('⚠️');
    const isInfo = bloco.secao.includes('ℹ️');
    const bgColor = isAlerta ? '#FEF2F2' : isInfo ? '#EFF6FF' : '#fff';
    const borderColor = isAlerta ? '#FECACA' : isInfo ? '#BFDBFE' : '#E2E8F0';
    const labelColor = isAlerta ? '#DC2626' : isInfo ? '#1D4ED8' : '#64748B';

    blocosHtml += `<div style="border:0.5px solid ${borderColor};border-radius:16px;overflow:hidden;margin-bottom:10px;background:${bgColor};">
      <div style="padding:10px 14px;border-bottom:0.5px solid ${borderColor};">
        <div style="font-size:11px;font-weight:700;color:${labelColor};letter-spacing:1px;">${bloco.secao}</div>
      </div>
      <div style="padding:12px 16px;">`;
    bloco.itens.forEach(item => {
      blocosHtml += `<div style="font-size:13px;color:#1E293B;line-height:1.6;margin-bottom:6px;display:flex;gap:8px;align-items:flex-start;"><span style="flex-shrink:0;color:#7C3FA0;">•</span><span>${item}</span></div>`;
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
