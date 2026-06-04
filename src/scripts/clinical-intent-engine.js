function clinicalNormalize(value){
  return String(value||"")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\b(\w{4,})s\b/g,"$1")
    .replace(/\s+/g," ")
    .trim();
}

function clinicalTokens(value){
  return clinicalNormalize(value).split(/\s+/).filter(token=>token.length>=2);
}

var CLINICAL_SEARCH_STOP_WORDS = [
  "paciente", "dente", "pode", "tomar", "com", "para", "qual", "quais", "como",
  "quando", "onde", "esta", "está", "tem", "nao", "não", "de", "da", "do", "das", "dos"
];

function clinicalUsefulTokens(value){
  return clinicalTokens(value).filter(token=>!CLINICAL_SEARCH_STOP_WORDS.includes(token));
}

function clinicalLevenshtein(a,b){
  if(!a)return b.length;
  if(!b)return a.length;
  const prev=Array.from({length:b.length+1},(_,i)=>i);
  const cur=new Array(b.length+1);
  for(let i=1;i<=a.length;i++){
    cur[0]=i;
    for(let j=1;j<=b.length;j++){
      cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
    }
    for(let j=0;j<=b.length;j++)prev[j]=cur[j];
  }
  return prev[b.length];
}

function clinicalFuzzyScore(queryToken,itemToken){
  if(!queryToken||!itemToken)return 0;
  if(itemToken===queryToken)return 34;
  if(queryToken.length<=3||itemToken.length<=3)return 0;
  if(itemToken.includes(queryToken)||queryToken.includes(itemToken))return 24;
  if(queryToken.length>=3&&itemToken.length>=3){
    if(itemToken.slice(0,3)===queryToken.slice(0,3))return 14;
    const dist=clinicalLevenshtein(queryToken,itemToken);
    if(dist<=1)return 18;
    if(dist<=2&&Math.max(queryToken.length,itemToken.length)>=5)return 10;
  }
  return 0;
}

function clinicalLabelForType(type){
  if(type==="conduct")return "Conduta rápida";
  if(type==="prescription")return "Prescrição";
  if(type==="profile")return "Perfil clínico";
  if(type==="alert")return "Alerta importante";
  return "Protocolo";
}

function clinicalMergeBadges(){
  const out=[];
  Array.from(arguments).forEach(list=>{
    (list||[]).forEach(label=>{
      if(label&&!out.includes(label))out.push(label);
    });
  });
  return out.slice(0,3);
}

function detectClinicalIntents(query){
  const normalized=clinicalNormalize(query);
  const qTokens=clinicalUsefulTokens(query);
  if(!normalized||!CLINICAL_SEARCH_INTENTS)return [];
  return Object.entries(CLINICAL_SEARCH_INTENTS).map(([id,intent])=>{
    let score=0;
    (intent.synonyms||[]).forEach(raw=>{
      const synonym=clinicalNormalize(raw);
      const synonymTokens=clinicalUsefulTokens(raw);
      if(!synonym)return;
      if(normalized===synonym)score+=96;
      else if(synonym.length>3&&(normalized.includes(synonym)||synonym.includes(normalized)))score+=72;
      synonymTokens.forEach(st=>{
        let best=0;
        qTokens.forEach(qt=>{best=Math.max(best,clinicalFuzzyScore(qt,st));});
        score+=best;
      });
    });
    return {id,label:intent.label,score,badges:intent.badges||[]};
  }).filter(intent=>intent.score>=32).sort((a,b)=>b.score-a.score);
}

function clinicalItemExists(type,id){
  if(type==="conduct")return !!(typeof QUICK_CONDUCT_CARDS!=="undefined"&&QUICK_CONDUCT_CARDS[id]);
  if(type==="protocol")return !!(typeof DATA!=="undefined"&&DATA&&DATA.protocols&&DATA.protocols[id]);
  if(type==="prescription")return !!(typeof PRESCRICOES_DATA!=="undefined"&&PRESCRICOES_DATA[id]);
  if(type==="profile"||type==="alert")return !!(typeof PACIENTES_ESPECIAIS_DATA!=="undefined"&&PACIENTES_ESPECIAIS_DATA[id]);
  return false;
}

