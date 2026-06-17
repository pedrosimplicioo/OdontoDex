function openProto(id){
  if(!DATA) return;
  const p = DATA.protocols[id];
  if(!p){
    showToast("Protocolo não disponível","error");
    return;
  }
  
  // Se for premium e usuário NÃO for premium, bloqueia
  if(!p.free && !window.userIsPremium){
    showUpgradeModal(null);
    return;
  }
  registrarUsoProtocolo(id);
  
  // NOVO: Registrar ação do usuário (para AHA e profundidade)
  if(currentUser) {
    registrarAcaoUsuario(currentUser.uid, 'open_protocol', {
      protocoloId: id,
      protocoloTitulo: p.title,
      categoria: selCat
    });
  }
  
  currentProtoId = id;
  HISTORY = [id, ...HISTORY.filter(h => h !== id)].slice(0,20);
  saveHistory();
  USAGE_COUNT[id] = (USAGE_COUNT[id] || 0) + 1;
  saveUsageCount();
  renderProtocol(id);
  goScreen("protocol");
}

function getProtocolTipText(tip){
  if(!tip)return "";
  if(typeof tip==="string")return tip;
  return [tip.text,tip.note].filter(Boolean).join(" ");
}

function renderProtocolTip(tip){
  if(!tip)return "";
  const text=typeof tip==="string"?tip:tip.text;
  const note=typeof tip==="string"?"":tip.note;
  if(!text&&!note)return "";
  return `<div class="protocol-tip-card">
      <div class="protocol-tip-title"><span class="protocol-inline-icon"><i class="ti ti-bulb"></i></span>Dica</div>
      ${text?`<div class="protocol-tip-text">${text}</div>`:""}
      ${note?`<div class="protocol-tip-note"><i class="ti ti-alert-circle"></i><span>${note}</span></div>`:""}
    </div>`;
}

