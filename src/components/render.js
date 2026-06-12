// ==================== RENDERIZAÇÃO ====================
function escapeHtml(text){
  return String(text || "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

function normalizeSearchText(text){
  return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function quickConductMatches(card, query){
  const q = normalizeSearchText(query);
  const haystack = [
    card.title,
    card.subtitle,
    card.intent,
    card.quick,
    ...(card.synonyms || []),
    ...(card.behind || []),
    ...(card.protocols || []).map(p => p.label),
    ...(card.related || []).map(r => r.label)
  ].join(" ");
  return normalizeSearchText(haystack).includes(q);
}

function protocolMatches(protocol, query){
  const q = normalizeSearchText(query);
  const tipText = protocol.tip ? (typeof protocol.tip === "string" ? protocol.tip : [protocol.tip.text, protocol.tip.note].filter(Boolean).join(" ")) : "";
  return normalizeSearchText(protocol.title).includes(q) ||
    protocol.steps?.some(s => normalizeSearchText(s).includes(q)) ||
    normalizeSearchText(tipText).includes(q) ||
    protocol.errors?.some(e => normalizeSearchText(e).includes(q)) ||
    protocol.decisions?.some(d => normalizeSearchText((d.if || "") + " " + (d.then || "")).includes(q));
}

function renderQuickConductCards(){
  const list = document.getElementById("quick-conduct-list");
  if(!list) return;
  list.innerHTML = "";
  Object.values(QUICK_CONDUCT_CARDS).forEach(card => {
    const btn = document.createElement("button");
    btn.className = "quick-conduct-card";
    btn.innerHTML = `
      <span class="quick-conduct-icon">${card.icon}</span>
      <span class="quick-conduct-copy">
        <span class="quick-conduct-title">${card.title}</span>
      </span>
      <span class="quick-conduct-arrow">›</span>
    `;
    btn.onclick = () => openConduta(card.id);
    list.appendChild(btn);
  });
}

function openConduta(id){
  if(!QUICK_CONDUCT_CARDS[id]) {
    showToast("Conduta rápida não disponível", "error");
    return;
  }
  currentCondutaId = id;
  goScreen("conduta");
}

function openPrescricoesAnestesicosFromCard(){
  if(typeof abaAtivaPrescricao !== "undefined") abaAtivaPrescricao = "anestesicos";
  goScreen("prescricoes");
}

function openCondutaAction(type, id){
  const actionType = type || "protocol";
  if(actionType === "protocol") {
    openProto(id);
    return;
  }
  if(actionType === "conduct") {
    openConduta(id);
    return;
  }
  if(actionType === "tool" && typeof openClinicalTool === "function") {
    openClinicalTool(id);
    return;
  }
  if(actionType === "tab" && id === "anestesicos") {
    openPrescricoesAnestesicosFromCard();
  }
}

function parseCondutaActionLabel(label){
  const text = String(label || "").trim();
  const parts = text.split(/\s*(?:→|->)\s*/);
  if(parts.length < 2) return {condition:text, target:text};
  return {condition:parts[0].trim(), target:parts.slice(1).join(" → ").trim()};
}

function getCondutaActionOpenLabel(type){
  const actionType = type || "protocol";
  if(actionType === "tool") return "Abrir ferramenta";
  if(actionType === "tab") return "Abrir aba";
  if(actionType === "conduct") return "Abrir conduta";
  if(actionType === "note") return "";
  return "Abrir protocolo de";
}

function renderCondutaActionButton(action, className){
  const type = action.type || "protocol";
  const disabled = type === "note" || !action.id;
  const icon = type === "conduct" ? "ti-link" : type === "tool" ? "ti-tools" : type === "tab" ? "ti-layout-list" : type === "note" ? "ti-info-circle" : "ti-clipboard-heart";
  const buttonClass = className || "conduta-protocol-btn";
  const parsed = parseCondutaActionLabel(action.label);
  if(type === "note") {
    return `
      <div class="${buttonClass} conduta-next-step-btn disabled">
        <div class="conduta-next-step-rule"><i class="ti ${icon}"></i><span>${escapeHtml(parsed.condition)}</span></div>
        ${parsed.target && parsed.target !== parsed.condition ? `<div class="conduta-next-step-note">${escapeHtml(parsed.target)}</div>` : ""}
      </div>
    `;
  }
  return `
    <button class="${buttonClass} conduta-next-step-btn ${disabled ? "disabled" : ""}" ${disabled ? "" : `onclick="openCondutaAction('${type}','${action.id}')"`}>
      <div class="conduta-next-step-rule"><i class="ti ti-alert-circle"></i><span>${escapeHtml(parsed.condition)}</span></div>
      <div class="conduta-next-step-open">
        <span>
          <span class="conduta-next-step-open-label">${escapeHtml(getCondutaActionOpenLabel(type))}</span>
          <span class="conduta-next-step-open-title">${escapeHtml(parsed.target)}</span>
        </span>
        <i class="ti ${icon}"></i>
      </div>
    </button>
  `;
}

function toggleCondutaBehind(){
  const list = document.getElementById("conduta-behind-list");
  const icon = document.getElementById("conduta-behind-icon");
  if(!list) return;
  const willOpen = !list.classList.contains("open");
  list.classList.toggle("open", willOpen);
  if(icon) icon.className = willOpen ? "ti ti-chevron-up" : "ti ti-chevron-down";
}

function splitFirstSentence(text){
  const clean = String(text || "").trim();
  const match = clean.match(/^(.+?\.)\s+(.+)$/s);
  return match ? {headline: match[1], rest: match[2]} : {headline: "", rest: clean};
}

function parseCondutaLine(line){
  const raw = String(line || "").trim();
  if(!raw) return null;
  const marker = raw.match(/^(👉|✅|➡️|➡|⚠️|⚠|📌|🧠)\s*/);
  const typeByMarker = {
    "👉": "lead",
    "✅": "check",
    "➡️": "action",
    "➡": "action",
    "⚠️": "warning",
    "⚠": "warning",
    "📌": "cause",
    "🧠": "tool"
  };
  const iconByType = {
    lead: "ti-route",
    check: "ti-circle-check",
    action: "ti-arrow-right",
    warning: "ti-alert-triangle",
    cause: "ti-point",
    tool: "ti-brain",
    text: "ti-minus"
  };
  const type = marker ? typeByMarker[marker[1]] : "text";
  const text = raw.replace(/^(👉|✅|➡️|➡|⚠️|⚠|📌|🧠)\s*/, "").trim();
  return {type, icon: iconByType[type] || iconByType.text, text};
}

function renderCondutaLines(text, options){
  const lines = String(text || "").split(/\n+/).map(parseCondutaLine).filter(Boolean);
  if(!lines.length) return "";
  const compact = options && options.compact;
  return `
    <div class="conduta-flow ${compact ? "compact" : ""}">
      ${lines.map(line => `
        <div class="conduta-flow-row ${line.type}">
          ${line.type === "text" ? "" : `<span class="conduta-flow-icon"><i class="ti ${line.icon}"></i></span>`}
          <span class="conduta-flow-text">${escapeHtml(line.text)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCondutaSmartText(text){
  const value = String(text || "");
  if(value.includes("\n") || /^(👉|✅|➡️|➡|⚠️|⚠|📌|🧠)/.test(value.trim())) {
    return renderCondutaLines(value);
  }
  const split = splitFirstSentence(value);
  if(!split.headline) return `<div class="conduta-smart-body">${escapeHtml(split.rest)}</div>`;
  return `
    <div class="conduta-smart-headline">${escapeHtml(split.headline)}</div>
    <div class="conduta-smart-body">${escapeHtml(split.rest)}</div>
  `;
}

function renderCondutaSmartList(items){
  if(!Array.isArray(items)) return renderCondutaSmartText(items);
  return `
    <div class="conduta-smart-list">
      ${items.map(item => {
        const value = String(item || "");
        if(value.includes("\n") || /^(👉|✅|➡️|➡|⚠️|⚠|📌|🧠)/.test(value.trim())) {
          return `
            <div class="conduta-smart-item structured">
              ${renderCondutaLines(value, {compact:true})}
            </div>
          `;
        }
        const split = splitFirstSentence(item);
        if(!split.headline) {
          return `
            <div class="conduta-smart-item">
              <span class="conduta-smart-dot"></span>
              <div class="conduta-smart-item-text"><div class="conduta-smart-item-rest">${escapeHtml(split.rest)}</div></div>
            </div>
          `;
        }
        return `
          <div class="conduta-smart-item">
            <span class="conduta-smart-dot"></span>
            <div class="conduta-smart-item-text">
              <div class="conduta-smart-item-head">${escapeHtml(split.headline)}</div>
              <div class="conduta-smart-item-rest">${escapeHtml(split.rest)}</div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderCondutaBehind(items){
  if(!Array.isArray(items)) return renderCondutaSmartText(items);
  return `
    <div class="conduta-behind-grid">
      ${items.map(item => {
        const parsed = parseCondutaLine(item);
        return `
        <div class="conduta-behind-chip"><i class="ti ti-point"></i><span>${escapeHtml(parsed ? parsed.text : item)}</span></div>
      `;
      }).join("")}
    </div>
  `;
}

function openPulpiteAssistantFromCard(){
  selCat = "endodontia";
  const st = document.getElementById("sit-title");
  if(st) st.textContent = "Endodontia";
  renderSituations();
  goScreen("situations");
  setTimeout(() => {
    const content = document.getElementById("pulpite-sit-content");
    if(content && content.style.display === "none" && typeof togglePulpiteSit === "function") {
      togglePulpiteSit();
    }
  }, 80);
}

function renderCondutaTool(card){
  if(!card.tool) return "";
  return `
    <section class="conduta-smart-block">
      <div class="conduta-smart-label"><i class="ti ${escapeHtml(card.tool.icon || "ti-tool")}"></i>${escapeHtml(card.tool.title || "Ferramenta auxiliar")}</div>
      <div class="conduta-smart-body">${escapeHtml((parseCondutaLine(card.tool.text) || {text: card.tool.text || ""}).text)}</div>
      <button class="conduta-protocol-btn" onclick="openPulpiteAssistantFromCard()">
        <i class="ti ti-brain"></i><span>${escapeHtml(card.tool.button || "Usar")}</span>
      </button>
    </section>
  `;
}

function renderQuickConduct(id){
  const card = QUICK_CONDUCT_CARDS[id];
  const body = document.getElementById("conduta-body");
  const title = document.getElementById("conduta-top-title");
  if(!body || !title || !card) return;
  title.textContent = "Conduta rápida";
  const protocolButtons = (card.protocols || []).map(proto => renderCondutaActionButton(proto, "conduta-protocol-btn")).join("");
  const changesBlock = (card.changes || []).length ? `
    <section class="conduta-smart-block alert">
      <div class="conduta-smart-label"><i class="ti ti-alert-triangle"></i>${escapeHtml(card.changesLabel || "Quando isso muda?")}</div>
      ${renderCondutaSmartList(card.changes || [])}
    </section>
  ` : "";
  const behindBlock = (card.behind || []).length ? `
    <section class="conduta-smart-block">
      <button class="conduta-behind-toggle" onclick="toggleCondutaBehind()">
        <span><i class="ti ti-search"></i> ${escapeHtml(card.behindLabel || "O que costuma estar por trás disso?")}</span>
        <i class="ti ti-chevron-down" id="conduta-behind-icon"></i>
      </button>
      <div class="conduta-behind-list" id="conduta-behind-list">
        ${renderCondutaBehind(card.behind || [])}
      </div>
    </section>
  ` : "";
  const protocolBlock = protocolButtons ? `
    <section class="conduta-smart-block">
      <div class="conduta-smart-label"><i class="ti ti-route"></i>${escapeHtml(card.protocolsLabel || "Como resolver")}</div>
      ${protocolButtons}
    </section>
  ` : "";
  const relatedButtons = (card.related || []).map(rel => {
    const enabled = rel.id && QUICK_CONDUCT_CARDS[rel.id];
    return `
      <button class="conduta-related-btn ${enabled ? "" : "disabled"}" ${enabled ? `onclick="openConduta('${rel.id}')"` : ""}>
        <i class="ti ti-link"></i><span>${escapeHtml(rel.label)}</span>
      </button>
    `;
  }).join("");
  const relatedBlock = relatedButtons ? `
    <section class="conduta-smart-block">
      <div class="conduta-smart-label"><i class="ti ti-link"></i>Problemas relacionados</div>
      ${relatedButtons}
    </section>
  ` : "";
  const isFav = typeof isFavorite === "function" && isFavorite("conduct", card.id);
  body.innerHTML = `
    <div class="conduta-hero">
      <div class="conduta-hero-top">
        <div class="conduta-eyebrow">Conduta rápida</div>
        <button class="conduta-fav-btn ${isFav ? "active" : ""}" data-fav-type="conduct" data-fav-id="${escapeHtml(card.id)}" onclick="toggleTypedFavorite('conduct','${card.id}')">${isFav ? '<i class="ti ti-star-filled"></i>' : '<i class="ti ti-star"></i>'}</button>
      </div>
      <div class="conduta-title">${escapeHtml(card.title)}</div>
    </div>
    <section class="conduta-smart-block primary">
      <div class="conduta-smart-label"><i class="ti ti-bolt"></i>${escapeHtml(card.quickLabel || "Resposta rápida")}</div>
      ${renderCondutaSmartText(card.quick)}
    </section>
    ${changesBlock}
    ${renderCondutaTool(card)}
    ${behindBlock}
    ${protocolBlock}
    ${relatedBlock}
    <div class="spacer"></div>
  `;
  body.scrollTop = 0;
}

function renderHome(){
  clearHomeSearch({preserveValue:true});
  if(!DATA) return;
  
  // NOVO: Registrar que o usuário está ativo (para métricas de retenção)
  if(currentUser && !sessionStorage.getItem('home_rendered')) {
    sessionStorage.setItem('home_rendered', 'true');
    registrarAcaoUsuario(currentUser.uid, 'home_view');
  }
  
  renderSOSButtons();
  if(typeof renderHomeFavorites === "function") renderHomeFavorites();
  document.querySelectorAll(".home-tool-lock").forEach(el => {
    el.style.display = window.userIsPremium ? "none" : "block";
  });
  // Categories
  const cs=document.getElementById("categories-scroll");
  if(cs){
    cs.innerHTML='<div class="categories-flex" id="categories-flex"></div>';
    const fd=document.getElementById("categories-flex");
    if(fd){
      DATA.categories.forEach(cat=>{
        const isPremiumCat = PREMIUM_CATEGORIES.includes(cat.id) && !window.userIsPremium;
        const btn=document.createElement("button");
        btn.className="cat-horizontal" + (isPremiumCat ? " cat-locked" : "");
        btn.innerHTML=`<span class="cat-horizontal-icon">${cat.icon}</span><span class="cat-horizontal-label">${cat.label}</span>${isPremiumCat ? '<span class="cat-crown"><i class="ti ti-lock"></i></span>' : ''}`;
        btn.onclick=()=>{
          if(isPremiumCat){
            showUpgradeModal(cat.id);
            return;
          }
          selCat=cat.id;
          const st=document.getElementById("sit-title");if(st)st.textContent=cat.label;
          renderSituations();
          goScreen("situations");
        };
        fd.appendChild(btn);
      });
    }
  }
  // Mais usados — sempre visível
  const muCard=document.getElementById("most-used-card");
  const muList=document.getElementById("most-used-list");
  if(muCard&&muList){
    muCard.style.display="block";
    const sorted=Object.entries(USAGE_COUNT)
      .filter(([id])=>DATA.protocols[id])
      .sort((a,b)=>b[1]-a[1])
      .slice(0,3);
    muList.innerHTML="";
    if(sorted.length>0){
      sorted.forEach(([id,count],idx)=>{
        const p=DATA.protocols[id];
        if(!p)return;
        const item=document.createElement("div");
        item.className="stat-item";
        item.onclick=()=>openProto(id);
        item.innerHTML=`<div class="stat-item-left"><span class="stat-item-num">${idx+1}</span><span class="stat-item-name">${p.title}</span></div><span class="stat-item-count"><span class="stat-count-icon"><i class="ti ti-flame"></i></span>${count}x</span>`;
        muList.appendChild(item);
      });
    } else {
      muList.innerHTML='<span style="font-size:13px;color:#94A3B8">Os protocolos que você mais abre aparecem aqui</span>';
    }
  }
}

function renderSituations(){
  if(!DATA||!selCat)return;
  const list=document.getElementById("situations-list");
  if(!list)return;
  list.innerHTML="";

  // Widget de diagnóstico de pulpite para Endodontia
  if(selCat==="endodontia"){
    const widgetDiv = document.createElement("div");
    widgetDiv.innerHTML = `
      <div class="fw-widget">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div class="fw-widget-label" style="margin-bottom:0;"><span class="protocol-inline-icon"><i class="ti ti-search"></i></span>Não sabe o diagnóstico? Comece aqui</div>
          <button onclick="togglePulpiteSit()" id="pulpite-sit-toggle" style="background:none;border:0.5px solid #D9B8F0;border-radius:20px;padding:4px 12px;font-size:11px;font-weight:700;color:#7C3FA0;cursor:pointer;font-family:inherit;">Usar</button>
        </div>
        <div id="pulpite-sit-content" style="display:none;">
          <div id="pulpite-sit-quiz">
            <div style="display:flex;gap:4px;margin-bottom:8px;" id="pulpite-sit-progress"></div>
            <div class="fw-confirm show" style="margin-bottom:8px;">
              <span class="fw-confirm-txt" id="pulpite-sit-perg-num" style="font-size:10px;letter-spacing:0.5px;"></span>
            </div>
            <div style="font-size:14px;font-weight:700;color:var(--color-text-primary);margin-bottom:10px;line-height:1.4;" id="pulpite-sit-perg-text"></div>
            <div style="display:flex;flex-direction:column;gap:6px;" id="pulpite-sit-opcoes"></div>
          </div>
          <div id="pulpite-sit-resultado" style="display:none;">
            <div class="fw-result show">
              <div class="fw-sec" style="display:flex;align-items:center;gap:10px;padding:10px 12px;">
                <div id="pulpite-sit-icon" style="width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;flex-shrink:0;"></div>
                <div>
                  <div id="pulpite-sit-badge" style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;display:inline-block;margin-bottom:4px;letter-spacing:0.3px;"></div>
                  <div class="fw-sec-value" id="pulpite-sit-title" style="font-size:13px;"></div>
                </div>
              </div>
              <div style="padding:0 12px 10px;">
                <div class="fw-sec-sub pulpite-widget-body" id="pulpite-sit-body" style="line-height:1.5;"></div>
              </div>
              <div style="padding:0 12px 12px;display:flex;flex-direction:column;gap:6px;">
                <button id="pulpite-sit-cta" style="width:100%;border:none;border-radius:20px;padding:10px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;"></button>
                <button onclick="resetPulpiteSit()" style="width:100%;background:none;border:0.5px solid #E2E8F0;border-radius:20px;padding:8px;font-size:11px;font-weight:700;color:#94A3B8;cursor:pointer;font-family:inherit;letter-spacing:0.3px;text-transform:uppercase;">Recomeçar</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    list.appendChild(widgetDiv);
    initPulpiteSit();
  }

  const sits=DATA.situations[selCat]||[];
  if(sits.length===0){list.innerHTML+='<p class="empty-msg">Nenhuma situação cadastrada.</p>';return;}
  sits.forEach(sit=>{
    if(sit.type==="header"){
      const hdr=document.createElement("div");
      hdr.style.cssText="font-size:10px;font-weight:800;color:#94A3B8;letter-spacing:1px;text-transform:uppercase;padding:12px 4px 6px;margin-top:4px;";
      hdr.textContent=sit.label;
      list.appendChild(hdr);
      return;
    }
    // Lógica de bloqueio por situação
    let isLocked = false;
    if(selCat === "dentistica" && sit.id === "d6" && !window.userIsPremium) {
      isLocked = true;
    }
    if(selCat === "emergencia" && !EMERGENCY_FREE.includes(sit.id) && !window.userIsPremium) {
      isLocked = true;
    }
    const btn=document.createElement("button");
    btn.className="list-btn";
    if(isLocked){
      btn.innerHTML=`<span class="list-txt">${sit.label}</span><span class="prem-tag"><i class="ti ti-lock"></i>Premium</span>`;
      btn.onclick=()=>showUpgradeModal(null);
    } else {
      btn.innerHTML=`<span class="list-txt">${sit.label}</span><span class="arr">›</span>`;
      btn.onclick=()=>{selSit=sit.id;renderProcedures();goScreen("procedures");};
    }
    list.appendChild(btn);
  });
}

function renderProcedures() {
  if(!DATA || !selSit) return;
  const list = document.getElementById("procedures-list");
  if(!list) return;
  
  const procs = DATA.procedures[selSit] || [];
  currentProceduresList = procs;
  
  // Limpa o campo de busca ao entrar na tela
  const searchInput = document.getElementById("proc-search-input");
  if(searchInput) searchInput.value = "";
  const clearBtn = document.getElementById("proc-search-clear");
  if(clearBtn) clearBtn.style.display = "none";
  
  renderProceduresList(procs);
}

function renderProceduresList(procs) {
  const list = document.getElementById("procedures-list");
  if(!list) return;
  list.innerHTML = "";
  
  if(procs.length === 0) {
    list.innerHTML = '<p class="empty-msg">Nenhum procedimento encontrado.</p>';
    return;
  }
  
  procs.forEach(proc => {
    const p = DATA.protocols[proc.id];
    const seenHtml = HISTORY.includes(proc.id) ? '<span class="seen-badge">✓ Visto</span>' : '';
    const btn = document.createElement("button");
    btn.className = "list-btn";
   if(proc.free || window.userIsPremium) {
  btn.innerHTML = `<span class="list-txt">${proc.label}</span>${seenHtml}<span class="arr">›</span>`;
} else {
  btn.innerHTML = `<span class="list-txt">${proc.label}</span><span class="prem-tag"><i class="ti ti-lock"></i>Premium</span>`;
}
    btn.onclick = () => openProto(proc.id);
    list.appendChild(btn);
  });
}

function filterProceduresList(query) {
  const searchInput = document.getElementById("proc-search-input");
  const clearBtn = document.getElementById("proc-search-clear");
  
  if(clearBtn) {
    clearBtn.style.display = query.length > 0 ? "block" : "none";
  }
  
  if(!query || query.length === 0) {
    renderProceduresList(currentProceduresList);
    return;
  }
  
  const ql = query.toLowerCase();
  const filtered = currentProceduresList.filter(proc => 
    proc.label.toLowerCase().includes(ql)
  );
  
  renderProceduresList(filtered);
}

function clearProcSearch() {
  const searchInput = document.getElementById("proc-search-input");
  if(searchInput) {
    searchInput.value = "";
    filterProceduresList("");
    searchInput.focus();
  }
}
function renderSOSButtons(){
  const SOS_ITEMS = [
    {icon:'<i class="ti ti-bed"></i>', label:"Desmaio",  proto:"sincope-protocolo",  free:true},
    {icon:'<i class="ti ti-heartbeat"></i>', label:"Infarto",  proto:"infarto-protocolo",  free:false},
    {icon:'<i class="ti ti-brain"></i>', label:"Epilepsia",proto:"epilepsia-protocolo",free:false},
    {icon:'<i class="ti ti-droplet"></i>', label:"Sangramento",proto:"hemostasia",       free:false},
  ];
  const container = document.getElementById("sos-buttons");
  if(!container) return;
  container.innerHTML = "";
  SOS_ITEMS.forEach(item => {
    const locked = !item.free && !window.userIsPremium;
    const btn = document.createElement("div");
    btn.className = "quick-btn" + (locked ? " sos-locked" : "");
    btn.innerHTML = `<span class="quick-btn-icon">${item.icon}</span><span class="quick-btn-label">${item.label}</span>${locked ? '<span class="sos-crown"><i class="ti ti-lock"></i></span>' : ''}`;
    btn.onclick = () => locked ? showUpgradeModal(null) : openProto(item.proto);
    container.appendChild(btn);
  });
}

function showUpgradeModal(catId){
  const titleEl = document.getElementById('premium-modal-title');
  const subEl = document.getElementById('premium-modal-sub');
  const sitsEl = document.getElementById('premium-modal-sits');

  // Categorias completas bloqueadas
  if(PREMIUM_CATEGORY_PREVIEW[catId]){
    const label = PREMIUM_CATEGORY_LABELS[catId];
    if(titleEl) titleEl.textContent = label + ' — Premium';
    if(subEl) subEl.textContent = 'Desbloqueie todos os protocolos de ' + label + ':';
    if(sitsEl){
      sitsEl.style.display = 'flex';
      sitsEl.innerHTML = PREMIUM_CATEGORY_PREVIEW[catId].map(s =>
        `<div style="font-size:13px;font-weight:600;color:#92400E;display:flex;align-items:center;gap:6px"><i class="ti ti-lock"></i> ${s}</div>`
      ).join('');
    }
  } else {
    // Situação individual bloqueada (ex: Clareamento, emergências)
    if(titleEl) titleEl.textContent = 'Conteúdo Premium';
    if(subEl) subEl.textContent = 'Esta situação está disponível no plano Premium.';
    if(sitsEl) sitsEl.style.display = 'none';
  }
  showOverlay('premium-overlay');
}
