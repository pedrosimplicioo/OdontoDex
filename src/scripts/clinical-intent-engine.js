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
  if(type==="anesthetic")return "Anestésico";
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

function clinicalIntentRulesFor(intentId){
  if(typeof CLINICAL_INTENT_RULES==="undefined"||!CLINICAL_INTENT_RULES)return {};
  return CLINICAL_INTENT_RULES[intentId]||{};
}

function clinicalPhrasePresent(normalized,raw){
  const term=clinicalNormalize(raw);
  return !!(term&&term.length>2&&(normalized===term||normalized.includes(term)||term.includes(normalized)));
}

function clinicalAnyTermPresent(normalized,terms){
  return (terms||[]).some(term=>clinicalPhrasePresent(normalized,term));
}

function clinicalScoreIntentTerm(normalized,qTokens,raw,weight){
  const term=clinicalNormalize(raw);
  const termTokens=clinicalUsefulTokens(raw);
  if(!term)return 0;
  let score=0;
  if(normalized===term)score+=96*weight;
  else if(term.length>3&&(normalized.includes(term)||term.includes(normalized)))score+=72*weight;
  termTokens.forEach(st=>{
    let best=0;
    qTokens.forEach(qt=>{best=Math.max(best,clinicalFuzzyScore(qt,st));});
    score+=best*weight;
  });
  return score;
}

function clinicalIntentTermGroups(intent,rules){
  return [
    {name:"synonyms",weight:1,terms:intent.synonyms||[]},
    {name:"symptoms",weight:1.16,terms:rules.symptoms||[]},
    {name:"redFlags",weight:1.35,terms:rules.redFlags||[]},
    {name:"procedures",weight:1.08,terms:rules.procedures||[]},
    {name:"profiles",weight:1.25,terms:rules.profiles||[]},
    {name:"differentiators",weight:1.1,terms:rules.differentiators||[]}
  ];
}

function detectClinicalIntents(query){
  const normalized=clinicalNormalize(query);
  const qTokens=clinicalUsefulTokens(query);
  if(!normalized||!CLINICAL_SEARCH_INTENTS)return [];
  return Object.entries(CLINICAL_SEARCH_INTENTS).map(([id,intent])=>{
    let score=0;
    const rules=clinicalIntentRulesFor(id);
    const matchedGroups=new Set();
    clinicalIntentTermGroups(intent,rules).forEach(group=>{
      (group.terms||[]).forEach(raw=>{
        score+=clinicalScoreIntentTerm(normalized,qTokens,raw,group.weight);
        if(clinicalPhrasePresent(normalized,raw))matchedGroups.add(group.name);
      });
    });
    if(rules.excludes&&clinicalAnyTermPresent(normalized,rules.excludes))score-=90;
    if(rules.requiredAny&&!clinicalAnyTermPresent(normalized,rules.requiredAny))score=0;
    if(matchedGroups.has("redFlags"))score+=45;
    if(rules.urgency==="alta"&&score>0)score+=8;
    if(rules.preferredMode==="profile"&&score>0)score+=10;
    if(id==="restauracao_solto_fratura"&&!/\b(caiu|soltou|descolou|perdeu|saiu|quebrou|fraturou|lascou|rachou|trincou)\b/.test(normalized))score=0;
    if(id==="restauracao_procedimento"&&/\b(alta|alto|mordendo|batendo|oclusao|hiperoclusao|prematuro|caiu|soltou|descolou|perdeu|saiu|quebrou|fraturou|lascou|rachou|trincou|dor|doendo|sensivel)\b/.test(normalized))score=0;
    if(id==="restauracao_procedimento"&&/\b(fio|proximal|contato|overhang|matriz|cunha)\b/.test(normalized))score=0;
    if(id==="sensibilidade_cervical"&&/\b(hipertenso|hipertensa|cardiopata|cardiaco|cardiaca|pressao alta|pa elevada)\b/.test(normalized)&&!/\b(sensivel|sensibilidade|frio|gelada|doce|raiz exposta|recessao|retracao|cervical|escovacao|ar)\b/.test(normalized))score=0;
    if(id==="acabamento_proximal"&&!/\b(acabamento|polimento|proximal|contato|fio|rasga|desfia|trava|overhang|excesso|sobrecontorno|interproximal|classe ii|classe 2|matriz|cunha|anel)\b/.test(normalized))score=0;
    if(id==="ajuste_oclusal_restauracao"&&!/\b(alta|alto|mordendo|batendo|oclusao|hiperoclusao|prematuro|papel|carbono|mic|lateralidade|protrusao|shimstock)\b/.test(normalized))score=0;
    if(id==="ajuste_oclusal_restauracao"&&score>0)score+=80;
    return {
      id,
      label:intent.label,
      score,
      badges:clinicalMergeBadges(intent.badges,rules.urgency==="alta"?["Urgência"]:[]),
      category:rules.category,
      urgency:rules.urgency,
      preferredMode:rules.preferredMode,
      exclusive:!!rules.exclusive
    };
  }).filter(intent=>intent.score>=32).sort((a,b)=>b.score-a.score);
}

