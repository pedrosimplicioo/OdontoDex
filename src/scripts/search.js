// BUSCA
let searchSheetReturnInputId = "home-search-input";
let searchSheetStack = [];
let persistedHomeSearchValue = "";

function createHomeSearchButton(title,kind,onClick,badges){
  const btn=document.createElement("button");
  btn.className="home-search-suggestion";
  const badgeHtml=(badges||[]).map(b=>`<span class="home-search-context-badge">${escapeHtml(b)}</span>`).join("");
  btn.innerHTML=`
    <span class="home-search-suggestion-title">${escapeHtml(title)}</span>
    <span class="home-search-suggestion-meta">
      <span class="home-search-suggestion-kind">${escapeHtml(kind)}</span>
      ${badgeHtml?`<span class="home-search-context-badges">${badgeHtml}</span>`:""}
    </span>
  `;
  btn.onclick=onClick;
  return btn;
}

function getSearchProtocolTipText(tip){
  if(!tip)return "";
  if(typeof tip==="string")return tip;
  return [tip.text,tip.note].filter(Boolean).join(" ");
}

function renderSearchProtocolTip(tip){
  if(!tip)return "";
  const text=typeof tip==="string"?tip:tip.text;
  const note=typeof tip==="string"?"":tip.note;
  if(!text&&!note)return "";
  return `<div class="search-tip-card">
    ${text?`<div class="search-tip-text">${text}</div>`:""}
    ${note?`<div class="search-tip-note"><i class="ti ti-alert-circle"></i><span>${note}</span></div>`:""}
  </div>`;
}

function searchTokens(value){
  return normalizeSearchText(value).split(/\s+/).filter(t=>t.length>=2);
}

function levenshteinDistance(a,b){
  if(!a)return b.length;
  if(!b)return a.length;
  const prev=Array.from({length:b.length+1},(_,i)=>i);
  const cur=new Array(b.length+1);
  for(let i=1;i<=a.length;i++){
    cur[0]=i;
    for(let j=1;j<=b.length;j++){
      cur[j]=Math.min(
        prev[j]+1,
        cur[j-1]+1,
        prev[j-1]+(a[i-1]===b[j-1]?0:1)
      );
    }
    for(let j=0;j<=b.length;j++)prev[j]=cur[j];
  }
  return prev[b.length];
}

function fuzzyTokenScore(queryToken,itemToken){
  if(!queryToken||!itemToken)return 0;
  if(itemToken.includes(queryToken)||queryToken.includes(itemToken))return 26;
  if(queryToken.length>=3&&itemToken.length>=3){
    if(itemToken.slice(0,3)===queryToken.slice(0,3))return 18;
    const dist=levenshteinDistance(queryToken,itemToken);
    if(dist<=1)return 16;
    if(dist<=2&&Math.max(queryToken.length,itemToken.length)>=5)return 10;
  }
  return 0;
}

function scoreSearchSuggestion(item,query){
  const qTokens=searchTokens(query);
  const haystack=[
    item.title,
    item.kind,
    item.subtitle,
    item.quick,
    getSearchProtocolTipText(item.tip),
    ...(item.synonyms||[]),
    ...(item.behind||[]),
    ...(item.steps||[]),
    ...(item.errors||[])
  ].join(" ");
  const normalized=normalizeSearchText(haystack);
  const itemTokens=searchTokens(haystack);
  let score=item.baseScore||0;
  qTokens.forEach(qt=>{
    if(normalized.includes(qt))score+=30;
    let best=0;
    itemTokens.forEach(it=>{best=Math.max(best,fuzzyTokenScore(qt,it));});
    score+=best;
  });
  if(item.type==="conduct")score+=18;
  score+=(USAGE_COUNT&&item.id&&USAGE_COUNT[item.id])?Math.min(USAGE_COUNT[item.id]*6,30):0;
  return score;
}