function clinicalTitleForItem(type,id){
  if(type==="conduct")return QUICK_CONDUCT_CARDS[id]?.title||id;
  if(type==="protocol")return DATA.protocols[id]?.title||id;
  if(type==="prescription")return PRESCRICOES_DATA[id]?.titulo||PRESCRICOES_LIST?.find(item=>item.id===id)?.label||id;
  if(type==="profile"||type==="alert")return PACIENTES_ESPECIAIS_DATA[id]?.titulo||PACIENTES_ESPECIAIS_LIST?.find(item=>item.id===id)?.label||id;
  return id;
}

function clinicalSearchTextForItem(type,id){
  if(type==="conduct"){
    const card=QUICK_CONDUCT_CARDS[id]||{};
    return [card.title,card.subtitle,card.quick,...(card.synonyms||[]),...(card.behind||[]),...(card.changes||[])].join(" ");
  }
  if(type==="protocol"){
    const p=DATA.protocols[id]||{};
    const tipText=p.tip?(typeof p.tip==="string"?p.tip:[p.tip.text,p.tip.note].filter(Boolean).join(" ")):"";
    return [
      p.title,
      tipText,
      ...(p.steps||[]),
      ...(p.errors||[]),
      ...(p.decisions||[]).flatMap(d=>[d.if,d.then]),
      ...(p.panic||[]).flatMap(panic=>[panic.problem,panic.solution])
    ].join(" ");
  }
  if(type==="prescription"){
    const data=PRESCRICOES_DATA[id]||{};
    const blocks=Object.values(data.blocos||{}).flat();
    return [data.titulo,...(data.filtros||[]),...blocks.flatMap(block=>[block.secao,...(block.itens||[])])].join(" ");
  }
  if(type==="profile"||type==="alert"){
    const data=PACIENTES_ESPECIAIS_DATA[id]||{};
    return [data.titulo,...(data.blocos||[]).flatMap(block=>[block.secao,...(block.itens||[])])].join(" ");
  }
  return "";
}

function buildClinicalSearchIndex(){
  const items=[];
  if(typeof QUICK_CONDUCT_CARDS!=="undefined"){
    Object.keys(QUICK_CONDUCT_CARDS).forEach(id=>{
      items.push({type:"conduct",id,title:clinicalTitleForItem("conduct",id),kind:clinicalLabelForType("conduct"),baseScore:12,badges:[]});
    });
  }
  if(typeof DATA!=="undefined"&&DATA&&DATA.protocols){
    Object.keys(DATA.protocols).forEach(id=>{
      items.push({type:"protocol",id,title:clinicalTitleForItem("protocol",id),kind:clinicalLabelForType("protocol"),baseScore:8,badges:[]});
    });
  }
  if(typeof PRESCRICOES_DATA!=="undefined"){
    Object.keys(PRESCRICOES_DATA).forEach(id=>{
      items.push({type:"prescription",id,title:clinicalTitleForItem("prescription",id),kind:clinicalLabelForType("prescription"),baseScore:6,badges:["Prescrição"]});
    });
  }
  if(typeof PACIENTES_ESPECIAIS_DATA!=="undefined"){
    Object.keys(PACIENTES_ESPECIAIS_DATA).forEach(id=>{
      items.push({type:"profile",id,title:clinicalTitleForItem("profile",id),kind:clinicalLabelForType("profile"),baseScore:5,badges:[]});
    });
  }
  return items;
}

