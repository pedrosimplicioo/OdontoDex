function togglePulpiteSit(){
  const content=document.getElementById('pulpite-sit-content');
  const btn=document.getElementById('pulpite-sit-toggle');
  if(!content||!btn)return;
  const visible=content.style.display!=='none';
  content.style.display=visible?'none':'block';
  btn.textContent=visible?'Usar':'Fechar';
  if(!visible)initPulpiteSit();
}

let pulpiteSitRespostas=[];
let pulpiteSitAtual=0;

function initPulpiteSit(){
  pulpiteSitRespostas=[];
  pulpiteSitAtual=0;
  const q=document.getElementById('pulpite-sit-quiz');
  const r=document.getElementById('pulpite-sit-resultado');
  if(q)q.style.display='block';
  if(r)r.style.display='none';
  renderPulpiteSitPergunta();
}

function renderPulpiteSitPergunta(){
  const p=PULPITE_PERGUNTAS[pulpiteSitAtual];
  const numEl=document.getElementById('pulpite-sit-perg-num');
  const textEl=document.getElementById('pulpite-sit-perg-text');
  const opcoesEl=document.getElementById('pulpite-sit-opcoes');
  const progEl=document.getElementById('pulpite-sit-progress');
  if(!numEl||!textEl||!opcoesEl||!progEl)return;
  numEl.textContent='PERGUNTA '+(pulpiteSitAtual+1)+' DE '+PULPITE_PERGUNTAS.length;
  textEl.textContent=p.texto;
  opcoesEl.innerHTML='';
  p.opcoes.forEach(op=>{
    const btn=document.createElement('button');
    btn.className='fw-confirm show';
    btn.style.cssText='cursor:pointer;width:100%;text-align:left;border:0.5px solid #475569;border-radius:10px;background:none;padding:6px 10px;font-family:inherit;margin-bottom:2px;';
    btn.innerHTML='<span class="protocol-inline-icon"><i class="ti ti-dental"></i></span><span class="fw-confirm-txt" style="font-size:13px;">'+op.label+'</span><span class="fw-confirm-ok">›</span>';
    btn.onclick=()=>responderPulpiteSit(op.valor);
    opcoesEl.appendChild(btn);
  });
  progEl.innerHTML='';
  for(let i=0;i<PULPITE_PERGUNTAS.length;i++){
    const d=document.createElement('div');
    d.style.cssText='height:3px;flex:1;border-radius:3px;background:'+(i<pulpiteSitAtual?'#7C3FA0':i===pulpiteSitAtual?'#D9B8F0':'#E2E8F0')+';';
    progEl.appendChild(d);
  }
}

function responderPulpiteSit(valor){
  pulpiteSitRespostas.push(valor);
  if(pulpiteSitAtual<PULPITE_PERGUNTAS.length-1){
    pulpiteSitAtual++;
    renderPulpiteSitPergunta();
  } else {
    mostrarResultadoPulpiteSit();
  }
}

