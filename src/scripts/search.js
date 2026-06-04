// BUSCA
function doHomeSearch(q){
  const resDiv=document.getElementById("home-search-results");
  const homeBody=document.getElementById("home-body");
  const clearBtn=document.getElementById("home-search-clear");
  if(!resDiv||!DATA)return;
  if(clearBtn)clearBtn.style.display=q.length>0?"block":"none";
  if(q.length<2){
    resDiv.style.display="none";
    if(homeBody)homeBody.style.display="flex";
    return;
  }
  // Esconde o corpo da home e mostra resultados inline
  if(homeBody)homeBody.style.display="none";
  resDiv.style.display="block";
  resDiv.innerHTML="";
  const ql=q.trim();
  const conductFound=Object.values(QUICK_CONDUCT_CARDS).filter(card=>quickConductMatches(card, ql));
  const all=Object.entries(DATA.protocols).map(([id,p])=>({id,...p}));
  const found=all.filter(p=>protocolMatches(p, ql));
  if(conductFound.length===0 && found.length===0){
    resDiv.innerHTML='<p class="empty-msg" style="margin-top:20px">Nenhum resultado para "'+escapeHtml(q)+'"</p>';
    return;
  }
  conductFound.forEach(card=>{
    const btn=document.createElement("button");
    btn.className="home-result-card";
    btn.innerHTML=`
      <span class="result-kind conduta">Conduta rápida</span>
      <span class="result-title">${card.title}</span>
      <span class="result-meta">${card.subtitle}</span>
    `;
    btn.onclick=()=>{clearHomeSearch();openConduta(card.id);};
    resDiv.appendChild(btn);
  });
  found.forEach(p=>{
    const btn=document.createElement("button");
    btn.className="home-result-card";
    btn.innerHTML='<span class="result-kind protocol">Protocolo</span><div style="display:flex;align-items:center;gap:6px"><span class="result-title">'+p.title+'</span>'+(!p.free && !window.userIsPremium ? '<span class="prem-tag"><i class="ti ti-lock"></i></span>' : '')+'</div>';
    btn.onclick=()=>{clearHomeSearch();openProto(p.id);};
    resDiv.appendChild(btn);
  });
}

function showHomeResults(){
  const inp=document.getElementById("home-search-input");
  if(inp&&inp.value.length>=2)doHomeSearch(inp.value);
}

function clearHomeSearch(){
  const inp=document.getElementById("home-search-input");
  const resDiv=document.getElementById("home-search-results");
  const homeBody=document.getElementById("home-body");
  const clearBtn=document.getElementById("home-search-clear");
  if(inp)inp.value="";
  if(resDiv)resDiv.style.display="none";
  if(homeBody)homeBody.style.display="flex";
  if(clearBtn)clearBtn.style.display="none";
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
  
  const ql=q.toLowerCase();
  const all=Object.entries(DATA.protocols).map(([id,p])=>({id,...p}));
  const found=all.filter(p=>
    p.title?.toLowerCase().includes(ql)||
    p.steps?.some(s=>s.toLowerCase().includes(ql))||
    p.errors?.some(e=>e.toLowerCase().includes(ql))||
    p.decisions?.some(d=>(d.if||'').toLowerCase().includes(ql)||(d.then||'').toLowerCase().includes(ql))
  );
  if(found.length===0){res.innerHTML=`<p class="empty-msg">Nenhum resultado para "${q}"</p>`;return;}
  res.innerHTML="";
  found.forEach(p=>{
    const btn=document.createElement("button");
    btn.className="result-card";
    btn.innerHTML=`<div style="display:flex;align-items:center;gap:6px"><span class="result-title">${p.title}</span>${!p.free && !window.userIsPremium ? '<span class="prem-tag"><i class="ti ti-lock"></i></span>' : ''}</div>`;
    btn.onclick=()=>openProto(p.id);
    res.appendChild(btn);
  });
}

// SHARE