function getRelatedSearchSuggestions(query,limit){
  const commonConductIds=["coroa-caiu","pino-nucleo-soltou","coroa-nao-entra"];
  const commonProtocolWords=["dor","urgencia","abscesso","coroa","pino","moldagem"];
  const suggestions=[
    ...Object.values(QUICK_CONDUCT_CARDS).map(card=>({
      type:"conduct",
      id:card.id,
      title:card.title,
      kind:"Conduta rápida",
      subtitle:card.subtitle,
      quick:card.quick,
      synonyms:card.synonyms,
      behind:card.behind,
      baseScore:commonConductIds.includes(card.id)?35:22
    })),
    ...Object.entries(DATA.protocols).map(([id,p])=>({
      type:"protocol",
      id,
      title:p.title,
      kind:"Protocolo",
      steps:p.steps,
      errors:p.errors,
      tip:p.tip,
      baseScore:commonProtocolWords.some(word=>normalizeSearchText(p.title).includes(word))?16:0
    }))
  ];
  return suggestions
    .map(item=>({...item,score:scoreSearchSuggestion(item,query)}))
    .filter(item=>item.score>0)
    .sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title))
    .slice(0,limit||5);
}

function renderRelatedSearchSuggestions(container,query){
  const clinical=typeof clinicalIntentSearch==="function"?clinicalIntentSearch(query,{limit:5}):null;
  const suggestions=clinical&&clinical.all.length?clinical.all:getRelatedSearchSuggestions(query,5);
  container.innerHTML='<div class="home-search-related-title">Sugestões relacionadas</div>';
  suggestions.forEach(item=>{
    const btn=createHomeSearchButton(item.title,item.kind,()=>openClinicalSearchItem(item,"home-search-input"),item.badges);
    container.appendChild(btn);
  });
}

function appendClinicalSearchGroup(container,title,items,returnInputId){
  if(!items||!items.length)return;
  if(title)container.insertAdjacentHTML("beforeend",`<div class="home-search-group-title">${escapeHtml(title)}</div>`);
  items.forEach(item=>{
    const btn=createHomeSearchButton(item.title,item.kind,()=>openClinicalSearchItem(item,returnInputId),item.badges);
    container.appendChild(btn);
  });
}

function renderClinicalSearchResults(container,result,returnInputId){
  container.innerHTML="";
  if(!result||!result.all||!result.all.length){
    renderRelatedSearchSuggestions(container,document.getElementById(returnInputId)?.value||"");
    return;
  }
  if(result.usedIntent&&result.best.length){
    appendClinicalSearchGroup(container,"Caminho mais provável",result.best,returnInputId);
    appendClinicalSearchGroup(container,"Sugestões relacionadas",result.related,returnInputId);
    return;
  }
  if(result.hasContentGap){
    appendClinicalSearchGroup(container,"Sugestões relacionadas",result.all,returnInputId);
    return;
  }
  if(result.all.every(item=>item.matchSource==="common")){
    appendClinicalSearchGroup(container,"Sugestões relacionadas",result.all,returnInputId);
    return;
  }
  appendClinicalSearchGroup(container,"",result.all,returnInputId);
}

function openClinicalSearchItem(item,returnInputId){
  searchSheetReturnInputId=returnInputId||"home-search-input";
  if(item.type==="conduct")openSearchCondutaSheet(item.id);
  else if(item.type==="prescription")openSearchPrescriptionSheet(item.id,{profile:item.profile,resetStack:true});
  else if(item.type==="profile"||item.type==="alert")openSearchPatientProfileSheet(item.id,{kind:item.kind||"Perfil clínico",resetStack:true});
  else openSearchProtocolSheet(item.id,{resetStack:true});
}

function doHomeSearch(q){
  const resDiv=document.getElementById("home-search-results");
  const clearBtn=document.getElementById("home-search-clear");
  if(!resDiv||!DATA)return;
  persistedHomeSearchValue=q;
  if(clearBtn)clearBtn.style.display=q.length>0?"block":"none";
  if(q.length<2){
    resDiv.style.display="none";
    resDiv.innerHTML="";
    return;
  }
  resDiv.style.display="block";
  resDiv.innerHTML="";
  if(typeof clinicalIntentSearch==="function"){
    const clinical=clinicalIntentSearch(q,{limit:8});
    if(clinical.all.length){
      renderClinicalSearchResults(resDiv,clinical,"home-search-input");
      return;
    }
  }
  const ql=q.trim();
  const conductFound=Object.values(QUICK_CONDUCT_CARDS).filter(card=>quickConductMatches(card, ql));
  const all=Object.entries(DATA.protocols).map(([id,p])=>({id,...p}));
  const found=all.filter(p=>protocolMatches(p, ql));
  if(conductFound.length===0 && found.length===0){
    renderRelatedSearchSuggestions(resDiv,q);
    return;
  }
  conductFound.forEach(card=>{
    const btn=createHomeSearchButton(card.title,"Conduta rápida",()=>{
      searchSheetReturnInputId="home-search-input";
      openSearchCondutaSheet(card.id);
    });
    resDiv.appendChild(btn);
  });
  found.forEach(p=>{
    const btn=createHomeSearchButton(p.title,"Protocolo",()=>{
      searchSheetReturnInputId="home-search-input";
      openSearchProtocolSheet(p.id);
    });
    resDiv.appendChild(btn);
  });
}

