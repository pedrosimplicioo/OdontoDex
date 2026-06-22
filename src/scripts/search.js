// BUSCA
let searchSheetReturnInputId = "home-search-input";
let searchSheetStack = [];
let persistedHomeSearchValue = "";
let searchLogTimer = null;
let homeSearchPlaceholderTimer = null;
let homeSearchPlaceholderIndex = 0;
let searchSheetDragState = null;
let homeTrendingRecordTimer = null;

const HOME_TRENDING_FALLBACK = [
  { key: "coroa-caiu", label: "Coroa caiu", query: "coroa caiu", icon: "ti-crown" },
  { key: "dente-sensivel", label: "Dente sensível", query: "dente sensível", icon: "ti-dental" },
  { key: "gestante", label: "Gestante", query: "gestante", icon: "ti-baby-carriage" },
  { key: "sangramento", label: "Sangramento", query: "sangramento", icon: "ti-droplet" },
  { key: "anestesia-nao-pega", label: "Anestesia não pega", query: "anestesia não pega", icon: "ti-needle" },
];

const HOME_TRENDING_PATTERNS = [
  { re: /\b(coroa caiu|coroa soltou|coroa saiu|coroa)\b/, item: HOME_TRENDING_FALLBACK[0] },
  { re: /\b(dente sensivel|sensibilidade|sensivel|gelado|frio)\b/, item: HOME_TRENDING_FALLBACK[1] },
  { re: /\b(gestante|gravida|grávida|lactante)\b/, item: HOME_TRENDING_FALLBACK[2] },
  { re: /\b(sangramento|sangra|sangrando|hemorragia|sangue)\b/, item: HOME_TRENDING_FALLBACK[3] },
  { re: /\b(anestesia nao pega|anestesia não pega|nao anestesia|não anestesia)\b/, item: HOME_TRENDING_FALLBACK[4] },
];

const HOME_SEARCH_PLACEHOLDERS = [
  "Ex.: A coroa caiu",
  "Ex.: Gestante pode tomar...",
  "Ex.: Anestesia não pega",
  "Ex.: Sangramento",
  "Ex.: Dente sensível",
  "Ex.: Paciente anticoagulado...",
  "Ex.: Fio dental não passa",
  "Ex.: Dor ao mastigar"
];

function normalizarHomeTrendingTerm(value){
  const raw = String(value || "").trim();
  const normalized = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if(normalized.length < 2) return null;
  const found = HOME_TRENDING_PATTERNS.find(entry => entry.re.test(normalized));
  return found ? found.item : null;
}

function getHomeTrendingCounts(){
  try {
    return JSON.parse(localStorage.getItem("odontodex_home_trending_searches") || "{}");
  } catch(e) {
    return {};
  }
}

function saveHomeTrendingCounts(counts){
  try {
    localStorage.setItem("odontodex_home_trending_searches", JSON.stringify(counts));
  } catch(e) {}
}

function recordHomeTrendingSearch(value){
  const item = normalizarHomeTrendingTerm(value);
  if(!item) return;
  const counts = getHomeTrendingCounts();
  counts[item.key] = (counts[item.key] || 0) + 1;
  saveHomeTrendingCounts(counts);
  renderHomeTrendingSearches();
}

function scheduleHomeTrendingRecord(value){
  clearTimeout(homeTrendingRecordTimer);
  homeTrendingRecordTimer = setTimeout(() => recordHomeTrendingSearch(value), 900);
}

function openHomeTrendingSearch(query){
  const input = document.getElementById("home-search-input");
  if(!input) return;
  input.value = query;
  persistedHomeSearchValue = query;
  homeSearchQueuedValue = query;
  setHomeSearchFocusMode(true);
  input.focus();
  doHomeSearch(query);
  recordHomeTrendingSearch(query);
}

function renderHomeTrendingSearches(){
  const row = document.getElementById("home-trending-row");
  if(!row) return;
  const counts = getHomeTrendingCounts();
  const sorted = [...HOME_TRENDING_FALLBACK].sort((a,b) => (counts[b.key] || 0) - (counts[a.key] || 0));
  row.innerHTML = sorted.map(item => `
    <button class="home-trending-chip" type="button" onclick="openHomeTrendingSearch('${escapeHtml(item.query)}')">
      <i class="ti ${escapeHtml(item.icon)}"></i>${escapeHtml(item.label)}
    </button>
  `).join("");
}

function updateHomeSearchPlaceholder(){
  const input = document.getElementById("home-search-input");
  if(!input || input.value) return;
  input.placeholder = HOME_SEARCH_PLACEHOLDERS[homeSearchPlaceholderIndex % HOME_SEARCH_PLACEHOLDERS.length];
  homeSearchPlaceholderIndex++;
}

function initHomeSearchPlaceholderRotation(){
  if(homeSearchPlaceholderTimer) return;
  updateHomeSearchPlaceholder();
  homeSearchPlaceholderTimer = setInterval(updateHomeSearchPlaceholder, 4200);
}