function renderProtocol(id){
  if(!DATA)return;
  const p=DATA.protocols[id];
  if(!p)return;
  const isFav=isFavorite("protocol", id);
  const body=document.getElementById("protocol-body");
  if(!body)return;
  const titleEl=document.getElementById("protocol-top-title");
  if(titleEl) titleEl.textContent=p.title;
  const favBtn=document.getElementById("fav-btn-proto");
  if(favBtn){
    favBtn.dataset.favId=id;
    favBtn.onclick=()=>toggleTypedFavorite("protocol", id);
    favBtn.className=`rx-fav-btn top-action-btn ${isFav?'active':''}`;
    favBtn.innerHTML=isFav?'<i class="ti ti-star-filled"></i>':'<i class="ti ti-star"></i>';
  }

  body.innerHTML=`
    <div class="clinical-note"><span class="protocol-inline-icon"><i class="ti ti-clipboard-heart"></i></span><span>Este protocolo é um guia de apoio clínico. Adapte conforme a condição do paciente. A responsabilidade pela decisão clínica é exclusivamente do profissional habilitado.</span></div>
    ${id==='extracao-simples'?`
    <div class="fw-widget">
      <div class="fw-widget-label"><span class="protocol-inline-icon"><i class="ti ti-target"></i></span>Fórceps Dinâmico</div>
      <input class="fw-widget-input" id="fw-es-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="Digite o nº do dente" oninput="renderForcepsWidget('fw-es-input','fw-es-confirm','fw-es-result','fw-es-alert','fw-es-p6')">
      <div class="fw-confirm" id="fw-es-confirm"><span class="protocol-inline-icon"><i class="ti ti-dental"></i></span><span class="fw-confirm-txt" id="fw-es-confirm-txt"></span><span class="fw-confirm-ok">✓</span></div>
      <div class="fw-result" id="fw-es-result"></div>
    </div>`:''}
    ${id==='endo-urgencia'?`
    <div class="fw-widget" id="pulpite-widget-box">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div class="fw-widget-label"><span class="protocol-inline-icon"><i class="ti ti-search"></i></span>Não sabe o diagnóstico? Comece aqui</div>
        <button onclick="togglePulpiteWidget()" id="pulpite-toggle-btn" style="background:none;border:0.5px solid var(--color-border-tertiary);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;color:#7C3FA0;cursor:pointer;">Usar</button>
      </div>
      <div id="pulpite-widget-content" style="display:none;">
        <div id="pulpite-quiz">
          <div style="display:flex;gap:4px;margin-bottom:10px;" id="pulpite-progress"></div>
          <div class="pulpite-widget-question">
            <div class="pulpite-widget-num" id="pulpite-perg-num"></div>
            <div class="pulpite-widget-text" id="pulpite-perg-text"></div>
            <div style="display:flex;flex-direction:column;gap:6px;" id="pulpite-opcoes"></div>
          </div>
        </div>
        <div id="pulpite-resultado" class="pulpite-widget-result" style="display:none;">
          <div class="pulpite-widget-badge" id="pulpite-res-badge"></div>
          <div class="pulpite-widget-title" id="pulpite-res-title"></div>
          <div class="pulpite-widget-body" id="pulpite-res-body"></div>
          <button onclick="resetPulpiteQuiz()" class="pulpite-widget-reset">Recomeçar diagnóstico</button>
        </div>
      </div>
    </div>`:''}
    ${id==='extracao-cirurgica'?`
    <div class="fw-widget">
      <div class="fw-widget-label"><span class="protocol-inline-icon"><i class="ti ti-cut"></i></span>Odontosecção Dinâmica</div>
      <input class="fw-widget-input" id="fw-ec-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="Digite o nº do dente" oninput="renderOdontoWidget('fw-ec-input','fw-ec-confirm','fw-ec-result','fw-ec-p7')">
      <div class="fw-confirm" id="fw-ec-confirm"><span class="protocol-inline-icon"><i class="ti ti-dental"></i></span><span class="fw-confirm-txt" id="fw-ec-confirm-txt"></span><span class="fw-confirm-ok">✓</span></div>
      <div class="fw-result" id="fw-ec-result"></div>
    </div>`:''}
    <div class="sec">
      <div class="sec-title"><span class="protocol-inline-icon"><i class="ti ti-checklist"></i></span>Passo a Passo</div>
      ${(p.steps||[]).map((s,i)=>{
        if(id==='extracao-simples' && i===5) return '<div class="step-row"><div class="step-num">'+(i+1)+'</div><div class="step-txt" id="fw-es-p6">'+s+'</div></div>';
        if(id==='extracao-cirurgica' && i===6) return '<div class="step-row"><div class="step-num">'+(i+1)+'</div><div class="step-txt" id="fw-ec-p7">'+s+'</div></div>';
        return '<div class="step-row"><div class="step-num">'+(i+1)+'</div><div class="step-txt">'+s+'</div></div>';
      }).join("")}
    </div>
    ${renderProtocolTip(p.tip)}
    <div class="sec">
      <div class="sec-title"><span class="protocol-inline-icon"><i class="ti ti-alert-triangle"></i></span>Erros que Ferram</div>
      ${(p.errors||[]).map(e=>`<div class="err-row"><span class="err-dot">&times;</span><span class="err-txt">${e}</span></div>`).join("")}
    </div>
    <div class="sec">
      <div class="sec-title"><span class="protocol-inline-icon"><i class="ti ti-arrows-split"></i></span>Decisão Rápida</div>
      ${(p.decisions||[]).map(d=>`<div class="dec-row"><span class="dec-if-lbl">Se</span><span class="dec-if">${d.if}</span><span class="dec-arr">→</span><span class="dec-then">${d.then||''}</span></div>`).join("")}
    </div>
    <div class="spacer"></div>`;
   body.scrollTop = 0;
  const sb=document.getElementById("share-proto-btn");
  if(sb)sb.style.display="flex";
}

function toggleFav(id){
  const favKey = normalizeFavKey("protocol", id);
  const legacyKey = id;
  const isFavNow = isFavorite("protocol", id);
  if(isFavNow){
    FAVS = FAVS.filter(f => f !== favKey && f !== legacyKey);
    showToast("Removido dos favoritos","error");
  } else {
    FAVS = [favKey, ...FAVS.filter(f => f !== legacyKey)];
    showToast("Adicionado aos favoritos!","success");
    
    // NOVO: Registrar favorito
    if(currentUser) {
      registrarAcaoUsuario(currentUser.uid, 'favorite', { protocoloId: id });
    }
  }
  saveFavs();
  if(typeof renderHomeFavorites === "function") renderHomeFavorites();
  // Atualiza o botão imediatamente
  const btn = document.getElementById("fav-btn-proto");
  if(btn){
    const nowFav = isFavorite("protocol", id);
    btn.innerHTML = nowFav ? '<i class="ti ti-star-filled"></i>' : '<i class="ti ti-star"></i>';
    btn.className = nowFav ? 'rx-fav-btn top-action-btn active' : 'rx-fav-btn top-action-btn';
  }
}