function showHomeResults(){
  const inp=document.getElementById("home-search-input");
  if(inp&&inp.value.length>=2)doHomeSearch(inp.value);
}

function clearHomeSearch(options){
  const shouldPreserve=options&&options.preserveValue;
  const inp=document.getElementById("home-search-input");
  const resDiv=document.getElementById("home-search-results");
  const clearBtn=document.getElementById("home-search-clear");
  if(!shouldPreserve)persistedHomeSearchValue="";
  if(inp&&!shouldPreserve)inp.value="";
  if(resDiv)resDiv.style.display="none";
  if(clearBtn&&!shouldPreserve)clearBtn.style.display="none";
}

function restoreHomeSearch(value){
  const inp=document.getElementById("home-search-input");
  const clearBtn=document.getElementById("home-search-clear");
  if(!inp)return;
  const finalValue=value||persistedHomeSearchValue||"";
  persistedHomeSearchValue=finalValue;
  inp.value=finalValue;
  if(clearBtn)clearBtn.style.display=finalValue.length>0?"block":"none";
  if(finalValue.length>=2)doHomeSearch(finalValue);
}

function hideHomeSearchResults(){
  const resDiv=document.getElementById("home-search-results");
  if(resDiv)resDiv.style.display="none";
}

function renderSearchSheetSections(sections){
  return sections.filter(section => section.items && section.items.length).map(section => `
    <section class="search-sheet-section">
      <div class="search-sheet-section-title">${section.icon?`<i class="ti ${section.icon}"></i>`:""}${section.title}</div>
      <div class="search-sheet-section-list">
        ${section.items.map(item => item).join("")}
      </div>
    </section>
  `).join("");
}

function updateSearchSheetBackButton(){
  const backBtn=document.getElementById("search-sheet-back");
  if(backBtn)backBtn.classList.toggle("visible",searchSheetStack.length>0);
}

function getCurrentSearchSheetState(){
  const kindEl=document.getElementById("search-sheet-kind");
  const titleEl=document.getElementById("search-sheet-title");
  const contentEl=document.getElementById("search-sheet-content");
  const sheet=document.getElementById("search-bottom-sheet");
  if(!kindEl||!titleEl||!contentEl)return null;
  return {
    kind:kindEl.textContent,
    title:titleEl.textContent,
    contentHtml:contentEl.innerHTML,
    scrollTop:sheet?sheet.scrollTop:0
  };
}

function openSearchBottomSheet(kind,title,contentHtml,options){
  const layer=document.getElementById("search-sheet-layer");
  const kindEl=document.getElementById("search-sheet-kind");
  const titleEl=document.getElementById("search-sheet-title");
  const contentEl=document.getElementById("search-sheet-content");
  const sheet=document.getElementById("search-bottom-sheet");
  if(!layer||!kindEl||!titleEl||!contentEl)return;
  if(options&&options.pushCurrent&&layer.classList.contains("active")){
    const currentState=getCurrentSearchSheetState();
    if(currentState)searchSheetStack.push(currentState);
  }
  if(options&&options.resetStack)searchSheetStack=[];
  kindEl.textContent=kind;
  titleEl.textContent=title;
  contentEl.innerHTML=contentHtml;
  if(sheet)sheet.scrollTop=0;
  layer.classList.add("active");
  layer.setAttribute("aria-hidden","false");
  updateSearchSheetBackButton();
  hideHomeSearchResults();
}