function syncHomeHeaderCompact(){
  const header = document.getElementById("main-header");
  const body = document.getElementById("home-body");
  if(!header || !body) return;
  header.classList.toggle("home-compact", body.scrollTop > 18);
}

function initHomeHeaderBehavior(){
  const body = document.getElementById("home-body");
  if(!body) return;
  body.addEventListener("scroll", syncHomeHeaderCompact, { passive: true });
  syncHomeHeaderCompact();
}

function setHomeSearchFocusMode(active){
  const appScreen = document.getElementById("screen-app");
  if(appScreen) appScreen.classList.toggle("home-search-focused", !!active);
}

function handleHomeSearchBlur(){
  setTimeout(() => {
    const active = document.activeElement;
    const searchWrap = document.querySelector(".home-search-wrap");
    if(searchWrap && active && searchWrap.contains(active)) return;
    setHomeSearchFocusMode(false);
  }, 120);
}

document.addEventListener("DOMContentLoaded", () => {
  initHomeSearchPlaceholderRotation();
  initHomeHeaderBehavior();
  renderHomeTrendingSearches();
  initSearchSheetDragToClose();
  const input = document.getElementById("home-search-input");
  if(input) input.addEventListener("blur", handleHomeSearchBlur);
});

function createHomeSearchButton(title,kind,onClick,badges,options){
  const btn=document.createElement("button");
  const locked=!!(options&&options.locked);
  btn.className="home-search-suggestion"+(locked?" is-premium-locked":"");
  if(locked)btn.setAttribute("aria-label",`${title} - Premium`);
  const badgeHtml=(badges||[]).map(b=>`<span class="home-search-context-badge">${escapeHtml(b)}</span>`).join("");
  const lockHtml=locked?'<span class="home-search-premium-lock"><i class="ti ti-lock"></i><span>Premium</span></span>':"";
  btn.innerHTML=`
    <span class="home-search-suggestion-head">
      <span class="home-search-suggestion-title">${escapeHtml(title)}</span>
      ${lockHtml}
    </span>
    <span class="home-search-suggestion-meta">
      <span class="home-search-suggestion-kind">${escapeHtml(kind)}</span>
      ${badgeHtml?`<span class="home-search-context-badges">${badgeHtml}</span>`:""}
    </span>
  `;
  btn.onclick=onClick;
  return btn;
}

function isSearchProtocolLocked(id){
  if(typeof isProtocolLocked==="function")return isProtocolLocked(id);
  const protocol=DATA&&DATA.protocols?DATA.protocols[id]:null;
  return !!(protocol&&protocol.free===false&&!window.userIsPremium);
}

function isClinicalSearchItemLocked(item){
  if(!item||window.userIsPremium)return false;
  if(item.free===false)return true;
  if(item.type==="conduct")return typeof isQuickConductLocked==="function"&&isQuickConductLocked(item.id);
  if(item.type==="protocol")return isSearchProtocolLocked(item.id);
  if(item.type==="prescription")return typeof isSearchPrescriptionLocked==="function"&&isSearchPrescriptionLocked(item.id);
  if(item.type==="profile"||item.type==="alert")return typeof isSearchProfileLocked==="function"&&isSearchProfileLocked(item.id);
  if(item.type==="anesthetic")return typeof isSearchAnestheticLocked==="function"&&isSearchAnestheticLocked(item.id);
  return false;
}

function openPremiumFromSearchSuggestion(){
  setHomeSearchFocusMode(false);
  closeSearchBottomSheet();
  const res=document.getElementById("home-search-results");
  if(res)closeHomeSearchResults(res);
  showUpgradeModal(null);
}

function createClinicalSearchButton(item,returnInputId){
  const locked=isClinicalSearchItemLocked(item);
  return createHomeSearchButton(
    item.title,
    item.kind,
    locked?openPremiumFromSearchSuggestion:()=>openClinicalSearchItem(item,returnInputId),
    item.badges,
    {locked}
  );
}

let homeSearchRenderTimer=null;
let homeSearchQueuedValue="";

function animateHomeSearchResults(container){
  if(!container)return;
  if(container.dataset.homeSearchOpened==="1")return;
  container.dataset.homeSearchOpened="1";
  container.classList.remove("home-search-results-animating");
  void container.offsetWidth;
  container.classList.add("home-search-results-animating");
  container.querySelectorAll(".home-search-suggestion,.home-search-related-title,.home-search-group-title,.home-search-empty").forEach((item,index)=>{
    item.style.setProperty("--home-search-item-delay",`${Math.min(index*24,120)}ms`);
  });
  clearTimeout(container.__homeSearchAnimationTimer);
  container.__homeSearchAnimationTimer=setTimeout(()=>{
    container.classList.remove("home-search-results-animating");
  },320);
}