function normalizeFavKey(type,id){
  return `${type}:${id}`;
}

function parseFavKey(key){
  if(typeof key !== "string") return null;
  if(key.includes(":")){
    const [type,id] = key.split(":");
    return {type,id};
  }
  return {type:"protocol",id:key};
}

function isFavorite(type,id){
  const key = normalizeFavKey(type,id);
  return FAVS.includes(key) || (type === "protocol" && FAVS.includes(id));
}

function toggleTypedFavorite(type,id){
  const key = normalizeFavKey(type,id);
  const wasFav = isFavorite(type,id);
  if(wasFav){
    FAVS = FAVS.filter(f => f !== key && !(type === "protocol" && f === id));
    showToast("Removido dos favoritos","error");
  }else{
    FAVS = [key, ...FAVS];
    showToast("Adicionado aos favoritos!","success");
    if(currentUser) registrarAcaoUsuario(currentUser.uid, 'favorite', { tipo:type, id });
  }
  saveFavs();
  updateFavoriteButtons(type,id);
  if(typeof renderHomeFavorites === "function") renderHomeFavorites();
}

function updateFavoriteButtons(type,id){
  const active = isFavorite(type,id);
  document.querySelectorAll(`[data-fav-type="${type}"][data-fav-id="${id}"]`).forEach(btn => {
    btn.classList.toggle("active", active);
    btn.innerHTML = active ? '<i class="ti ti-star-filled"></i>' : '<i class="ti ti-star"></i>';
  });
}

function getFavoriteItem(key){
  const parsed = parseFavKey(key);
  if(!parsed) return null;
  if(parsed.type === "protocol" && DATA?.protocols?.[parsed.id]){
    return {type:"protocol",id:parsed.id,title:DATA.protocols[parsed.id].title,kind:"Protocolo",icon:"ti-clipboard-heart",open:()=>openProto(parsed.id)};
  }
  if(parsed.type === "conduct" && QUICK_CONDUCT_CARDS?.[parsed.id]){
    return {type:"conduct",id:parsed.id,title:QUICK_CONDUCT_CARDS[parsed.id].title,kind:"Conduta rápida",icon:"ti-bolt",open:()=>openConduta(parsed.id)};
  }
  if(parsed.type === "prescription" && PRESCRICOES_DATA?.[parsed.id]){
    return {type:"prescription",id:parsed.id,title:PRESCRICOES_DATA[parsed.id].titulo,kind:"Prescrição",icon:"ti-pill",open:()=>abrirPrescricao(parsed.id)};
  }
  return null;
}

function renderHomeFavorites(){
  const list = document.getElementById("home-favorites-list");
  if(!list) return;
  const items = FAVS.map(getFavoriteItem).filter(Boolean).slice(0,6);
  if(!items.length){
    list.innerHTML = `
      <button class="home-favorite-empty" type="button" onclick="document.getElementById('home-search-input')?.focus()">
        <span class="home-favorite-empty-title">Seus atalhos clínicos aparecerão aqui</span>
        <span class="home-favorite-empty-sub">Favorite condutas, protocolos e prescrições para acessar sem procurar.</span>
      </button>
    `;
    return;
  }
  list.innerHTML = "";
  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = `home-favorite-chip ${item.type}`;
    btn.type = "button";
    btn.innerHTML = `
      <span class="home-favorite-icon"><i class="ti ${item.icon}"></i></span>
      <span class="home-favorite-copy">
        <span class="home-favorite-title">${escapeHtml(item.title)}</span>
        <span class="home-favorite-kind">${escapeHtml(item.kind)}</span>
      </span>
    `;
    btn.onclick = item.open;
    list.appendChild(btn);
  });
}

function renderFavs(){
  if(!DATA)return;
  const list=document.getElementById("favs-list");
  if(!list)return;
  list.innerHTML="";
  const vf=FAVS.map(getFavoriteItem).filter(Boolean);
  if(vf.length===0){list.innerHTML='<p class="empty-msg">Use ★ em condutas, protocolos ou prescrições para salvar.</p>';return;}
  vf.forEach(item=>{
    const btn=document.createElement("button");
    btn.className="result-card";
    btn.innerHTML=`<span class="result-title">${escapeHtml(item.title)}</span>`;
    btn.onclick=item.open;
    list.appendChild(btn);
  });
}