function goBackSearchBottomSheet(){
  const previous=searchSheetStack.pop();
  if(!previous)return;
  const kindEl=document.getElementById("search-sheet-kind");
  const titleEl=document.getElementById("search-sheet-title");
  const contentEl=document.getElementById("search-sheet-content");
  const sheet=document.getElementById("search-bottom-sheet");
  if(kindEl)kindEl.textContent=previous.kind;
  if(titleEl)titleEl.textContent=previous.title;
  if(contentEl)contentEl.innerHTML=previous.contentHtml;
  if(sheet)sheet.scrollTop=previous.scrollTop||0;
  updateSearchSheetBackButton();
}

function closeSearchBottomSheet(){
  const layer=document.getElementById("search-sheet-layer");
  if(layer){
    layer.classList.remove("active");
    layer.setAttribute("aria-hidden","true");
  }
  searchSheetStack=[];
  updateSearchSheetBackButton();
  const inp=document.getElementById(searchSheetReturnInputId)||document.getElementById("home-search-input");
  if(inp){
    inp.focus();
    if(searchSheetReturnInputId==="home-search-input"&&inp.value.length>=2)doHomeSearch(inp.value);
    if(searchSheetReturnInputId==="search-input"&&inp.value.length>=2)doSearch(inp.value);
  }
}

document.addEventListener("click",function(event){
  const wrap=document.querySelector(".home-search-wrap");
  const layer=document.getElementById("search-sheet-layer");
  if(event.target.closest && event.target.closest("#search-sheet-layer"))return;
  if(!wrap||wrap.contains(event.target))return;
  if(layer&&layer.classList.contains("active"))return;
  hideHomeSearchResults();
});

function openSearchCondutaSheet(id){
  const card=QUICK_CONDUCT_CARDS[id];
  if(!card){
    showToast("Conduta rápida não disponível","error");
    return;
  }
  currentCondutaId=id;
  const protocolButtons=(card.protocols||[]).map(proto=>`
    <button class="search-sheet-link-btn" onclick="openSearchProtocolSheet('${proto.id}')">
      <i class="ti ti-clipboard-heart"></i><span>${escapeHtml(proto.label)}</span>
    </button>
  `);
  const relatedButtons=(card.related||[]).map(rel=>{
    const enabled=rel.id&&QUICK_CONDUCT_CARDS[rel.id];
    return `
      <button class="search-sheet-link-btn ${enabled?"":"disabled"}" ${enabled?`onclick="openSearchCondutaSheet('${rel.id}')"`:""}>
        <i class="ti ti-link"></i><span>${escapeHtml(rel.label)}</span>
      </button>
    `;
  });
  const behindBlock=`
    <section class="search-sheet-section">
      <button class="search-sheet-toggle" onclick="toggleSearchCondutaBehind()">
        <span><i class="ti ti-search"></i> O que costuma estar por trás disso?</span>
        <i class="ti ti-chevron-down" id="search-conduta-behind-icon"></i>
      </button>
      <div class="search-sheet-collapsible" id="search-conduta-behind-list">
        <div class="search-sheet-text">${renderCondutaBehind(card.behind||[])}</div>
      </div>
    </section>
  `;
  const introSections=renderSearchSheetSections([
    {title:"Resposta rápida",items:[`<div class="search-sheet-text">${renderCondutaSmartText(card.quick)}</div>`]},
    {title:"Quando isso muda?",items:[`<div class="search-sheet-text">${renderCondutaSmartList(card.changes||[])}</div>`]}
  ]);
  const actionSections=renderSearchSheetSections([
    {title:"Como resolver",items:protocolButtons},
    {title:"Problemas relacionados",items:relatedButtons}
  ]);
  const content=introSections+behindBlock+actionSections;
  openSearchBottomSheet("Conduta rápida",card.title,content,{resetStack:true});
}