function closeHomeSearchResults(container){
  if(!container)return;
  clearTimeout(homeSearchRenderTimer);
  clearTimeout(container.__homeSearchAnimationTimer);
  container.style.display="none";
  container.classList.remove("home-search-results-animating");
  delete container.dataset.homeSearchOpened;
  container.innerHTML="";
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
    item.intent,
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
      free:typeof isQuickConductFree==="function"?isQuickConductFree(card.id):card.free,
      subtitle:card.subtitle,
      intent:card.intent,
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
      free:typeof isProtocolFree==="function"?isProtocolFree(id):p.free,
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
    const btn=createClinicalSearchButton(item,"home-search-input");
    container.appendChild(btn);
  });
  animateHomeSearchResults(container);
}

function renderWeakClinicalSearchState(container,returnInputId){
  const commonPaths=[
    {label:"Dor",query:"dor"},
    {label:"Infecção",query:"abscesso"},
    {label:"Sangramento",query:"sangramento"},
    {label:"Coroa / prótese",query:"coroa caiu"},
    {label:"Prescrição",query:"prescrição"},
    {label:"Anestesia",query:"anestesia não pega"}
  ];
  container.innerHTML=`
    <div class="home-search-empty">
      <strong>Não identifiquei um termo clínico claro</strong>
      <span>Tente buscar pelo problema, sintoma, procedimento ou perfil do paciente.</span>
    </div>
    <div class="home-search-group-title">Caminhos clínicos comuns</div>
  `;
  commonPaths.forEach(path=>{
    const btn=createHomeSearchButton(path.label,"Caminho clínico comum",()=>{
      const input=document.getElementById(returnInputId||"home-search-input");
      if(input){
        input.value=path.query;
        input.focus();
      }
      if(returnInputId==="search-input"&&typeof doSearch==="function")doSearch(path.query);
      else doHomeSearch(path.query);
    });
    container.appendChild(btn);
  });
  animateHomeSearchResults(container);
}

function appendClinicalSearchGroup(container,title,items,returnInputId){
  if(!items||!items.length)return;
  if(title)container.insertAdjacentHTML("beforeend",`<div class="home-search-group-title">${escapeHtml(title)}</div>`);
  items.forEach(item=>{
    const btn=createClinicalSearchButton(item,returnInputId);
    container.appendChild(btn);
  });
}

function appendClinicalSearchTypedGroups(container,items,returnInputId,searchMode){
  if(!items||!items.length)return;
  const used=new Set();
  const groupMap={
    alert:{title:"Alertas importantes",filter:item=>item.type==="alert"},
    conduct:{title:"Pode envolver",filter:item=>item.type==="conduct"||item.type==="anesthetic"},
    profile:{title:"Perfil que muda a conduta",filter:item=>item.type==="profile"},
    prescription:{title:"Prescrições relacionadas",filter:item=>item.type==="prescription"},
    protocol:{title:"Protocolos relacionados",filter:item=>item.type==="protocol"}
  };
  const groupOrderByMode={
    protocol:["protocol","conduct","profile","prescription","alert"],
    prescription:["prescription","profile","alert","conduct","protocol"],
    profile:["alert","profile","prescription","conduct","protocol"],
    mixed:["alert","conduct","profile","prescription","protocol"],
    problem:["conduct","protocol","alert","profile","prescription"]
  };
  const groups=(groupOrderByMode[searchMode]||groupOrderByMode.problem).map(key=>groupMap[key]);
  groups.forEach(group=>{
    const groupItems=items.filter(item=>!used.has(item.type+":"+item.id)&&group.filter(item));
    groupItems.forEach(item=>used.add(item.type+":"+item.id));
    appendClinicalSearchGroup(container,group.title,groupItems,returnInputId);
  });
  const remaining=items.filter(item=>!used.has(item.type+":"+item.id));
  appendClinicalSearchGroup(container,"Sugestões relacionadas",remaining,returnInputId);
}

function renderClinicalSearchResults(container,result,returnInputId){
  container.innerHTML="";
  if(result&&(result.confidence==="none"||result.confidence==="low"||result.fallbackOnly)){
    renderWeakClinicalSearchState(container,returnInputId);
    return;
  }
  if(!result||!result.all||!result.all.length){
    renderWeakClinicalSearchState(container,returnInputId);
    return;
  }
  if(result.usedIntent&&result.best.length){
    if(result.searchMode==="mixed"){
      container.insertAdjacentHTML("beforeend",`<div class="home-search-empty"><strong>Sua busca envolve mais de um fator clínico</strong><span>Separei o problema principal, perfis do paciente e conteúdos relacionados.</span></div>`);
    }
    appendClinicalSearchGroup(container,"Comece por aqui",result.best,returnInputId);
    appendClinicalSearchTypedGroups(container,result.related,returnInputId,result.searchMode);
    animateHomeSearchResults(container);
    return;
  }
  if(result.searchMode==="mixed"||(result.matchedTerms&&result.matchedTerms.length>1)){
    container.insertAdjacentHTML("beforeend",`<div class="home-search-empty"><strong>Sua busca envolve mais de um fator clínico</strong><span>Separei o problema principal, perfis do paciente e conteúdos relacionados.</span></div>`);
  }
  if(result.hasContentGap){
    appendClinicalSearchTypedGroups(container,result.all,returnInputId,result.searchMode);
    animateHomeSearchResults(container);
    return;
  }
  if(result.all.every(item=>item.matchSource==="common")){
    renderWeakClinicalSearchState(container,returnInputId);
    animateHomeSearchResults(container);
    return;
  }
  appendClinicalSearchTypedGroups(container,result.all,returnInputId,result.searchMode);
  animateHomeSearchResults(container);
}

