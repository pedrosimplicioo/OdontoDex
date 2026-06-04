function checkScrollTop(){const b=document.querySelector("#screen-protocol .body");const btn=document.getElementById("scroll-top-btn");if(b&&btn){if(document.querySelector("#screen-protocol.active")&&b.scrollTop>300)btn.classList.add("visible");else btn.classList.remove("visible");}}

// CRISE/DEU ERRADO - modal mantido, sem botão externo
function abrirModalCrise(){
  if(!DATA)return;
  const opt=document.getElementById("crise-options-list");
  if(!opt)return;
  opt.innerHTML="";
  const items=DATA.panicItems||[];
  if(items.length===0){opt.innerHTML='<p class="empty-msg">Nenhuma crise configurada.</p>';}
  else{
    items.forEach(item=>{
      const proto=DATA.protocols[item.protocol];
      const btn=document.createElement("button");
      btn.className="crise-option";
      btn.innerHTML=`<span class="crise-option-icon"><i class="ti ti-bolt"></i></span><div class="crise-option-text"><div class="crise-option-title">${item.label}</div><div class="crise-option-sub">→ ${proto?proto.title:item.protocol}</div></div>`;
      btn.onclick=()=>{hideOverlay("crise-overlay");openProto(item.protocol);};
      opt.appendChild(btn);
    });
  }
  showOverlay("crise-overlay");
}