function mostrarResultadoPulpiteSit(){
  const r=pulpiteSitRespostas;
  let tipo='reversivel';
  if(r[0]==='espontanea' || r[2]==='frioAlivio' || r[3]==='sim') tipo='irreversivel';
  else if(r[1]==='longa' || r[2]==='frioPiora') tipo='transicao';
  const dk=document.body.classList.contains('dark');
  const configs={
    reversivel:{icon:'ti-circle-check',iconBg:dk?'#1A3A0A':'#EAF3DE',iconColor:dk?'#9FE1CB':'#27500A',badge:'Pulpite reversível',badgeBg:dk?'#27500A':'#C0DD97',badgeColor:dk?'#C0DD97':'#27500A',title:'Polpa com potencial de recuperação',titleColor:dk?'#C0DD97':'#27500A',body:'Remover fator causal + proteção pulpar. Não indica endodontia agora — acompanhar em 1–2 semanas.',ctaText:'Ver protocolo',ctaBg:'#3B6D11',ctaColor:'#fff',proto:'pulpite-reversivel'},
    transicao:{icon:'ti-alert-circle',iconBg:dk?'#3D2200':'#FAEEDA',iconColor:dk?'#FAC775':'#633806',badge:'Fase de transição',badgeBg:dk?'#633806':'#FAC775',badgeColor:dk?'#FAC775':'#633806',title:'Entre reversível e irreversível',titleColor:dk?'#FAC775':'#633806',body:'Conduta conservadora. Acompanhar em 2–4 semanas. Se piorar: endodontia.',ctaText:'Ver protocolo',ctaBg:'#854F0B',ctaColor:'#fff',proto:'pulpite-reversivel'},
    irreversivel:{icon:'ti-alert-triangle',iconBg:dk?'#3D0A0A':'#FCEBEB',iconColor:dk?'#F7C1C1':'#791F1F',badge:'Pulpite irreversível',badgeBg:dk?'#791F1F':'#F7C1C1',badgeColor:dk?'#F7C1C1':'#791F1F',title:'Endodontia indicada',titleColor:dk?'#F7C1C1':'#791F1F',body:'Abertura de urgência para alívio da dor + encaminhar endodontista.',ctaText:'Abrir protocolo de urgência',ctaBg:'#A32D2D',ctaColor:'#fff',proto:'pulpite-irreversivel'}
  };
  const c=configs[tipo];
  const quiz=document.getElementById('pulpite-sit-quiz');
  const res=document.getElementById('pulpite-sit-resultado');
  const icon=document.getElementById('pulpite-sit-icon');
  const badge=document.getElementById('pulpite-sit-badge');
  const title=document.getElementById('pulpite-sit-title');
  const body=document.getElementById('pulpite-sit-body');
  const cta=document.getElementById('pulpite-sit-cta');
  if(!quiz||!res||!icon||!badge||!title||!body||!cta)return;
  quiz.style.display='none';
  res.style.display='block';
  icon.style.cssText='width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;flex-shrink:0;background:'+c.iconBg+';color:'+c.iconColor+';';
  icon.innerHTML='<i class="ti '+c.icon+'"></i>';
  badge.style.cssText='font-size:11px;font-weight:700;padding:3px 10px;border-radius:30px;display:inline-block;margin-bottom:5px;background:'+c.badgeBg+';color:'+c.badgeColor+';';
  badge.textContent=c.badge;
  title.style.cssText='font-size:15px;font-weight:700;color:#0F172A;';
  title.textContent=c.title;
  body.style.cssText='font-size:13px;line-height:1.6;margin-bottom:14px;color:#1E293B;';
  body.textContent=c.body;
  cta.style.cssText='width:100%;border:none;border-radius:30px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;margin-bottom:8px;font-family:inherit;background:'+c.ctaBg+';color:'+c.ctaColor+';';
  cta.textContent=c.ctaText;
  cta.onclick=()=>openProto(c.proto);
}

function resetPulpiteSit(){initPulpiteSit();}

function togglePulpiteWidget(){
  const content = document.getElementById('pulpite-widget-content');
  const btn = document.getElementById('pulpite-toggle-btn');
  if(!content||!btn) return;
  const visible = content.style.display !== 'none';
  content.style.display = visible ? 'none' : 'block';
  btn.textContent = visible ? 'Usar' : 'Fechar';
  if(!visible) initPulpiteQuiz();
}

const PULPITE_PERGUNTAS = [
  {texto:"A dor aparece sem estímulo?",opcoes:[{label:"Não — só dói com frio, doce ou pressão",valor:"provocada"},{label:"Sim — dói sozinha, sem motivo",valor:"espontanea"}]},
  {texto:"Após o estímulo, a dor some rapidamente?",opcoes:[{label:"Sim — cessa em segundos",valor:"curta"},{label:"Não — persiste por mais de 30 segundos",valor:"longa"}]},
  {texto:"Como o paciente reage ao frio?",opcoes:[{label:"Piora com frio",valor:"frioPiora"},{label:"O frio alivia a dor temporariamente",valor:"frioAlivio"},{label:"Não muda nada",valor:"frioNeutro"}]},
  {texto:"A dor irradia ou piora à noite?",opcoes:[{label:"Não — dor bem localizada",valor:"nao"},{label:"Sim — irradia ou piora à noite",valor:"sim"}]}
];

let pulpiteRespostas = [];
let pulpiteAtual = 0;

function initPulpiteQuiz(){
  pulpiteRespostas = [];
  pulpiteAtual = 0;
  const q = document.getElementById('pulpite-quiz');
  const r = document.getElementById('pulpite-resultado');
  if(q) q.style.display='block';
  if(r) r.style.display='none';
  renderPulpitePergunta();
}