function openSearchProtocolSheet(id,options){
  if(!DATA)return;
  const p=DATA.protocols[id];
  if(!p){
    showToast("Protocolo não disponível","error");
    return;
  }
  if(!p.free&&!window.userIsPremium){
    closeSearchBottomSheet();
    showUpgradeModal(null);
    return;
  }
  registrarUsoProtocolo(id);
  if(currentUser){
    registrarAcaoUsuario(currentUser.uid,"open_protocol",{
      protocoloId:id,
      protocoloTitulo:p.title,
      categoria:selCat
    });
  }
  currentProtoId=id;
  HISTORY=[id,...HISTORY.filter(h=>h!==id)].slice(0,20);
  saveHistory();
  USAGE_COUNT[id]=(USAGE_COUNT[id]||0)+1;
  saveUsageCount();
  const content=renderSearchSheetSections([
    {
      title:"Passo a passo",
      items:(p.steps||[]).map((s,i)=>`<div class="search-step-row"><span class="search-step-num">${i+1}</span><span class="search-step-text">${s}</span></div>`)
    },
    {
      title:"Dica",
      icon:"ti-bulb",
      items:p.tip?[renderSearchProtocolTip(p.tip)]:[]
    },
    {
      title:"Erros que ferram",
      items:(p.errors||[]).map(e=>`<div class="search-error-row"><span class="search-error-dot">✕</span><span>${e}</span></div>`)
    },
    {
      title:"Decisão rápida",
      items:(p.decisions||[]).map(d=>`<div class="search-decision-row"><span class="search-decision-if">Se ${d.if}</span><span class="search-decision-then">${d.then||""}</span></div>`)
    },
    {
      title:"Modo Pânico",
      items:(p.panic||[]).map(item=>`<div class="search-panic-card"><div class="search-panic-prob"><i class="ti ti-bolt"></i>${item.problem}</div><div class="search-panic-sol">${item.solution||""}</div></div>`)
    }
  ]);
  openSearchBottomSheet("Protocolo",p.title,content,{
    pushCurrent:!(options&&options.resetStack),
    resetStack:!!(options&&options.resetStack)
  });
}

function getSearchPrescriptionFilter(data,preferred){
  if(!data||!data.filtros||!data.filtros.length)return "padrao";
  if(preferred&&data.filtros.includes(preferred))return preferred;
  if(preferred==="crianca"&&data.filtros.includes("moderada"))return "moderada";
  if(preferred==="gravida"&&data.filtros.includes("gravida"))return "gravida";
  return data.filtros[0];
}

function getSearchFilterLabel(filter){
  if(typeof FILTROS_LABELS!=="undefined"&&FILTROS_LABELS&&FILTROS_LABELS[filter])return FILTROS_LABELS[filter];
  const fallback={
    padrao:"Sem restrições",
    alergia:"Alergia à penicilina",
    gravida:"Grávida / Lactante",
    crianca:"Criança",
    moderada:"Infecção moderada",
    grave:"Infecção grave"
  };
  return fallback[filter]||filter;
}

function isSearchPrescriptionLocked(id){
  const item=typeof PRESCRICOES_LIST!=="undefined"?PRESCRICOES_LIST.find(rx=>rx.id===id):null;
  return !!(item&&!item.free&&!window.userIsPremium);
}

function isSearchProfileLocked(id){
  const item=typeof PACIENTES_ESPECIAIS_LIST!=="undefined"?PACIENTES_ESPECIAIS_LIST.find(profile=>profile.id===id):null;
  return !!(item&&!item.free&&!window.userIsPremium);
}

