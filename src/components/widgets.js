function renderForcepsWidget(inputId, confirmId, resultId, alertId, passo6Id){
  var val = document.getElementById(inputId).value.replace(/[^0-9]/g,'');
  var n = parseInt(val);
  var confirm = document.getElementById(confirmId);
  var result = document.getElementById(resultId);
  var p6 = document.getElementById(passo6Id);

  const validPermanent = (n >= 11 && n <= 48);
  const validDeciduous = (n >= 51 && n <= 85);

  if(!n || (!validPermanent && !validDeciduous)){
    confirm.classList.remove('show');
    result.classList.remove('show');
    if(p6){ p6.className='step-txt'; p6.textContent='Selecione o dente acima para ver o fórceps indicado'; }
    return;
  }
  var f = FORCEPS_DB[n];
  if(!f){ confirm.classList.remove('show'); result.classList.remove('show'); return; }

  document.getElementById(confirmId+'-txt').textContent = 'Dente ' + n + ' — ' + f.nome;
  confirm.classList.add('show');
  result.innerHTML =
    '<div class="fw-sec"><div class="fw-sec-label">Fórceps indicado</div><div class="fw-sec-value">' + f.forceps + '</div><div class="fw-sec-sub">' + f.tipo + '</div><span class="fw-tecnica-tag">' + f.tecnica + '</span></div>' +
    (f.alerta ? '<div class="fw-widget-alert show"><span class="protocol-inline-icon"><i class="ti ti-alert-triangle"></i></span>' + f.alerta + '</div>' : '');
  result.classList.add('show');

  if(p6){ p6.className='step-txt'; p6.style.color='#6B2F8E'; p6.style.fontWeight='700'; p6.innerHTML='<span class="protocol-inline-icon"><i class="ti ti-target"></i></span>Usar ' + f.forceps + ' — ' + f.tecnica; }
  
  // NOVO: Registrar uso do fórceps
  if(currentUser && f) {
    registrarAcaoUsuario(currentUser.uid, 'forceps', { 
      dente: n, 
      forceps: f.forceps,
      nome: f.nome
    });
  }
}

function renderCorteIcon(icon){
  const map = {'✂️':'ti-cut','➡️':'ti-arrow-right','🔧':'ti-tool','📐':'ti-ruler-measure'};
  const iconClass = map[icon];
  return iconClass ? '<i class="ti ' + iconClass + '"></i>' : icon;
}

function renderOdontoWidget(inputId, confirmId, resultId, passo7Id){
  var val = document.getElementById(inputId).value.replace(/[^0-9]/g,'');
  var n = parseInt(val);
  var confirm = document.getElementById(confirmId);
  var result = document.getElementById(resultId);
  var p7 = document.getElementById(passo7Id);

  if(!n || n < 11 || n > 48){
    confirm.classList.remove('show');
    result.classList.remove('show');
    if(p7){ p7.className='step-txt'; p7.textContent='Digite o número do dente para ver a odontosecção'; }
    return;
  }
  var f = ODONTO_DB[n];
  if(!f){ confirm.classList.remove('show'); result.classList.remove('show'); return; }

  document.getElementById(confirmId+'-txt').textContent = 'Dente ' + n + ' — ' + f.nome;
  confirm.classList.add('show');

  var cortesHtml = f.corte.map(function(c){
    return '<div class="fw-corte-card' + (c.active?' active':'') + '"><div class="fw-corte-icon">' + renderCorteIcon(c.icon) + '</div><div class="fw-corte-label">' + c.label + '</div><div class="fw-corte-sub">' + c.sub + '</div></div>';
  }).join('');

  result.innerHTML =
    '<div class="fw-sec"><div class="fw-sec-label">Anatomia radicular</div><div class="fw-sec-value">' + f.raizes + '</div><div class="fw-sec-sub">' + f.raizesSub + '</div></div>' +
    '<div class="fw-sec"><div class="fw-sec-label">Técnica de odontosecção</div><div class="fw-sec-value">' + f.tecnica + '</div><div class="fw-corte-visual">' + cortesHtml + '</div></div>' +
    '<div class="fw-sec"><div class="fw-sec-label">Fórceps após secção</div><div class="fw-sec-value">' + f.forceps + '</div></div>' +
    (f.alerta ? '<div class="fw-widget-alert show"><span class="protocol-inline-icon"><i class="ti ti-alert-triangle"></i></span>' + f.alerta + '</div>' : '');
  result.classList.add('show');

  if(p7){ p7.className='step-txt'; p7.style.color='#6B2F8E'; p7.style.fontWeight='700'; p7.innerHTML='<span class="protocol-inline-icon"><i class="ti ti-cut"></i></span>' + f.tecnica; }
}