function renderPulpitePergunta(){
  const p = PULPITE_PERGUNTAS[pulpiteAtual];
  const numEl = document.getElementById('pulpite-perg-num');
  const textEl = document.getElementById('pulpite-perg-text');
  const opcoesEl = document.getElementById('pulpite-opcoes');
  const progEl = document.getElementById('pulpite-progress');
  if(!numEl||!textEl||!opcoesEl||!progEl) return;
  numEl.textContent = 'Pergunta '+(pulpiteAtual+1)+' de '+PULPITE_PERGUNTAS.length;
  textEl.textContent = p.texto;
  opcoesEl.innerHTML = '';
  p.opcoes.forEach(op=>{
    const btn = document.createElement('button');
    btn.style.cssText = 'background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-md);padding:9px 12px;font-size:13px;color:var(--color-text-primary);cursor:pointer;text-align:left;width:100%;';
    btn.textContent = op.label;
    btn.onclick = ()=>responderPulpite(op.valor);
    opcoesEl.appendChild(btn);
  });
  progEl.innerHTML = '';
  for(let i=0;i<PULPITE_PERGUNTAS.length;i++){
    const d = document.createElement('div');
    d.style.cssText = 'width:8px;height:8px;border-radius:50%;background:'+(i<pulpiteAtual?'#059669':i===pulpiteAtual?'#7C3FA0':'var(--color-border-tertiary)')+';';
    progEl.appendChild(d);
  }
}

function responderPulpite(valor){
  pulpiteRespostas.push(valor);
  if(pulpiteAtual < PULPITE_PERGUNTAS.length-1){
    pulpiteAtual++;
    renderPulpitePergunta();
  } else {
    mostrarResultadoPulpite();
  }
}

function mostrarResultadoPulpite(){
  const r = pulpiteRespostas;
  let tipo = 'reversivel';
  if(r[0]==='espontanea' || r[2]==='frioAlivio' || r[3]==='sim') tipo='irreversivel';
  else if(r[1]==='longa' || r[2]==='frioPiora') tipo='transicao';

  const configs = {
    reversivel:{badge:'Pulpite Reversível',title:'Polpa com potencial de recuperação',body:'Dor provocada e de curta duração. Remover fator causal + proteção pulpar. Não indica endodontia agora — acompanhar em 30 dias.',bg:'#EAF3DE',color:'#27500A',borderColor:'#97C459'},
    transicao:{badge:'Fase de Transição',title:'Entre reversível e irreversível',body:'Quadro ambíguo — pode evoluir. Conduta conservadora com acompanhamento rigoroso. Reavaliar em 30 dias. Se piorar: endodontia.',bg:'#FAEEDA',color:'#633806',borderColor:'#EF9F27'},
    irreversivel:{badge:'Pulpite Irreversível',title:'Endodontia indicada',body:'Dano pulpar permanente. Abertura de urgência + curativo + encaminhar especialista para biopulpectomia.',bg:'#FCEBEB',color:'#791F1F',borderColor:'#F09595'}
  };

  const c = configs[tipo];
  const quiz = document.getElementById('pulpite-quiz');
  const res = document.getElementById('pulpite-resultado');
  const badge = document.getElementById('pulpite-res-badge');
  const title = document.getElementById('pulpite-res-title');
  const body = document.getElementById('pulpite-res-body');
  if(!quiz||!res||!badge||!title||!body) return;
  quiz.style.display = 'none';
  res.style.cssText = 'display:block;border-radius:var(--border-radius-md);padding:12px 14px;margin-top:8px;background:'+c.bg+';border:0.5px solid '+c.borderColor+';';
  badge.style.cssText = 'font-size:11px;font-weight:600;margin-bottom:4px;color:'+c.color+';';
  badge.textContent = c.badge;
  title.style.cssText = 'font-size:14px;font-weight:500;margin-bottom:6px;color:'+c.color+';';
  title.textContent = c.title;
  body.style.cssText = 'font-size:13px;line-height:1.5;color:'+c.color+';';
  body.textContent = c.body;
  
  // NOVO: Registrar uso do diagnóstico
  if(currentUser) {
    registrarAcaoUsuario(currentUser.uid, 'diagnostico', { 
      tipo: tipo,
      respostas: r
    });
  }
}

function resetPulpiteQuiz(){
  initPulpiteQuiz();
}