function renderSearchRxBlocks(blocks){
  return (blocks||[]).map(block=>{
    const section=block.secao||"";
    const isAlert=section.includes("⚠")||section.toUpperCase().includes("ALERTA");
    const isInfo=section.includes("ℹ");
    const blockClass=isAlert?"rx-block alert":isInfo?"rx-block info":"rx-block";
    return `
      <div class="${blockClass}">
        <div class="rx-block-head">
          <div class="rx-block-label">${section}</div>
        </div>
        <div class="rx-block-body">
          ${(block.itens||[]).map(item=>`<div class="rx-item"><span class="rx-dot">•</span><span>${item}</span></div>`).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function openSearchPrescriptionSheet(id,options){
  if(typeof PRESCRICOES_DATA==="undefined")return;
  const data=PRESCRICOES_DATA[id];
  if(!data){
    showToast("Prescrição não disponível","error");
    return;
  }
  if(isSearchPrescriptionLocked(id)){
    closeSearchBottomSheet();
    showUpgradeModal(null);
    return;
  }
  const filter=getSearchPrescriptionFilter(data,options&&options.profile);
  const blocks=data.blocos[filter]||data.blocos[data.filtros?.[0]]||data.blocos.padrao||[];
  const filterHtml=data.filtros&&data.filtros.length?`
    <section class="search-sheet-section">
      <div class="search-sheet-section-title">Perfil do paciente</div>
      <div class="search-sheet-profile-chip">${escapeHtml(getSearchFilterLabel(filter))}</div>
    </section>
  `:"";
  const aviso=typeof AVISO_LEGAL_HTML!=="undefined"?`<div class="rx-legal-note" style="margin-bottom:12px;font-size:11px;">${AVISO_LEGAL_HTML}</div>`:"";
  const content=filterHtml+`<section class="search-sheet-section search-sheet-rx-section">${renderSearchRxBlocks(blocks)}</section>`+aviso;
  openSearchBottomSheet("Prescrição",data.titulo,content,{
    pushCurrent:!(options&&options.resetStack),
    resetStack:!!(options&&options.resetStack)
  });
}

function openSearchPatientProfileSheet(id,options){
  if(typeof PACIENTES_ESPECIAIS_DATA==="undefined")return;
  const data=PACIENTES_ESPECIAIS_DATA[id];
  if(!data){
    showToast("Perfil clínico não disponível","error");
    return;
  }
  if(isSearchProfileLocked(id)){
    closeSearchBottomSheet();
    showUpgradeModal(null);
    return;
  }
  const aviso=typeof AVISO_LEGAL_HTML!=="undefined"?`<div class="rx-legal-note" style="margin-bottom:12px;font-size:11px;">${AVISO_LEGAL_HTML}</div>`:"";
  const content=`<section class="search-sheet-section search-sheet-rx-section">${renderSearchRxBlocks(data.blocos||[])}</section>`+aviso;
  openSearchBottomSheet((options&&options.kind)||"Perfil clínico",data.titulo,content,{
    pushCurrent:!(options&&options.resetStack),
    resetStack:!!(options&&options.resetStack)
  });
}

function toggleSearchCondutaBehind(){
  const list=document.getElementById("search-conduta-behind-list");
  const icon=document.getElementById("search-conduta-behind-icon");
  if(!list)return;
  const willOpen=!list.classList.contains("open");
  list.classList.toggle("open",willOpen);
  if(icon)icon.className=willOpen?"ti ti-chevron-up":"ti ti-chevron-down";
}

function doSearch(q){
  if(!DATA)return;
  const res=document.getElementById("search-results");
  if(!res)return;
  if(q.length<2){res.innerHTML='<p class="empty-msg">Digite pelo menos 2 letras</p>';return;}
  
  // NOVO: Registrar busca (se tiver pelo menos 2 caracteres)
  if(currentUser && q && q.length >= 2) {
    registrarAcaoUsuario(currentUser.uid, 'search', { termo: q });
  }

  if(typeof clinicalIntentSearch==="function"){
    const clinical=clinicalIntentSearch(q,{limit:10});
    if(clinical.all.length){
      renderClinicalSearchResults(res,clinical,"search-input");
      return;
    }
  }
  
  const ql=q.toLowerCase();
  const all=Object.entries(DATA.protocols).map(([id,p])=>({id,...p}));
  const found=all.filter(p=>
    p.title?.toLowerCase().includes(ql)||
    p.steps?.some(s=>s.toLowerCase().includes(ql))||
    getSearchProtocolTipText(p.tip).toLowerCase().includes(ql)||
    p.errors?.some(e=>e.toLowerCase().includes(ql))||
    p.decisions?.some(d=>(d.if||'').toLowerCase().includes(ql)||(d.then||'').toLowerCase().includes(ql))
  );
  if(found.length===0){
    renderRelatedSearchSuggestions(res,q);
    return;
  }
  res.innerHTML="";
  found.forEach(p=>{
    const btn=createHomeSearchButton(p.title,"Protocolo",()=>{
      searchSheetReturnInputId="search-input";
      openSearchProtocolSheet(p.id,{resetStack:true});
    });
    res.appendChild(btn);
  });
}

// SHARE