function openClinicalSearchItem(item,returnInputId){
  setHomeSearchFocusMode(false);
  searchSheetReturnInputId=returnInputId||"home-search-input";
  if(item.type==="conduct")openSearchCondutaSheet(item.id);
  else if(item.type==="prescription")openSearchPrescriptionSheet(item.id,{profile:item.profile,resetStack:true});
  else if(item.type==="profile"||item.type==="alert")openSearchPatientProfileSheet(item.id,{kind:item.kind||"Perfil clínico",resetStack:true});
  else if(item.type==="anesthetic")openSearchAnestheticSheet(item.id,{resetStack:true});
  else openSearchProtocolSheet(item.id,{resetStack:true});
}

function renderHomeSearchQuery(q,resDiv){
  if(!resDiv||!DATA||homeSearchQueuedValue!==q)return;
  if(q.length<2){
    closeHomeSearchResults(resDiv);
    return;
  }
  resDiv.innerHTML="";
  if(typeof clinicalIntentSearch==="function"){
    const clinical=clinicalIntentSearch(q,{limit:8});
    if(clinical.all.length||clinical.fallbackOnly||clinical.confidence==="none"||clinical.confidence==="low"){
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
    const item={type:"conduct",id:card.id,title:card.title,kind:"Conduta rápida",free:card.free};
    const locked=isClinicalSearchItemLocked(item);
    const btn=createHomeSearchButton(card.title,"Conduta rápida",locked?openPremiumFromSearchSuggestion:()=>{
      setHomeSearchFocusMode(false);
      searchSheetReturnInputId="home-search-input";
      openSearchCondutaSheet(card.id);
    },null,{locked});
    resDiv.appendChild(btn);
  });
  found.forEach(p=>{
    const item={type:"protocol",id:p.id,title:p.title,kind:"Protocolo",free:p.free};
    const locked=isClinicalSearchItemLocked(item);
    const btn=createHomeSearchButton(p.title,"Protocolo",locked?openPremiumFromSearchSuggestion:()=>{
      setHomeSearchFocusMode(false);
      searchSheetReturnInputId="home-search-input";
      openSearchProtocolSheet(p.id);
    },null,{locked});
    resDiv.appendChild(btn);
  });
  animateHomeSearchResults(resDiv);
}

function doHomeSearch(q){
  const resDiv=document.getElementById("home-search-results");
  const clearBtn=document.getElementById("home-search-clear");
  if(!resDiv||!DATA)return;
  persistedHomeSearchValue=q;
  homeSearchQueuedValue=q;
  if(clearBtn)clearBtn.style.display=q.length>0?"block":"none";
  if(q.length<2){
    clearTimeout(homeTrendingRecordTimer);
    closeHomeSearchResults(resDiv);
    return;
  }
  scheduleHomeTrendingRecord(q);
  resDiv.style.display="block";
  clearTimeout(homeSearchRenderTimer);
  const hasVisibleResults=resDiv.innerHTML.trim().length>0;
  homeSearchRenderTimer=setTimeout(()=>renderHomeSearchQuery(q,resDiv),hasVisibleResults?140:0);
}

function showHomeResults(){
  setHomeSearchFocusMode(true);
  const inp=document.getElementById("home-search-input");
  if(inp&&inp.value.length>=2)doHomeSearch(inp.value);
}

function clearHomeSearch(options){
  const shouldPreserve=options&&options.preserveValue;
  const inp=document.getElementById("home-search-input");
  const resDiv=document.getElementById("home-search-results");
  const clearBtn=document.getElementById("home-search-clear");
  if(!shouldPreserve)persistedHomeSearchValue="";
  if(!shouldPreserve)homeSearchQueuedValue="";
  if(inp&&!shouldPreserve)inp.value="";
  if(resDiv)closeHomeSearchResults(resDiv);
  if(clearBtn&&!shouldPreserve)clearBtn.style.display="none";
  if(!shouldPreserve) setHomeSearchFocusMode(false);
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
  setHomeSearchFocusMode(false);
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
  const sheet=document.getElementById("search-bottom-sheet");
  const hasBack=searchSheetStack.length>0;
  if(backBtn)backBtn.classList.toggle("visible",hasBack);
  if(sheet)sheet.classList.toggle("has-back",hasBack);
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
    titleHtml:titleEl.innerHTML,
    contentHtml:contentEl.innerHTML,
    scrollTop:sheet?sheet.scrollTop:0
  };
}