function clinicalScoreTextMatch(item,query){
  const normalizedQuery=clinicalNormalize(query);
  const qTokens=clinicalUsefulTokens(query);
  const titleNorm=clinicalNormalize(item.title);
  const haystack=clinicalNormalize(clinicalSearchTextForItem(item.type,item.id));
  const itemTokens=clinicalTokens(haystack);
  let score=0;
  let matched=false;
  if(titleNorm===normalizedQuery){
    score+=110;
    matched=true;
  }else if(normalizedQuery.length>=3&&(titleNorm.includes(normalizedQuery)||normalizedQuery.includes(titleNorm))){
    score+=74;
    matched=true;
  }
  qTokens.forEach(qt=>{
    if(titleNorm.split(" ").includes(qt)){
      score+=36;
      matched=true;
    }else if(titleNorm.includes(qt)){
      score+=24;
      matched=true;
    }
    if(haystack.includes(qt)){
      score+=10;
      matched=true;
    }
    let best=0;
    itemTokens.forEach(it=>{best=Math.max(best,clinicalFuzzyScore(qt,it));});
    if(best>0){
      score+=Math.min(best,24);
      matched=true;
    }
  });
  if(!matched)return 0;
  score+=item.baseScore||0;
  if(item.type==="conduct")score+=8;
  if(item.type==="protocol")score+=5;
  if(item.id&&typeof USAGE_COUNT!=="undefined"&&USAGE_COUNT)score+=Math.min((USAGE_COUNT[item.id]||0)*4,24);
  return score;
}

function clinicalTypeOrder(type,intentIds){
  if(type==="conduct")return 1;
  if(intentIds&&(
    intentIds.includes("gestante")||
    intentIds.includes("anticoagulado")
  )){
    if(type==="alert")return 2;
    if(type==="profile")return 3;
    if(type==="protocol")return 4;
    if(type==="prescription")return 5;
    return 9;
  }
  if(intentIds&&(
    intentIds.includes("prescricao")||
    intentIds.includes("crianca")
  )){
    if(type==="prescription")return 2;
    if(type==="protocol")return 3;
    if(type==="alert")return 4;
    if(type==="profile")return 5;
    return 9;
  }
  if(type==="protocol")return 2;
  if(type==="prescription")return 3;
  if(type==="alert")return 4;
  if(type==="profile")return 5;
  return 9;
}

function clinicalIntentHasContentGap(intentId){
  return !!(typeof CLINICAL_SEARCH_CONTENT_GAPS!=="undefined"&&CLINICAL_SEARCH_CONTENT_GAPS&&CLINICAL_SEARCH_CONTENT_GAPS[intentId]);
}

function clinicalIntentShouldAvoidBest(intentIds){
  return intentIds.some(id=>["prescricao","gestante","crianca","anticoagulado"].includes(id));
}