function clinicalItemExists(type,id){
  if(type==="conduct")return !!(typeof QUICK_CONDUCT_CARDS!=="undefined"&&QUICK_CONDUCT_CARDS[id]);
  if(type==="protocol")return !!(typeof DATA!=="undefined"&&DATA&&DATA.protocols&&DATA.protocols[id]);
  if(type==="prescription")return !!(typeof PRESCRICOES_DATA!=="undefined"&&PRESCRICOES_DATA[id]);
  if(type==="profile"||type==="alert")return !!(typeof PACIENTES_ESPECIAIS_DATA!=="undefined"&&PACIENTES_ESPECIAIS_DATA[id]);
  if(type==="anesthetic")return !!(typeof ANESTESICOS_DATA!=="undefined"&&ANESTESICOS_DATA[id]);
  return false;
}

function clinicalTitleForItem(type,id){
  if(type==="conduct")return QUICK_CONDUCT_CARDS[id]?.title||id;
  if(type==="protocol")return DATA.protocols[id]?.title||id;
  if(type==="prescription")return PRESCRICOES_DATA[id]?.titulo||PRESCRICOES_LIST?.find(item=>item.id===id)?.label||id;
  if(type==="profile"||type==="alert")return PACIENTES_ESPECIAIS_DATA[id]?.titulo||PACIENTES_ESPECIAIS_LIST?.find(item=>item.id===id)?.label||id;
  if(type==="anesthetic")return ANESTESICOS_DATA[id]?.titulo||ANESTESICOS_LIST?.find(item=>item.id===id)?.label||id;
  return id;
}