function resetSearchSheetDrag(sheet,backdrop){
  if(sheet){
    sheet.classList.remove("search-sheet-dragging","search-sheet-snap-back","search-sheet-drag-closing","search-sheet-closing");
    sheet.style.removeProperty("transform");
    sheet.style.removeProperty("opacity");
  }
  if(backdrop)backdrop.style.removeProperty("opacity");
}

function finishSearchSheetDragClose(sheet,backdrop){
  if(!sheet)return;
  sheet.classList.remove("search-sheet-dragging","search-sheet-snap-back");
  sheet.classList.add("search-sheet-drag-closing");
  sheet.style.transform="translate(-50%, calc(100% + 36px))";
  sheet.style.opacity="0";
  if(backdrop)backdrop.style.opacity="0";
  clearTimeout(sheet.__searchSheetDragCloseTimer);
  sheet.__searchSheetDragCloseTimer=setTimeout(()=>{
    resetSearchSheetDrag(sheet,backdrop);
    closeSearchBottomSheet({immediate:true});
  },240);
}

function settleSearchSheetDrag(sheet,backdrop){
  if(!sheet)return;
  sheet.classList.remove("search-sheet-dragging");
  sheet.classList.add("search-sheet-snap-back");
  sheet.style.transform="translate(-50%, 0)";
  sheet.style.opacity="1";
  if(backdrop)backdrop.style.opacity="1";
  clearTimeout(sheet.__searchSheetDragSettleTimer);
  sheet.__searchSheetDragSettleTimer=setTimeout(()=>resetSearchSheetDrag(sheet,backdrop),260);
}

function initSearchSheetDragToClose(){
  const handle=document.getElementById("search-sheet-handle");
  const layer=document.getElementById("search-sheet-layer");
  const sheet=document.getElementById("search-bottom-sheet");
  if(!handle||!layer||!sheet||handle.dataset.dragReady==="1")return;
  handle.dataset.dragReady="1";
  const getBackdrop=()=>layer.querySelector(".search-sheet-backdrop");
  handle.addEventListener("keydown",(event)=>{
    if(event.key==="Enter"||event.key===" "){
      event.preventDefault();
      closeSearchBottomSheet();
    }
  });
  handle.addEventListener("pointerdown",(event)=>{
    if(!layer.classList.contains("active"))return;
    event.preventDefault();
    clearTimeout(sheet.__searchSheetDragSettleTimer);
    clearTimeout(sheet.__searchSheetDragCloseTimer);
    sheet.classList.remove("search-sheet-entering","search-sheet-snap-back","search-sheet-drag-closing");
    sheet.classList.add("search-sheet-dragging");
    searchSheetDragState={
      startY:event.clientY,
      lastY:event.clientY,
      lastTime:performance.now(),
      velocity:0,
      pointerId:event.pointerId
    };
    try{handle.setPointerCapture(event.pointerId);}catch(e){}
  });
  handle.addEventListener("pointermove",(event)=>{
    if(!searchSheetDragState||searchSheetDragState.pointerId!==event.pointerId)return;
    event.preventDefault();
    const now=performance.now();
    const rawDelta=event.clientY-searchSheetDragState.startY;
    const delta=rawDelta<0?rawDelta*0.18:rawDelta;
    const elapsed=Math.max(now-searchSheetDragState.lastTime,1);
    searchSheetDragState.velocity=(event.clientY-searchSheetDragState.lastY)/elapsed;
    searchSheetDragState.lastY=event.clientY;
    searchSheetDragState.lastTime=now;
    const backdrop=getBackdrop();
    sheet.style.transform=`translate(-50%, ${Math.max(delta,-10)}px)`;
    sheet.style.opacity=String(1-Math.min(Math.max(delta,0)/520,0.24));
    if(backdrop)backdrop.style.opacity=String(1-Math.min(Math.max(delta,0)/360,0.46));
  });
  const finishDrag=(event)=>{
    if(!searchSheetDragState||searchSheetDragState.pointerId!==event.pointerId)return;
    const delta=event.clientY-searchSheetDragState.startY;
    const shouldClose=delta>118||searchSheetDragState.velocity>0.72;
    const backdrop=getBackdrop();
    try{handle.releasePointerCapture(event.pointerId);}catch(e){}
    searchSheetDragState=null;
    if(shouldClose)finishSearchSheetDragClose(sheet,backdrop);
    else settleSearchSheetDrag(sheet,backdrop);
  };
  handle.addEventListener("pointerup",finishDrag);
  handle.addEventListener("pointercancel",finishDrag);
}