function clinicalIntentSearch(query,options){
  const limit=(options&&options.limit)||8;
  const intents=detectClinicalIntents(query);
  const byKey=new Map();
  buildClinicalSearchIndex().forEach(item=>{
    const score=clinicalScoreTextMatch(item,query);
    if(score>18)byKey.set(item.type+":"+item.id,{...item,score,matchSource:"text"});
  });

  intents.forEach((intent,intentIndex)=>{
    const relations=(CLINICAL_SEARCH_RELATIONS&&CLINICAL_SEARCH_RELATIONS[intent.id])||[];
    relations.forEach(rel=>{
      if(!clinicalItemExists(rel.type,rel.id))return;
      const keyType=rel.type==="alert"?"profile":rel.type;
      const key=keyType+":"+rel.id;
      const existing=byKey.get(key)||{
        type:rel.type,
        id:rel.id,
        title:clinicalTitleForItem(rel.type,rel.id),
        kind:clinicalLabelForType(rel.type),
        score:0,
        badges:[]
      };
      const intentBoost=Math.min(intent.score,92);
      existing.score+=rel.weight+intentBoost-(intentIndex*8);
      if((intent.id==="gestante"||intent.id==="crianca")&&rel.type==="prescription")existing.score+=20;
      if(rel.type==="alert"){
        existing.type="alert";
        existing.kind=clinicalLabelForType("alert");
        existing.title=clinicalTitleForItem("alert",rel.id);
      }
      existing.badges=clinicalMergeBadges(existing.badges,rel.badges,intent.badges);
      existing.profile=rel.profile||existing.profile;
      existing.matchSource="intent";
      byKey.set(key,existing);
    });
  });

  let all=Array.from(byKey.values());
  if(!all.length&&CLINICAL_SEARCH_COMMON){
    all=CLINICAL_SEARCH_COMMON.filter(rel=>clinicalItemExists(rel.type,rel.id)).map(rel=>({
      type:rel.type,
      id:rel.id,
      title:clinicalTitleForItem(rel.type,rel.id),
      kind:clinicalLabelForType(rel.type),
      score:rel.weight,
      badges:rel.badges||[],
      profile:rel.profile,
      matchSource:"common"
    }));
  }

  const intentIds=intents.map(intent=>intent.id);
  if(intentIds.length){
    const exclusiveIntentIds=["sensibilidade_cervical","acabamento_proximal","ajuste_oclusal_restauracao"];
    if(exclusiveIntentIds.includes(intents[0]?.id)){
      const topIntentId=intents[0].id;
      const allowed=new Set(((CLINICAL_SEARCH_RELATIONS&&CLINICAL_SEARCH_RELATIONS[topIntentId])||[]).map(rel=>rel.type+":"+rel.id));
      all=all.filter(item=>allowed.has(item.type+":"+item.id));
    }else{
      all=all.filter(item=>item.matchSource==="intent"||item.score>=120);
    }
  }
  all=all
    .map(item=>({...item,badges:clinicalMergeBadges(item.badges)}))
    .map(item=>{
      if(intentIds.includes("crianca")&&item.type==="prescription"&&item.id==="odontopediatria"){
        return {...item,score:item.score+220,badges:clinicalMergeBadges(item.badges,["Pediátrico","Prescrição"])};
      }
      if(intentIds.includes("gestante")&&item.type==="alert"&&item.id==="gestantes"){
        return {...item,score:item.score+500,badges:clinicalMergeBadges(item.badges,["Gestante","Prescrição"])};
      }
      if(intentIds.includes("anticoagulado")&&item.type==="alert"&&item.id==="coagulopatas"){
        return {...item,score:item.score+300,badges:clinicalMergeBadges(item.badges,["Anticoagulado","Urgência"])};
      }
      if(intentIds.includes("sensibilidade_cervical")){
        if(item.type==="protocol"&&item.id==="recessao-gengival")return {...item,score:item.score+260};
        if(item.type==="protocol"&&item.id==="dessensibilizante")return {...item,score:item.score+180};
        if(item.type==="protocol"&&item.id==="ajuste-oclusal-restauracao")return {...item,score:item.score-60};
      }
      return item;
    })
    .filter(item=>intentIds.includes("crianca")||item.id!=="odontopediatria")
    .sort((a,b)=>b.score-a.score||clinicalTypeOrder(a.type,intentIds)-clinicalTypeOrder(b.type,intentIds)||a.title.localeCompare(b.title))
    .slice(0,limit);

  const usedIntent=intents.length>0&&all.some(item=>item.matchSource==="intent");
  const topIntentId=intents[0]?.id||"";
  const hasContentGap=usedIntent&&clinicalIntentHasContentGap(topIntentId);
  const avoidBest=usedIntent&&clinicalIntentShouldAvoidBest(intentIds);
  return {
    usedIntent,
    intents,
    hasContentGap,
    contentGap: hasContentGap?CLINICAL_SEARCH_CONTENT_GAPS[topIntentId]:"",
    best: usedIntent&&!hasContentGap&&!avoidBest&&all.length?[all[0]]:[],
    related: usedIntent&&!hasContentGap&&!avoidBest?all.slice(1):all,
    all
  };
}
