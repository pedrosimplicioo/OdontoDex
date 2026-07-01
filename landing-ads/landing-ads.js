(function initPaidLanding(){
  "use strict";

  const APP_URL = "https://www.odontodex.com.br";
  const PRODUCTION_HOSTS = new Set(["www.odontodex.com.br", "odontodex.com.br"]);
  const isProduction = PRODUCTION_HOSTS.has(window.location.hostname);
  const firebaseConfig = {
    apiKey: "AIzaSyDud_6RSVNCiPHUGjdDXLZgcN8YydJwYXs",
    authDomain: "guia-odonto-a24ed.firebaseapp.com",
    projectId: "guia-odonto-a24ed",
    storageBucket: "guia-odonto-a24ed.firebasestorage.app",
    messagingSenderId: "238746682290",
    appId: "1:238746682290:web:1541bfc31c720a9a16e9cd"
  };

  function safeStorageGet(key){
    try{return localStorage.getItem(key);}catch(_){return null;}
  }

  function safeStorageSet(key,value){
    try{localStorage.setItem(key,value);}catch(_){}
  }

  function getOrCreateSessionId(){
    let sessionId=safeStorageGet("odontodex_session_id");
    if(!sessionId){
      sessionId=Math.random().toString(36).slice(2,15)+Date.now().toString(36);
      safeStorageSet("odontodex_session_id",sessionId);
    }
    return sessionId;
  }

  function getDeviceType(){
    if(/mobile/i.test(navigator.userAgent))return "mobile";
    if(/tablet/i.test(navigator.userAgent))return "tablet";
    return "desktop";
  }

  function getSource(){
    const params=new URLSearchParams(window.location.search);
    if(params.get("utm_source"))return params.get("utm_source");
    const referrer=document.referrer.toLowerCase();
    if(referrer.includes("google"))return "google";
    if(referrer.includes("facebook"))return "facebook";
    if(referrer.includes("instagram"))return "instagram";
    if(referrer)return "referrer";
    return "direct";
  }

  function buildAppUrl(){
    const destination=new URL(APP_URL);
    const sourceParams=new URLSearchParams(window.location.search);
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","gclid"].forEach(key=>{
      const value=sourceParams.get(key);
      if(value)destination.searchParams.set(key,value);
    });
    return destination.toString();
  }

  document.querySelectorAll(".js-app-link").forEach(link=>{
    link.href=buildAppUrl();
  });

  const video=document.getElementById("product-video");
  const videoPlaceholder=document.getElementById("video-placeholder");
  const videoPlayFallback=document.getElementById("video-play-fallback");
  if(video&&videoPlaceholder){
    const hidePlaceholder=()=>videoPlaceholder.classList.add("is-hidden");
    const hideFallback=()=>{
      if(!videoPlayFallback)return;
      videoPlayFallback.classList.remove("is-visible");
      videoPlayFallback.hidden=true;
    };
    const showFallback=()=>{
      if(!videoPlayFallback)return;
      hidePlaceholder();
      videoPlayFallback.hidden=false;
      requestAnimationFrame(()=>videoPlayFallback.classList.add("is-visible"));
    };
    const playbackStarted=()=>{
      hidePlaceholder();
      hideFallback();
    };
    const attemptPlayback=()=>{
      video.muted=true;
      video.playsInline=true;
      const playPromise=video.play();
      if(playPromise&&typeof playPromise.then==="function"){
        playPromise.then(playbackStarted).catch(showFallback);
      }
    };

    video.addEventListener("loadeddata",hidePlaceholder,{once:true});
    video.addEventListener("playing",playbackStarted);
    video.addEventListener("canplay",()=>{
      window.setTimeout(()=>{
        if(video.paused&&!video.ended)showFallback();
      },1500);
    },{once:true});
    if(videoPlayFallback){
      videoPlayFallback.addEventListener("click",()=>{
        hideFallback();
        attemptPlayback();
      });
    }
    attemptPlayback();
  }

  const prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(prefersReducedMotion){
    document.querySelectorAll(".reveal").forEach(element=>element.classList.add("is-visible"));
  }else{
    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },{threshold:.1,rootMargin:"0px 0px -35px"});
    document.querySelectorAll(".reveal").forEach(element=>revealObserver.observe(element));
  }

  if(!isProduction||!window.firebase)return;

  if(!firebase.apps.length)firebase.initializeApp(firebaseConfig);
  const db=firebase.firestore();
  const sessionId=getOrCreateSessionId();
  const startedAt=Date.now();
  let hasInteraction=false;
  let maxScrollPercent=0;
  const scrollEventsSent=new Set();

  async function trackEvent(event,eventData={}){
    try{
      await db.collection("landing_stats").add({
        sessionId,
        event,
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        userAgent:navigator.userAgent,
        deviceType:getDeviceType(),
        screenWidth:window.innerWidth,
        screenHeight:window.innerHeight,
        source:getSource(),
        url:window.location.pathname,
        landingVariant:"paid_decision_confidence",
        hasInteraction,
        ...eventData
      });
    }catch(error){
      console.warn("Landing analytics indisponível",error?.message||error);
    }
  }

  trackEvent("page_view",{
    pageTitle:document.title,
    referrer:document.referrer,
    utmCampaign:new URLSearchParams(window.location.search).get("utm_campaign")||""
  });
  if(typeof window.trackMetaPageViewOnce==="function")window.trackMetaPageViewOnce("paid_landing");

  document.addEventListener("click",event=>{
    const target=event.target.closest("[data-track]");
    if(!target)return;
    hasInteraction=true;
    const eventName=target.dataset.track;
    trackEvent(eventName,{
      position:target.dataset.position||"",
      elementText:(target.textContent||"").trim().slice(0,100),
      elementHref:target.href||""
    });
    if(target.classList.contains("js-app-link")&&typeof window.trackMetaPixelEvent==="function"){
      window.trackMetaPixelEvent("Lead",{content_name:"OdontoDex",cta:eventName,surface:"paid_landing"});
    }
  });

  const sectionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      trackEvent("section_view",{section:entry.target.dataset.trackSection});
      sectionObserver.unobserve(entry.target);
    });
  },{threshold:.4});
  document.querySelectorAll("[data-track-section]").forEach(section=>sectionObserver.observe(section));

  window.addEventListener("scroll",()=>{
    const pageHeight=Math.max(document.documentElement.scrollHeight-window.innerHeight,1);
    const percent=Math.min(100,Math.round(window.scrollY/pageHeight*100));
    if(percent<=maxScrollPercent)return;
    maxScrollPercent=percent;
    [25,50,75,100].forEach(threshold=>{
      if(percent>=threshold&&!scrollEventsSent.has(threshold)){
        scrollEventsSent.add(threshold);
        hasInteraction=true;
        trackEvent("scroll_"+threshold,{scrollPercent:percent});
      }
    });
  },{passive:true});

  window.addEventListener("pagehide",()=>{
    trackEvent("exit",{
      timeOnPageSeconds:Math.round((Date.now()-startedAt)/1000),
      maxScrollPercent,
      hasInteraction
    });
  });
})();