function clinicalSearchTextForItem(type,id){
  if(type==="conduct"){
    const card=QUICK_CONDUCT_CARDS[id]||{};
    return [
      card.title,
      card.subtitle,
      card.intent,
      card.quick,
      ...(card.synonyms||[]),
      ...(card.behind||[]),
      ...(card.changes||[]),
      ...(card.protocols||[]).map(item=>item.label),
      ...(card.related||[]).map(item=>item.label)
    ].join(" ");
  }
  if(type==="protocol"){
    const p=DATA.protocols[id]||{};
    const tipText=p.tip?(typeof p.tip==="string"?p.tip:[p.tip.text,p.tip.note].filter(Boolean).join(" ")):"";
    return [
      p.title,
      tipText,
      ...(p.steps||[]),
      ...(p.errors||[]),
      ...(p.decisions||[]).flatMap(d=>[d.if,d.then])
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
  if(type==="anesthetic"){
    const data=ANESTESICOS_DATA[id]||{};
    return [data.titulo,"anestesia anestésico anestesico",...(data.blocos||[]).flatMap(block=>[block.secao,...(block.itens||[])])].join(" ");
  }
  return "";
}

function clinicalQueryHasAnestheticNeed(query){
  const normalized=clinicalNormalize(query);
  return /\b(anestesia|anestesico|anestesiar|anestesia local|tubete|vasoconstrictor|lidocaina|prilocaina|mepivacaina|articaina|citanest|xilocaina|scandicaine|biopressin|citocaina|novocol|epinefrina|adrenalina|felipressina)\b/.test(normalized);
}

function clinicalDetectAnestheticProfile(query){
  const normalized=clinicalNormalize(query);
  const patterns=[
    {id:"gestantes-lactantes", badge:"Gestante", re:/\b(gestante|gravida|lactante|amamentando|gravidez|obstetra)\b/},
    {id:"odontopediatria", badge:"Pediátrico", re:/\b(crianca|infantil|pediatrico|odontopediatria|bebe|bebezinho|kg)\b/},
    {id:"idosos", badge:"Idoso", re:/\b(idoso|idosa|geriatrico|fragil|polifarmacia)\b/},
    {id:"cardiopatas", badge:"Cardiopata", re:/\b(cardiopata|cardiaco|cardiaca|hipertenso|hipertensa|pressao|pa elevada|infarto|arritmia|angina)\b/},
    {id:"diabeticos", badge:"Diabético", re:/\b(diabetico|diabetica|diabetes|glicemia|hipoglicemia|insulina)\b/},
    {id:"asmaticos", badge:"Asmático", re:/\b(asmatico|asmatica|asma|bronquite|bombinha|sulfito|sulfitos|chiado)\b/},
    {id:"epilepticos", badge:"Epiléptico", re:/\b(epileptico|epileptica|epilepsia|convulsao|crise convulsiva|anticonvulsivante)\b/},
    {id:"coagulopatas", badge:"Coagulopata", re:/\b(coagulopata|coagulopatia|anticoagulado|anticoagulante|hemofilia|inr|marevan|varfarina|xarelto|rivaroxabana|eliquis|apixabana)\b/},
    {id:"hepatopatas", badge:"Hepatopata", re:/\b(hepatopata|hepatopatia|figado|hepatico|hepatica|cirrose|ictericia)\b/},
    {id:"nefropatas", badge:"Nefropata", re:/\b(nefropata|nefropatia|renal|rim|rins|dialise|hemodialise)\b/}
  ];
  return patterns.find(item=>item.re.test(normalized))||null;
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
  if(typeof ANESTESICOS_DATA!=="undefined"){
    Object.keys(ANESTESICOS_DATA).forEach(id=>{
      items.push({type:"anesthetic",id,title:clinicalTitleForItem("anesthetic",id),kind:clinicalLabelForType("anesthetic"),baseScore:6,badges:["Anestésicos"]});
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

function clinicalDirectMatchScore(item,query){
  const normalizedQuery=clinicalNormalize(query);
  const titleNorm=clinicalNormalize(item.title);
  const idNorm=clinicalNormalize(item.id);
  if(!normalizedQuery)return 0;
  if(titleNorm&&normalizedQuery===titleNorm)return 1600;
  if(idNorm&&normalizedQuery===idNorm)return 1400;
  if(titleNorm&&normalizedQuery.length>=4&&(titleNorm.includes(normalizedQuery)||normalizedQuery.includes(titleNorm)))return 900;
  return 0;
}

function clinicalQueryMode(query,intentIds){
  const normalized=clinicalNormalize(query);
  const topRules=intentIds&&intentIds.length?clinicalIntentRulesFor(intentIds[0]):{};
  const hasProfile=/\b(gestante|gravida|lactante|crianca|infantil|pediatrico|anticoagulado|coagulopata|diabetico|hipertenso|hipertensa|cardiopata|cardiaco|cardiaca|pressao alta|pa elevada|asmatico|alergico|idoso)\b/.test(normalized);
  const hasAnesthetic=clinicalQueryHasAnestheticNeed(query);
  const hasAnestheticFailure=/\b(anestesia nao pega|nao anestesia|nao consigo anestesiar|anestesia falhou|falha anestesica|anestesia nao funcionou|dor mesmo anestesiado|bloqueio nao pegou)\b/.test(normalized);
  const hasPrescription=/\b(remedio|medicamento|receita|prescricao|prescrever|tomar|nimesulida|ibuprofeno|amoxicilina|antibiotico|analgesico|antiinflamatorio|dipirona|paracetamol)\b/.test(normalized);
  const hasTechnical=/\b(classe|moldagem|cimentacao|preparo|restauracao proximal|acabamento proximal|ajuste oclusal|isolamento|capeamento|pulpotomia|endodontia|exodontia|cirurgia|aumento de coroa|provisorio|provisoria|pino de fibra|nucleo|resina|protocolo|passo)\b/.test(normalized);
  const hasProblem=/\b(caiu|soltou|saiu|quebrou|fraturou|lascou|rachou|nao entra|nao passa|rasga|desfia|dor|doendo|sensivel|sensibilidade|sangra|sangramento|inchado|abscesso|anestesia nao pega|nao anestesia|mastigar|morder|alto|batendo|travou|travado|perdeu)\b/.test(normalized);
  if(hasAnestheticFailure)return "conduct";
  if(hasAnesthetic)return "anesthetic";
  if(hasProfile||intentIds.some(id=>["gestante","crianca","anticoagulado"].includes(id)))return "profile";
  if(hasPrescription||intentIds.includes("prescricao"))return "prescription";
  if(topRules.preferredMode)return topRules.preferredMode;
  if(hasTechnical&&!hasProblem)return "protocol";
  return "conduct";
}

function clinicalApplyPriority(item,mode,intentIds){
  if(mode==="anesthetic"){
    if(item.type==="anesthetic")return {...item,score:item.score+180};
    if(item.type==="profile")return {...item,score:item.score+70};
    if(item.type==="prescription")return {...item,score:item.score+30};
    return item;
  }
  if(mode==="profile"){
    if(item.type==="alert")return {...item,score:item.score+180};
    if(item.type==="profile")return {...item,score:item.score+150};
    if(item.type==="prescription")return {...item,score:item.score+90};
    if(item.type==="conduct")return {...item,score:item.score+20};
    return item;
  }
  if(mode==="prescription"){
    if(item.type==="prescription")return {...item,score:item.score+180};
    if(item.type==="alert"||item.type==="profile")return {...item,score:item.score+60};
    if(item.type==="conduct")return {...item,score:item.score+25};
    return item;
  }
  if(mode==="protocol"){
    if(item.type==="protocol")return {...item,score:item.score+120};
    if(item.type==="conduct")return {...item,score:item.score+35};
    return item;
  }
  if(item.type==="conduct")return {...item,score:item.score+160};
  if(item.type==="protocol")return {...item,score:item.score+10};
  if(item.type==="prescription"&&!intentIds.includes("prescricao"))return {...item,score:item.score-20};
  return item;
}

function clinicalTypeOrder(type,intentIds){
  if(type==="conduct")return 1;
  if(intentIds&&intentIds.some(id=>clinicalIntentRulesFor(id).preferredMode==="profile")){
    if(type==="alert")return 2;
    if(type==="profile")return 3;
    if(type==="anesthetic")return 4;
    if(type==="protocol")return 5;
    if(type==="prescription")return 6;
    return 9;
  }
  if(intentIds&&(
    intentIds.includes("prescricao")||
    intentIds.includes("crianca")
  )){
    if(type==="prescription")return 2;
    if(type==="anesthetic")return 3;
    if(type==="protocol")return 4;
    if(type==="alert")return 5;
    if(type==="profile")return 6;
    return 9;
  }
  if(type==="protocol")return 2;
  if(type==="prescription")return 3;
  if(type==="anesthetic")return 4;
  if(type==="alert")return 5;
  if(type==="profile")return 6;
  return 9;
}

function clinicalIntentHasContentGap(intentId){
  return !!(typeof CLINICAL_SEARCH_CONTENT_GAPS!=="undefined"&&CLINICAL_SEARCH_CONTENT_GAPS&&CLINICAL_SEARCH_CONTENT_GAPS[intentId]);
}

function clinicalIntentShouldAvoidBest(intentIds){
  return intentIds.some(id=>{
    const mode=clinicalIntentRulesFor(id).preferredMode;
    return ["prescricao","gestante","crianca","anticoagulado"].includes(id)||mode==="profile"||mode==="prescription";
  });
}

function clinicalIntentSearch(query,options){
  const limit=(options&&options.limit)||8;
  const intents=detectClinicalIntents(query);
  const normalizedForRules=clinicalNormalize(query);
  const byKey=new Map();
  buildClinicalSearchIndex().forEach(item=>{
    const score=clinicalScoreTextMatch(item,query);
    const directScore=clinicalDirectMatchScore(item,query);
    if(score>18||directScore>0){
      byKey.set(item.type+":"+item.id,{
        ...item,
        score:score+directScore,
        directMatch:directScore>0,
        matchSource:directScore>0?"direct":"text"
      });
    }
  });

  intents.forEach((intent,intentIndex)=>{
    const rules=clinicalIntentRulesFor(intent.id);
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
      let relationBoost=rel.weight+intentBoost-(intentIndex*8);
      if(rules.urgency==="alta")relationBoost+=16;
      if(rules.preferredMode&&rel.type===rules.preferredMode)relationBoost+=30;
      if(rules.preferredMode==="profile"&&rel.type==="alert")relationBoost+=30;
      if(rules.redFlags&&clinicalAnyTermPresent(normalizedForRules,rules.redFlags))relationBoost+=42;
      existing.score+=relationBoost;
      if((intent.id==="gestante"||intent.id==="crianca")&&rel.type==="prescription")existing.score+=20;
      if(rel.type==="alert"){
        existing.type="alert";
        existing.kind=clinicalLabelForType("alert");
        existing.title=clinicalTitleForItem("alert",rel.id);
      }
      existing.badges=clinicalMergeBadges(existing.badges,rel.badges,intent.badges,rules.urgency==="alta"?["Urgência"]:[]);
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
    const exclusiveIntentIds=["sensibilidade_cervical","restauracao_procedimento","acabamento_proximal","ajuste_oclusal_restauracao","dor_mastigar","restauracao_solto_fratura","exodontia_extracao"];
    const topRules=clinicalIntentRulesFor(intents[0]?.id);
    if(exclusiveIntentIds.includes(intents[0]?.id)||topRules.exclusive){
      const topIntentId=intents[0].id;
      const allowed=new Set(((CLINICAL_SEARCH_RELATIONS&&CLINICAL_SEARCH_RELATIONS[topIntentId])||[]).map(rel=>rel.type+":"+rel.id));
      intentIds
        .filter(id=>clinicalIntentRulesFor(id).preferredMode==="profile")
        .forEach(id=>{
          ((CLINICAL_SEARCH_RELATIONS&&CLINICAL_SEARCH_RELATIONS[id])||[]).forEach(rel=>{
            allowed.add(rel.type+":"+rel.id);
          });
        });
      all=all.filter(item=>item.directMatch||allowed.has(item.type+":"+item.id));
    }else{
      all=all.filter(item=>item.directMatch||item.matchSource==="intent"||item.score>=120);
    }
  }
  const anestheticProfile=clinicalQueryHasAnestheticNeed(query)?clinicalDetectAnestheticProfile(query):null;
  if(anestheticProfile&&clinicalItemExists("anesthetic",anestheticProfile.id)){
    const profileCard=all.find(item=>item.type==="conduct"&&item.id==="anestesico-perfil-paciente");
    if(profileCard){
      profileCard.score+=1120;
      profileCard.badges=clinicalMergeBadges(profileCard.badges,["Anestésicos",anestheticProfile.badge]);
      profileCard.matchSource=profileCard.matchSource||"anesthetic-profile";
    }else if(clinicalItemExists("conduct","anestesico-perfil-paciente")){
      all.push({
        type:"conduct",
        id:"anestesico-perfil-paciente",
        title:clinicalTitleForItem("conduct","anestesico-perfil-paciente"),
        kind:clinicalLabelForType("conduct"),
        score:1120,
        badges:clinicalMergeBadges(["Anestésicos",anestheticProfile.badge]),
        matchSource:"anesthetic-profile"
      });
    }
    const existing=all.find(item=>item.type==="anesthetic"&&item.id===anestheticProfile.id);
    if(existing){
      existing.score+=900;
      existing.badges=clinicalMergeBadges(existing.badges,["Anestésicos",anestheticProfile.badge]);
      existing.matchSource=existing.matchSource||"anesthetic-profile";
    }else{
      all.push({
        type:"anesthetic",
        id:anestheticProfile.id,
        title:clinicalTitleForItem("anesthetic",anestheticProfile.id),
        kind:clinicalLabelForType("anesthetic"),
        score:980,
        badges:clinicalMergeBadges(["Anestésicos",anestheticProfile.badge]),
        matchSource:"anesthetic-profile"
      });
    }
  }
  const normalizedForManual=clinicalNormalize(query);
  const ensureManualResult=(type,id,score,badges)=>{
    if(!clinicalItemExists(type,id))return;
    const existing=all.find(item=>item.type===type&&item.id===id);
    if(existing){
      existing.score+=score;
      existing.badges=clinicalMergeBadges(existing.badges,badges||[]);
      existing.matchSource=existing.matchSource||"manual";
      return;
    }
    all.push({
      type,
      id,
      title:clinicalTitleForItem(type,id),
      kind:clinicalLabelForType(type),
      score,
      badges:clinicalMergeBadges(badges||[]),
      matchSource:"manual"
    });
  };
  if(/\b(dentadura|protese total)\b/.test(normalizedForManual)&&/\b(frouxa|solta|caindo|sem retencao|instavel|perde vacuo)\b/.test(normalizedForManual)){
    ensureManualResult("conduct","protese-total-caindo",1120,[]);
  }
  if(/\b(fistula|pus)\b/.test(normalizedForManual)&&/\b(gengiva|dente|boca|abscesso)\b/.test(normalizedForManual)){
    ensureManualResult("conduct","fistula-gengiva",980,["Urgência"]);
  }
  if(/\b(inchaco|inchado|edema|face|facial|rosto)\b/.test(normalizedForManual)&&/\b(rosto|face|facial|inchaco|inchado|edema)\b/.test(normalizedForManual)){
    ensureManualResult("conduct","inchaco-rosto",1040,["Urgência"]);
  }
  const isExtractionPlanning=/\b(exodontia|extracao|extrair|tirar dente|arrancar dente|remover dente)\b/.test(normalizedForManual);
  const isPostExtraction=/\b(pos|apos|depois|dor|doendo|alveolite|sangramento|sangra|espicula|osso espetando|mau cheiro|mal cheiro)\b/.test(normalizedForManual);
  if(isExtractionPlanning&&!isPostExtraction){
    ensureManualResult("protocol","extracao-simples",1300,["Cirurgia"]);
    ensureManualResult("protocol","extracao-cirurgica",1180,["Cirurgia"]);
  }
  const isRestorationPlanning=/\b(restau|restauracao|restaurar|resina|obturacao)\b/.test(normalizedForManual);
  const isRestorationProblem=/\b(alta|alto|mordendo|batendo|oclusao|caiu|soltou|descolou|perdeu|saiu|quebrou|fraturou|lascou|rachou|trincou|dor|doendo|sensivel)\b/.test(normalizedForManual);
  const isSpecificRestoration=/\b(classe ii|classe 2|proximal|contato|fio|matriz|cunha|fratura|carie profunda|carie|cervical)\b/.test(normalizedForManual);
  if(isRestorationPlanning&&!isRestorationProblem&&!isSpecificRestoration){
    ensureManualResult("protocol","trocar-rest",780,["Dentística"]);
    ensureManualResult("protocol","restauracao-carie",520,["Dentística"]);
  }
  const queryMode=clinicalQueryMode(query,intentIds);
  all=all
    .map(item=>({...item,badges:clinicalMergeBadges(item.badges)}))
    .map(item=>clinicalApplyPriority(item,queryMode,intentIds))
    .map(item=>{
      if(intentIds.includes("crianca")&&item.type==="prescription"&&item.id==="odontopediatria"){
        return {...item,score:item.score+220,badges:clinicalMergeBadges(item.badges,["Pediátrico","Prescrição"])};
      }
      if(intentIds.includes("gestante")&&item.type==="alert"&&item.id==="gestantes"){
        return {...item,score:item.score+1500,badges:clinicalMergeBadges(item.badges,["Gestante","Prescrição"])};
      }
      if(intentIds.includes("anticoagulado")&&item.type==="alert"&&item.id==="coagulopatas"){
        return {...item,score:item.score+300,badges:clinicalMergeBadges(item.badges,["Anticoagulado","Urgência"])};
      }
      if(intentIds.includes("cardiopata_hipertenso")&&item.type==="alert"&&item.id==="cardiopatas"){
        return {...item,score:item.score+1200,badges:clinicalMergeBadges(item.badges,["Cardiopata"])};
      }
      if(intentIds.includes("sensibilidade_cervical")){
        if(item.type==="conduct"&&item.id==="dente-sensivel")return {...item,score:item.score+320};
        if(item.type==="protocol"&&item.id==="recessao-gengival")return {...item,score:item.score+260};
        if(item.type==="protocol"&&item.id==="dessensibilizante")return {...item,score:item.score+180};
        if(item.type==="protocol"&&item.id==="ajuste-oclusal-restauracao")return {...item,score:item.score-60};
      }
      const normalizedQuery=clinicalNormalize(query);
      if(/\b(coroa|protese fixa)\b/.test(normalizedQuery)&&/\b(caiu|soltou|saiu|descolou)\b/.test(normalizedQuery)){
        if(item.type==="conduct"&&item.id==="coroa-caiu")return {...item,score:item.score+520};
        if(item.type==="conduct"&&item.id==="restauracao-caiu")return {...item,score:item.score-180};
        if(item.type==="conduct"&&item.id==="restauracao-fraturou")return {...item,score:item.score-180};
      }
      if(/\b(siso|terceiro molar|impactado|incluso|semi incluso|semiincluso)\b/.test(normalizedQuery)){
        if(item.type==="protocol"&&item.id==="extracao-cirurgica")return {...item,score:item.score+420};
        if(item.type==="protocol"&&item.id==="extracao-simples")return {...item,score:item.score-80};
      }
      if(/\b(extracao|exodontia|extrair|tirar dente|arrancar dente)\b/.test(normalizedQuery)&&/\b(simples|unirradicular|raiz reta|facil)\b/.test(normalizedQuery)){
        if(item.type==="protocol"&&item.id==="extracao-simples")return {...item,score:item.score+280};
        if(item.type==="protocol"&&item.id==="extracao-cirurgica")return {...item,score:item.score-80};
      }
      if(/\b(pino|nucleo)\b/.test(normalizedQuery)&&/\b(caiu|soltou|saiu|descolou)\b/.test(normalizedQuery)){
        if(item.type==="conduct"&&item.id==="pino-nucleo-soltou")return {...item,score:item.score+520};
        if(item.type==="conduct"&&item.id==="coroa-caiu")return {...item,score:item.score-80};
      }
      if(/\b(resina|obturacao|restauracao)\b/.test(normalizedQuery)&&/\b(quebrou|fraturou|lascou|rachou|trincou)\b/.test(normalizedQuery)){
        if(item.type==="conduct"&&item.id==="restauracao-fraturou")return {...item,score:item.score+360};
        if(item.type==="conduct"&&item.id==="protese-quebrou-card")return {...item,score:item.score-120};
      }
      if(/\b(dentadura|protese total)\b/.test(normalizedQuery)&&/\b(frouxa|solta|caindo|sem retencao|instavel|perde vacuo)\b/.test(normalizedQuery)){
        if(item.type==="conduct"&&item.id==="protese-total-caindo")return {...item,score:item.score+360};
        if(item.type==="conduct"&&item.id==="protese-quebrou-card")return {...item,score:item.score-120};
      }
      if(/\b(dente mole|dente amolecido|dente balancando|mobilidade dental|mobilidade dentaria)\b/.test(normalizedQuery)){
        if(item.type==="conduct"&&item.id==="mobilidade-dental")return {...item,score:item.score+420};
        if(item.type==="conduct"&&item.id==="restauracao-caiu")return {...item,score:item.score-120};
      }
      if(/\b(anestesia nao pega|nao anestesia|nao consigo anestesiar|anestesia falhou|falha anestesica|anestesia nao funcionou|bloqueio nao pegou)\b/.test(normalizedQuery)){
        if(item.type==="conduct"&&item.id==="dente-nao-anestesia")return {...item,score:item.score+520};
        if(item.type==="anesthetic")return {...item,score:item.score-260};
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