function playSearchSheetEntry(layer,sheet,kindEl,titleEl,contentEl,wasActive){
  if(sheet&&!wasActive){
    sheet.classList.remove("search-sheet-entering");
    void sheet.offsetWidth;
    sheet.classList.add("search-sheet-entering");
    clearTimeout(sheet.__searchSheetEntryTimer);
    sheet.__searchSheetEntryTimer=setTimeout(()=>sheet.classList.remove("search-sheet-entering"),520);
  }
  [kindEl,titleEl,contentEl].forEach((el,index)=>{
    if(!el)return;
    el.classList.remove("search-sheet-content-enter");
    el.style.setProperty("--search-sheet-entry-delay",`${70+(index*35)}ms`);
    void el.offsetWidth;
    el.classList.add("search-sheet-content-enter");
    clearTimeout(el.__searchSheetContentTimer);
    el.__searchSheetContentTimer=setTimeout(()=>el.classList.remove("search-sheet-content-enter"),560);
  });
  if(contentEl){
    Array.from(contentEl.children).forEach((child,index)=>{
      child.classList.remove("search-sheet-block-enter");
      child.style.setProperty("--search-sheet-entry-delay",`${130+(index*45)}ms`);
      void child.offsetWidth;
      child.classList.add("search-sheet-block-enter");
      clearTimeout(child.__searchSheetBlockTimer);
      child.__searchSheetBlockTimer=setTimeout(()=>child.classList.remove("search-sheet-block-enter"),640);
    });
  }
}

function openSearchBottomSheet(kind,title,contentHtml,options){
  const layer=document.getElementById("search-sheet-layer");
  const kindEl=document.getElementById("search-sheet-kind");
  const titleEl=document.getElementById("search-sheet-title");
  const contentEl=document.getElementById("search-sheet-content");
  const sheet=document.getElementById("search-bottom-sheet");
  if(!layer||!kindEl||!titleEl||!contentEl)return;
  const wasActive=layer.classList.contains("active");
  clearTimeout(sheet?.__searchSheetCloseTimer);
  layer.classList.remove("search-sheet-closing");
  resetSearchSheetDrag(sheet,layer.querySelector(".search-sheet-backdrop"));
  if(options&&options.pushCurrent&&layer.classList.contains("active")){
    const currentState=getCurrentSearchSheetState();
    if(currentState)searchSheetStack.push(currentState);
  }
  if(options&&options.resetStack)searchSheetStack=[];
  kindEl.textContent=kind;
  titleEl.innerHTML=`<span class="search-sheet-title-text">${escapeHtml(title)}</span>${options?.titleActionHtml||""}`;
  contentEl.innerHTML=contentHtml;
  if(sheet)sheet.scrollTop=0;
  layer.classList.add("active");
  layer.setAttribute("aria-hidden","false");
  updateSearchSheetBackButton();
  playSearchSheetEntry(layer,sheet,kindEl,titleEl,contentEl,wasActive);
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
  if(titleEl)titleEl.innerHTML=previous.titleHtml||escapeHtml(previous.title||"");
  if(contentEl)contentEl.innerHTML=previous.contentHtml;
  if(sheet)sheet.scrollTop=previous.scrollTop||0;
  updateSearchSheetBackButton();
}

function completeSearchBottomSheetClose(layer,sheet,backdrop){
  resetSearchSheetDrag(sheet,backdrop);
  if(layer){
    layer.classList.remove("active","search-sheet-closing");
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

function closeSearchBottomSheet(options){
  const layer=document.getElementById("search-sheet-layer");
  const sheet=document.getElementById("search-bottom-sheet");
  const backdrop=layer?layer.querySelector(".search-sheet-backdrop"):null;
  if(!layer||!sheet){
    completeSearchBottomSheetClose(layer,sheet,backdrop);
    return;
  }
  clearTimeout(sheet.__searchSheetCloseTimer);
  if(options&&options.immediate){
    completeSearchBottomSheetClose(layer,sheet,backdrop);
    return;
  }
  if(!layer.classList.contains("active")||layer.classList.contains("search-sheet-closing"))return;
  sheet.classList.remove("search-sheet-entering","search-sheet-dragging","search-sheet-snap-back");
  sheet.classList.add("search-sheet-closing");
  layer.classList.add("search-sheet-closing");
  sheet.style.transform="translate(-50%, calc(100% + 36px))";
  sheet.style.opacity="0";
  if(backdrop)backdrop.style.opacity="0";
  sheet.__searchSheetCloseTimer=setTimeout(()=>{
    completeSearchBottomSheetClose(layer,sheet,backdrop);
  },260);
}

document.addEventListener("click",function(event){
  const wrap=document.querySelector(".home-search-wrap");
  const layer=document.getElementById("search-sheet-layer");
  if(event.target.closest && event.target.closest("#search-sheet-layer"))return;
  if(!wrap||wrap.contains(event.target))return;
  if(layer&&layer.classList.contains("active"))return;
  hideHomeSearchResults();
});

function openSearchCondutaAction(type,id){
  const actionType=type||"protocol";
  if(actionType==="protocol"){
    openSearchProtocolSheet(id);
    return;
  }
  if(actionType==="conduct"){
    openSearchCondutaSheet(id);
    return;
  }
  if(actionType==="tool"&&typeof openClinicalTool==="function"){
    closeSearchBottomSheet();
    openClinicalTool(id);
    return;
  }
  if(actionType==="tab"&&id==="anestesicos"){
    closeSearchBottomSheet();
    if(typeof openPrescricoesAnestesicosFromCard==="function") openPrescricoesAnestesicosFromCard();
  }
}

function renderSearchCondutaActionButton(action){
  const type=action.type||"protocol";
  const disabled=type==="note"||!action.id;
  const icon=type==="conduct"?"ti-link":type==="tool"?"ti-tools":type==="tab"?"ti-layout-list":type==="note"?"ti-info-circle":"ti-clipboard-heart";
  const parsed=typeof parseCondutaActionLabel==="function"?parseCondutaActionLabel(action.label):{condition:action.label,target:action.label};
  const openLabel=typeof getCondutaActionOpenLabel==="function"?getCondutaActionOpenLabel(type):"Abrir protocolo de";
  if(type==="note"){
    return `
      <div class="search-sheet-link-btn search-next-step-btn conduta-next-step-btn disabled">
        <div class="conduta-next-step-rule"><i class="ti ${icon}"></i><span>${escapeHtml(parsed.condition)}</span></div>
        ${parsed.target&&parsed.target!==parsed.condition?`<div class="conduta-next-step-note">${escapeHtml(parsed.target)}</div>`:""}
      </div>
    `;
  }
  return `
    <button class="search-sheet-link-btn search-next-step-btn conduta-next-step-btn ${disabled?"disabled":""}" ${disabled?"":`onclick="openSearchCondutaAction('${type}','${action.id}')"`}>
      <div class="conduta-next-step-rule"><i class="ti ti-alert-circle"></i><span>${escapeHtml(parsed.condition)}</span></div>
      <div class="conduta-next-step-open">
        <span>
          <span class="conduta-next-step-open-label">${escapeHtml(openLabel)}</span>
          <span class="conduta-next-step-open-title">${escapeHtml(parsed.target)}</span>
        </span>
        <i class="ti ti-chevron-right conduta-next-step-action"></i>
      </div>
    </button>
  `;
}

function openSearchCondutaSheet(id){
  const card=QUICK_CONDUCT_CARDS[id];
  if(!card){
    showToast("Conduta rápida não disponível","error");
    return;
  }
  if(typeof isQuickConductLocked==="function"&&isQuickConductLocked(id)){
    closeSearchBottomSheet();
    showUpgradeModal(null);
    return;
  }
  currentCondutaId=id;
  const isFav=typeof isFavorite==="function"&&isFavorite("conduct",id);
  const favoriteControl=`
    <button class="search-sheet-fav-btn ${isFav?"active":""}" data-fav-type="conduct" data-fav-id="${escapeHtml(id)}" onclick="toggleTypedFavorite('conduct','${id}')" aria-label="Favoritar conduta">
      ${isFav?'<i class="ti ti-star-filled"></i>':'<i class="ti ti-star"></i>'}
    </button>
  `;
  const protocolButtons=(card.protocols||[]).map(renderSearchCondutaActionButton);
  const relatedButtons=(card.related||[]).map(rel=>{
    const enabled=rel.id&&QUICK_CONDUCT_CARDS[rel.id];
    return `
      <button class="search-sheet-link-btn ${enabled?"":"disabled"}" ${enabled?`onclick="openSearchCondutaSheet('${rel.id}')"`:""}>
        <i class="ti ti-link"></i><span>${escapeHtml(rel.label)}</span>
      </button>
    `;
  });
  const behindBlock=(card.behind||[]).length?`
    <section class="search-sheet-section">
      <button class="search-sheet-toggle" onclick="toggleSearchCondutaBehind()">
        <span><i class="ti ti-search"></i> ${escapeHtml(card.behindLabel||"O que costuma estar por trás disso?")}</span>
        <i class="ti ti-chevron-down" id="search-conduta-behind-icon"></i>
      </button>
      <div class="search-sheet-collapsible" id="search-conduta-behind-list">
        <div class="search-sheet-text">${renderCondutaBehind(card.behind||[])}</div>
      </div>
    </section>
  `:"";
  const introSections=renderSearchSheetSections([
    {title:card.quickLabel||"Resposta rápida",items:[`<div class="search-sheet-text">${renderCondutaSmartText(card.quick)}</div>`]},
    {title:card.changesLabel||"Quando isso muda?",items:(card.changes||[]).length?[`<div class="search-sheet-text">${renderCondutaSmartList(card.changes||[])}</div>`]:[]},
    {
      title:card.tool?.title||"Ferramenta auxiliar",
      icon:card.tool?.icon||"ti-tool",
      items:card.tool?[`
        <div class="search-sheet-text">${escapeHtml((parseCondutaLine(card.tool.text)||{text:card.tool.text||""}).text)}</div>
        <button class="search-sheet-link-btn" onclick="closeSearchBottomSheet();openPulpiteAssistantFromCard();">
          <i class="ti ti-brain"></i><span>${escapeHtml(card.tool.button||"Usar")}</span>
        </button>
      `]:[]
    }
  ]);
  const actionSections=renderSearchSheetSections([
    {title:card.protocolsLabel||"Como resolver",items:protocolButtons},
    {title:"Problemas relacionados",items:relatedButtons}
  ]);
  const content=introSections+behindBlock+actionSections;
  openSearchBottomSheet("Conduta rápida",card.title,content,{resetStack:true,titleActionHtml:favoriteControl});
}

function openSearchProtocolSheet(id,options){
  if(!DATA)return;
  const p=DATA.protocols[id];
  if(!p){
    showToast("Protocolo não disponível","error");
    return;
  }
  if(typeof isProtocolLocked==="function" ? isProtocolLocked(id) : (!p.free&&!window.userIsPremium)){
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
  const isFav=typeof isFavorite==="function"&&isFavorite("protocol",id);
  const favoriteControl=`
    <button class="search-sheet-fav-btn ${isFav?"active":""}" data-fav-type="protocol" data-fav-id="${escapeHtml(id)}" onclick="toggleTypedFavorite('protocol','${id}')" aria-label="Favoritar protocolo">
      ${isFav?'<i class="ti ti-star-filled"></i>':'<i class="ti ti-star"></i>'}
    </button>
  `;
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
      items:(p.errors||[]).map(e=>`<div class="search-error-row"><span class="search-error-dot">&times;</span><span>${e}</span></div>`)
    },
    {
      title:"Decisão rápida",
      items:(p.decisions||[]).map(d=>`<div class="search-decision-row"><span class="search-decision-if">Se ${d.if}</span><span class="search-decision-then">${d.then||""}</span></div>`)
    }
  ]);
  openSearchBottomSheet("Protocolo",p.title,content,{
    pushCurrent:!(options&&options.resetStack),
    resetStack:!!(options&&options.resetStack),
    titleActionHtml:favoriteControl
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

function isSearchAnestheticLocked(id){
  const item=typeof ANESTESICOS_LIST!=="undefined"?ANESTESICOS_LIST.find(profile=>profile.id===id):null;
  return !!(item&&!item.free&&!window.userIsPremium);
}

function renderSearchRxBlocks(blocks){
  return (blocks||[]).map(block=>{
    const section=block.secao||"";
    const sectionLower=section.toLowerCase();
    const isAlert=section.includes("âš ")||section.toUpperCase().includes("ALERTA")||sectionLower.includes("evitar");
    const isInfo=section.includes("â„¹")||sectionLower.includes("atenção")||sectionLower.includes("recomenda");
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

function openSearchAnestheticSheet(id,options){
  if(typeof ANESTESICOS_DATA==="undefined")return;
  const data=ANESTESICOS_DATA[id];
  if(!data){
    showToast("Anestésico não disponível","error");
    return;
  }
  if(isSearchAnestheticLocked(id)){
    closeSearchBottomSheet();
    showUpgradeModal(null);
    return;
  }
  const aviso=typeof ANESTESICOS_AVISO_HTML!=="undefined"?`<div class="rx-legal-note" style="margin-bottom:12px;font-size:11px;">${ANESTESICOS_AVISO_HTML}</div>`:"";
  const content=aviso+`<section class="search-sheet-section search-sheet-rx-section">${renderSearchRxBlocks(data.blocos||[])}</section>`;
  openSearchBottomSheet("Anestésico",data.titulo,content,{
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
  if(q.length<2){res.innerHTML='<p class="empty-msg">Digite pelo menos 2 letras para consultar</p>';return;}
  
  // NOVO: Registrar busca (se tiver pelo menos 2 caracteres)
  if(currentUser && q && q.length >= 2) {
    const searchTerm = q;
    const searchUserId = currentUser.uid;
    clearTimeout(searchLogTimer);
    searchLogTimer = setTimeout(() => {
      registrarAcaoUsuario(searchUserId, 'search', { termo: searchTerm });
    }, 800);
  }

  if(typeof clinicalIntentSearch==="function"){
    const clinical=clinicalIntentSearch(q,{limit:10});
    if(clinical.all.length||clinical.fallbackOnly||clinical.confidence==="none"||clinical.confidence==="low"){
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
    const item={type:"protocol",id:p.id,title:p.title,kind:"Protocolo",free:p.free};
    const locked=isClinicalSearchItemLocked(item);
    const btn=createHomeSearchButton(p.title,"Protocolo",locked?openPremiumFromSearchSuggestion:()=>{
      searchSheetReturnInputId="search-input";
      openSearchProtocolSheet(p.id,{resetStack:true});
    },null,{locked});
    res.appendChild(btn);
  });
}

// SHARE


