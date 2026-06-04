// ==================== DADOS ====================
const PREMIUM_CATEGORIES = ["protese","endodontia","cirurgia","perio"];

// Situações exibidas no modal de upgrade por categoria
const PREMIUM_CATEGORY_PREVIEW = {
  protese: ["Dente com pouca estrutura","Coroa solta","Cimentação definitiva","Prótese folgada","Moldagem aberta","Instalar coroa unitária","Carga imediata","+ muito mais"],
  endodontia: ["Urgência endodôntica","Medicação e retorno","Diagnóstico de pulpite guiado"],
  cirurgia: ["Dente impactado / siso","Extração cirúrgica","Alveolite","Sutura"],
  perio: ["Sangramento gengival","Abscesso periodontal"]
};

const PREMIUM_CATEGORY_LABELS = {
  protese: "Prótese",
  endodontia: "Endodontia",
  cirurgia: "Cirurgia",
  perio: "Periodontia"
};

// Situações de Emergência free
const EMERGENCY_FREE = ["em1","em2"];

const INITIAL_DATA = {
  categories:[
    {id:"dentistica",label:"Dentística",icon:'<i class="ti ti-dental"></i>'},
    {id:"protese",label:"Prótese",icon:'<i class="ti ti-crown"></i>'},
    {id:"endodontia",label:"Endodontia",icon:'<i class="ti ti-microscope"></i>'},
    {id:"cirurgia",label:"Cirurgia",icon:'<i class="ti ti-medical-cross"></i>'},
    {id:"perio",label:"Periodontia",icon:'<i class="ti ti-brush"></i>'}
  ],
  situations:{
    dentistica:[{id:"d1",label:"Cárie profunda"},{id:"d2",label:"Fratura de dente"},{id:"d3",label:"Restauração de rotina"},{id:"d4",label:"Dente sensível"},{id:"d5",label:"Troca de amálgama"},{id:"d6",label:"Clareamento dental"}],
    protese:[{id:"hdr-fixa",label:"PRÓTESE FIXA",type:"header"},{id:"p1",label:"Dente com pouca estrutura"},{id:"p2",label:"Preciso de provisório"},{id:"p3",label:"Coroa solta"},{id:"p4",label:"Cimentação definitiva"},{id:"p5",label:"Ajuste oclusal"},{id:"p9",label:"Coroa não entra — Ajuste e decisão"},{id:"p10",label:"Moldagem para Coroa/Ponte"},{id:"p11",label:"Reparo de Porcelana/Cerâmica"},{id:"hdr-removivel",label:"PRÓTESE REMOVÍVEL",type:"header"},{id:"p6",label:"Prótese incomodando"},{id:"p7",label:"Prótese folgada"},{id:"p8",label:"Dente da prótese soltou"},{id:"p12",label:"Prótese quebrada — Laboratório"},{id:"hdr-implante",label:"PRÓTESE SOBRE IMPLANTE",type:"header"},{id:"imp_pilar",label:"Escolher o pilar certo"},{id:"imp_provisorio",label:"Provisório sobre implante"},{id:"imp_moldagem_aberta",label:"Moldagem aberta"},{id:"imp_moldagem_fechada",label:"Moldagem fechada"},{id:"imp_instalar_coroa",label:"Instalar coroa unitária"},{id:"imp_carga_imediata",label:"Carga imediata"},{id:"imp_afrouxamento",label:"Afrouxamento de parafuso"},{id:"imp_parafuso_fraturado",label:"Parafuso fraturado"},{id:"imp_fratura_dente",label:"Fratura de dente em protocolo"},{id:"imp_cimento_extravasado",label:"Remoção de cimento extravasado"}],
    endodontia:[{id:"e1",label:"Urgência endodôntica"},{id:"e2",label:"Medicação e retorno"}],
    cirurgia:[{id:"c1",label:"Extração simples"},{id:"c2",label:"Dente impactado / siso"},{id:"c3",label:"Sangramento pós-extração"},{id:"c4",label:"Alveolite"},{id:"c5",label:"Sutura"}],
    perio:[{id:"pe1",label:"Sangramento gengival"},{id:"pe3",label:"Abscesso periodontal"}],
    emergencia:[{id:"em1",label:"Reação alérgica / Anafilaxia"},{id:"em2",label:"Síncope (desmaio)"},{id:"em3",label:"Infarto / Dor no peito"},{id:"em4",label:"Hipoglicemia"},{id:"em5",label:"Crise hipertensiva"},{id:"em6",label:"Engoliu instrumento"},{id:"em7",label:"Crise epiléptica"}],
  },
  procedures:{
    d1:[{id:"restauracao-carie",label:"Restauração Direta",free:true},{id:"remocao-seletiva",label:"Remoção Seletiva de Cárie",free:false},{id:"protecao-pulpar",label:"Proteção Pulpar",free:false}],
    d2:[{id:"restauracao-fratura",label:"Restauração Direta",free:true},{id:"pino-fratura",label:"Pino + Restauração",free:false}],
    d3:[{id:"trocar-rest",label:"Restauração de Rotina",free:true},{id:"acabamento-proximal-restauracao",label:"Acabamento Proximal em Restauração",free:true},{id:"restauracao-proximal-classe-ii",label:"Restauração Proximal Classe II em Resina",free:true},{id:"ajuste-oclusal-restauracao",label:"Ajuste Oclusal em Restauração",free:true}],
    d4:[{id:"dessensibilizante",label:"Dessensibilizante",free:true},{id:"recessao-gengival",label:"Sensibilidade Cervical por Recessão Gengival",free:true}],
    d5:[{id:"resina-comp",label:"Resina Composta",free:true}],
    d6:[{id:"clareamento-consultorio",label:"Clareamento em Consultório",free:false},{id:"clareamento-caseiro",label:"Clareamento Caseiro",free:true}],
    p1:[{id:"pino-nucleo",label:"Pino de Fibra + Núcleo em Resina",free:true},{id:"coroa-direta",label:"Coroa Direta",free:false}],
    p2:[{id:"provisorio-resina",label:"Provisório em Resina",free:true},{id:"provisorio-bisacril",label:"Bis-acryl direto",free:false}],
    p3:[{id:"recimentar-metal",label:"Recimentar — Metalo-cerâmica / Metal",free:true},{id:"recimentar-ceramica",label:"Recimentar — Porcelana / Zircônia / Disilicato",free:true},{id:"nova-coroa",label:"Planejar Nova Coroa",free:false}],
    p4:[{id:"cimentacao-metal",label:"Cimentação — Metalo-cerâmica / Metal",free:true},{id:"cimentacao-ceramica",label:"Cimentação — Porcelana / Zircônia / Disilicato",free:true}],
    p5:[{id:"ajuste-oclusal",label:"Ajuste Oclusal",free:true}],p9:[{id:"coroa-nao-entra",label:"Coroa não entra — Ajuste e decisão",free:true}],p10:[{id:"moldagem-coroa-ponte",label:"Moldagem — Silicone de Adição (1 passo)",free:false}],p11:[{id:"reparo-porcelana",label:"Reparo Intraoral de Porcelana/Cerâmica",free:false}],p6:[{id:"protese-incomodando",label:"Ajuste de Base / Borda",free:true}],p7:[{id:"reemb-prov-pt",label:"Reembasamento Provisório — PT",free:true},{id:"reemb-prov-ppr",label:"Reembasamento Provisório — PPR",free:true},{id:"reemb-def-pt",label:"Reembasamento Definitivo — PT",free:false},{id:"reemb-def-ppr",label:"Reembasamento Definitivo — PPR",free:false}],p8:[{id:"dente-protese-soltou",label:"Reparo na Cadeira",free:true},{id:"dente-protese-laboratorio",label:"Encaminhar Laboratório",free:false}],p12:[{id:"protese-quebrada-lab",label:"Prótese Quebrada — Envio ao Laboratório",free:false}],p12:[{id:"protese-quebrada-lab",label:"Prótese Quebrada — Envio ao Laboratório",free:false}],
    e1:[{id:"endo-urgencia",label:"Urgência Endodôntica",free:true},{id:"pulpite-reversivel",label:"Pulpite Reversível / Fase de Transição",free:true},{id:"pulpite-irreversivel",label:"Pulpite Irreversível — Urgência",free:true}],
    e2:[{id:"medicacao",label:"Medicação + Retorno",free:true}],
    
    
    
    c1:[{id:"extracao-simples",label:"Extração Simples",free:true}],
    c2:[{id:"extracao-cirurgica",label:"Extração Cirúrgica",free:false}],
    c3:[{id:"hemostasia",label:"Hemostasia de Urgência",free:true}],
    c4:[{id:"alveolite-seca",label:"Alveolite Seca",free:true},{id:"alveolite-umida",label:"Alveolite Úmida",free:true}],
    c5:[{id:"sutura-tecnica",label:"Técnica de Sutura",free:true}],
    pe1:[{id:"raspagem-supragengival",label:"Raspagem Supragengival",free:true}],
    
    pe3:[{id:"abscesso-perio",label:"Abscesso Periodontal",free:true}],
    
    em1:[{id:"alergia-protocolo",label:"Protocolo Alergia",free:true}],
    em2:[{id:"sincope-protocolo",label:"Protocolo Síncope",free:true}],
    em3:[{id:"infarto-protocolo",label:"Protocolo Infarto",free:true}],
    em4:[{id:"hipoglicemia-protocolo",label:"Protocolo Hipoglicemia",free:true}],
    em5:[{id:"hipertensao-protocolo",label:"Protocolo Hipertensão",free:true}],
    em6:[{id:"corpo-estranho",label:"Corpo Estranho Engolido",free:true}],
    em7:[{id:"epilepsia-protocolo",label:"Protocolo Epilepsia",free:true}],
    imp_pilar:[{id: "imp_pilar_protocolo", label: "Escolher o pilar certo", free: false}],
    imp_provisorio:[{id: "imp_provisorio_protocolo", label: "Provisório sobre implante", free: false}],
    imp_moldagem_aberta:[{id: "imp_moldagem_aberta_protocolo", label: "Moldagem aberta", free: false}],
    imp_moldagem_fechada:[{id: "imp_moldagem_fechada_protocolo", label: "Moldagem fechada", free: false}],
    imp_instalar_coroa:[{id: "imp_instalar_coroa_protocolo", label: "Instalar coroa unitária", free: false}],
    imp_carga_imediata:[{id: "imp_carga_imediata_protocolo", label: "Captura de PT para Protocolo Carga Imediata Provisória", free: false}],
    imp_afrouxamento:[{id: "imp_afrouxamento_protocolo", label: "Afrouxamento de parafuso", free: false}],
    imp_parafuso_fraturado:[{id: "imp_parafuso_fraturado_protocolo", label: "Parafuso fraturado", free: false}],
    imp_fratura_dente:[{id: "imp_fratura_dente_protocolo", label: "Fratura de dente em protocolo", free: false}],
    imp_cimento_extravasado:[{id: "imp_cimento_extravasado_protocolo", label: "Remoção de cimento extravasado", free: false}]
  },
  protocols:{
    "pino-nucleo":{title:"Pino de Fibra + Núcleo em Resina",time:"60 min",level:"difícil",free:true,steps:["[CONDUTO] Remover guta: Broca Gates Glidden #2–#4 nos 4–5mm iniciais → Broca Largo #1–#3 para terço médio e cervical — preservar 4mm apicais","[CONDUTO] Prova do pino — deve assentar passivamente, nunca forçar","[CONDUTO] Lavar com NaOCl + EDTA 17% → secar com cones de papel","[CONDUTO] Ácido fosfórico 35–37% por 15s → lavar abundantemente → secar com cones de papel (deixar levemente úmido)","[CONDUTO] Adesivo com microbrush dentro do canal → fotopolimerizar 20s","[PINO] Jatear com óxido de alumínio 50µm (2–3s, 2cm, 45°) → limpar com álcool 70°","[PINO] Silano: aguardar 60s — NÃO SOPRAR","[PINO] Adesivo no pino → fotopolimerizar 20s","[CIMENTAÇÃO] Resina dual: aplicar dentro do canal com ponteira e no pino → remover excessos → fotopolimerizar 40s por face (mínimo 3 faces)","Construir núcleo em resina composta (incrementos ≤2mm) → encaminhar para coroa"],errors:["Remover além de 2/3 da guta — compromete vedamento apical","Não fazer condicionamento ácido no conduto","Condicionar >15s — pode sensibilizar a dentina","Não jatear o pino — falha adesiva previsível","Soprar o silano antes de 60s","Forçar pino sem calibrar — risco de fratura radicular","Usar cimento de fosfato de zinco — usar sempre resina dual"],decisions:[{if:"Canal largo (diâmetro > 1/3 da raiz)",then:"Reembasar pino com resina flow antes de cimentar"},{if:"Estrutura coronária < 50% após núcleo",then:"Coroa obrigatória — não restaurar diretamente"},{if:"Canal muito curvo",then:"Pino curto + núcleo longo — nunca force"},{if:"Menos de 1mm de estrutura",then:"Avaliar prognóstico — pode ser exodontia"}],panic:[{problem:"Pino não entra até o comprimento",solution:"Ajustar com broca calibrada — nunca forçar. Se não entrar, usar pino mais curto"},{problem:"Pino soltou em menos de 7 dias",solution:"Remover, limpar canal e pino, secar bem e recimentar com resina dual"},{problem:"Fratura radicular ao inserir",solution:"Parar imediatamente. Avaliar com RX. Se fratura vertical → exodontia"},{problem:"Bolha no cimento visível no RX",solution:"Remover pino, eliminar bolha, recimentar com ponteira"}],crises:[{label:"Pino soltou",target:"pino-nucleo"}]},"coroa-nao-entra":{title:"Coroa não entra — Ajuste e Decisão",time:"15 min",level:"fácil",free:true,steps:["Remova o provisório e limpe completamente o preparo — elimine cimento provisório, resíduos e detritos.","Prove a coroa sem cimento e observe se ela assenta completamente.","Teste os contatos proximais com fio dental — se o fio não passa, desfia ou entra com muita resistência, o contato está apertado.","Ajuste o contato proximal da coroa de forma conservadora — nunca desgaste o dente adjacente.","Se os proximais estiverem adequados e a coroa ainda não assentar, use spray indicador ou silicone tipo Fit Checker na parte interna da coroa.","Desgaste apenas os pontos internos marcados e teste novamente.","Confira a margem com explorador em toda a volta — a coroa deve assentar completamente antes de qualquer cimentação.","Se houver tecido mole interferindo, afaste/maneje o tecido e teste novamente.","Se mesmo após ajustes conservadores a coroa não assentar, não force e não cimente — devolva ao laboratório ou refaça.","Só depois de confirmar assentamento completo, cheque oclusão e siga para cimentação conforme o material."],errors:["Cimentar coroa que não assentou completamente","Forçar a coroa para tentar encaixar","Ajustar no olho sem identificar onde está travando","Desgastar o dente adjacente em vez da coroa","Checar oclusão antes de confirmar assentamento","Cimentar com margem aberta"],decisions:[{if:"Fio dental não passa ou desfia",then:"Ajuste o contato proximal da coroa"},{if:"Proximais estão bons, mas a coroa não assenta",then:"Use indicador interno e alivie apenas os pontos marcados"},{if:"A margem continua aberta após ajustes conservadores",then:"Não cimente; devolva ao laboratório ou refaça"},{if:"O preparo foi alterado após a moldagem/escaneamento",then:"Nova moldagem/escaneamento e nova coroa"}],panic:[{problem:"Coroa não assenta de jeito nenhum",solution:"Não force. Reavalie proximal, parte interna, margem e preparo. Se não resolver com ajustes conservadores, devolva ao laboratório."},{problem:"Margem aberta mesmo após ajustes",solution:"Não cimente. Margem aberta compromete adaptação e favorece infiltração."},{problem:"A coroa assentou, mas ficou alta",solution:"Confirme que ela está totalmente assentada. Se estiver, faça ajuste oclusal seletivo."}],crises:[]},"moldagem-coroa-ponte":{title:"Moldagem para Coroa/Ponte — Silicone de Adição, Técnica Simultânea",time:"30 min",level:"médio",free:false,steps:["Confirme que a gengiva está saudável, sem inflamação ou sangramento ativo.","Remova o provisório e limpe completamente o preparo com pedra-pomes.","Selecione e prove a moldeira total de estoque.","Aplique adesivo específico para silicone de adição na moldeira e aguarde secar.","Isole o campo, controle saliva e seque bem os preparos.","Selecione o fio retrator conforme o caso: fio fino #000 ou #00 para sulco delicado; fio #0 ou #1 quando precisar de maior afastamento. Em margens subgengivais, considerar técnica de fio duplo.","Insira o fio retrator com agente hemostático/adstringente compatível e aguarde o tempo indicado pelo fabricante.","Remova o fio superficial, seque o sulco e injete o silicone leve ao redor dos preparos, mantendo a ponta sempre próxima à margem.","Carregue a moldeira com silicone pesado e assente imediatamente em boca, com movimento único e firme.","Mantenha a moldeira imóvel até a presa completa, conforme o tempo do fabricante.","Remova o molde com movimento único, firme e no longo eixo.","Inspecione o molde antes de dispensar o paciente: margens nítidas, sem bolhas, sem rasgos cervicais e sem descolamento do material da moldeira.","Faça moldagem do antagonista e registro oclusal.","Registre a cor e envie ao laboratório a referência completa: cor escolhida, escala utilizada, fotos se possível e observações relevantes.","Lave, desinfete conforme protocolo/fabricante e envie ao laboratório.","Confeccione ou recimente o provisório antes de o paciente sair."],errors:["Moldar com gengiva inflamada ou sangrando","Manipular silicone de adição com luva de látex","Não usar adesivo na moldeira","Não controlar saliva e umidade","Perder o tempo de trabalho do material","Movimentar a moldeira durante a presa","Enviar molde com bolha ou rasgo na margem","Enviar ao laboratório sem antagonista, registro oclusal ou referência de cor","Não informar a escala de cor utilizada"],decisions:[{if:"Gengiva inflamada ou sangrando",then:"Não molde; controle tecido, ajuste provisório e remarque."},{if:"Margem subgengival",then:"Use fio duplo; se ainda não houver acesso à margem, reavalie o preparo ou considere aumento de coroa clínica."},{if:"Sangrou ao remover o fio",then:"Controle a hemostasia antes de injetar o silicone leve."},{if:"Molde tem bolha, rasgo ou margem incompleta",then:"Refaça; não envie ao laboratório."},{if:"São múltiplos preparos e o tempo estiver difícil de controlar",then:"Considere técnica de 2 passos ou escaneamento, se disponível."}],panic:[{problem:"O silicone começou a prender antes de assentar",solution:"Não force. Remova o material e refaça com silicone novo."},{problem:"A moldeira mexeu durante a presa",solution:"Considere o molde distorcido e refaça."},{problem:"Bolha exatamente na margem",solution:"Refaça. Não conte com correção laboratorial."},{problem:"Material descolou da moldeira",solution:"Refaça usando adesivo correto e respeitando o tempo de secagem."},{problem:"Moldagem boa, mas sem antagonista, registro ou cor",solution:"Não envie incompleta. Faça os registros necessários antes de liberar o caso."}],crises:[]},"reparo-porcelana":{title:"Reparo Intraoral de Porcelana/Cerâmica",time:"40 min",level:"médio",free:false,steps:["Avalie se a coroa está bem adaptada, sem mobilidade, sem margem aberta e sem infiltração.","Identifique o que ficou exposto no lascamento: porcelana/cerâmica, metal ou zircônia.","Cheque a oclusão antes do reparo — se a área fraturada recebe carga pesada, o reparo tende a falhar.","Isole bem o campo e proteja tecidos moles, principalmente se for usar ácido fluorídrico.","Asperize a área fraturada com ponta diamantada ou jateamento com óxido de alumínio, se disponível.","Se for porcelana/cerâmica vítrea: condicione com ácido fluorídrico conforme fabricante → lave abundantemente → seque → aplique silano.","Se for metal ou zircônia: não use fluorídrico como etapa principal → jateie/asperize e aplique primer específico com MDP.","Aplique adesivo conforme o sistema escolhido e fotopolimerize.","Reconstrua a área com resina composta em incrementos pequenos, devolvendo forma, contato e estética.","Ajuste oclusão, acabamento e polimento cuidadoso da área reparada.","Oriente o paciente de que o reparo aumenta a longevidade da peça, mas pode não ter a mesma previsibilidade de uma nova coroa."],errors:["Reparar coroa com margem aberta, infiltração ou má adaptação","Ignorar contato oclusal pesado na área fraturada","Usar ácido fluorídrico em zircônia como se fosse porcelana vítrea","Não proteger tecidos moles ao usar ácido fluorídrico","Não usar silano em porcelana/cerâmica vítrea condicionada","Não usar primer MDP em metal ou zircônia","Fazer reparo sem acabamento e polimento adequado","Prometer ao paciente que o reparo terá a mesma durabilidade de uma nova coroa"],decisions:[{if:"Lascamento pequeno, sem carga oclusal importante",then:"Polimento ou reparo simples podem ser suficientes."},{if:"Porcelana/cerâmica vítrea está exposta",then:"Asperização + ácido fluorídrico conforme fabricante + silano + adesivo + resina composta."},{if:"Metal está exposto",then:"Asperização/jateamento + primer para metal/MDP + adesivo + resina composta."},{if:"Zircônia está exposta",then:"Asperização/jateamento + primer MDP para zircônia + adesivo/resina composta."},{if:"A fratura envolve margem, adaptação ou contato proximal importante",then:"Não trate como reparo simples; avalie laboratório ou nova coroa."},{if:"A área fraturada recebe carga oclusal pesada",then:"Ajuste a causa ou considere nova peça; o reparo isolado tende a falhar."}],panic:[{problem:"Fratura extensa com metal/zircônia exposta",solution:"Avalie se há condição real de reparo. Se estética, função ou retenção estiverem comprometidas, planeje nova coroa."},{problem:"Paciente exige estética perfeita",solution:"Não prometa resultado invisível. Explique que reparo intraoral pode melhorar, mas pode não igualar uma nova peça."},{problem:"Reparou e ficou alto em oclusão",solution:"Ajuste imediatamente. Contato alto aumenta risco de nova fratura."},{problem:"Ácido fluorídrico tocou tecido mole",solution:"Interrompa, lave abundantemente e avalie a lesão. O uso exige isolamento rigoroso."},{problem:"Reparo soltou em pouco tempo",solution:"Procure causa: carga oclusal, contaminação, protocolo adesivo inadequado ou material exposto tratado de forma errada."}],crises:[]},
    "apenas-nucleo":{title:"Apenas Núcleo",time:"20 min",level:"fácil",free:true,steps:["Avaliar estrutura remanescente (mínimo 2 paredes)","Criar retenção: caixas ou pins","Isolamento absoluto rigoroso","Condicionamento ácido (30s esmalte / 15s dentina)","Lavar 30s, secar levemente","Aplicar adesivo + fotopolimerizar 20s","Inserir resina em incrementos ≤2mm","Modelar o núcleo no formato do preparo","Fotopolimerizar cada incremento 40s","Checar oclusão e ajustar"],errors:["Fazer núcleo sem retenção mecânica","Não usar isolamento absoluto","Incrementos grossos >2mm","Não verificar oclusão ao final"],decisions:[{if:"Estrutura < 50% da coroa",then:"Considerar pino intrarradicular"},{if:"Dente vital com risco de exposição",then:"Capeamento pulpar antes do núcleo"}],panic:[{problem:"Núcleo fraturou logo",solution:"Refazer com pino para maior retenção"},{problem:"Contaminação salival",solution:"Lavar, resecar e reaplicar adesivo por completo"}],crises:[]},
    "coroa-direta":{title:"Coroa Direta",time:"60–90 min",level:"difícil",free:false,steps:["Preparo do dente: linha de término cervical intrasulcular, remover ângulos vivos, espessura uniforme — brocas tronco-cônicas + ponta fina para acabamento de margens","Afastamento gengival duplo: fio 00 no sulco durante o preparo → após refinamento, fio 0 para afastamento vertical e horizontal — hemostático à base de cloreto de alumínio (evitar sulfato férrico)","Seleção de cor em luz natural — antes do isolamento","Seleção do material: silicone de adição ou condensação — técnica de dois passos (pesado + leve) ou dupla mistura — moldeira total","Moldagem: posicionar material pesado na moldeira → remover 2º fio → secar margem cervical → aplicar material leve no preparo e dentro do sulco → posicionar moldeira → aguardar 4–5 min","Remover moldagem com cuidado → lavar em água corrente → desinfetar (hipoclorito ou glutaraldeído até 10 min) → enviar ao laboratório","Provisório em bis-acryl → ajustar oclusão e contatos proximais → cimentar com TempBond","Cimentação definitiva com cimento resinoso na instalação da coroa","Checar oclusão em MIC e lateralidade"],errors:["Não usar fio afastador — margem cervical não copiada","Usar sulfato férrico como hemostático — interfere na polimerização do silicone","Não secar a margem antes de aplicar o material leve — bolha na moldagem","Provisório mal adaptado — desconforto e infiltração","Não verificar lateralidade — ponto alto em excursão"],decisions:[{if:"Pouca estrutura remanescente",then:"Pino de Fibra + Núcleo em Resina antes do preparo"},{if:"Gengiva inflamada",then:"Tratamento periodontal antes — moldagem imprecisa com gengiva sangrante"},{if:"Margem subgengival muito profunda",then:"Cirurgia de aumento de coroa clínica antes"}],panic:[{problem:"Provisório soltou",solution:"Recimentar com TempBond — verificar retenção do preparo"},{problem:"Coroa não assenta completamente",solution:"Verificar ponto proximal com fio dental abrasivo"},{problem:"Moldagem com bolha na margem",solution:"Refazer — não enviar ao laboratório com defeito"}],crises:[]},
    "provisorio-resina":{title:"Provisório em Resina",time:"20 min",level:"fácil",free:true,steps:["Pegar molde antes do preparo (alginato ou PVS)","Executar o preparo do dente","Preencher o molde com bis-acryl","Levar ao dente no início da presa","Remover na fase borrachosa (1,5–2 min)","Aguardar polimerização fora da boca","Ajustar com broca multilaminada","Polir com disco de feltro + pasta","Cimentar com TempBond"],errors:["Não pegar molde antes do preparo","Deixar resina endurecer dentro da boca","Não polir — provisório rugoso acumula placa"],decisions:[{if:"Sem molde prévio",then:"Usar matriz de cera ou modelar manualmente"},{if:"Baixa retenção",then:"Usar cimento mais resistente (Freegenol)"}],panic:[{problem:"Provisório soltou no mesmo dia",solution:"Ajustar retenção, limpar e recimentar"}],crises:[]},
    "provisorio-bisacril":{title:"Bis-acryl Direto",time:"15 min",level:"fácil",free:false,steps:["Selecionar cor do bis-acryl","Preencher matriz/molde","Posicionar sobre o preparo","Remover na fase borrachosa (~1,5 min)","Aguardar cura completa fora da boca","Ajustar oclusão e contatos proximais","Polir levemente","Cimentar com TempBond"],errors:["Deixar endurecer completamente na boca","Não verificar contatos proximais"],decisions:[{if:"Múltiplos dentes",then:"Usar matriz em segmentos separados"}],panic:[{problem:"Material ficou retido no dente",solution:"Usar alavanca pequena lateralmente — nunca puxar"}],crises:[]},
    "recimentar-metal":{title:"Recimentar — Metalo-cerâmica / Metal",time:"20 min",level:"fácil",free:true,steps:["Remover coroa com remoedor ou fio de pesca — sem forçar","Limpar o dente: pedra-pomes + taça de borracha → checar cárie secundária","Preparar superfície interna da coroa: jatear com óxido de alumínio 50µm → limpar com álcool 70°","Secar o dente com jato de ar","Testar adaptação — coroa deve assentar completamente sem força","Aplicar cimento de ionômero de vidro ou fosfato de zinco na coroa","Assentar com pressão digital + rolete de gaze por 3–5 min","Remover excessos com fio dental antes da presa completa","Checar oclusão em MIC e lateralidade"],errors:["Não jatear a superfície interna — falha adesiva","Cimentar com resíduos de cimento antigo","Não checar oclusão após cimentação"],decisions:[{if:"Soltou mais de 2 vezes",then:"Avaliar novo preparo"},{if:"Cárie no remanescente",then:"Tratar antes de recimentar"},{if:"Coroa íntegra mas preparo insuficiente",then:"Nova coroa"}],panic:[{problem:"Coroa não assenta",solution:"Checar cárie, cálculo ou ponto proximal com fio dental"},{problem:"Excesso de cimento endurecido",solution:"Ultrassom — nunca instrumento cortante"}],crises:[]},
    "recimentar-ceramica":{title:"Recimentar — Porcelana / Zircônia / Disilicato",time:"30 min",level:"médio",free:true,steps:["Remover coroa com remoedor ou fio de pesca — sem forçar","Limpar o dente: pedra-pomes + taça de borracha → checar cárie secundária","Preparar superfície interna da coroa:","→ Porcelana / Disilicato: jatear + ácido fluorídrico 10% por 60s → lavar → silano por 60s → secar","→ Zircônia: jatear com óxido de alumínio 50µm + primer de zircônia → secar","Preparar o dente: condicionamento ácido + adesivo → fotoativar","Testar adaptação — coroa deve assentar completamente sem força","Aplicar cimento resinoso dual na coroa → assentar → fotopolimerizar 40s por face","Remover excessos com fio dental antes da presa completa","Checar oclusão em MIC e lateralidade"],errors:["Usar cimento de fosfato ou ionômero em zircônia ou disilicato — não adere","Não aplicar silano em porcelana — falha adesiva garantida","Não fazer primer de zircônia — o silano sozinho não funciona em zircônia","Cimentar com resíduos de cimento antigo","Não checar oclusão após cimentação"],decisions:[{if:"Soltou mais de 2 vezes",then:"Avaliar novo preparo"},{if:"Cárie no remanescente",then:"Tratar antes de recimentar"},{if:"Coroa íntegra mas preparo insuficiente",then:"Nova coroa"}],panic:[{problem:"Coroa não assenta",solution:"Checar cárie, cálculo ou ponto proximal com fio dental"},{problem:"Excesso de cimento resinoso polimerizado",solution:"Ultrassom — nunca instrumento cortante"}],crises:[]},
    "nova-coroa":{title:"Planejar Nova Coroa",time:"Planejamento",level:"médio",free:false,steps:["RX periapical — avaliar raiz, osso, lesão apical e altura do remanescente","Teste de vitalidade pulpar — dente sem vitalidade exige endodontia + pino antes","Checar espaço oclusal: mínimo 1,5mm para cerâmica, 0,5mm para zircônia monolítica","Escolher o material: Zircônia monolítica (posterior, bruxismo, espaço reduzido) / Disilicato de lítio (anterior ou pré-molar, alta estética) / Metalo-cerâmica (quando custo é limitante)","Avaliar necessidade de aumento de coroa clínica — margem subgengival > 2mm","Preparo + moldagem + provisório — seguir protocolo de Coroa Direta","Instalação: prova → ajuste de contatos → ajuste oclusal → cimentação conforme material"],errors:["Não avaliar espaço oclusal antes do preparo — coroa vai fraturar","Selecionar cor com luz artificial — resultado diferente do esperado","Cimentar sem ajustar contatos proximais","Não fazer provisório — dente migra e inviabiliza a coroa"],decisions:[{if:"Dente sem vitalidade",then:"Endodontia + Pino de Fibra + Núcleo em Resina antes do preparo"},{if:"Espaço oclusal insuficiente",then:"Desgastar antagonista ou avaliação ortodôntica"},{if:"Margem muito subgengival",then:"Cirurgia de aumento de coroa clínica antes"},{if:"Bruxismo",then:"Zircônia monolítica + placa de bruxismo pós-instalação"}],panic:[{problem:"Coroa instalada com oclusão alta",solution:"Ajuste seletivo imediato"},{problem:"Cor errada",solution:"Devolver ao laboratório — não cimente com cor errada"},{problem:"Coroa não assenta",solution:"Checar ponto proximal com fio dental abrasivo"}],crises:[]},
    "cimentacao-metal":{title:"Cimentação — Metalo-cerâmica / Metal",time:"20 min",level:"fácil",free:true,steps:["Testar adaptação, contatos proximais e oclusão ANTES de qualquer cimento","Limpar o dente: remover provisório, pedra-pomes + taça de borracha, secar","[NA COROA] Jatear superfície interna com óxido de alumínio 50µm → limpar com álcool 70°","[NO DENTE] Secar com jato de ar","Aplicar ionômero de vidro ou fosfato de zinco na coroa → assentar com pressão digital → rolete de gaze por 3–5 min","Remover excessos com fio dental antes da presa completa","Checar oclusão em MIC e lateralidade"],errors:["Não jatear a superfície interna da coroa — falha adesiva","Cimentar com resíduos de provisório — falha garantida","Não checar oclusão após cimentação"],decisions:[{if:"Coroa solta mais de 2 vezes",then:"Avaliar novo preparo — retenção insuficiente"},{if:"Dente com pouca estrutura",then:"Pino de Fibra + Núcleo em Resina antes de novo preparo"}],panic:[{problem:"Coroa não assenta completamente",solution:"Checar ponto proximal com fio dental abrasivo"},{problem:"Excesso de cimento endurecido",solution:"Ultrassom — nunca instrumento cortante"},{problem:"Oclusão alta após cimentar",solution:"Ajuste seletivo imediato com papel carbono"}],crises:[]},
    "cimentacao-ceramica":{title:"Cimentação — Porcelana / Zircônia / Disilicato",time:"30 min",level:"médio",free:true,steps:["Testar adaptação, contatos proximais e oclusão ANTES de qualquer cimento","Limpar o dente: remover provisório, pedra-pomes + taça de borracha, secar","[NA COROA — PORCELANA / DISILICATO] Jatear + ácido fluorídrico 10% por 60s → lavar → silano por 60s → secar","[NA COROA — ZIRCÔNIA] Jatear com óxido de alumínio 50µm → primer de zircônia → secar","[NO DENTE] Condicionamento ácido + adesivo → fotoativar","Aplicar cimento resinoso dual na coroa → assentar → fotopolimerizar 40s por face","Remover excessos com fio dental antes da presa completa","Checar oclusão em MIC e lateralidade"],errors:["Usar fosfato ou ionômero em porcelana / zircônia / disilicato — não adere","Não aplicar silano em porcelana — falha adesiva garantida","Usar silano em zircônia sem primer específico — não funciona","Cimentar com resíduos de provisório","Não checar oclusão após cimentação"],decisions:[{if:"Porcelana / disilicato",then:"Fluorídrico + silano + resinoso dual"},{if:"Zircônia",then:"Primer de zircônia + resinoso dual"},{if:"Coroa solta mais de 2 vezes",then:"Avaliar novo preparo"}],panic:[{problem:"Coroa não assenta completamente",solution:"Checar ponto proximal com fio dental abrasivo"},{problem:"Excesso de cimento resinoso endurecido",solution:"Ultrassom — nunca instrumento cortante"},{problem:"Oclusão alta após cimentar",solution:"Ajuste seletivo imediato com papel carbono"}],crises:[]},
    "protese-incomodando":{title:"Prótese Incomodando — Ajuste de Base / Borda",time:"20 min",level:"fácil",free:true,steps:["Perguntar ao paciente onde dói e quando — o relato direciona o ajuste","Examinar a mucosa: localizar úlcera ou ponto de pressão","Aplicar pasta de evidenciação (Kerr) na base interna → inserir na boca → remover → identificar marcas","Em PPR: checar também se grampo está pressionando dente ou mucosa","Acoplar a broca Maxicut na peça reta → desgastar os pontos marcados — pequenos e progressivos","Reinserir → verificar conforto → repetir até eliminação do desconforto","Trocar para broca de polimento do kit → polir a área desgastada","Orientar: úlcera leva 7–10 dias para cicatrizar — retorno em 1 semana"],errors:["Desgastar sem pasta de evidenciação — desgaste às cegas","Desgaste excessivo de uma vez — enfraquece a base","Não polir após desgaste — superfície rugosa irrita o tecido","Dispensar sem verificar conforto imediato"],decisions:[{if:"Múltiplos pontos de pressão",then:"Prótese folgada — indicar reembasamento"},{if:"PPR com grampo machucando",then:"Ajuste com alicate 139 ou encaminhar laboratório"},{if:"Úlcera não cicatriza em 14 dias",then:"Encaminhar — descartar lesão suspeita"},{if:"Dor generalizada em PT",then:"Prótese folgada — reembasamento"}],panic:[{problem:"Úlcera extensa com bordas endurecidas",solution:"Não ajustar — encaminhar para avaliação"},{problem:"Dor intensa",solution:"Orientar a não usar por 48–72h antes do retorno"},{problem:"Perfurei a base da prótese",solution:"Fazer moldagem da prótese com alginato → encaminhar ao laboratório para reparo"},{problem:"Quebrei o grampo ao ajustar",solution:"Fazer moldagem com a prótese em boca → encaminhar ao laboratório para novo grampo"}],crises:[]},
    "reemb-prov-pt":{title:"Reembasamento Provisório — PT",time:"30 min",level:"médio",free:true,steps:["Confirmar indicação: PT folgada, instável, sem retenção por reabsorção óssea","Remover material reembasador antigo e superfícies irregulares com broca Maxicut na peça reta","Manipular a resina Soft para reembasamento conforme o fabricante","Aplicar camada de 2–3mm na superfície interna com espátula — cobrir toda área em contato com mucosa","Assentar a prótese na boca com paciente em MIC — realizar movimentos funcionais: sorriso, sugar bochechas, abrir a boca — para copiar inserções musculares","Aguardar presa completa conforme fabricante → remover → deixar polimerizar fora da boca","Recortar excessos com bisturi ou tesoura","Reinserir → verificar retenção, estabilidade e conforto","Orientar: tempo de duração conforme fabricante — retorno para troca periódica → indicar reembasamento definitivo em laboratório"],errors:["Não remover material antigo — nova camada não adere","Não realizar movimentos funcionais — prótese perde retenção nas bordas","Paciente fora de MIC durante a presa — distorce a DVO","Usar como solução definitiva — é provisório"],decisions:[{if:"PT completamente folgada",then:"Provisório agora + agendar definitivo em laboratório"},{if:"Mucosa inflamada",then:"Deixar sem prótese por 48–72h antes de reembasar"},{if:"Prótese antiga >5 anos com desgaste oclusal",then:"Avaliar nova prótese"}],panic:[{problem:"Prótese não ficou retentiva após reembasamento",solution:"Verificar se movimentos funcionais foram feitos corretamente — refazer"},{problem:"Prótese ficou retida",solution:"Movimentos laterais suaves — nunca puxar verticalmente"},{problem:"DVO alterada após reembasamento",solution:"Remover material e refazer com paciente em MIC correto"}],crises:[]},
    "reemb-prov-ppr":{title:"Reembasamento Provisório — PPR Rígida de Resina",time:"30 min",level:"médio",free:true,steps:["Confirmar indicação: PPR rígida de resina folgada/instável por reabsorção óssea","Remover material antigo e irregularidades com Maxicut — preservar apoios e ganchos","Manipular resina Soft para reembasamento conforme fabricante","Aplicar 2–3mm na superfície interna da sela — sem invadir retenções","Assentar em MIC → movimentos funcionais: sorriso, sugar bochechas, abrir, laterais","Aguardar presa completa conforme fabricante → remover → polimerizar fora da boca","Recortar excessos com bisturi ou tesoura","Reinserir → verificar retenção, estabilidade, conforto e assentamento","Orientar: é provisório — agendar reembasamento definitivo em laboratório"],errors:["Obstruir apoios ou ganchos com a resina","Não fazer movimentos funcionais","Paciente fora da MIC durante a presa","Usar como solução definitiva"],decisions:[{if:"PPR completamente folgada",then:"Provisório agora + agendar definitivo em laboratório"},{if:"Mucosa inflamada",then:"Deixar sem prótese por 48–72h antes de reembasar"},{if:"Prótese antiga >5 anos com desgaste oclusal",then:"Avaliar nova PPR"},{if:"Apoios sem contato",then:"Reembasamento não resolve — nova PPR"}],panic:[{problem:"Não ficou retentiva",solution:"Refazer com movimentos funcionais"},{problem:"DVO alterada",solution:"Remover material nos posteriores e refazer com MIC correto"},{problem:"Apoio elevado",solution:"Remover a resina da região e refazer"}],crises:[]},
    "reemb-def-pt":{title:"Reembasamento Definitivo — PT",time:"Laboratório",level:"médio",free:false,steps:["Confirmar indicação: PT folgada com estrutura e dentes em bom estado","Inspecionar a base interna — remover material antigo e eliminar retenções com broca Maxicut na peça reta","Realizar moldagem funcional com a própria prótese usando silicone de adição leve → assentar em MIC → movimentos funcionais: sorriso, sugar, abrir, laterais → aguardar presa → remover","Desinfetar moldagem → lavar em água corrente → encaminhar ao laboratório","Na instalação: verificar retenção, estabilidade e oclusão","Ajustes com pasta de evidenciação de pressão (zinco-enólica, apenas a base branca) se necessário","Controles periódicos até adaptação completa"],errors:["Não fazer moldagem funcional — resultado impreciso","Paciente fora de MIC durante a presa — oclusão errada","Enviar ao laboratório sem desinfetar","Não fazer controles periódicos após instalação"],decisions:[{if:"Estrutura da prótese comprometida",then:"Nova prótese"},{if:"Prótese antiga >5 anos com desgaste oclusal severo",then:"Nova prótese"},{if:"Reembasamento provisório recente",then:"Aguardar mucosa estabilizar antes do definitivo"}],panic:[{problem:"Moldagem distorcida",solution:"Refazer — não enviar com defeito ao laboratório"},{problem:"DVO alterada na instalação",solution:"Devolver ao laboratório para ajuste"},{problem:"Prótese não assenta após reembasamento",solution:"Verificar pontos de pressão com pasta de evidenciação"}],crises:[]},
    "reemb-def-ppr":{title:"Reembasamento Definitivo — PPRG",time:"Laboratório",level:"médio",free:false,steps:["Confirmar indicação: PPRG folgada com estrutura metálica, apoios e ganchos em bom estado","Inspecionar a base interna — remover material antigo e eliminar retenções com broca Maxicut na peça reta — preservar apoios e ganchos","Realizar moldagem funcional com a própria PPRG usando silicone de adição leve → assentar em MIC garantindo assentamento correto dos apoios → movimentos funcionais: sorriso, sugar, abrir, laterais → aguardar presa → remover","Desinfetar moldagem → lavar em água corrente → encaminhar ao laboratório","Na instalação: verificar assentamento dos apoios, retenção, estabilidade e oclusão","Se ganchos frouxos: apertar com alicate 139 (Nance) — dobras pequenas e progressivas na ponta ativa do gancho, sempre no terço médio — nunca na conexão com a estrutura metálica","Ajustes com pasta de evidenciação de pressão (zinco-enólica, apenas a base branca) se necessário","Controles periódicos até adaptação completa"],errors:["Não fazer moldagem funcional — resultado impreciso","Paciente fora de MIC durante a presa — oclusão errada","Obstruir apoios ou ganchos durante a moldagem","Apertar gancho na conexão com a estrutura — fratura metálica","Enviar ao laboratório sem desinfetar","Não fazer controles periódicos após instalação"],decisions:[{if:"Estrutura metálica fraturada ou gancho quebrado",then:"Laboratório para reparo antes de reembasar"},{if:"PPRG antiga >5 anos com desgaste oclusal severo",then:"Avaliar nova PPRG"},{if:"Reembasamento provisório recente",then:"Aguardar mucosa estabilizar antes do definitivo"}],panic:[{problem:"Moldagem distorcida",solution:"Refazer — não enviar com defeito ao laboratório"},{problem:"Apoio elevado na instalação",solution:"Devolver ao laboratório para ajuste"},{problem:"Gancho fraturou ao apertar",solution:"Encaminhar ao laboratório para reparo — não improvise"},{problem:"PPRG não assenta após reembasamento",solution:"Verificar pontos de pressão com pasta de evidenciação"}],crises:[]},
    "dente-protese-soltou":{title:"Reparo na Cadeira — Dente da Prótese Soltou",time:"20 min",level:"fácil",free:true,steps:["Remover resíduos de resina antiga do dente e do alvéolo da prótese","Verificar se o dente se encaixa perfeitamente no local — conferir alinhamento e oclusão","Criar retenções no alvéolo e na base do dente com lixa ou broca pequena — melhora adesão da resina","Misturar resina acrílica autopolimerizável (pó + líquido) → aplicar no alvéolo e na base do dente","Pressionar o dente no local na posição correta → remover excessos antes da presa","Aguardar polimerização completa fora da boca conforme fabricante","Polir a região com broca de polimento na peça reta","Verificar oclusão — ajustar se necessário"],errors:["Não remover resíduos antigos — dente solta novamente","Não criar retenções — adesão insuficiente","Deixar excesso de resina — irrita a mucosa","Não verificar oclusão — dente alto causa descolamento"],decisions:[{if:"Alvéolo fraturado ou base comprometida",then:"Encaminhar laboratório"},{if:"Dente fraturado",then:"Encaminhar laboratório"},{if:"Múltiplos dentes soltos",then:"Prótese muito antiga — avaliar nova prótese"}],panic:[{problem:"Resina polimerizou com dente mal posicionado",solution:"Remover com broca e refazer"},{problem:"Dente soltou novamente em dias",solution:"Verificar oclusão — ponto alto causa descolamento"}],crises:[]},"protese-quebrada-lab":{title:"Prótese Quebrada — Envio ao Laboratório",time:"—",level:"fácil",free:false,steps:["Avalie o que quebrou: base acrílica, dente artificial, grampo, apoio, conector ou estrutura metálica.","Reúna a prótese completa e todos os fragmentos, mesmo os pequenos.","Se um dente artificial soltou, envie o dente junto quando o paciente trouxer.","Verifique se os fragmentos encaixam corretamente entre si — isso ajuda o laboratório a recuperar a posição original.","Faça uma moldagem auxiliar da boca para orientar o reparo e a adaptação da prótese.","Se a fratura comprometer a relação entre os arcos, a dimensão vertical ou a posição dos dentes, faça também registro oclusal e envie o antagonista.","Fotografe a prótese, os fragmentos e, se possível, a prótese posicionada em boca.","Envie ao laboratório com ordem clara: tipo de fratura, região quebrada, urgência, necessidade de reembasamento associado e observações clínicas.","Explique ao paciente que o reparo pode devolver função temporariamente, mas nem sempre tem a mesma resistência da prótese original.","Se a prótese for muito antiga, desadaptada, com dentes desgastados ou já tiver quebrado outras vezes, converse sobre a necessidade de nova prótese."],errors:["Tentar colar a prótese em boca como solução definitiva","Enviar a prótese sem todos os fragmentos","Não fazer moldagem auxiliar para orientar o reparo","Enviar sem registro oclusal quando há perda de referência entre os arcos","Ignorar que fraturas repetidas indicam causa não resolvida","Prometer que o reparo terá a mesma resistência da prótese original","Não informar ao laboratório se precisa de reembasamento associado","Não avaliar se a prótese já está antiga ou desadaptada demais"],decisions:[{if:"Quebrou apenas um dente artificial e a base está íntegra",then:"Enviar o dente, a prótese e moldagem auxiliar; avaliar reparo simples."},{if:"A base acrílica quebrou e os fragmentos encaixam bem",then:"Enviar prótese completa, fragmentos e moldagem auxiliar para reparo laboratorial."},{if:"A prótese quebrou em vários pedaços ou perdeu referência de posição",then:"Enviar moldagem auxiliar, fotos e registro oclusal quando necessário."},{if:"Quebrou grampo, apoio, conector ou estrutura metálica",then:"Não reparar com resina em boca; enviar ao laboratório e reavaliar planejamento da PPR."},{if:"A prótese está antiga, desadaptada ou quebra sempre na mesma região",then:"Tratar o reparo como provisório e iniciar conversa sobre nova prótese."},{if:"Há desadaptação associada",then:"Solicitar avaliação de reembasamento junto com o reparo."}],panic:[{problem:"Paciente quer 'colar agora'",solution:"Explique que colagem improvisada pode alterar adaptação, machucar a mucosa e dificultar o reparo correto."},{problem:"Faltam fragmentos",solution:"Envie a prótese com moldagem auxiliar e fotos, mas avise ao paciente que o reparo pode ficar limitado."},{problem:"Prótese quebrou no meio",solution:"Não tente unir em boca. Envie ao laboratório com todos os fragmentos e moldagem auxiliar."},{problem:"Quebrou estrutura metálica da PPR",solution:"Não tente compensar com acrílico. Encaminhe ao laboratório e reavalie o planejamento."},{problem:"Reparo voltou quebrado ou quebrou novamente",solution:"Procure a causa: desadaptação, oclusão, base fina, prótese antiga ou planejamento inadequado."}],crises:[]},
    "dente-protese-laboratorio":{title:"Encaminhar Laboratório — Dente da Prótese",time:"—",level:"fácil",free:false,steps:["Guardar o dente e a prótese — não descartar nada","Fazer moldagem da arcada antagonista com alginato","Fazer registro oclusal com lâmina de cera 7 aquecida com a prótese em boca — especialmente em dentes posteriores","Encaminhar ao laboratório: prótese + dente + moldagem do antagonista + registro oclusal + instruções de cor e posicionamento","Na instalação: verificar oclusão e conforto","Ajustes com pasta de evidenciação se necessário"],errors:["Descartar o dente — laboratório precisa dele ou da referência de tamanho e cor","Não enviar moldagem do antagonista — laboratório não consegue ajustar oclusão","Não fazer registro oclusal em dentes posteriores"],decisions:[{if:"Base fraturada junto com o dente",then:"Laboratório para reparo completo da base"},{if:"Múltiplos dentes soltos",then:"Avaliar nova prótese"},{if:"Paciente sem condições de ficar sem prótese",then:"Reparo provisório na cadeira antes de encaminhar"}],panic:[{problem:"Dente perdido pelo paciente",solution:"Encaminhar prótese ao laboratório com referência de cor e tamanho do dente contralateral"},{problem:"Cor errada na instalação",solution:"Devolver ao laboratório para recolocar dente correto"}],crises:[]},
    "imp_pilar_protocolo":{title:"Escolher o Pilar Certo",time:"5 min",level:"fácil",free:false,steps:["Remova o cicatrizador do implante","Meça com sonda periodontal a distância da plataforma até a margem gengival (ponto mais apical da parábola)","Escolha o pilar com altura 1mm menor que a medida obtida (ex: 5mm → pilar de 4mm)","Alturas disponíveis: 0,8mm / 1,5mm / 2,5mm / 3,5mm / 4,5mm / 5,5mm","Para prótese cimentada → linha de cimentação próxima ao nível gengival","Para prótese parafusada → pode deixar mais subgengival","Confirme a adaptação com radiografia"],errors:["Medir até o zênite gengival em vez do ponto mais apical","Não confirmar radiograficamente a adaptação do pilar","Escolher altura errada que dificulta a higienização"],decisions:[{if:"Altura transmucosa < 3mm",then:"Use UCLA direto sobre o implante"},{if:"Múltiplos implantes com inclinação",then:"Mini pilar angulado (17° ou 30°)"},{if:"Espaço interoclusal < 4,5mm",then:"UCLA é a melhor opção"}],panic:[{problem:"Pilar instalado muito longo",solution:"Troque por um menor — não desgaste em boca"},{problem:"Exposição metálica excessiva",solution:"Componente muito curto, troque por um maior"}],crises:[]},
    "imp_provisorio_protocolo":{title:"Provisório sobre Implante",time:"40 min",level:"médio",free:false,steps:["Selecione o cilindro provisório compatível","Parafuse o cilindro sobre o implante","Marque 2mm aquém da incisal/oclusal com caneta","Remova o cilindro e corte no local (anteriores: bisel 45° / posteriores: corte reto)","Faça um furo na região oclusal/palatina do dente de estoque","Aplique resina acrílica pó/líquido entre cilindro e dente","Aguarde a presa, retire o provisório e acrescente resina até a cinta","Remova excessos e realize polimento","Parafuse em boca, feche acesso com Teflon e resina"],errors:["Não deixar espaço para resina entre dente e cilindro","Não fazer o furo de encaixe do dente no cilindro","Perfil de emergência convexo","Provisório em oclusão"],decisions:[{if:"Implante bem posicionado",then:"Provisório direto sobre o implante"},{if:"Implante inclinado",then:"Mini pilar angulado antes do provisório"},{if:"Osseointegração comprometida",then:"Converta para carga tardia"}],panic:[{problem:"Provisório fraturou durante osseointegração",solution:"Reparar em boca sem remover — NÃO desparafusar"},{problem:"Cilindro não encaixa",solution:"Verificar interferência do acrílico na cinta"}],crises:[]},
    "imp_moldagem_aberta_protocolo":{title:"Moldagem Aberta",time:"30 min",level:"médio",free:false,steps:["Parafuse o transferente aberto no implante e radiografe","Para múltiplos implantes: una os transferentes com fio dental + resina pattern","Corte a moldeira na região dos parafusos e sele com cera 7","Injete silicona leve ao redor dos transferentes","Leve a moldeira com silicona pesada à boca","Aguarde 4–5 min, desparafuse os transferentes (saem presos no molde)","Parafuse os análogos (sem forçar)","Coloque gengiva artificial e vaze com gesso"],errors:["Não esplintar os transferentes em casos múltiplos","Forçar o aperto do análogo","Não radiografar os transferentes"],decisions:[{if:"Um implante",then:"Não precisa esplintar"},{if:"Múltiplos implantes",then:"Obrigatório esplintar"},{if:"Distância entre implantes > 15mm",then:"Seccionar a união e reunir após 24h"}],panic:[{problem:"Transferente girou no molde",solution:"Refazer a moldagem"},{problem:"Análogo não encaixa",solution:"Verificar resina na área de assentamento"}],crises:[]},
    "imp_moldagem_fechada_protocolo":{title:"Moldagem Fechada",time:"25 min",level:"médio",free:false,steps:["Parafuse o transferente fechado no implante e radiografe","Injete silicona leve ao redor do transferente","Leve moldeira com silicona pesada à boca","Aguarde 4–5 min, remova a moldeira (transferente fica no implante)","Desparafuse o transferente do implante","Parafuse o análogo no transferente","Encaixe no molde respeitando as ranhuras","Vaze com gesso"],errors:["Transferente mal encaixado no molde (ranhuras fora de posição)","Não radiografar o transferente","Maior chance de distorção em casos múltiplos"],decisions:[{if:"Limitação de abertura ou náusea",then:"Prefira moldeira fechada"},{if:"Caso múltiplo ou definitivo",then:"Prefira moldeira aberta"}],panic:[{problem:"Transferente não encaixa no molde",solution:"Moldagem perdida — refazer"},{problem:"Ranhuras não coincidem",solution:"Verificar posição correta do transferente"}],crises:[]},
    "imp_instalar_coroa_protocolo":{title:"Instalar Coroa Unitária",time:"30 min",level:"médio",free:false,steps:["Remova o provisório, cicatrizador ou cilindro de proteção","Limpe a plataforma do implante/pilar","Instale a coroa parafusada","Verifique contatos interproximais com fio dental","Radiografe para verificar adaptação","Ajuste a oclusão com papel carbono","Aplique o torque recomendado","Feche o acesso com Teflon","Sele com resina composta","Polimento final"],errors:["Não radiografar a coroa antes de torquear","Torque insuficiente ou excessivo","Esquecer o Teflon antes da resina"],decisions:[{if:"Contato proximal passivo",then:"Solicite acréscimo de cerâmica ao laboratório"},{if:"Contato muito justo",then:"Desgaste com ponta diamantada"}],panic:[{problem:"Coroa não assenta",solution:"Verifique interferência, excesso de cimento ou resina"},{problem:"Parafuso não entra",solution:"Limpe a rosca com sonda"},{problem:"Não sei qual chave usar",solution:"Comece com hexagonal 1.2mm, depois quadrada 1.3mm ou hexagonal 0.9mm"}],crises:[]},
    "imp_carga_imediata_protocolo":{title:"Carga Imediata Provisória — Captura de PT",time:"60 min",level:"difícil",free:false,steps:["Instale os mini pilares","Parafuse os cilindros provisórios","Posicione a PT perfurada sobre os cilindros","Marque 2mm aquém da oclusal com caneta","Remova os cilindros e corte na marcação com disco de carborundum","Parafuse os cilindros cortados em boca","Una os cilindros à PT com resina acrílica","Aguarde a presa, desparafuse o conjunto","Preencha com acrílico até a cinta","Desgaste excessos (formato ferradura)","Mantenha região interna convexa","Polimento","Parafuse em boca e radiografe"],errors:["Não deixar espaço para resina entre cilindro e PT","Superfície interna côncava","Não radiografar a adaptação final"],decisions:[{if:"Carga imediata",then:"Carga distribuída entre todos os implantes"},{if:"Osseointegração comprometida",then:"Converta para carga tardia"}],panic:[{problem:"Provisório fraturou na osseointegração",solution:"Reparar em boca — NÃO desparafusar (torque pode romper vasos)"},{problem:"Adaptação ruim",solution:"Refazer moldagem"}],crises:[]},
    "imp_afrouxamento_protocolo":{title:"Afrouxamento de Parafuso",time:"10 min",level:"fácil",free:false,steps:["Remova a resina do acesso com ponta diamantada","Selecione a chave: quadrada 1.3mm / hexagonal 1.2mm / hexagonal 0.9mm","Teste qual encaixa sem folga","Aperte o parafuso","Dê o torque recomendado pelo fabricante","Limpe o acesso","Coloque Teflon e feche com resina"],errors:["Usar chave incorreta ou desgastada","Forçar chave que não encaixa","Não dar o torque correto"],decisions:[{if:"Afrouxou 1 vez",then:"Aperte com torque correto e monitore"},{if:"Afrouxou 2 ou mais vezes",then:"Verifique adaptação da infraestrutura — problema oclusal ou de passividade"}],panic:[{problem:"Chave não encaixa",solution:"Parafuso pode estar espanado — ver protocolo de parafuso fraturado"},{problem:"Não sei qual chave usar",solution:"Comece com hexagonal 1.2mm"},{problem:"Não tem torquímetro",solution:"Aperte manualmente com firmeza — encaminhe para torquear depois"}],crises:[]},
    "imp_parafuso_fraturado_protocolo":{title:"Parafuso Fraturado",time:"30 min",level:"difícil",free:false,steps:["Técnica 1 — Sonda reta: encoste na irregularidade do parafuso e gire anti-horário","Técnica 2 — Chave de fenda: faça canaleta com broca + use chave de fenda","Técnica 3 — Cotonete: só funciona se fraturado acima do nível do mini pilar","Último recurso — Canaleta no mini pilar: use chave de fenda e depois troque o mini pilar"],errors:["Tentar remover sem técnica adequada","Forçar sentido horário","Não proteger a plataforma do implante"],decisions:[{if:"Fratura superficial",then:"Técnica do cotonete ou sonda"},{if:"Fratura profunda",then:"Canaleta no mini pilar + chave de fenda"},{if:"Não conseguiu remover",then:"Encaminhe para especialista em implante"}],panic:[{problem:"Não tem chave de fenda",solution:"Use sonda reta ou cotonete"},{problem:"Parafuso não sai com nenhuma técnica",solution:"Encaminhe para referência em implante — não force"}],crises:[]},
    "imp_fratura_dente_protocolo":{title:"Fratura de Dente em Protocolo",time:"20 min",level:"médio",free:false,steps:["Faça retenções com broca esférica na área fraturada","Inclua fio ortodôntico como reforço se necessário (fratura grande)","Acrescente acrílico da cor compatível (66 para dentes / rosa para gengiva)","Aguarde a presa","Remova excessos e acabe","Polimento","Ajuste oclusal"],errors:["Confundir resina autopolimerizável com termopolimerizável","Não fazer retenções mecânicas antes de reparar","Usar acrílico da cor errada"],decisions:[{if:"Fratura pequena",then:"Apenas resina, sem reforço"},{if:"Fratura grande",then:"Inclua fio ortodôntico"},{if:"Dente perdido",then:"Use dente de estoque compatível"}],panic:[{problem:"Reparo soltou",solution:"Refaça com retenções mais profundas"},{problem:"Fratura extensa",solution:"Encaminhe ao laboratório"}],crises:[]},
    "imp_cimento_extravasado_protocolo":{title:"Remoção de Cimento Extravasado",time:"20 min",level:"médio",free:false,steps:["Identifique o excesso (radiografia se necessário)","Use cureta periodontal fina","Remova delicadamente entre gengiva e coroa","Movimentos suaves corono-apicais","Complete com fio dental","Irrigue com água ou clorexidina 0,12%","Verifique radiograficamente","Oriente higienização intensa"],errors:["Usar instrumento muito rígido — arranha o pilar","Deixar cimento remanescente","Não radiografar após remoção"],decisions:[{if:"Cimento superficial",then:"Cureta + fio dental"},{if:"Cimento profundo",then:"Radiografia + ultrassom"},{if:"Inflamação instalada",then:"Clorexidina 0,12% por 7 dias"}],panic:[{problem:"Cimento endurecido e profundo",solution:"Encaminhe ao periodontista"},{problem:"Sangramento abundante",solution:"Comprima com gaze e retorne em 48h"}],crises:[]},    "ajuste-oclusal":{title:"Ajuste Oclusal",time:"30 min",level:"médio",free:true,steps:["Anamnese: dor, clique, travamento, desgaste","Papel carbono fino (8µ) em máxima intercuspidação","Marcar contatos e identificar pontos altos","Desgaste seletivo com broca multilaminada esférica","Papel carbono em lateralidade e protrusão","Ajustar guia canino e anterior","Polir todos os desgastes com borracha abrasiva","Reavaliar em 7–15 dias"],errors:["Desgastar sem papel carbono","Não polir após desgaste","Ajustar sem avaliar DTM associada"],decisions:[{if:"DTM associada",then:"Placa estabilizadora antes do ajuste definitivo"},{if:"Desgaste generalizado",then:"Avaliar bruxismo — placa + reabilitação"}],panic:[{problem:"Dor muscular pós-ajuste",solution:"Anti-inflamatório + reavaliação em 48h"},{problem:"Desgastou demais um dente",solution:"Restauração direta para recompor a cúspide"}],crises:[]},
    "restauracao-carie":{title:"Restauração Direta (Cárie)",time:"30 min",level:"fácil",free:true,steps:["Anestesiar (opcional)","Isolamento absoluto ou relativo","Remoção completa da cárie — cureta de dentina + broca carbide em baixa rotação nas paredes. NUNCA ponta diamantada","Condicionamento ácido: esmalte 35–37% (15–30s) + dentina (se adesivo convencional)","Lavar 30s — secar levemente (dentina úmida, não ressecada)","Adesivo: 2 camadas, aplicação ativa 20s cada, fotopolimerizar 20–40s","Resina em incrementos ≤2mm — fotopolimerizar 40s cada (ou bulk-fill até 4mm)","Acabamento: pontas F/FF → discos flexíveis → borrachas abrasivas → pasta óxido de alumínio","Verificar oclusão"],errors:["Usar ponta diamantada para remover cárie","Ressecar a dentina — colapso de colágeno","Incrementos grossos em resina convencional","Não checar oclusão — causa sensibilidade e fratura"],decisions:[{if:"Cavidade grande",then:"Avaliar onlay ou coroa"},{if:"Dente sensível após restauração",then:"Verificar ponto alto antes de qualquer outra hipótese"}],panic:[{problem:"Adesivo não polimerizou",solution:"Remover tudo e reaplicar — não curar em cima"},{problem:"Resina soltou em dias",solution:"Contaminação por saliva — refazer com isolamento correto"},{problem:"Sensibilidade intensa",solution:"Checar oclusão + testar frio para descartar pulpite irreversível"}],crises:[{label:"Restauração soltou",target:"restauracao-carie"},{label:"Contaminou o adesivo",target:"restauracao-carie"}]},
    "remocao-seletiva":{title:"Remoção Seletiva de Cárie",time:"40 min",level:"médio",free:false,steps:["Anestesiar","Isolamento absoluto","RX bite-wing + teste térmico frio antes de iniciar (dor que cessa = reversível; dor >30s = irreversível)","Cavidade profunda (terço interno): remover cárie das paredes, manter dentina coriácea no fundo","Cavidade muito profunda: manter tecido amolecido no fundo — não arriscar exposição","Instrumentos: cureta de dentina (prioridade) → broca de polímero autolimitante → broca carbide baixa rotação","Proteção do fundo: CIV se dentina coriácea / Ca(OH)₂ + CIV ou MTA/Biodentine se tecido amolecido","Restaurar normalmente sobre a proteção"],errors:["Remover toda a cárie em cavidade profunda — expõe a polpa desnecessariamente","Condicionar ácido sobre dentina coriácea ou amolecida mantida — prejudica adesão","Não agendar retorno na técnica stepwise — risco de progressão da cárie"],decisions:[{if:"Dentina coriácea mantida",then:"Apenas CIV como base"},{if:"Tecido amolecido mantido",then:"Ca(OH)₂ + CIV ou MTA/Biodentine"},{if:"Teste frio positivo com dor >30s",then:"Suspeita de pulpite irreversível — reavaliar antes de restaurar"}],panic:[{problem:"Exposição pulpar acidental",solution:"Hemostasia com algodão seco, clorexidina 2%, MTA — não entre em pânico"},{problem:"Sangramento não cede em 5 min",solution:"Pulpite irreversível — indique endodontia"}],crises:[]},
    "protecao-pulpar":{title:"Proteção Pulpar",time:"45 min",level:"médio",free:false,steps:["Confirmar vitalidade pulpar — teste frio obrigatório","Isolamento absoluto rigoroso","Hemostasia: algodão seco por 2–3 min. Se não ceder → endodontia","Irrigar com clorexidina 2% ou soro fisiológico — não usar NaOCl concentrado","Secar com bolinhas de algodão — nunca jato de ar","Aplicar MTA ou Biodentine diretamente sobre a exposição","Aguardar presa inicial (15–20 min para MTA)","Base de CIV sobre o MTA","Restauração definitiva em resina","RX de controle + retorno em 30, 90 e 180 dias"],errors:["Capear exposição por cárie com sangramento ativo — indica endodontia","Usar Ca(OH)₂ no lugar do MTA em exposição direta — prognóstico inferior","Aplicar adesivo diretamente sobre a polpa","Não agendar controle — falha pode ser silenciosa"],decisions:[{if:"Exposição acidental por trauma/instrumento + polpa vital",then:"Capeamento direto com MTA"},{if:"Exposição por cárie",then:"Pulpotomia ou endodontia — não capear"},{if:"Sangramento não controlado em 5 min",then:"Endodontia obrigatória"},{if:"Dente assintomático com necrose no RX de controle",then:"Endodontia"}],panic:[{problem:"Sangramento intenso ao capear",solution:"Pare. Pressão por 5 min. Se não ceder — endodontia na mesma sessão"},{problem:"Dor espontânea no retorno",solution:"Falha do capeamento — encaminhe para endodontia"}],crises:[]},
    "capeamento":{title:"Capeamento Pulpar",time:"30 min",level:"médio",free:true,steps:["Isolamento absoluto rigoroso","Remover cárie sem expor a polpa","Lavar com NaOCl 0,5% + soro fisiológico","Secar com bola de algodão — não use ar","Aplicar MTA ou Ca(OH)₂ puro sobre a polpa","Cimento de base de ionômero de vidro","Restauração definitiva em resina","RX de controle + retorno 30 e 90 dias"],errors:["Capeamento em exposição por cárie com sangramento — indica endo","Não usar isolamento absoluto","Aplicar adesivo diretamente sobre a polpa"],decisions:[{if:"Exposição acidental por trauma",then:"Capeamento com MTA — bom prognóstico"},{if:"Exposição por cárie",then:"Pulpotomia ou endodontia"},{if:"Sangramento não controlado em 5 min",then:"Endodontia obrigatória"}],panic:[{problem:"Exposição pulpar inesperada",solution:"Calma. Avalie: trauma ou cárie? Controle sangramento e decida"},{problem:"Sangramento intenso",solution:"Não capeie — indique endodontia"}],crises:[]},
    "endodontia-ind":{title:"Indicação de Endodontia",time:"Diagnóstico",level:"fácil",free:false,steps:["Teste de frio: Endo-Ice ou algodão com cloretila","Teste elétrico se disponível","Percussão vertical e horizontal","Sondagem periodontal","RX periapical","Diagnóstico pulpar + periapical","Explicar ao paciente e agendar"],errors:["Restaurar dente com pulpite irreversível","Não fazer RX antes","Confundir pulpite reversível com irreversível"],decisions:[{if:"Dor cessa logo após o estímulo",then:"Pulpite reversível — restaurar"},{if:"Dor persiste > 30s após estímulo",then:"Pulpite irreversível — endodontia"},{if:"Sem vitalidade + lesão apical",then:"Necrose — endodontia obrigatória"}],panic:[{problem:"Diagnóstico incerto",solution:"Encaminhe ao endodontista — não arrisque"}],crises:[]},
    "restauracao-fratura":{title:"Restauração Direta em Fratura",time:"40–60 min",level:"médio",free:true,steps:["Avaliar extensão da fratura, oclusão e expectativa — fraturas extensas ou dente desvitalizado: considerar pino de fibra","Selecionar cor ANTES do isolamento, com dente hidratado — dentina, esmalte e translúcida","Isolamento absoluto","Bisel em esmalte — se colagem de fragmento: condicionar dente e fragmento","Matriz de silicone ou BRB para guiar anatomia palatina","Ácido fosfórico: 30s esmalte / 15s dentina → lavar → secar","Adesivo: evaporar solvente + fotopolimerizar","Parede palatina com resina translúcida","Estratificar: dentina opaca + esmalte translúcido + flow entre mamelos para efeito incisal","Acabamento: multilaminada → discos → borrachas → espiral + pasta","Checar oclusão em MIC e lateralidade"],errors:["Selecionar cor após isolamento — dente desidratado distorce o resultado","Não fazer bisel — transição visível e frágil","Não estratificar em fraturas extensas — resultado monocromático","Fotopolimerizar sem evaporar o solvente — falha adesiva","Não checar lateralidade — restauração fratura em dias"],decisions:[{if:"Fragmento viável",then:"Colagem direta — ótima estética, menor desgaste"},{if:"Fratura só em esmalte",then:"Resina de opacidade única, sem estratificação"},{if:"Fratura extensa / dente desvitalizado",then:"Pino de fibra antes de restaurar"},{if:"Exposição pulpar",then:"Capeamento com MTA ou endodontia — nunca restaure direto"},{if:"Fratura radicular",then:"Endodontia + avaliar prognóstico"}],panic:[{problem:"Fragmento escurecido",solution:"Tente a colagem — hidrate e avalie antes de descartar"},{problem:"Cor diferente após polimento",solution:"Normal — espere 24h para reidratação"},{problem:"Restauração fraturou logo",solution:"Checar ponto alto em lateralidade"}],crises:[]},
    "pino-fratura":{title:"Cimentação de Pino de Fibra",time:"60 min",level:"difícil",free:false,steps:["[CONDUTO] Remover guta: Broca Gates preservando 4mm apical → Broca Largo no diâmetro do pino","[CONDUTO] Prova do pino — deve assentar passivamente, nunca forçar","[CONDUTO] Lavar com NaOCl + EDTA 17% → secar com cones de papel","[CONDUTO] Ácido fosfórico 35–37% por 15s → lavar abundantemente → secar com cones de papel","[CONDUTO] Adesivo com microbrush dentro do canal → fotopolimerizar 20s","[PINO] Jatear com óxido de alumínio 50µm (2–3s, 2cm, 45°) → limpar com álcool 70°","[PINO] Silano: aguardar 60s — NÃO SECAR","[PINO] Adesivo no pino → fotopolimerizar 20s","[CIMENTAÇÃO] Resina dual: aplicar dentro do canal com ponteira e no pino → remover excessos → fotopolimerizar 40s por face (mínimo 3 faces)","Construir núcleo em resina composta (incrementos ≤2mm) → restauração direta ou coroa"],errors:[" Remover além de 2/3 da guta — compromete vedamento apical","Não fazer condicionamento ácido","Condicionar >15s — pode sensibilizar","Não jatear o pino — falha adesiva previsível","Soprar ar no silano antes de 60s","Forçar pino sem calibrar — fratura radicular","Usar cimento de fosfato de zinco — usar sempre resina dual"],decisions:[{if:"Canal largo (diâmetro > 1/3 da raiz)",then:"Reembasar pino com resina flow antes de cimentar"},{if:"Estrutura coronária < 50% após núcleo",then:"Não fazer restauração direta → preparo para coroa"},{if:"Canal muito curvo",then:"Pino curto + núcleo longo — nunca force"},{if:"Sem microjato no consultório",then:"Ácido fluorídrico 10% por 60s (apenas pinos com sílica)"}],panic:[{problem:"Pino não entra até o comprimento desejado",solution:"Ajustar com broca calibrada do sistema — nunca forçar. Se não entrar, usar pino mais curto"},{problem:"Pino soltou em menos de 7 dias",solution:"Remover, limpar canal e pino, secar bem e recimentar com resina dual"},{problem:"Fratura radicular ao inserir pino",solution:"Parar imediatamente. Avaliar extensão com RX. Se fratura vertical → exodontia"},{problem:"Bolha no cimento visível no RX",solution:"Remover pino, eliminar bolha com ponta exploradora, recimentar com ponteira"}],crises:[]},
    "trocar-rest":{title:"Restauração de Rotina",time:"30-40 min",level:"fácil",free:true,steps:["Isolamento absoluto ou relativo","Preparo cavitário — remover cárie e remanescente de restauração antiga","Ácido fosfórico 37%: esmalte 30s / dentina 15s → lavar 30s → secar controlado (dentina levemente úmida)","Primer/bond: aplicação ativa em esmalte e dentina → evaporar solvente → fotopolimerizar","Inserir resina em incrementos oblíquos ≤2mm → fotopolimerizar 40s cada","Acabamento e polimento","Ajuste oclusal final"],errors:["Ressecar a dentina — colapso das fibras de colágeno, falha adesiva","Incrementos grossos >2mm — contração de polimerização excessiva","Não evaporar o solvente do adesivo — falha adesiva","Não checar oclusão — sensibilidade e fratura precoce"],decisions:[{if:"Cavidade extensa (>50% da estrutura perdida)",then:"Avaliar onlay ou coroa"},{if:"Classe II com contato proximal ruim",then:"Usar matriz seccionada + cunha"},{if:"Sensibilidade pós-operatória",then:"Checar ponto alto antes de qualquer outra hipótese"}],panic:[{problem:"Adesivo não polimerizou",solution:"Remover tudo e reaplicar — não cure em cima"},{problem:"Resina soltou em dias",solution:"Contaminação por saliva — refazer com isolamento correto"},{problem:"Sensibilidade intensa",solution:"Checar oclusão + testar frio para descartar pulpite irreversível"}],crises:[]},
    "acabamento-proximal-restauracao":{title:"Acabamento Proximal em Restauração",time:"15-25 min",level:"fácil",free:true,steps:["Identificar exatamente onde o fio trava ou rasga usando fio dental","Confirmar se o problema é excesso/overhang ou apenas contato muito justo","Isolar e garantir boa visualização da região proximal","Se houver excesso leve → iniciar com tira de lixa interproximal fina","Se o contato estiver muito travado ou houver excesso mais rígido → considerar tira metálica serrilhada/diamantada (tipo ContacEZ, GC, Komet, EVA/IPR)","Movimentar a tira com pressão controlada, sem serrar agressivamente o ponto de contato","Se houver degrau maior ou sobrecontorno → usar multilaminada fina ou ponta de acabamento adequada","Reavaliar frequentemente com fio dental durante o ajuste","O fio deve passar com leve resistência, sem ficar frouxo","Após ajuste → realizar acabamento e polimento proximal","Checar presença de impacto alimentar e conforto do paciente"],tip:{text:"Sem tira serrilhada disponível? É possível improvisar usando tira de matriz metálica fina e criando pequenas serrilhas com broca diamantada ou multilaminada.",note:"Use apenas para pequenos excessos e com muito controle, porque o desgaste pode ficar agressivo e abrir o contato rapidamente."},errors:["Desgastar sem localizar exatamente onde o fio trava","Abrir demais o contato proximal","Usar tira serrilhada agressivamente em contato saudável","Ajustar sem repolir — superfície rugosa retém placa e rasga fio","Ignorar excesso subgengival ou cálculo confundindo com contato apertado","Desgastar dente hígido apenas porque o contato é naturalmente justo"],decisions:[{if:"Fio não passa, mas não rasga",then:"Tente técnica de serra, fita dental ou fio PTFE antes de desgastar"},{if:"Fio rasga/desfia no mesmo ponto",then:"Suspeite de overhang, excesso, cálculo ou margem irregular"},{if:"Excesso pequeno e localizado",then:"Tira de lixa interproximal costuma resolver"},{if:"Contato muito travado ou excesso mais resistente",then:"Tira serrilhada/diamantada pode facilitar o desgaste controlado"},{if:"Sobrecontorno grande ou degrau importante",then:"Reanatomização ou troca da restauração pode ser mais previsível"},{if:"Houver impacto alimentar após ajuste",then:"Provavelmente o contato proximal foi aberto demais"}],panic:[{problem:"O contato abriu demais",solution:"Pare o desgaste e reavalie necessidade de refazer anatomia proximal"},{problem:"O fio continua rasgando após ajuste",solution:"Procure excesso subgengival, cálculo ou cárie proximal"},{problem:"O paciente começou a impactar alimento",solution:"O contato perdeu pressão proximal — considere correção/restauração"},{problem:"O fio ainda não passa mesmo após ajuste leve",solution:"Reavalie assentamento da restauração/coroa antes de continuar desgastando"}],crises:[]},
    "restauracao-proximal-classe-ii":{title:"Restauração Proximal Classe II em Resina",time:"35-50 min",level:"médio",free:true,steps:["Confirmar extensão da lesão clinicamente e na radiografia, avaliando também o dente adjacente","Anestesia + isolamento absoluto","Remover cárie/restauração antiga de forma conservadora, protegendo o dente vizinho","Fazer pré-cunhamento quando possível","Adaptar matriz seccional, cunha e anel separador","Confirmar adaptação cervical da matriz antes de restaurar","Se o contato remanescente impedir passagem da matriz, aliviar com tira diamantada fina","Realizar protocolo adesivo corretamente: condicionamento, adesivo, evaporação do solvente e fotopolimerização","Construir primeiro a parede proximal, transformando a Classe II em Classe I","Inserir resina em incrementos oblíquos de até 2 mm, fotopolimerizando cada camada","Esculpir anatomia, remover matriz/cunha e checar contato proximal com fio dental","Fazer acabamento, polimento e ajuste oclusal final"],errors:["Matriz mal adaptada na cervical","Contato proximal frouxo","Overhang cervical","Não usar cunha ou anel separador","Incremento grande/horizontal gerando tensão excessiva","Não evaporar solvente do adesivo","Não checar fio dental antes de finalizar","Liberar sem ajuste oclusal"],decisions:[{if:"Contato proximal ficou aberto",then:"Refaça a parede proximal com matriz seccional bem adaptada"},{if:"A matriz não passa pelo contato",then:"Alivie com tira diamantada fina antes de forçar"},{if:"A matriz não adapta na cervical",then:"Reajuste cunha/matriz antes de restaurar"},{if:"O contato ficou frouxo",then:"Provavelmente faltou separação proximal adequada"},{if:"O fio rasga após restauração",then:"Procure overhang ou excesso cervical"},{if:"Cavidade muito extensa/profunda",then:"Avalie onlay ou coroa conforme remanescente"}],panic:[{problem:"O contato ficou aberto",solution:"Não tente resolver só no acabamento — refaça a parede proximal"},{problem:"O fio rasga após finalizar",solution:"Faça acabamento proximal e procure excesso cervical"},{problem:"A restauração ficou alta",solution:"Ajuste em MIC e lateralidade antes de liberar"},{problem:"Sensibilidade pós-operatória",solution:"Reavalie adesão, oclusão e profundidade cavitária"}],crises:[]},
    "ajuste-oclusal-restauracao":{title:"Ajuste Oclusal em Restauração",time:"10-20 min",level:"fácil",free:true,steps:["Secar bem os dentes antes de marcar com papel articular/carbono","Marcar a restauração e os dentes vizinhos em máxima intercuspidação (MIC)","Pedir para o paciente fechar leve, sem apertar forte","Se apenas a restauração marcar forte e os dentes vizinhos não tocarem, confirmar hiperoclusão","Se o paciente ainda estiver anestesiado, avaliar visualmente os contatos e reavaliar depois da anestesia quando necessário","Ajustar os pontos altos com broca fina/em acabamento, removendo pouco por vez","Remarcar frequentemente durante o ajuste","Após estabilizar a mordida em MIC, checar lateralidade e protrusão","Remover interferências excêntricas sem destruir anatomia saudável","Se disponível, confirmar equilíbrio dos contatos com shimstock","Polir toda área desgastada","Confirmar conforto do paciente antes de finalizar"],errors:["Desgastar baseado apenas no tamanho da marca do carbono","Pedir mordida forte em restauração recém-feita","Ajustar excessivamente e achatar anatomia oclusal","Ignorar contatos em lateralidade/protrusão","Confiar totalmente na percepção do paciente ainda anestesiado","Não polir após ajuste","Liberar sem remarcar os contatos"],decisions:[{if:"Só a restauração marca forte no carbono",then:"Hiperoclusão praticamente confirmada"},{if:"O desconforto melhora imediatamente após ajuste",then:"A causa era provavelmente contato prematuro"},{if:"A dor continua mesmo após ajuste adequado",then:"Avalie sensibilidade pulpar, trinca ou outra causa"},{if:"A restauração marca em lateralidade/protrusão",then:"Existe interferência dinâmica"},{if:"O paciente ainda está anestesiado",then:"Reavalie depois da anestesia se houver dúvida"}],panic:[{problem:"O paciente continua “batendo alto” após ajuste",solution:"Remarque novamente em MIC e movimentos excêntricos antes de desgastar mais"},{problem:"A anatomia ficou muito plana",solution:"Reavalie necessidade de reanatomização/restauração"},{problem:"O paciente começou a relatar sensibilidade após ajuste excessivo",solution:"Evite desgaste desnecessário adicional e reavalie o caso"},{problem:"O carbono marca tudo igual",solution:"Use queixa clínica e, se possível, shimstock para confirmar os contatos reais"}],crises:[]},
    "dessensibilizante":{title:"Dessensibilizante",time:"15 min",level:"fácil",free:true,steps:["Identificar origem: cervical leve, generalizada ou pós-clareamento","Verificar cárie cervical antes de qualquer aplicação","Profilaxia com taça de borracha + pasta profilática","Aplicar dessensibilizante (Gluma, Admira Protect) ou verniz de flúor 5%","Fotopolimerizar se necessário","Orientar: evitar ácido e frio por 24h","Reavaliar em 14 dias"],errors:["Aplicar sobre cárie não tratada","Não identificar a causa real","Não orientar dieta e hábitos"],decisions:[{if:"Sem melhora em 30 dias",then:"Suspeitar de pulpite — avaliar endodontia"},{if:"Pós-clareamento",then:"Flúor neutro + potássio — intervalo entre sessões"}],panic:[{problem:"Dor intensa ao aplicar",solution:"Pare. Verificar exposição pulpar"}],crises:[]},
    "recessao-gengival":{title:"Sensibilidade Cervical por Recessão Gengival",time:"30 min",level:"médio",free:true,steps:["Confirmar se há recessão gengival, dentina cervical exposta ou raiz exposta","Descartar outras causas: cárie cervical, restauração infiltrada, trinca, hiperoclusão ou dor pulpar","Identificar o gatilho principal: frio, ar, escovação, doce ou toque cervical","Corrigir fatores causais: escovação traumática, escova dura, dieta ácida, refluxo, bruxismo ou trauma oclusal","Orientar dentifrício dessensibilizante de uso contínuo","Se precisar de alívio mais rápido, aplicar dessensibilizante em consultório","Considerar verniz fluoretado, oxalato, nitrato de potássio, adesivo/selante dentinário ou ionômero conforme o caso","Se houver lesão cervical não cariosa com perda de estrutura, restaurar a área cervical","Se houver demanda estética, progressão da recessão ou necessidade de tecido queratinizado, encaminhar para Periodontia","Reavaliar resposta clínica e escalar tratamento apenas se a sensibilidade persistir"],errors:["Tratar toda sensibilidade cervical como “normal”","Aplicar dessensibilizante sem corrigir escovação traumática","Ignorar cárie cervical ou restauração infiltrada","Não investigar hiperoclusão ou bruxismo","Restaurar raiz exposta sem perda real de estrutura","Indicar cirurgia periodontal só por sensibilidade leve","Não orientar uso contínuo do dessensibilizante domiciliar"],decisions:[{if:"Dor curta ao frio/ar e cervical exposta",then:"Provável hipersensibilidade dentinária por recessão"},{if:"Há retração, mas sem cavidade cervical",then:"Comece com controle de causa + dessensibilizante domiciliar"},{if:"Precisa de alívio mais rápido",then:"Aplicar dessensibilizante em consultório"},{if:"Existe lesão cervical com perda de estrutura",then:"Restaurar a cervical"},{if:"Há estética comprometida, recessão progressiva ou pouca faixa de gengiva",then:"Encaminhar para Periodontia"},{if:"Dor persiste, lateja ou aparece sozinha",then:"Não trate como sensibilidade cervical; avaliar pulpite"}],panic:[{problem:"Paciente diz que “não consegue tomar água gelada”",solution:"Confirme se a dor é curta e localizada. Se for, dessensibilize e controle a causa"},{problem:"Dessensibilizante não resolveu",solution:"Reavalie causa ativa: escovação, erosão, bruxismo, trinca, cárie ou restauração infiltrada"},{problem:"A raiz está exposta e com cavidade",solution:"Não dependa só de pasta dessensibilizante; avalie restauração cervical"},{problem:"O paciente quer “cobrir a raiz”",solution:"Encaminhe para avaliação periodontal, principalmente se houver queixa estética ou recessão progressiva"}],crises:[]},
    "resina-comp":{title:"Troca de Amálgama por Resina",time:"40 min",level:"médio",free:true,steps:["Avaliar indicação: cárie secundária, fratura, infiltração ou estética — amálgama íntegro sem sintomas não precisa ser trocado","RX periapical pré-operatório","Isolamento absoluto — obrigatório para conter fragmentos e vapores","Remover amálgama em blocos com broca multilaminada em alta rotação + irrigação abundante + sugador de alta potência","Verificar e remover cárie secundária completamente","Avaliar profundidade — proteção pulpar se necessário","Ácido fosfórico 37%: esmalte 30s / dentina 15s → lavar → secar controlado","Primer/bond: aplicação ativa → evaporar solvente → fotopolimerizar","Resina em incrementos oblíquos ≤2mm → fotopolimerizar 40s cada","Acabamento, polimento e ajuste oclusal"],errors:["Trocar amálgama íntegro sem indicação clínica — desgaste desnecessário","Não usar isolamento absoluto — fragmentos e vapores de mercúrio","Deixar cárie secundária — falha garantida","Não fazer proteção pulpar em cavidade profunda"],decisions:[{if:"Cavidade extensa após remoção",then:"Avaliar onlay ou coroa"},{if:"Amálgama com cárie + cavidade profunda",then:"Proteção pulpar antes de restaurar"},{if:"Amálgama íntegro sem sintomas",then:"Não trocar — orientar o paciente"}],panic:[{problem:"Exposição pulpar ao remover",solution:"Hemostasia + avaliar capeamento ou endodontia"},{problem:"Fragmento de amálgama no sulco",solution:"Remover com sonda + irrigar abundantemente"}],crises:[]},
    "clareamento-consultorio":{title:"Clareamento em Consultório",time:"60–90 min",level:"médio",free:false,steps:["Avaliar cor com escala Vita — fotografar antes e depois de cada sessão","Verificar: dentes vitais, saudáveis, sem cárie ou restaurações extensas no sorriso","Profilaxia para remoção de placa","Aplicar dessensibilizante em gel (ex: Desensibilize KF 2%) por 10 min","Afastador labial + barreira gengival fotopolimerizável cobrindo margem gengival e 0,5mm da superfície dental","Preparar gel clareador (peróxido de hidrogênio 35%) — misturar peróxido + espessante 3:1 por 40s até viscosidade adequada","Aplicar camada fina na face vestibular — aguardar 15 min — remover com sugador","Repetir 3x de 15 min na mesma sessão","Remover barreira gengival → polimento com pasta diamantada + disco de feltro","Orientar: sem corantes por 48h — retorno em 7 dias (total: 3 sessões)"],errors:["Não aplicar dessensibilizante antes — sensibilidade intensa previsível","Não proteger a gengiva — queimadura química","Aplicar em dentes com cárie ou restaurações extensas","Não avisar sobre restaurações — não clareiam junto com o dente","Trocar restaurações antes do clareamento — a cor ainda vai mudar"],decisions:[{if:"Dente escurecido por trauma ou endodontia",then:"Clareamento interno (walking bleach) — protocolo diferente"},{if:"Sensibilidade intensa",then:"Aumentar intervalo entre sessões + dessensibilizante reforçado"},{if:"Restaurações no sorriso",then:"Clarear primeiro, trocar restaurações depois"}],panic:[{problem:"Queimou a gengiva",solution:"Irrigar com água abundante + analgésico + reavaliação em 48h"},{problem:"Sensibilidade intensa pós-sessão",solution:"Dessensibilizante + potássio + intervalo maior na próxima sessão"}],crises:[]},
    "clareamento-caseiro":{title:"Clareamento Caseiro",time:"3–4 semanas",level:"fácil",free:true,steps:["Avaliar cor com escala Vita — fotografar","Verificar: dentes vitais, saudáveis, sem cárie","Moldagem para confecção das moldeiras","Orientar o paciente: aplicar gel de peróxido de carbamida ou hidrogênio 10–22% na moldeira","Usar por 2–4h/dia (ou overnight para 10%) — conforme indicação do fabricante","Duração: 3–4 semanas","Retorno em 14 dias para avaliação e controle de cor","Ao finalizar: polimento profissional + fotografia final"],errors:["Usar concentrações acima de 22% sem supervisão — risco de sensibilidade grave","Não avisar sobre corantes durante o tratamento","Não fazer moldeira individual — gel vaza e queima a gengiva","Não advertir sobre restaurações — não clareiam"],decisions:[{if:"Sensibilidade",then:"Reduzir tempo de uso + dessensibilizante fluoretado pós-aplicação"},{if:"Sem resultado em 2 semanas",then:"Reavaliar — considerar consultório"},{if:"Paciente grávida ou lactante",then:"Contraindicado"}],panic:[{problem:"Irritação gengival",solution:"Reduzir tempo de uso + verificar adaptação da moldeira"}],crises:[]},
    "endo-urgencia":{title:"Urgência Endodôntica",time:"30–45 min",level:"médio",free:true,steps:["Anamnese rápida + RX periapical + teste de vitalidade + percussão","Usar widget de diagnóstico de pulpite acima para orientar a conduta","Anestesia infiltrativa — se não funcionar: intraligamentar ou intrapulpar","Isolamento absoluto","Abertura coronária com broca esférica — acessar a câmara pulpar","Remoção do conteúdo pulpar com lima ou broca — alívio imediato da pressão","Irrigação com soro fisiológico ou NaOCl 1%","Curativo de hidróxido de cálcio ou pellet de algodão seco","Selamento provisório com Cavit ou IRM","Prescrição: ibuprofeno 600mg 8/8h + encaminhar especialista"],errors:["Não fazer RX antes — risco de perfuração","Instrumentar o canal completo — não é papel do clínico geral","Selar com abscesso ativo — drenagem obrigatória antes","Não encaminhar para especialista"],decisions:[{if:"Dor espontânea + teste positivo",then:"Pulpite irreversível — abertura de urgência"},{if:"Sem vitalidade + lesão apical",then:"Necrose — abertura + drenagem"},{if:"Abscesso flutuante",then:"Drenar antes de selar"},{if:"Dente sem condições",then:"Extrair em vez de tratar"}],panic:[{problem:"Anestesia não funciona",solution:"Intraligamentar + aguardar 5 min — se persistir: intrapulpar direta"},{problem:"Sangramento abundante ao abrir",solution:"NaOCl + pressão com cone de papel — não sele"},{problem:"Dor intensa após abertura",solution:"Verificar selamento — pode ter ficado aberto"}],crises:[]},
    "pulpite-reversivel":{title:"Pulpite Reversível / Fase de Transição",time:"30 min",level:"fácil",free:true,steps:["Remover o agente causal completamente — cárie, restauração fraturada ou fator irritante","Avaliar se há exposição pulpar","Sem exposição → capeamento indireto com hidróxido de cálcio ou CIV","Exposição pequena e acidental → capeamento direto com MTA ou hidróxido de cálcio","Cimento provisório (TempBond ou ionômero de vidro)","Reavaliação em 1–2 semanas — avaliar sintomas e teste de vitalidade","Sem melhora ou dor espontânea → indicar endodontia — encaminhar especialista","Com melhora completa → restauração definitiva"],errors:["Indicar endodontia sem necessidade — polpa tem potencial de recuperação","Não remover completamente o fator causal — inflamação persiste","Restaurar definitivamente sem reavaliar — pode estar evoluindo silenciosamente","Não informar o paciente que pode precisar de endodontia"],decisions:[{if:"Sem exposição pulpar",then:"Capeamento indireto"},{if:"Exposição pequena acidental",then:"Capeamento direto com MTA"},{if:"Melhora completa em 1–2 semanas",then:"Restauração definitiva"},{if:"Dor persiste ou piora",then:"Pulpite irreversível — encaminhar especialista"},{if:"Dor espontânea noturna",then:"Não esperar — endodontia"}],panic:[{problem:"Exposição pulpar inesperada",solution:"Avaliar sangramento — sem sangramento: MTA — com sangramento ativo: endodontia"},{problem:"Dor espontânea no retorno",solution:"Evoluiu para irreversível — encaminhar especialista"}],crises:[]},
    "pulpite-irreversivel":{title:"Pulpite Irreversível — Urgência",time:"30 min",level:"médio",free:true,steps:["RX periapical + confirmar diagnóstico","Anestesia — se não funcionar: intraligamentar ou intrapulpar","Acesso à câmara pulpar com broca esférica + Endo-Z","Remover polpa coronária com extirpa nervos — alívio imediato da dor","Irrigação com hipoclorito de sódio 2,5%","Algodão quase seco com formocresol — apenas o suficiente para sentir o cheiro, sem excesso de líquido + cimento provisório (TempBond ou ionômero de vidro)","Ibuprofeno 600mg 6/6h por 3–5 dias","Encaminhar para endodontista — urgência não é tratamento definitivo"],errors:["Não fazer RX — risco de perfuração","Selar com abscesso ativo — drenar antes","Algodão encharcado de formocresol — risco de extravasamento e necrose periapical","Não encaminhar — urgência não é tratamento definitivo"],decisions:[{if:"Abscesso flutuante",then:"Drenar antes de selar"},{if:"Dente irrestaurável",then:"Avaliar extração"},{if:"Alérgico a AINE",then:"Paracetamol 500mg 6/6h"}],panic:[{problem:"Anestesia não funciona",solution:"Intraligamentar + 5 min — se persistir: intrapulpar"},{problem:"Sangramento não cede",solution:"Hipoclorito + cone de papel — não sele"}],crises:[]},
    "medicacao":{title:"Medicação + Retorno",time:"10 min",level:"fácil",free:true,steps:["Confirmar: dor sem abscesso visível ou fístula","Ibuprofeno 600mg de 8/8h por 3 dias","Se infecção evidente: amoxicilina 500mg 8/8h por 7 dias","Se alergia à penicilina: clindamicina 300mg 8/8h","Se dor muito intensa: adicionar dipirona 1g 6/6h","Agendar endodontia em 24–48h","Orientar: gelo, dieta mole, não morder no dente"],errors:["Antibiótico sem infecção","Não agendar retorno","Dipirona isolada em dor pulpar — insuficiente"],decisions:[{if:"Febre + trismo + edema",then:"Urgência — drenagem cirúrgica ou UPA"},{if:"Paciente grávida",then:"Paracetamol — ibuprofeno contraindicado"}],panic:[{problem:"Edema crescendo rapidamente",solution:"Não espere — encaminhe para drenagem cirúrgica"}],crises:[]},
    "retratamento":{title:"Retratamento Endodôntico",time:"60–90 min",level:"difícil",free:false,steps:["RX periapical + tomografia se disponível","Avaliar: qualidade da obturação, lesão apical, sintomas","Remover restauração coronária","Dissolver guta com solvente (eucaliptol)","Instrumentar com limas de retratamento","Reodontometria eletrônica","Reinstrumentar todo o canal","Irrigação agressiva: NaOCl + EDTA","Medicação: Ca(OH)₂ por 30 dias","Obturação na sessão seguinte"],errors:["Sem tomografia em casos complexos","Forçar instrumentos — cria degrau ou perfura","Obturar na mesma sessão sem medicação"],decisions:[{if:"Lesão > 5mm",then:"Retratamento + aguardar 6 meses; se persistir — cirurgia"},{if:"Lima fraturada",then:"Encaminhar especialista"}],panic:[{problem:"Canal não localizado",solution:"Pare. Use magnificação. Não perfure"},{problem:"Sangramento intenso",solution:"NaOCl + reavaliação do comprimento de trabalho"}],crises:[]},
    "bypassar":{title:"Bypass de Lima Fraturada",time:"30 min",level:"difícil",free:true,steps:["RX para localizar fragmento","NÃO tente remover com força","Use lima K #6 ou #8 lateralmente ao fragmento","Movimentos de cateterismo suave + NaOCl","Avance gradualmente com limas crescentes","Se passou: instrumente além normalmente","Se não passou: documente e encaminhe"],errors:["Forçar — piora a situação","Usar torque excessivo","Não informar o paciente"],decisions:[{if:"Fragmento terço apical + canal instrumentado",then:"Obture incluindo o fragmento — prognóstico similar"},{if:"Fragmento terço coronal",then:"Ultrassom pode remover — encaminhe especialista"}],panic:[{problem:"Fragmento se aprofundou mais",solution:"Pare. Documente. Encaminhe especialista imediatamente"}],crises:[]},
    "controle-sangramento-endo":{title:"Controle de Sangramento Endodôntico",time:"15 min",level:"médio",free:true,steps:["Irrigação com NaOCl 5,25%","Pressão com cone de papel por 2 min","Verificar comprimento — sangramento por perfuração?","Normal: Ca(OH)₂ + selamento","Perfuração suspeita: RX + MTA","Nunca sele se sangramento ativo"],errors:["Selar com sangramento ativo","Não investigar causa","Epinefrina no canal — contraindicado"],decisions:[{if:"Polpa vital",then:"Pulpotomia ou endodontia completa"},{if:"Perfuração",then:"MTA + encaminhar"}],panic:[{problem:"Sangramento não cede",solution:"Ca(OH)₂ + curativo seco + retorno em 7 dias"}],crises:[]},
    "canal-calcificado":{title:"Canal Calcificado",time:"60–90 min",level:"difícil",free:false,steps:["Tomografia cone beam obrigatória","Acesso ampliado para visualização","Lupa ou microscópio cirúrgico","Lima K #6 ou #8 com EDTA 17%","Cateterismo ultrassônico","Odontometria + RX de confirmação","Instrumentação cuidadosa","NaOCl + EDTA + ativação sônica"],errors:["Sem magnificação","Forçar — perfura","Sem EDTA"],decisions:[{if:"Canal não localizado",then:"Pause. Tomografia. Encaminhe"},{if:"Calcificação parcial",then:"Trabalhe no trecho desobstruído"}],panic:[{problem:"Perfurou o assoalho",solution:"MTA imediato + encaminhar especialista"}],crises:[]},
    "extracao-simples":{title:"Extração Simples",time:"20–40 min",level:"fácil",free:true,steps:["Anamnese detalhada","Aferir PA antes de iniciar","Anestesia infiltrativa + bloqueio se necessário","Aguardar 3–5 min","Sindesmotomia com descolador","Luxação: movimentos vestíbulo-linguais progressivos","Rotação suave em raízes cônicas","Avulsão controlada — não torça com fórceps","Curetagem alveolar","Comprimir corticais com os dedos","Compressa de gaze por 30 min","Orientações por escrito"],errors:["Não fazer sindesmotomia","Forçar sem luxar","Ignorar anticoagulante","Não orientar pós-operatório","Não curetejar o alvéolo"],decisions:[{if:"Paciente anticoagulado",then:"Contato com médico — protocolo local de hemostasia"},{if:"Raiz fraturada",then:"Converter para cirúrgica com retalho"},{if:"PA > 180/110",then:"Adiar — controlar PA antes"},{if:"Paciente grávida",then:"Evitar 1º trimestre — se urgência, 2º trimestre é mais seguro"},{if:"Diabético descompensado",then:"Adiar — glicemia > 200 mg/dL aumenta risco de infecção"},{if:"Paciente com bisfosfonato",then:"Não extrair sem protocolo — risco de osteonecrose"},{if:"Dente com abscesso agudo",then:"Drenar primeiro, extrair após antibiótico 48h"},{if:"Raiz muito curva no RX",then:"Luxar com cuidado — alto risco de fratura"},{if:"Paciente muito ansioso",then:"Considerar pré-medicação ansiolítica"}],panic:[{problem:"Raiz partiu",solution:"Luxador apical + alavanca Potts; se não conseguir em 10 min — retalho"},{problem:"Sangramento não cede",solution:"Sutura em X + esponja hemostática absorvível + curativo compressivo"},{problem:"Dente errado",solution:"Reimplante imediato se <5 min. Informe o paciente. Documente tudo"}],crises:[{label:"Raiz partiu na extração",target:"extracao-simples"},{label:"Sangramento não para",target:"hemostasia"}]},
    "extracao-cirurgica":{title:"Extração Cirúrgica",time:"45–90 min",level:"difícil",free:false,steps:["RX panorâmica + periapical","Anamnese completa + PA","Anestesia: bloqueio + infiltrativa","Incisão: envelope ou triangular","Descolamento mucoperiosteal","Osteotomia com broca cirúrgica COM irrigação","Odontosecção se raízes divergentes","Luxação e extração por partes","Curetagem + irrigação abundante com SF","Sutura: pontos simples ou em X","Compressa + orientações","Prescrição: amoxicilina 500mg + ibuprofeno 600mg"],errors:["RX insuficiente","Retalho mal planejado","Osteotomia sem irrigação — osteonecrose","Não suturar"],decisions:[{if:"Siso vertical",then:"Muitas vezes extração simples"},{if:"Siso horizontal/mesioangular",then:"Cirúrgica com odontosecção"},{if:"Próximo ao nervo alveolar inferior",then:"Tomografia + discutir risco de parestesia"}],panic:[{problem:"Raiz foi para o seio maxilar",solution:"Pare. RX. Encaminhe bucomaxilo imediatamente"},{problem:"Sangramento intenso que não cede",solution:"Sutura + esponja hemostática + encaminhar hospital"}],crises:[]},
    "hemostasia":{title:"Hemostasia de Urgência",time:"10–20 min",level:"médio",free:true,steps:["Compressão com gaze SECA por 5 min ininterruptos — sem trocar","Avaliar origem do sangramento: alvéolo ou tecido mole?","→ Alvéolo: esponja hemostática absorvível dentro + sutura em X","→ Tecido mole: pressão direta + sutura simples se necessário","Irrigar com SF para visualizar bem a origem","Ácido tranexâmico tópico se disponível","Morder por 30 min — orientar: não cuspir, não bochechar, não usar canudo — deslocam o coágulo","Compressa de gaze gelada externamente — auxilia na vasoconstrição","Verificar histórico de anticoagulante","Orientar: sem líquidos quentes, sem cigarro, sem esforço físico por 24h"],errors:["Trocar gaze a cada minuto — remove o coágulo","Não verificar anticoagulante","Não suturar quando o alvéolo exige","Bochechar com líquido quente"],decisions:[{if:"Sangramento não cede em 30 min",then:"Sutura + encaminhar UPA"},{if:"Anticoagulante oral",then:"Ácido tranexâmico + contato médico"},{if:"Hemofilia",then:"UPA imediatamente"}],panic:[{problem:"Sangramento intenso pulsátil",solution:"Pressão digital forte + SAMU se não ceder em 5 min"},{problem:"Paciente com tontura/palidez",solution:"Deitar, elevar pernas, monitorar PA, chamar socorro"}],crises:[{label:"Sangramento não para",target:"hemostasia"}]},
    "alveolite-seca":{title:"Alveolite Seca",time:"20 min",level:"fácil",free:true,steps:["Diagnóstico: alvéolo vazio sem coágulo, dor intensa irradiada, halitose — 2–4 dias após extração","Anestesia local — obrigatória, é muito doloroso","Irrigação abundante com SF + clorexidina 0,12%","Curetagem SUAVE para estimular sangramento e formação de novo coágulo","Curativo com Alvogyl ou gaze iodofórmio dentro do alvéolo","Trocar curativo a cada 2–3 dias por 1–2 semanas","Ibuprofeno 600mg 8/8h","Orientar: não fumar, não usar canudo, não cuspir, higiene suave"],errors:["Curetagem agressiva — piora o quadro","Não trocar o curativo — infecção secundária","Não anestesiar antes de trocar o curativo","Não orientar sobre cigarro — principal fator de risco"],decisions:[{if:"Sem melhora em 7 dias",then:"RX para descartar fragmento ósseo"},{if:"Febre associada",then:"Suspeitar de alveolite úmida — antibiótico sistêmico"}],panic:[{problem:"Dor intensa ao remover curativo",solution:"Anestesiar antes de remover sempre"},{problem:"Não melhora após 2 semanas",solution:"RX + encaminhar — suspeitar de osteomielite"}],crises:[]},
    "alveolite-umida":{title:"Alveolite Úmida",time:"20 min",level:"médio",free:true,steps:["Diagnóstico: alvéolo com tecido necrótico, pus, odor fétido, febre — infecção bacteriana","Anestesia local — obrigatória","Curetagem do tecido necrótico — mais agressiva que na alveolite seca","Irrigação abundante com SF + clorexidina 0,12%","Drenagem do pus se necessário","Amoxicilina 500mg 8/8h por 7 dias + ibuprofeno 600mg 8/8h","Curativo com gaze iodofórmio — trocar a cada 2–3 dias","Retorno em 48h para reavaliação"],errors:["Não prescrever antibiótico — alveolite úmida tem componente infeccioso","Curetagem insuficiente — tecido necrótico deve ser removido","Não drenar o pus se presente","Confundir com alveolite seca — conduta diferente"],decisions:[{if:"Febre alta + trismo + edema",then:"Encaminhar hospital — risco de infecção disseminada"},{if:"Sem melhora em 5 dias com antibiótico",then:"Trocar antibiótico ou encaminhar"}],panic:[{problem:"Edema crescendo rapidamente",solution:"Encaminhar hospital imediatamente — risco de vida"},{problem:"Pus não drena",solution:"Incisão para drenagem + encaminhar se não controlar"}],crises:[]},
    "sutura-tecnica":{title:"Técnica de Sutura",time:"10–20 min",level:"médio",free:true,steps:["Fio: nylon 4-0 (anterior), seda 3-0 (posterior/gengiva)","Porta-agulha no 1/3 posterior da agulha","Entrar perpendicular ao tecido a 3mm da borda","Passar pela borda oposta de dentro para fora","Nó cirúrgico: 2 laçadas + 1 + 1","Bordas coaptadas sem tensão","Ponto em X: alvéolo com sangramento","Remoção: 7 dias anterior, 10 dias posterior"],errors:["Suturar sob tensão — deiscência certa","Nó frouxo — abre no 1° dia","Pontos muito apertados — isquemia"],decisions:[{if:"Retalho tenso",then:"Incisão de alívio periosteal antes de suturar"}],panic:[{problem:"Tecido rasgou",solution:"Ampliar ponto para tecido íntegro adjacente"}],crises:[]},
    "raspagem-supragengival":{title:"Raspagem Supragengival",time:"45–60 min",level:"fácil",free:true,steps:["Sondagem periodontal completa (6 pontos por dente)","Índice de sangramento à sondagem","RX periapicais se indicado","Ultrassom: ponta supragengival para remoção de cálculo","Alisamento coronorradicular com curetas Gracey — alisar a superfície radicular e remover biofilme aderido","Polimento com taça de borracha + pasta profilática","Aplicação de flúor","Instrução de higiene personalizada","Retorno em 45–60 dias para reavaliação"],errors:["Não fazer sondagem pré-raspagem","Não reinstruir sobre higiene","Raspagem sem polimento"],decisions:[{if:"Bolsa > 4mm",then:"Encaminhar periodontista"},{if:"Sangramento generalizado",then:"Intensificar higiene + controle semanal"}],panic:[{problem:"Dor intensa após raspagem",solution:"Anti-inflamatório + enxaguante clorexidina 0,12% por 7 dias"}],crises:[]},
    "raspagem-subgengival":{title:"Raspagem Subgengival (RAR)",time:"60–90 min / quadrante",level:"difícil",free:false,steps:["Sondagem completa pré-tratamento","Anestesia local por quadrante","Cureta Gracey 5-6 (anterior) / 11-12 e 13-14 (posterior)","Movimentos de tração controlados — 45° à parede radicular","Alisamento radicular: superfície lisa e dura ao toque","Ultrassom subgengival com ponta fina","Irrigação subgengival com clorexidina","Reavaliação em 6–8 semanas"],errors:["Não anestesiar","Cureta errada para o sítio","Não alisar a raiz","Não reavaliar em 6–8 semanas"],decisions:[{if:"Bolsa > 6mm persistente após RAR",then:"Indicar cirurgia periodontal"},{if:"Furcação grau III",then:"Encaminhar periodontista"}],panic:[{problem:"Sangramento excessivo pós-RAR",solution:"Clorexidina 0,12% + compressão + retorno em 48h"}],crises:[]},
    "abscesso-perio":{title:"Abscesso Periodontal",time:"20 min",level:"médio",free:true,steps:["Diagnóstico: bolsa periodontal + flutuação + dor à palpação — diferenciar de abscesso periapical","RX periapical + teste de vitalidade pulpar","Anestesia a distância","Drenagem do pus pela bolsa periodontal — se abscesso volumoso ou drenagem insuficiente: pequena incisão","Raspagem e alisamento radicular do sítio — remover biofilme e tártaro como fator causal","Irrigação com clorexidina 0,12%","Antibiótico apenas se comprometimento sistêmico (febre, mal-estar, edema): amoxicilina 500mg 8/8h por 5 dias — alérgico: clindamicina ou azitromicina","Ibuprofeno 600mg 8/8h","Orientar: higiene rigorosa + enxágue com água morna e sal","Retorno em 48h — se não melhora: encaminhar periodontista"],errors:["Confundir com abscesso periapical — conduta completamente diferente","Usar antibiótico sem necessidade sistêmica","Não remover o fator causal — abscesso vai recorrer","Não drenar — antibiótico sozinho não resolve"],decisions:[{if:"Dente vital + bolsa + flutuação",then:"Abscesso periodontal"},{if:"Dente sem vitalidade + lesão apical",then:"Abscesso periapical — endodontia"},{if:"Febre + trismo + edema difuso",then:"Encaminhar hospital"},{if:"Sequelas após tratamento",then:"Cirurgia periodontal — encaminhar periodontista"}],panic:[{problem:"Edema crescendo rapidamente",solution:"Encaminhar hospital imediatamente"},{problem:"Drenagem insuficiente pela bolsa",solution:"Incisão de alívio + irrigação abundante"}],crises:[]},
    "guna":{title:"Gengivite Ulcerativa (GUNA)",time:"30 min",level:"médio",free:true,steps:["Diagnóstico: úlceras em papilas, dor intensa, halitose, pseudomembrana","Amoxicilina 500mg 8/8h + metronidazol 250mg 8/8h por 7 dias","Ibuprofeno 600mg 8/8h","Enxaguante clorexidina 0,12% 2x/dia","Higiene suave com escova macia","Raspagem supragengival SUAVE após melhora inicial (48–72h)","Orientar: parar de fumar, sono, alimentação","Retorno em 7 dias"],errors:["Raspagem agressiva no início","Não associar antibiótico + metronidazol","Não investigar imunossupressão"],decisions:[{if:"Sem melhora em 48h",then:"Suspeitar de imunossupressão — HIV, leucemia"}],panic:[{problem:"Lesões extensas + febre alta",solution:"Encaminhar hospital"}],crises:[]},
    "alergia-protocolo":{title:"Reação Alérgica / Anafilaxia",time:"Emergência",level:"urgente",free:true,steps:["Interromper agente suspeito IMEDIATAMENTE","Avaliar: leve (urticária, prurido) ou grave (dispneia, edema, hipotensão)?","LEVE: prometazina 25mg IM + observar 30 min","GRAVE — ANAFILAXIA: chamar SAMU 192 AGORA","Adrenalina 1:1000 — 0,3–0,5ml IM na coxa lateral","Deitar com pernas elevadas","O₂ por máscara 5–8 L/min","Repetir adrenalina a cada 5–15 min se não melhorar","Monitorar sinais vitais continuamente"],errors:["Aguardar em anafilaxia — risco de morte","Não ter adrenalina no kit de emergência","Não chamar SAMU"],decisions:[{if:"Urticária localizada sem dispneia",then:"Anti-histamínico IM + observar 30 min"},{if:"Edema de laringe / broncoespasmo",then:"Adrenalina IM + SAMU 192"},{if:"Hipotensão + perda de consciência",then:"Anafilaxia — RCP se necessário + SAMU"}],panic:[{problem:"Parou de respirar",solution:"RCP + SAMU 192 imediatamente"},{problem:"Sem adrenalina no consultório",solution:"SAMU agora — não há substituto. Deixe SEMPRE no kit"}],crises:[{label:"Reação alérgica no consultório",target:"alergia-protocolo"}]},
    "sincope-protocolo":{title:"Síncope (Desmaio)",time:"Emergência",level:"urgente",free:true,steps:["Interromper o procedimento","Deitar em posição supina","Elevar pernas acima do coração (Trendelenburg)","Afrouxar roupas","Verificar respiração e pulso","O₂ por máscara (5 L/min)","Amoníaco aromático se disponível","Aguardar recuperação 1–3 min","SAMU 192 se não recuperar em 3 min"],errors:["Sentar o paciente — piora perfusão cerebral","Dar líquido com paciente inconsciente","Não acionar emergência"],decisions:[{if:"Recuperou em < 3 min",then:"Monitorar 15 min — não continuar procedimento"},{if:"Não recuperou em 3 min",then:"SAMU 192"},{if:"Dor no peito + síncope",then:"IAM suspeito — SAMU + iniciar RCP se necessário"}],panic:[{problem:"Parou de respirar",solution:"RCP 30:2 + SAMU 192"},{problem:"Convulsão associada",solution:"Proteger cabeça, não segurar, não coloque nada na boca, SAMU"}],crises:[{label:"Paciente desmaiou",target:"sincope-protocolo"}]},
    "infarto-protocolo":{title:"Infarto / Dor no Peito",time:"Emergência",level:"urgente",free:true,steps:["Interromper procedimento imediatamente","SAMU 192 IMEDIATAMENTE","Posição semi-sentada (Fowler)","O₂ por máscara 5–8 L/min","AAS 300mg mastigado (se disponível e sem contraindicação)","Monitorar pulso e respiração a cada 2 min","RCP se parada cardíaca","DEA se disponível","Não deixar o paciente sozinho"],errors:["Não chamar SAMU imediatamente","Deitar paciente com insuficiência respiratória","Não iniciar RCP em parada cardíaca"],decisions:[{if:"Dor típica + sudorese + náusea",then:"IAM provável — SAMU 192 sem hesitar"},{if:"Parada cardíaca",then:"RCP 30:2 + DEA + SAMU"}],panic:[{problem:"Parou de respirar/pulso",solution:"RCP 30:2 + chamar socorro + DEA se disponível"}],crises:[{label:"Dor no peito / Infarto",target:"infarto-protocolo"}]},
    "hipoglicemia-protocolo":{title:"Hipoglicemia",time:"Emergência",level:"urgente",free:true,steps:["Reconhecer: sudorese, palidez, tremor, confusão, taquicardia","Perguntar: diabético? Comeu antes? Tomou insulina?","Consciente: suco de laranja, refrigerante, sachê de mel","Repetir em 15 min se não melhorar","Inconsciente: NÃO dê nada pela boca","Gel de glicose na mucosa gengival","SAMU 192","Glucagon 1mg IM se disponível"],errors:["Dar açúcar a paciente inconsciente — aspiração","Não reconhecer os sinais","Não chamar socorro grave"],decisions:[{if:"Consciente + glicemia > 70",then:"Glicose oral + observar"},{if:"Inconsciente ou < 50",then:"SAMU + glucagon IM"}],panic:[{problem:"Paciente inconsciente diabético",solution:"Gel de glicose gengival + SAMU 192"}],crises:[{label:"Paciente em hipoglicemia",target:"hipoglicemia-protocolo"}]},
    "hipertensao-protocolo":{title:"Crise Hipertensiva",time:"Emergência",level:"urgente",free:true,steps:["Sempre aferir PA antes de iniciar","PA > 180/110: suspender procedimento eletivo","Ambiente calmo, paciente sentado confortavelmente","Identificar causa: dor, ansiedade, medicação esquecida","Analgesia se dor for causa","PA > 180/110 sem melhora em 15 min: SAMU 192","Não use vasoconstritor se PA > 200/120"],errors:["Não aferir PA","Usar vasoconstritor em PA muito alta","Cirurgia eletiva em hipertenso descompensado"],decisions:[{if:"PA 140–180 / 90–110",then:"Vasoconstritor com cautela — máx 2 tubetes"},{if:"PA > 180/110",then:"Adiar + encaminhar médico"},{if:"PA > 200/120 + cefaleia intensa",then:"SAMU — urgência hipertensiva"}],panic:[{problem:"AVC suspeito (face, braço, fala)",solution:"SAMU 192 imediatamente — janela terapêutica é 4,5h"}],crises:[{label:"Crise hipertensiva",target:"hipertensao-protocolo"}]},
    "corpo-estranho":{title:"Corpo Estranho Engolido",time:"Emergência",level:"urgente",free:true,steps:["Manter calma — maioria passa espontaneamente","Diferenciar: deglutiu (esôfago) ou aspirou (pulmão)?","SE ASPIROU: tosse, cianose, dispneia — SAMU 192","SE deglutiu e assintomático: pronto-socorro para RX","Documentar: objeto, tamanho, material, bordas","Objetos pontiagudos ou > 2,5cm: endoscopia urgente","Orientar: observar fezes 4–7 dias","NÃO induza vômito"],errors:["Confundir deglutição com aspiração","Não encaminhar para imagem","Induzir vômito"],decisions:[{if:"Aspirou (tosse + dispneia)",then:"SAMU — emergência respiratória"},{if:"Lima endodôntica deglutida",then:"RX + gastroenterologista urgente"}],panic:[{problem:"Cianose após engolir",solution:"ASPIRAÇÃO — Heimlich + SAMU 192"}],crises:[{label:"Paciente engoliu instrumento",target:"corpo-estranho"}]},
    "epilepsia-protocolo":{title:"Crise Epiléptica",time:"Emergência",level:"urgente",free:true,steps:["Interromper procedimento","Afastar instrumentos e mobiliário","Deitar no chão com proteção para a cabeça","NÃO segurar o paciente","NÃO coloque nada na boca","Posição lateral de recuperação após a crise","Cronometrar duração da crise","Se > 5 min: SAMU 192 — status epiléptico"],errors:["Segurar o paciente — fraturas","Colocar objeto na boca — mito, causa lesão","Não chamar socorro se > 5 min"],decisions:[{if:"Crise < 5 min e autolimitada",then:"Posição lateral + observar"},{if:"> 5 min",then:"Midazolam IM + SAMU 192"}],panic:[{problem:"Apneia durante a crise",solution:"SAMU 192 + posição lateral + O₂ se disponível"}],crises:[{label:"Paciente com convulsão",target:"epilepsia-protocolo"}]},
    "restauracao-direta-prot":{title:"Restauração Direta (Prótese)",time:"40 min",level:"médio",free:true,steps:["Isolamento absoluto rigoroso","Preparo cavitário com extensão preventiva mínima","Proteção pulpar com Ca(OH)₂ + cimento de base","Condicionamento ácido: 30s esmalte / 15s dentina","Lavar 30s, secar levemente","Aplicar adesivo — ativar 20s — fotopolimerizar","Inserir resina em incrementos oblíquos ≤2mm","Fotopolimerizar cada camada 40s","Acabamento com brocas multilaminadas","Polimento com discos Sof-Lex e pasta diamantada"],errors:["Não isolar corretamente","Dentina ressecada — colapso de colágeno","Camadas grossas — contração excessiva","Não verificar contatos proximais"],decisions:[{if:"Cavidade classe II proximal",then:"Usar matriz seccionada (TDV) + cunha"},{if:"Margem subgengival",then:"Afastamento gengival antes"}],panic:[{problem:"Restauração soltou em dias",solution:"Verificar umidade — refazer com isolamento correto"},{problem:"Ponto alto oclusal",solution:"Papel carbono + desgaste seletivo"}],crises:[]},
    "abscesso-drenagem":{title:"Drenagem de Abscesso",time:"20 min",level:"médio",free:true,steps:["Avaliar: flutuação presente?","RX periapical","Anestesia a distância (nunca no centro do abscesso)","Incisão na região de maior flutuação (bisturi lâmina 15)","Drenagem por pressão digital","Irrigar com NaOCl 0,5% ou SF","Antibiótico: amoxicilina 500mg 8/8h + anti-inflamatório","Retorno em 48h"],errors:["Anestesiar no centro do abscesso — não funciona","Incisar sem flutuação","Não associar antibiótico","Selar o canal nessa sessão"],decisions:[{if:"Sem flutuação",then:"Antibiótico + retorno em 48h quando flutuar"},{if:"Edema difuso + febre + trismo",then:"UPA ou hospital — risco de angina de Ludwig"}],panic:[{problem:"Trismo intenso + febre + edema difuso",solution:"ENCAMINHAR URGENTE — risco de vida"}],crises:[{label:"Abscesso com inchaço crescendo",target:"abscesso-drenagem"}]},
    "ansiedade-protocolo":{title:"Crise de Ansiedade",time:"10-20 min",level:"urgente",free:true,steps:["Interromper o procedimento imediatamente","Falar com calma e voz firme: 'Você está seguro, estou aqui'","Reclinar a cadeira levemente — não deite completamente","Pedir para respirar devagar: inspirar 4s, segurar 4s, expirar 4s","Afrouxar roupas e dar espaço — não segurar o paciente","Ambiente calmo: reduzir luz, sons e movimento","Oferecer água fresca se consciente e sem náusea","Monitorar: PA, FC e nível de consciência","Se não melhorar em 5 min: SAMU 192"],errors:["Continuar o procedimento — piora imediata","Falar alto ou expressar urgência — aumenta o pânico","Forçar respiração rápida — pode causar hiperventilação","Deixar o paciente sozinho"],decisions:[{if:"Hiperventilação (respiração muito rápida)",then:"Respirar em saco de papel por 1 min"},{if:"Dor no peito + formigamento",then:"Descartar infarto — SAMU se não ceder em 2 min"},{if:"Perda de consciência",then:"Protocolo de síncope — deitar + elevar pernas"},{if:"Recorrente (2ª vez ou mais)",then:"Indicar ansiolítico oral antes das próximas consultas"}],panic:[{problem:"Paciente em pânico total — gritando ou chorando",solution:"Voz firme e calma: 'Respira comigo. Você está bem.' Não entre em pânico junto."},{problem:"Formigamento nas mãos e rosto",solution:"Hiperventilação — respirar em saco de papel ou técnica 4-4-4"},{problem:"Não melhora após 5 min",solution:"SAMU 192 — pode ser outra emergência associada"}],crises:[]}
  },
  panicItems:[
    {id:"pi1",label:"Pino soltou",protocol:"pino-nucleo"},
    {id:"pi2",label:"Restauração fraturou",protocol:"restauracao-carie"},
    {id:"pi3",label:"Contaminou o adesivo",protocol:"restauracao-carie"},
    {id:"pi4",label:"Sangramento não para",protocol:"hemostasia"},
    {id:"pi5",label:"Paciente desmaiou",protocol:"sincope-protocolo"},
    {id:"pi6",label:"Lima fraturou no canal",protocol:"bypassar"},
    {id:"pi7",label:"Raiz partiu na extração",protocol:"extracao-simples"},
    {id:"pi8",label:"Crise alérgica no consultório",protocol:"alergia-protocolo"},
    {id:"pi9",label:"Paciente engoliu instrumento",protocol:"corpo-estranho"},
    {id:"pi10",label:"Crise hipertensiva",protocol:"hipertensao-protocolo"},
    {id:"pi11",label:"Dente errado extraído",protocol:"extracao-simples"},
    {id:"pi12",label:"Abscesso crescendo rápido",protocol:"abscesso-drenagem"},
    {id:"pi13",label:"Crise epiléptica",protocol:"epilepsia-protocolo"},
    {id:"pi14",label:"Dor no peito / Infarto",protocol:"infarto-protocolo"}
  ]
};

// ==================== STORAGE ====================
// ==================== PRESCRIÇÕES ====================
const AVISO_LEGAL = `Este conteúdo é uma referência clínica de apoio. A prescrição final é responsabilidade exclusiva do profissional habilitado. Adapte conforme o paciente, anamnese e condição clínica.`;
const AVISO_LEGAL_HTML = `<span class="protocol-inline-icon"><i class="ti ti-clipboard-heart"></i></span><span>${AVISO_LEGAL}</span>`;
 
  const PRESCRICOES_LIST = [
  {id:"abscesso-periodontal", label:"Abscesso periodontal", icon:'<i class="ti ti-virus"></i>', free:true},
  {id:"abscesso-periapical", label:"Abscesso periapical agudo", icon:'<i class="ti ti-microscope"></i>', free:true},
  {id:"alveolite", label:"Alveolite", icon:'<i class="ti ti-dental-broken"></i>', free:true},
  {id:"pericoronarite", label:"Pericoronarite", icon:'<i class="ti ti-dental"></i>', free:false},
  {id:"profilaxia", label:"Profilaxia antibiótica", icon:'<i class="ti ti-vaccine"></i>', free:false},
  {id:"dentes-impactados", label:"Dentes impactados", icon:'<i class="ti ti-clipboard-heart"></i>', free:false},
  {id:"gengivoestomatite", label:"Gengivoestomatite herpética primária", icon:'<i class="ti ti-virus"></i>', free:false},
  {id:"candidíase", label:"Candidíase oral", icon:'<i class="ti ti-shield"></i>', free:false},
  {id:"hemorragias", label:"Hemorragias", icon:'<i class="ti ti-droplet"></i>', free:false},
  {id:"herpes", label:"Herpes simples recorrente", icon:'<i class="ti ti-alert-circle"></i>', free:false},
  {id:"ulceracoes", label:"Ulcerações aftosas recorrentes", icon:'<i class="ti ti-circle-dot"></i>', free:false},
  {id:"odontopediatria", label:"Odontopediatria", icon:'<i class="ti ti-baby-bottle"></i>', free:false},
];

const PACIENTES_ESPECIAIS_LIST = [
  {id:"idosos", label:"Idosos", icon:'<i class="ti ti-user-heart"></i>', free:false},
  {id:"epilepticos", label:"Epilépticos", icon:'<i class="ti ti-brain"></i>', free:false},
  {id:"coagulopatas", label:"Coagulopatas", icon:'<i class="ti ti-droplet"></i>', free:false},
  {id:"gestantes", label:"Gestantes e lactantes", icon:'<i class="ti ti-baby-carriage"></i>', free:false},
  {id:"nefropatas", label:"Nefropatas", icon:'<i class="ti ti-medical-cross"></i>', free:false},
  {id:"hepatopatas", label:"Hepatopatas", icon:'<i class="ti ti-flask"></i>', free:false},
  {id:"cardiopatas", label:"Cardiopatas", icon:'<i class="ti ti-heartbeat"></i>', free:false},
  {id:"diabeticos", label:"Diabéticos", icon:'<i class="ti ti-vaccine"></i>', free:false},
  {id:"asmaticos", label:"Asmáticos", icon:'<i class="ti ti-lungs"></i>', free:false},
];

const PRESCRICOES_DATA = {
  "abscesso-periodontal": {
    titulo: "Abscesso periodontal",
    filtros: ["padrao", "alergia", "gravida"],
    blocos: {
      padrao: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia",
          "Anti-inflamatório"
        ]},
        {secao:"ANTIBIÓTICO", itens:[
          "Amoxicilina (cap. 500mg): 1 cápsula, de 8/8 horas, VO, durante 7 dias"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Nimesulida (comp. 100mg): 1 comprimido de 12/12 horas, VO, durante 3 dias",
          "Cetoprofeno (comp. 50mg): 1 comprimido de 8/8 horas, VO, durante 3 dias",
          "Piroxicam (comp. 20mg): 1 comprimido de 8/8 horas, VO, durante 3 dias"
        ]},
      ],
      alergia: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia",
          "Anti-inflamatório"
        ]},
        {secao:"ANTIBIÓTICO — ALERGIA À PENICILINA", itens:[
          "Clindamicina (comp. 300mg): 1 comprimido de 8/8 horas, VO, durante 7 dias",
          "Azitromicina (comp. 500mg): 1 comprimido por dia, VO, durante 3 dias"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Nimesulida (comp. 100mg): 1 comprimido de 12/12 horas, VO, durante 3 dias",
          "Cetoprofeno (comp. 50mg): 1 comprimido de 8/8 horas, VO, durante 3 dias",
          "Piroxicam (comp. 20mg): 1 comprimido de 8/8 horas, VO, durante 3 dias"
        ]},
      ],
      gravida: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia",
          "Anti-inflamatório"
        ]},
        {secao:"⚠️ ATENÇÃO", itens:[
          "Consultar protocolo de Pacientes Gestantes e Lactantes para conduta completa"
        ]},
        {secao:"ANTIBIÓTICO", itens:[
          "Amoxicilina (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
          "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas, durante 7 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas enquanto houver dor",
          "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas enquanto houver dor",
          "⚠️ AAS é contraindicado"
        ]},
      ],
    }
  },

  "abscesso-periapical": {
    titulo: "Abscesso periapical agudo",
    filtros: ["padrao", "alergia", "gravida"],
    blocos: {
      padrao: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia de amplo espectro e penicilínase resistente",
          "Dose inicial dupla",
          "Anti-inflamatório e Analgésico"
        ]},
        {secao:"ANTIBIÓTICOS", itens:[
          "Cefalexina (comp 500mg): 1 comprimido de 6/6 horas, VO, durante 7 dias",
          "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas, VO, durante 7 dias",
          "Amoxicilina (cap. 500mg): 1 cápsula de 8/8 horas, VO, durante 7 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas, VO, enquanto houver dor",
          "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas, VO, enquanto houver dor"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Nimesulida (comp. 100mg): 1 comprimido de 12/12 horas, VO, durante 3 dias",
          "Cetoprofeno (comp. 50mg): 1 comprimido de 8/8 horas, VO, durante 3 dias",
          "Piroxicam (comp. 20mg): 1 comprimido de 8/8 horas, VO, durante 3 dias"
        ]},
        {secao:"ANALGÉSICO CONTROLADO — DOR INTENSA", itens:[
          "Codeína + Paracetamol (Tylex, comp. 30mg): 1 comprimido de 6/6 horas, VO, enquanto houver dor"
        ]},
      ],
      alergia: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia de amplo espectro e penicilínase resistente",
          "Dose inicial dupla",
          "Anti-inflamatório e Analgésico"
        ]},
        {secao:"ANTIBIÓTICOS — ALERGIA À PENICILINA", itens:[
          "Clindamicina (comp. 300mg): 1 comprimido de 8/8 horas, VO, durante 7 dias",
          "Azitromicina (comp. 500mg): 1 comprimido por dia, VO, durante 3 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas, VO, enquanto houver dor",
          "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas, VO, enquanto houver dor"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Nimesulida (comp. 100mg): 1 comprimido de 12/12 horas, VO, durante 3 dias",
          "Cetoprofeno (comp. 50mg): 1 comprimido de 8/8 horas, VO, durante 3 dias",
          "Piroxicam (comp. 20mg): 1 comprimido de 8/8 horas, VO, durante 3 dias"
        ]},
        {secao:"ANALGÉSICO CONTROLADO — DOR INTENSA", itens:[
          "Codeína + Paracetamol (Tylex, comp. 30mg): 1 comprimido de 6/6 horas, VO, enquanto houver dor"
        ]},
      ],
      gravida: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia de amplo espectro e penicilínase resistente",
          "Dose inicial dupla",
          "Anti-inflamatório e Analgésico"
        ]},
        {secao:"⚠️ ATENÇÃO", itens:[
          "Consultar protocolo de Pacientes Gestantes e Lactantes para conduta completa"
        ]},
        {secao:"ANTIBIÓTICOS", itens:[
          "Amoxicilina (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
          "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas, durante 7 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas enquanto houver dor",
          "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas enquanto houver dor",
          "⚠️ AAS é contraindicado"
        ]},
      ],
    }
  },

  "alveolite": {
    titulo: "Alveolite",
    filtros: ["padrao", "alergia", "gravida"],
    blocos: {
      padrao: [
        {secao:"CONDUTA", itens:[
          "Realizar Anestesia local",
          "Limpeza do local com Soro Fisiológico",
          "Remover espícula ou coágulo necrótico",
          "Medicação local: Colocar Alveosan®, não suturar"
        ]},
        {secao:"ANTIBIÓTICO", itens:[
          "Amoxicilina (cap. 500mg): Tomar 1 comprimido de 8/8 horas, durante 7 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): Tomar 1 comprimido de 6/6 horas enquanto houver dor",
          "Paracetamol (comp. 750mg): Tomar 1 comprimido de 6/6 horas enquanto houver dor"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Nimesulida (comp. 100mg): Tomar 1 comprimido de 12/12 horas, durante 3 dias",
          "Diclofenaco sódico (comp. 50mg): Tomar 1 comprimido de 8/8 horas, durante 3 dias"
        ]},
      ],
      alergia: [
        {secao:"CONDUTA", itens:[
          "Realizar Anestesia local",
          "Limpeza do local com Soro Fisiológico",
          "Remover espícula ou coágulo necrótico",
          "Medicação local: Colocar Alveosan®, não suturar"
        ]},
        {secao:"ANTIBIÓTICO — ALERGIA À PENICILINA", itens:[
          "Clindamicina (comp. 300mg): Tomar 1 comprimido de 8/8 horas, durante 7 dias",
          "Azitromicina (comp. 500mg): Tomar 1 comprimido diário durante 3 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): Tomar 1 comprimido de 6/6 horas enquanto houver dor",
          "Paracetamol (comp. 750mg): Tomar 1 comprimido de 6/6 horas enquanto houver dor"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Nimesulida (comp. 100mg): Tomar 1 comprimido de 12/12 horas, durante 3 dias",
          "Diclofenaco sódico (comp. 50mg): Tomar 1 comprimido de 8/8 horas, durante 3 dias"
        ]},
      ],
      gravida: [
        {secao:"CONDUTA", itens:[
          "Realizar Anestesia local",
          "Limpeza do local com Soro Fisiológico",
          "Remover espícula ou coágulo necrótico",
          "Medicação local: Colocar Alveosan®, não suturar"
        ]},
        {secao:"⚠️ ATENÇÃO", itens:[
          "Consultar protocolo de Pacientes Gestantes e Lactantes para conduta completa"
        ]},
        {secao:"ANTIBIÓTICO", itens:[
          "Amoxicilina (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
          "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas, durante 7 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas enquanto houver dor",
          "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas enquanto houver dor",
          "⚠️ AAS é contraindicado"
        ]},
      ],
    }
  },

  "pericoronarite": {
    titulo: "Pericoronarite",
    filtros: ["padrao", "alergia", "gravida"],
    blocos: {
      padrao: [
        {secao:"CONDUTA", itens:[
          "Limpeza do local com Soro Fisiológico",
          "Remover debris",
          "Medicação Local: Colocar Clorexidina 0,12% ou agente oxidante"
        ]},
        {secao:"ANTIBIÓTICO", itens:[
          "Amoxicilina (cap. 500mg): Tomar 1 comprimido de 8/8 horas, durante 7 dias"
        ]},
        {secao:"ANTI-INFLAMATÓRIO", itens:[
          "Mioflex®: Tomar 1 comprimido de 6/6 horas, durante 3 dias"
        ]},
      ],
      alergia: [
        {secao:"CONDUTA", itens:[
          "Limpeza do local com Soro Fisiológico",
          "Remover debris",
          "Medicação Local: Colocar Clorexidina 0,12% ou agente oxidante"
        ]},
        {secao:"ANTIBIÓTICO — ALERGIA À PENICILINA", itens:[
          "Clindamicina (comp. 300mg): Tomar 1 comprimido de 8/8 horas, durante 7 dias",
          "Azitromicina (comp. 500mg): Tomar 1 comprimido diário durante 3 dias"
        ]},
        {secao:"ANTI-INFLAMATÓRIO", itens:[
          "Mioflex®: Tomar 1 comprimido de 6/6 horas, durante 3 dias"
        ]},
      ],
      gravida: [
        {secao:"CONDUTA", itens:[
          "Limpeza do local com Soro Fisiológico",
          "Remover debris",
          "Medicação Local: Colocar Clorexidina 0,12% ou agente oxidante"
        ]},
        {secao:"⚠️ ATENÇÃO", itens:[
          "Consultar protocolo de Pacientes Gestantes e Lactantes para conduta completa"
        ]},
        {secao:"ANTIBIÓTICO", itens:[
          "Amoxicilina (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
          "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas, durante 7 dias"
        ]},
      ],
    }
  },

  "profilaxia": {
    titulo: "Profilaxia antibiótica",
    filtros: ["padrao", "alergia", "crianca", "incapaz-oral", "incapaz-oral-alergia", "gravida"],
    blocos: {
      padrao: [
        {secao:"INDICAÇÕES", itens:[
          "Valvas cardíacas protéticas",
          "Endocardite bacteriana prévia",
          "Doenças cardíaca congênita cianótica",
          "Disfunção valvar",
          "Prolapso de válva mitral",
          "Cardiomiopatia hipertrófica",
          "Febre reumática com disfunção valvar"
        ]},
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia antes de procedimentos cirúrgicos para prevenção de Endocardite"
        ]},
        {secao:"ANTIBIÓTICO — ADULTOS", itens:[
          "Amoxicilina (caps 500mg): 2g 1 hora antes do procedimento"
        ]},
      ],
      alergia: [
        {secao:"INDICAÇÕES", itens:[
          "Valvas cardíacas protéticas",
          "Endocardite bacteriana prévia",
          "Doenças cardíaca congênita cianótica",
          "Disfunção valvar",
          "Prolapso de válva mitral",
          "Cardiomiopatia hipertrófica",
          "Febre reumática com disfunção valvar"
        ]},
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia antes de procedimentos cirúrgicos para prevenção de Endocardite"
        ]},
        {secao:"ANTIBIÓTICO — ADULTOS COM ALERGIA À PENICILINA", itens:[
          "Clindamicina (comp 300mg): 600mg 1 hora antes do procedimento"
        ]},
      ],
      crianca: [
        {secao:"INDICAÇÕES", itens:[
          "Valvas cardíacas protéticas",
          "Endocardite bacteriana prévia",
          "Doenças cardíaca congênita cianótica",
          "Disfunção valvar",
          "Prolapso de válva mitral",
          "Cardiomiopatia hipertrófica",
          "Febre reumática com disfunção valvar"
        ]},
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia antes de procedimentos cirúrgicos para prevenção de Endocardite"
        ]},
        {secao:"ANTIBIÓTICO — CRIANÇAS", itens:[
          "Amoxicilina (caps 250mg): 50mg/Kg, dose única, 1 hora antes do procedimento"
        ]},
        {secao:"ANTIBIÓTICO — CRIANÇAS COM ALERGIA À PENICILINA", itens:[
          "Azitromicina (susp 200mg): 15mg/Kg, dose única, 1 hora antes do procedimento"
        ]},
      ],
      "incapaz-oral": [
        {secao:"ANTIBIÓTICO — ADULTOS INCAPAZES VIA ORAL", itens:[
          "Ampicilina: 2g IM, aplicar 30 minutos antes do procedimento"
        ]},
        {secao:"ANTIBIÓTICO — CRIANÇAS INCAPAZES VIA ORAL", itens:[
          "Ampicilina: 2g IM, aplicar 30 minutos antes do procedimento, não exceder dose de adultos"
        ]},
      ],
      "incapaz-oral-alergia": [
        {secao:"ANTIBIÓTICO — ADULTOS INCAPAZES VIA ORAL + ALERGIA À PENICILINA", itens:[
          "Clindamicina (600mg): 600mg IV, aplicar 30 minutos antes do procedimento"
        ]},
        {secao:"ANTIBIÓTICO — CRIANÇAS INCAPAZES VIA ORAL + ALERGIA À PENICILINA", itens:[
          "Clindamicina (600mg): 20mg/Kg IV, aplicar 30 minutos antes do procedimento"
        ]},
      ],
      gravida: [
        {secao:"⚠️ ATENÇÃO", itens:[
          "Consultar protocolo de Pacientes Gestantes e Lactantes para conduta completa"
        ]},
        {secao:"ANTIBIÓTICO", itens:[
          "Amoxicilina (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
          "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas, durante 7 dias"
        ]},
      ],
    }
  },

  "dentes-impactados": {
    titulo: "Dentes impactados",
    filtros: ["padrao", "alergia", "gravida", "asmatico"],
    blocos: {
      padrao: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia (Dose Inicial Dupla)",
          "Anti-inflamatório e Analgésico"
        ]},
        {secao:"ANTIBIÓTICO", itens:[
          "Amoxicilina (cap. 500mg): 1gr antes do procedimento e 1 comprimido de 8/8 horas, durante 7 dias"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Nimesulida (comp. 100mg): 1 comprimido de 12/12 horas, durante 3 dias",
          "Diclofenaco sódico (comp. 50mg): 1 comprimido de 8/8 horas, durante 3 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas VO, durante 3 dias. Iniciar 1 hora antes do procedimento",
          "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas, enquanto houver dor"
        ]},
      ],
      alergia: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia (Dose Inicial Dupla)",
          "Anti-inflamatório e Analgésico"
        ]},
        {secao:"ANTIBIÓTICO — ALERGIA À PENICILINA", itens:[
          "Clindamicina (cap. 300mg): 600gr, antes do procedimento e 1 comprimido de 8/8 horas, durante 7 dias",
          "Azitromicina (comp. 500mg): 1gr, antes do procedimento e 1 comprimido diário, durante 3 dias"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Nimesulida (comp. 100mg): 1 comprimido de 12/12 horas, durante 3 dias",
          "Diclofenaco sódico (comp. 50mg): 1 comprimido de 8/8 horas, durante 3 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas VO, durante 3 dias. Iniciar 1 hora antes do procedimento",
          "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas, enquanto houver dor"
        ]},
      ],
      gravida: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia (Dose Inicial Dupla)",
          "Anti-inflamatório e Analgésico"
        ]},
        {secao:"⚠️ ATENÇÃO", itens:[
          "Consultar protocolo de Pacientes Gestantes e Lactantes para conduta completa"
        ]},
        {secao:"ANTIBIÓTICO", itens:[
          "Amoxicilina (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
          "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas, durante 7 dias"
        ]},
        {secao:"ANALGÉSICOS", itens:[
          "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas enquanto houver dor",
          "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas enquanto houver dor",
          "⚠️ AAS é contraindicado"
        ]},
      ],
      asmatico: [
        {secao:"CONDUTA", itens:[
          "Antibioticoterapia (Dose Inicial Dupla)",
          "Anti-inflamatório e Analgésico"
        ]},
        {secao:"⚠️ ATENÇÃO", itens:[
          "Consultar protocolo de Pacientes Asmáticos para conduta completa"
        ]},
        {secao:"CONTROLE DA DOR", itens:[
          "Dipirona: 500mg a cada 4 horas",
          "Paracetamol: 750mg a cada 6 horas"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Betametasona ou Dexametasona 4mg em dose única, 1 hora antes do procedimento"
        ]},
      ],
    }
  },

  "gengivoestomatite": {
    titulo: "Gengivoestomatite herpética primária",
    filtros: [],
    blocos: {
      padrao: [
        {secao:"CONDUTAS", itens:[
          "Dieta líquida ou pastosa e fria",
          "Repouso"
        ]},
        {secao:"MEDICAMENTOS", itens:[
          "Paracetamol (Sol. gotas): 1 gota/kg de peso corporal com intervalos de 4 horas, em no máximo 4 doses/dia",
          "Gluconato de clorexedina (gel 1%): Aplicar no local com auxílio de gaze, 3x/dia, durante 5 dias; Bochechos 2x/dia"
        ]},
      ],
    }
  },

  "candidíase": {
    titulo: "Candidíase oral",
    filtros: ["leve", "severo", "queilite"],
    blocos: {
      leve: [
        {secao:"CANDIDOSES DE GRAU LEVE", itens:[
          "Remoção da causa",
          "Higienização bucal",
          "Higienização da prótese com uma colher das de sopa hipoclorito de sódio a 1% diluído em um copo de água"
        ]},
        {secao:"MEDICAMENTOS", itens:[
          "Nistatina 100.000 u/ml sus., fracos 50ml: Bochechar 5ml da suspensão, 4x/dia, durante 15 dias, retendo na boca por 1 minuto e depois deglutir; Tratamento deve durar pelo menos 48 horas após os sintomas terem desaparecido",
          "Miconazol (gel oral): Recobrir a prótese 3x/dia, durante 14 dias"
        ]},
      ],
      severo: [
        {secao:"CANDIDOSES DE GRAU SEVERO", itens:[
          "Cetoconazol (comp. 200mg): 1 comprimido ao dia durante 7 dias"
        ]},
      ],
      queilite: [
        {secao:"QUEILITE ANGULAR", itens:[
          "Cetoconazol (creme): 1-2x/dia, durante até 3 dias após desaparecerem os sintomas"
        ]},
      ],
    }
  },

  "hemorragias": {
    titulo: "Hemorragias",
    filtros: [],
    blocos: {
      padrao: [
        {secao:"CONDUTAS", itens:[
          "Rever sutura",
          "Verificar origem do sangramento",
          "Esponja de Fibrina: Hemospon, Cera para osso",
          "Compressa com gaze umededida em soro fisiológico gelado",
          "Sutura"
        ]},
        {secao:"MEDICAÇÃO SISTÊMICA", itens:[
          "Vitamina K amp. 10mg: 1 amp. ao dia, VI, durante 3 dias no máximo"
        ]},
      ],
    }
  },

  "herpes": {
    titulo: "Herpes simples recorrente",
    filtros: [],
    blocos: {
      padrao: [
        {secao:"TRATAMENTO", itens:[
          "Aciclovir (Creme Dermatológico): Aplicar 5x/dia, durante 5 dias",
          "Aciclovir (Comp. 200mg): 5x/dia, VO, durante 5 dias"
        ]},
      ],
    }
  },

  "ulceracoes": {
    titulo: "Ulcerações aftosas recorrentes",
    filtros: [],
    blocos: {
      padrao: [
        {secao:"CONDUTA", itens:[
          "Identificar e remover o fator desencadeante",
          "Utilizar antibiótico bactericida, de amplo espectro e penicilínase resistente",
          "Manter a concentração inibitória mínima durante a prescrição",
          "Dose inicial preferencial dupla",
          "Prescrever um AINES",
          "Analgésico puro"
        ]},
        {secao:"MEDICAMENTOS", itens:[
          "Acetonido de triamcinolona (tubo 10mg): Aplicar pequena quantidade sobre lesão, 2 a 3 vezes ao dia, após as refeições e ao deitar",
          "Cloridrato de difenidramina - anti-histamínico (Benadryl, vidro com 120ml): Bochechar com o conteúdo de 1 colher de sopa, 3 vezes ao dia, para lesões múltiplas",
          "Gluconato de clorexedina (sol. 0,12%): Bochechos 2x/dia",
          "Gluconato de clorexedina gel 1%: Aplicar no local 3x/dia"
        ]},
      ],
    }
  },

  "odontopediatria": {
    titulo: "Odontopediatria",
    filtros: ["moderada", "grave"],
    blocos: {
      moderada: [
        {secao:"ANTIBIÓTICO — INFECÇÃO MODERADA", itens:[
          "Amoxicilina susp. 250mg: 40mg/kg peso de 8/8 horas VO, 7 dias"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Ibuprofeno 1 gota + 0,5mg / 1 gota/1kg de 12/12 horas (máx 35 gotas) 3 dias VO — Gotas 50mg/1ml, Comprimido 100mg",
          "Ibuprofeno 1-2 gota/1kg de 6/6 horas (máx 35 gotas) VO — Gotas 100mg/1ml, Suspensão 100mg/5ml",
          "Paracetamol 1 gota/kg de 6/6 horas, máx 35 gotas, VO — Suspensão 32mg/1ml embrança / Suspensão 100mg/1ml bebê"
        ]},
        {secao:"DOSAGEM PARACETAMOL SUSPENSÃO", itens:[
          "3kg: 0,4ml · 5kg: 0,6ml · 8kg: 0,8ml · 10kg: 1,3ml",
          "11–15kg: 5ml · 16–21kg: 7,5ml · 22–26kg: 10ml · 27–31kg: 12,5ml · 32–43kg: 15ml"
        ]},
        {secao:"DIPIRONA SÓDICA", itens:[
          "1 gota/2kg peso, de 6/6 horas — Solução: 2,5 a 5ml, de 6/6 horas",
          "Dosagem suspensão 50mg/1ml: 5–8kg: 1,25–2,5ml · 9–15kg: 2,5–5ml · 16–23kg: 5–7,5ml · 24–30kg: 5–10ml · 31–45kg: 7,5–15ml · 46–53kg: 8,75–17,5ml"
        ]},
        {secao:"CORTICÓIDES", itens:[
          "Betametasona: Dose única (30min antes), 0,05–0,05mg/kg — Elixir 0,5mg/5ml, Gotas 0,5mg/1ml"
        ]},
        {secao:"AINEs", itens:[
          "Ibuprofeno: 1–2 gotas/1kg, de 6–8 horas — Gotas 50mg/1ml, Gotas 100mg/1ml"
        ]},
        {secao:"ANESTÉSICOS LOCAIS", itens:[
          "Prilocaína com vasoconstrictor: Citanest, Biogress, Cliocaína",
          "Lidocaína com vasoconstrictor: Lidocaína"
        ]},
      ],
      grave: [
        {secao:"ANTIBIÓTICO — INFECÇÃO GRAVE", itens:[
          "Cefalexina susp. 250mg/5ml: peso de 8/8 horas por 7 dias, VO",
          "Azitromicina susp. 200mg/5ml: peso/dose única, por 3 dias VO",
          "Clindamicina susp. 150mg/5ml: peso/8/8 horas por 7 dias, VO"
        ]},
        {secao:"ANTI-INFLAMATÓRIOS", itens:[
          "Ibuprofeno 1 gota + 0,5mg / 1 gota/1kg de 12/12 horas (máx 35 gotas) 3 dias VO — Gotas 50mg/1ml, Comprimido 100mg",
          "Ibuprofeno 1-2 gota/1kg de 6/6 horas (máx 35 gotas) VO — Gotas 100mg/1ml, Suspensão 100mg/5ml",
          "Paracetamol 1 gota/kg de 6/6 horas, máx 35 gotas, VO — Suspensão 32mg/1ml embrança / Suspensão 100mg/1ml bebê"
        ]},
        {secao:"DOSAGEM PARACETAMOL SUSPENSÃO", itens:[
          "3kg: 0,4ml · 5kg: 0,6ml · 8kg: 0,8ml · 10kg: 1,3ml",
          "11–15kg: 5ml · 16–21kg: 7,5ml · 22–26kg: 10ml · 27–31kg: 12,5ml · 32–43kg: 15ml"
        ]},
        {secao:"DIPIRONA SÓDICA", itens:[
          "1 gota/2kg peso, de 6/6 horas — Solução: 2,5 a 5ml, de 6/6 horas",
          "Dosagem suspensão 50mg/1ml: 5–8kg: 1,25–2,5ml · 9–15kg: 2,5–5ml · 16–23kg: 5–7,5ml · 24–30kg: 5–10ml · 31–45kg: 7,5–15ml · 46–53kg: 8,75–17,5ml"
        ]},
        {secao:"CORTICÓIDES", itens:[
          "Betametasona: Dose única (30min antes), 0,05–0,05mg/kg — Elixir 0,5mg/5ml, Gotas 0,5mg/1ml"
        ]},
        {secao:"AINEs", itens:[
          "Ibuprofeno: 1–2 gotas/1kg, de 6–8 horas — Gotas 50mg/1ml, Gotas 100mg/1ml"
        ]},
        {secao:"ANESTÉSICOS LOCAIS", itens:[
          "Prilocaína com vasoconstrictor: Citanest, Biogress, Cliocaína",
          "Lidocaína com vasoconstrictor: Lidocaína"
        ]},
      ],
    }
  },
};

const PACIENTES_ESPECIAIS_DATA = {
  "idosos": {
    titulo: "Pacientes Idosos",
    blocos: [
      {secao:"ANTIBIÓTICOS — SEM ALERGIA À PENICILINA", itens:[
        "Cefalexina (comp. 500mg): 1 comprimido de 6/6 horas VO, durante 7 dias",
        "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Amoxicilina (caps. 600mg): 1 cápsula de 8/8 horas VO, durante 7 dias"
      ]},
      {secao:"ANTIBIÓTICOS — ALERGIA À PENICILINA", itens:[
        "Clindamicina (comp. 300mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Azitromicina (comp. 500mg): 1 comprimido/dia, durante 3 dias VO"
      ]},
      {secao:"ANTI-INFLAMATÓRIOS", itens:[
        "Betametasona (comp. 2mg): 2 comprimidos, dose única VO",
        "Dexametasona (comp. 4mg): 1 comprimido, dose única VO"
      ]},
      {secao:"ANSIOLÍTICOS", itens:[
        "Lorazepam (1mg/Lorax): 1 comprimido 2 horas antes da intervenção"
      ]},
      {secao:"ANALGÉSICOS", itens:[
        "Dipirona sódica ou magnésica (500mg, evitar em diabéticos): 1 comprimido de 6/6 horas VO, enquanto tiver dor",
        "Paracetamol (500mg e 750mg, evitar em hepatopata): 1 comprimido de 6/6 horas VO, enquanto houver dor"
      ]},
      {secao:"ANESTÉSICOS LOCAIS", itens:[
        "Lidocaína 2% com vasoconstrictor - adrenalina 1:100.000: Xilocaína, Lidocaína com adrenalina",
        "Mepivacaína 2% com adrenalina (1:100.000): Mepivacaína 2%"
      ]},
    ]
  },

  "epilepticos": {
    titulo: "Pacientes Epilépticos",
    blocos: [
      {secao:"ANTIBIÓTICOS — SEM ALERGIA À PENICILINA", itens:[
        "Cefalexina (comp. 500mg): 1 comprimido de 6/6 horas VO, durante 7 dias",
        "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Amoxicilina (caps. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias"
      ]},
      {secao:"ANTIBIÓTICOS — ALERGIA À PENICILINA", itens:[
        "Clindamicina (comp. 300mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Azitromicina (comp. 500mg): 1 comprimido/dia VO, durante 3 dias"
      ]},
      {secao:"ANTI-INFLAMATÓRIOS", itens:[
        "Nimesulida (comp. 100mg): 1 comprimido de 12/12 horas VO, durante 3 dias"
      ]},
      {secao:"ANESTÉSICOS LOCAIS", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine 3%, Scandicaine 3%"
      ]},
    ]
  },

  "coagulopatas": {
    titulo: "Pacientes Coagulopatas",
    blocos: [
      {secao:"ANTIBIÓTICOS — SEM ALERGIA À PENICILINA", itens:[
        "Cefalexina (comp. 500mg): 1 comprimido de 6/6 horas VO, durante 7 dias",
        "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Amoxicilina (caps. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias"
      ]},
      {secao:"ANTIBIÓTICOS — ALERGIA À PENICILINA", itens:[
        "Clindamicina (comp. 300mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Azitromicina (comp. 500mg): 1 comprimido/dia VO, durante 3 dias"
      ]},
      {secao:"ANTI-INFLAMATÓRIOS", itens:[
        "Betametasona (comp. 2mg): 2 comprimidos VO, dose única",
        "Dexametasona (comp. 4mg): 1 comprimido VO, dose única"
      ]},
      {secao:"ANALGÉSICOS", itens:[
        "Paracetamol (comp. 500mg): 1 comprimido de 6/6 horas VO, enquanto houver dor",
        "Dipirona (comp. ou gota de 500mg): 1 comprimido de 6/6 horas ou 35 gotas de 6/6 horas VO, enquanto houver dor"
      ]},
      {secao:"ANESTÉSICOS LOCAIS", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine 3%, Scandicaine 3%"
      ]},
    ]
  },

  "gestantes": {
    titulo: "Pacientes Gestantes e Lactantes",
    blocos: [
      {secao:"ANTIBIÓTICOS — SEM ALERGIA À PENICILINA", itens:[
        "Amoxicilina (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas, durante 7 dias"
      ]},
      {secao:"ANTIBIÓTICOS — ALERGIA À PENICILINA", itens:[
        "Clindamicina (comp. 300mg): 1 comprimido de 8/8 horas VO, durante 7 dias"
      ]},
      {secao:"ANTI-INFLAMATÓRIOS", itens:[
        "Betametasona (comp. 2mg): 2 comprimidos VO, dose única — ⚠️ Evitar último trimestre da gravidez!",
        "Dexametasona (comp. 4mg): 1 comprimido VO, dose única — ⚠️ Pacientes sem hipertensão!"
      ]},
      {secao:"ANALGÉSICOS", itens:[
        "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas enquanto houver dor",
        "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas enquanto houver dor",
        "⚠️ AAS é contraindicado"
      ]},
      {secao:"ANESTÉSICOS LOCAIS", itens:[
        "Lidocaína 2% com adrenalina 1:100.000: Xilocaína®, Lidocaína® 2% Adrenalina",
        "⚠️ Evitar Prilocaína (Citanest®, Biopressin®) e Fenilefrina — tóxicos ao feto e recém-nascido",
        "⚠️ Contactar sempre o Obstetra da paciente"
      ]},
    ]
  },

  "nefropatas": {
    titulo: "Pacientes Nefropatas",
    blocos: [
      {secao:"ANTIBIÓTICOS — ALERGIA À PENICILINA", itens:[
        "Clindamicina (comp. 300mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Azitromicina (comp. 500mg): 1 comprimido/dia VO, durante 3 dias"
      ]},
      {secao:"ANTI-INFLAMATÓRIOS", itens:[
        "Benzidamina (comp. 50mg): 1 comprimido de 8/8 horas VO, durante 3 dias"
      ]},
      {secao:"ANALGÉSICOS", itens:[
        "Paracetamol (comp. 500mg): 1 comprimido de 6/6 horas VO, enquanto houver dor",
        "Dipirona (comp. ou gota de 500mg): 1 comprimido de 6/6 horas ou 35 gotas de 6/6 horas VO, enquanto houver dor"
      ]},
      {secao:"ANESTÉSICOS LOCAIS", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine 3%, Scandicaine 3%"
      ]},
    ]
  },

  "hepatopatas": {
    titulo: "Pacientes Hepatopatas",
    blocos: [
      {secao:"ANTIBIÓTICOS — SEM ALERGIA À PENICILINA", itens:[
        "Cefalosporina (caps. 500mg): 1 comprimido de 6/6 horas, durante 7 dias",
        "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas, durante 7 dias"
      ]},
      {secao:"ANTIBIÓTICOS — ALERGIA À PENICILINA", itens:[
        "Azitromicina (comp. 500mg): 1 comprimido diário durante 3 dias"
      ]},
      {secao:"ANALGÉSICOS", itens:[
        "Dipirona sódica (comp. 500mg): 1 comprimido de 6/6 horas enquanto houver dor",
        "Paracetamol (comp. 750mg): 1 comprimido de 6/6 horas enquanto houver dor — ⚠️ Não receber AAS"
      ]},
      {secao:"ANTI-INFLAMATÓRIO", itens:[
        "Benzidamina (comp. 50mg): 1 comprimido de 8/8 horas, durante 3 dias"
      ]},
      {secao:"⚠️ RECOMENDAÇÕES", itens:[
        "Evitar receitação de Diclofenaco, Piroxicam, Nimesulida e Corticóides pela sobrecarga hepática"
      ]},
      {secao:"ANESTÉSICOS LOCAIS", itens:[
        "Prilocaína com vasoconstrictor: Citanest®, Citocainca®, Biopressin®",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine® 3%, Scandicaine® 3%"
      ]},
    ]
  },

  "cardiopatas": {
    titulo: "Pacientes Cardiopatas",
    blocos: [
      {secao:"ANTIBIÓTICOS — SEM ALERGIA À PENICILINA", itens:[
        "Cefalexina (comp. 500mg): 1 comprimido de 6/6 horas VO, durante 7 dias",
        "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Amoxicilina (caps. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias"
      ]},
      {secao:"ANTIBIÓTICOS — ALERGIA À PENICILINA", itens:[
        "Clindamicina (comp. 300mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Azitromicina (comp. 500mg): 1 comprimido/dia VO, durante 3 dias"
      ]},
      {secao:"ANTI-INFLAMATÓRIOS", itens:[
        "Nimesulida (comp. 100mg): 1 comprimido de 12/12 horas VO, durante 3 dias",
        "Ácido Mefenâmico (500mg): 1 comprimido de 8/8 horas VO, durante 3 dias"
      ]},
      {secao:"ANESTÉSICOS LOCAIS", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine 3%, Scandicaine 3%"
      ]},
      {secao:"ANSIOLÍTICOS", itens:[
        "Diazepam (comp. 5mg): 1 comprimido a noite anterior e outro 1 hora antes do atendimento"
      ]},
    ]
  },

  "diabeticos": {
    titulo: "Pacientes Diabéticos",
    blocos: [
      {secao:"ANTIBIÓTICOS — SEM ALERGIA À PENICILINA", itens:[
        "Cefalexina (comp. 500mg): 1 comprimido de 6/6 horas VO, durante 7 dias",
        "Amoxicilina + Clavulanato de potássio (comp. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Amoxicilina (caps. 500mg): 1 comprimido de 8/8 horas VO, durante 7 dias"
      ]},
      {secao:"ANTIBIÓTICOS — ALERGIA À PENICILINA", itens:[
        "Clindamicina (comp. 300mg): 1 comprimido de 8/8 horas VO, durante 7 dias",
        "Azitromicina (comp. 500mg): 1 comprimido/dia VO, durante 3 dias"
      ]},
      {secao:"ANTI-INFLAMATÓRIOS", itens:[
        "Betametasona (comp. 2mg): 2 comprimidos VO, dose única",
        "Dexametasona (comp. 4mg): 1 comprimido VO, dose única"
      ]},
      {secao:"ANALGÉSICOS", itens:[
        "Paracetamol (comp. 500mg): 1 comprimido de 6/6 horas VO, enquanto houver dor",
        "Dipirona (comp. ou gt. 500mg): 1 comprimido de 6/6 horas ou 35 gotas de 6/6 horas VO, enquanto tiver dor"
      ]},
      {secao:"ANESTÉSICOS LOCAIS", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin"
      ]},
    ]
  },

  "asmaticos": {
    titulo: "Pacientes Asmáticos",
    blocos: [
      {secao:"SEDAÇÃO MÍNIMA", itens:[
        "Via respiratória: Evitar em pacientes com asma severa persistente",
        "Via Oral: Midazolam 7,5mg, 20-30 minutos antes do procedimento",
        "Lorazepam: 1mg (para idosos) 2h antes do procedimento"
      ]},
      {secao:"ANESTESIA LOCAL", itens:[
        "Lidocaína 2%, Mepivacaína 2% ou Articaína 4% com epinefrina 1:100.000 ou 1:200.000",
        "Pacientes alérgicos aos sulfitos: Prilocaína 3% com felipressina 0,03 UI/ml"
      ]},
      {secao:"CONTROLE DA DOR", itens:[
        "Dipirona: 500mg a cada 4 horas",
        "Paracetamol: 750mg a cada 6 horas"
      ]},
      {secao:"ANTI-INFLAMATÓRIOS", itens:[
        "Betametasona ou Dexametasona 4mg em dose única, 1 hora antes do procedimento"
      ]},
      {secao:"TRATAMENTO DAS INFECÇÕES BACTERIANAS", itens:[
        "Descontaminação do local",
        "Prescrição de antibiótico na presença de sinais locais ou manifestações sistêmicas de infecção"
      ]},
    ]
  },
};

const QUICK_CONDUCT_CARDS = {
  "coroa-caiu": {
    id: "coroa-caiu",
    title: "A coroa caiu",
    icon: '<i class="ti ti-crown"></i>',
    subtitle: "Avalie adaptação, remanescente e recimentação.",
    synonyms: [
      "coroa caiu","coroa soltou","coroa descolou","coroa saiu","coroa saiu da boca",
      "coroa saiu na mão","coroa soltou do dente","coroa descolou do dente",
      "prótese fixa caiu","prótese fixa soltou","prótese fixa descolou","jaqueta caiu",
      "jaqueta soltou","jaqueta descolou","bloco caiu","bloco soltou","peça protética caiu",
      "restauração indireta caiu","paciente chegou com a coroa na mão","coroa caiu mastigando",
      "coroa soltou mastigando","coroa caiu de novo","coroa soltou de novo"
    ],
    quick: "O primeiro caminho é tentar salvar a coroa existente. Se a peça estiver íntegra e adaptar bem, a recimentação costuma ser a solução mais simples e rápida.",
    changes: [
      "Se houver cárie, fratura do remanescente, preparo sem retenção ou adaptação ruim, não trate como simples recimentação.",
      "Nesses casos, avalie reconstruir o remanescente, refazer o preparo ou planejar uma nova coroa."
    ],
    behind: [
      "Falha de cimentação",
      "Perda de retenção do preparo",
      "Contato oclusal excessivo",
      "Cárie secundária",
      "Fratura do remanescente",
      "Contaminação na cimentação anterior"
    ],
    protocols: [
      {id: "recimentar-metal", label: "Recimentar — Metalo-cerâmica / Metal"},
      {id: "recimentar-ceramica", label: "Recimentar — Porcelana / Zircônia / Disilicato"},
      {id: "nova-coroa", label: "Planejar Nova Coroa"},
      {id: "moldagem-coroa-ponte", label: "Moldagem para Coroa/Ponte — Silicone de Adição, Técnica Simultânea"}
    ],
    related: [
      {id: "pino-nucleo-soltou", label: "O pino/núcleo soltou"},
      {id: "porcelana-lascou", label: "Coroa fraturou"},
      {id: "coroa-nao-entra-card", label: "A coroa não entra"}
    ]
  },
  "pino-nucleo-soltou": {
    id: "pino-nucleo-soltou",
    title: "O pino/núcleo soltou",
    icon: '<i class="ti ti-dental-broken"></i>',
    subtitle: "Cheque retenção, fratura e reaproveitamento.",
    synonyms: [
      "pino soltou","pino caiu","pino de fibra soltou","pino de fibra caiu",
      "núcleo soltou","núcleo caiu","coroa caiu com pino","coroa caiu com núcleo",
      "coroa soltou com pino","coroa soltou com núcleo","coroa saiu com pino",
      "coroa saiu com núcleo","coroa saiu inteira","coroa saiu levando o pino",
      "coroa saiu levando o núcleo","prótese fixa caiu com pino","prótese fixa caiu com núcleo",
      "jaqueta caiu com pino","jaqueta caiu com núcleo"
    ],
    quick: "O primeiro caminho é avaliar se o conjunto que saiu com a coroa ainda pode ser reaproveitado. Se o pino/núcleo estiver íntegro, bem adaptado ao conduto e ainda houver remanescente com retenção suficiente, a recimentação do conjunto pode ser considerada.",
    changes: [
      "Se houver fratura radicular, cárie, conduto comprometido, pino curto/mal adaptado ou remanescente insuficiente, recimentar tende a falhar.",
      "Nesses casos, avalie refazer a reconstrução com pino de fibra e núcleo em resina, reconstruir apenas o remanescente, planejar nova coroa ou, se o prognóstico for ruim, considerar exodontia."
    ],
    behind: [
      "Falha de cimentação do pino/núcleo",
      "Pino curto ou mal adaptado",
      "Pouca estrutura remanescente",
      "Cárie secundária",
      "Sobrecarga oclusal",
      "Fratura radicular",
      "Conduto desfavorável ou preparo intrarradicular inadequado"
    ],
    protocols: [
      {id: "pino-nucleo", label: "Pino de Fibra + Núcleo em Resina"},
      {id: "nova-coroa", label: "Planejar Nova Coroa"},
      {id: "moldagem-coroa-ponte", label: "Moldagem para Coroa/Ponte — Silicone de Adição, Técnica Simultânea"}
    ],
    related: [
      {id: "coroa-caiu", label: "A coroa caiu"},
      {id: "dente-pouca-estrutura", label: "Dente com pouca estrutura"},
      {id: "porcelana-lascou", label: "Coroa fraturou"}
    ]
  },
  "coroa-nao-entra-card": {
    id: "coroa-nao-entra-card",
    title: "A coroa não entra",
    icon: '<i class="ti ti-adjustments-horizontal"></i>',
    subtitle: "Localize contato, interno e tecido antes de ajustar.",
    synonyms: [
      "coroa não entra","coroa não assenta","coroa não encaixa","coroa não adaptou",
      "coroa não chega no lugar","coroa não desce","coroa não senta","coroa ficou aberta",
      "coroa ficou levantada","coroa não fechou na margem","coroa com margem aberta",
      "coroa com ponto de contato forte","coroa prende no contato","coroa apertada",
      "coroa travando","coroa não passa no proximal","coroa não adapta na cervical",
      "coroa não encaixa no preparo","peça não entra","peça não assenta",
      "prótese fixa não entra","jaqueta não entra","jaqueta não assenta"
    ],
    quick: "O primeiro caminho é descobrir onde a coroa está travando antes de ajustar. Na maioria dos casos, o problema está no contato proximal, na parte interna da coroa, em resíduo no preparo ou em tecido mole impedindo o assentamento.",
    changes: [
      "Se a coroa não assenta completamente mesmo após ajustes conservadores, não force e não cimente.",
      "Nesses casos, devolva ao laboratório ou refaça a peça, principalmente se houver margem aberta persistente, erro de moldagem/escaneamento, alteração do preparo ou adaptação inadequada."
    ],
    behind: [
      "Contato proximal excessivo",
      "Interferência interna da coroa",
      "Resíduo de cimento provisório ou detrito no preparo",
      "Tecido mole interferindo no assentamento",
      "Erro de moldagem ou escaneamento",
      "Alteração do preparo após a moldagem",
      "Distorção ou erro laboratorial"
    ],
    protocols: [
      {id: "coroa-nao-entra", label: "Coroa não entra — Ajuste e decisão"},
      {id: "moldagem-coroa-ponte", label: "Moldagem para Coroa/Ponte — Silicone de Adição, Técnica Simultânea"},
      {id: "nova-coroa", label: "Planejar Nova Coroa"}
    ],
    related: [
      {id: "coroa-caiu", label: "A coroa caiu"},
      {id: "porcelana-lascou", label: "A porcelana lascou"},
      {id: "dente-pouca-estrutura", label: "Dente com pouca estrutura"}
    ]
  },
  "porcelana-lascou": {
    id: "porcelana-lascou",
    title: "A porcelana lascou",
    icon: '<i class="ti ti-dental-broken"></i>',
    subtitle: "Defina se basta polir, reparar ou refazer.",
    synonyms: [
      "porcelana lascou","porcelana quebrou","porcelana trincou","porcelana fraturou",
      "cerâmica lascou","cerâmica quebrou","cerâmica trincou","coroa lascou",
      "coroa quebrou","coroa trincou","coroa de porcelana lascou",
      "coroa de porcelana quebrou","metalocerâmica lascou","zircônia lascou",
      "dissilicato lascou","faceta da coroa quebrou","saiu um pedaço da porcelana",
      "saiu um pedaço da coroa","ponta da coroa quebrou","porcelana soltou da coroa",
      "lasca na coroa","fratura de porcelana","fratura de cerâmica"
    ],
    quick: "O primeiro caminho é avaliar o tamanho da fratura e o impacto clínico/estético. Pequenos lascamentos, sem exposição importante da infraestrutura e sem prejuízo funcional, podem ser apenas polidos ou reparados em boca.",
    changes: [
      "Se houver exposição extensa de metal/zircônia, fratura envolvendo margem, contato proximal, oclusão, estética importante ou sinais de sobrecarga oclusal, não trate como simples polimento.",
      "Nesses casos, avalie reparo intraoral, encaminhamento ao laboratório ou planejamento de nova coroa/prótese. Se houver bruxismo, apertamento ou fratura recorrente, considere também placa oclusal para reduzir risco de nova falha."
    ],
    behind: [
      "Contato oclusal excessivo",
      "Bruxismo ou apertamento",
      "Sobrecarga oclusal",
      "Espessura insuficiente de cerâmica",
      "Falta de suporte da infraestrutura",
      "Trauma mastigatório",
      "Ajuste oclusal sem polimento adequado",
      "Falha laboratorial ou escolha inadequada do material"
    ],
    protocols: [
      {id: "reparo-porcelana", label: "Reparo Intraoral de Porcelana/Cerâmica"},
      {id: "nova-coroa", label: "Planejar Nova Coroa"},
      {id: "moldagem-coroa-ponte", label: "Moldagem para Coroa/Ponte — Silicone de Adição, Técnica Simultânea"}
    ],
    related: [
      {id: "coroa-nao-entra-card", label: "A coroa não entra"},
      {id: "coroa-caiu", label: "A coroa caiu"},
      {id: "dente-pouca-estrutura", label: "Dente com pouca estrutura"}
    ]
  },
  "dente-pouca-estrutura": {
    id: "dente-pouca-estrutura",
    title: "Dente com pouca estrutura",
    icon: '<i class="ti ti-dental"></i>',
    subtitle: "Defina se restaura, protege ou encaminha.",
    synonyms: [
      "dente com pouca estrutura","dente sem estrutura","pouca estrutura dentária",
      "remanescente pequeno","remanescente insuficiente","dente muito destruído",
      "dente destruído","dente quebrado para coroa","dente sem parede",
      "dente com pouca parede","dente com uma parede","dente com duas paredes",
      "dente precisa de pino","precisa de pino de fibra","quando usar pino de fibra",
      "quando fazer núcleo","preciso fazer núcleo","dente para núcleo",
      "dente tratado canal pouca estrutura","dente endodonticamente tratado sem estrutura",
      "dá para salvar esse dente","dente com prognóstico ruim","preparo sem retenção",
      "coroa sem retenção"
    ],
    quick: "O primeiro caminho é avaliar se ainda existe estrutura suficiente para reconstruir com previsibilidade. Remanescente favorável e bom isolamento? A reconstrução coronária pode ser suficiente. Dente tratado endodonticamente com pouca retenção coronária? Considere pino de fibra associado a núcleo em resina.",
    changes: [
      "Se houver margem muito subgengival, fratura radicular, cárie profunda, pouco remanescente ou impossibilidade de isolamento, não trate como simples reconstrução.",
      "Nesses casos, avalie pino de fibra + núcleo em resina, nova coroa ou encaminhamento periodontal/cirúrgico. Se o prognóstico for ruim, considere exodontia e novo planejamento reabilitador."
    ],
    behind: [
      "Cárie extensa",
      "Fratura coronária",
      "Restaurações antigas amplas",
      "Tratamento endodôntico prévio",
      "Perda de paredes remanescentes",
      "Preparo antigo sem retenção",
      "Margem subgengival ou difícil acesso"
    ],
    protocols: [
      {id: "pino-nucleo", label: "Pino de Fibra + Núcleo em Resina"},
      {id: "nova-coroa", label: "Planejar Nova Coroa"},
      {id: "moldagem-coroa-ponte", label: "Moldagem para Coroa/Ponte — Silicone de Adição, Técnica Simultânea"}
    ],
    related: [
      {id: "pino-nucleo-soltou", label: "O pino/núcleo soltou"},
      {id: "coroa-caiu", label: "A coroa caiu"},
      {id: "coroa-nao-entra-card", label: "A coroa não entra"},
      {id: "porcelana-lascou", label: "A porcelana lascou"}
    ]
  },
  "protese-total-machuca": {
    id: "protese-total-machuca",
    title: "A prótese total machuca",
    icon: '<i class="ti ti-bandage"></i>',
    subtitle: "Diferencie pressão, borda e oclusão.",
    synonyms: [
      "prótese total machuca","dentadura machuca","dentadura ferindo","dentadura fez ferida",
      "prótese machucando gengiva","prótese total ferindo","prótese total incomoda",
      "prótese total doendo","prótese total causando ferida","ferida por dentadura",
      "ferida por prótese","úlcera por prótese","prótese machuca ao mastigar",
      "prótese machuca no fundo","prótese machuca na borda","prótese total apertando",
      "dentadura apertando","dentadura incomodando","prótese total nova machuca",
      "paciente não consegue usar dentadura","dentadura machuca ao comer",
      "dentadura machuca no céu da boca","prótese machuca palato","prótese machuca freio",
      "prótese machuca fundo de sulco"
    ],
    quick: "O primeiro caminho é localizar se a dor vem de ponto de pressão, borda ou oclusão. Ferida localizada ou área isquemiada costuma indicar ponto de pressão. Dor em fundo de sulco ou região de freio sugere borda sobreestendida. Dor ao mastigar ou vários pontos doloridos pede avaliação de oclusão e adaptação geral.",
    changes: [
      "Se a dor persiste após ajustes, a prótese balança, perdeu retenção ou existe reabsorção evidente, não trate como ponto isolado.",
      "Nesses casos, avalie reembasamento provisório/definitivo ou nova prótese. Se a lesão não cicatriza após remover o trauma, encaminhe para estomatologista/patologista bucal."
    ],
    behind: [
      "Ponto de pressão na base",
      "Borda sobreestendida",
      "Freio comprimido",
      "Oclusão desequilibrada",
      "Prótese instável ou folgada",
      "Reabsorção do rebordo",
      "Superfície interna irregular",
      "Estomatite protética/candidíase associada"
    ],
    protocols: [
      {id: "protese-incomodando", label: "Prótese Incomodando — Ajuste de Base / Borda"},
      {id: "reemb-prov-pt", label: "Reembasamento Provisório — PT"},
      {id: "reemb-def-pt", label: "Reembasamento Definitivo — PT"}
    ],
    related: [
      {id: "protese-total-caindo", label: "A prótese total está caindo"},
      {id: "ppr-machuca-balanca", label: "A PPR machuca ou balança"},
      {id: "protese-quebrou-card", label: "A prótese quebrou"},
      {id: "dente-protese-soltou-card", label: "Dente da prótese soltou"}
    ]
  },
  "protese-total-caindo": {
    id: "protese-total-caindo",
    title: "A prótese total está caindo",
    icon: '<i class="ti ti-arrow-down-circle"></i>',
    subtitle: "Avalie retenção, base, selado e oclusão.",
    synonyms: [
      "prótese total está caindo","dentadura está caindo","dentadura solta","dentadura folgada",
      "dentadura balançando","dentadura não segura","dentadura sem pressão",
      "dentadura sai ao falar","dentadura sai ao comer","prótese total folgada",
      "prótese total solta","prótese total balançando","prótese total sem retenção",
      "prótese total não para","prótese total não fica presa","prótese total desloca",
      "prótese total sai ao falar","prótese total sai ao mastigar","prótese superior está caindo",
      "prótese inferior está solta","prótese total perdeu retenção","prótese total antiga folgada"
    ],
    quick: "O primeiro caminho é descobrir se a prótese só perdeu adaptação da base ou se a peça como um todo já perdeu previsibilidade. Se está folgada, mas ainda estável e sem grandes desgastes/deformações, o reembasamento pode melhorar a adaptação da base e devolver retenção.",
    changes: [
      "Se a prótese estiver muito antiga, instável, com base deformada, dentes desgastados, dimensão vertical alterada ou estética comprometida, o reembasamento tende a ser limitado.",
      "Nesses casos, ajustes podem melhorar temporariamente, mas o caminho mais previsível pode ser uma nova prótese ou outro planejamento reabilitador."
    ],
    behind: [
      "Reabsorção do rebordo",
      "Base desadaptada",
      "Perda de selado periférico",
      "Bordas inadequadas",
      "Oclusão desequilibrada",
      "Dentes artificiais desgastados",
      "Prótese antiga",
      "Anatomia mandibular desfavorável"
    ],
    protocols: [
      {id: "reemb-prov-pt", label: "Reembasamento Provisório — PT"},
      {id: "reemb-def-pt", label: "Reembasamento Definitivo — PT"},
      {id: "protese-incomodando", label: "Prótese Incomodando — Ajuste de Base / Borda"}
    ],
    related: [
      {id: "protese-total-machuca", label: "A prótese total machuca"},
      {id: "ppr-machuca-balanca", label: "A PPR machuca ou balança"},
      {id: "protese-quebrou-card", label: "A prótese quebrou"},
      {id: "dente-protese-soltou-card", label: "Dente da prótese soltou"}
    ]
  },
  "ppr-machuca-balanca": {
    id: "ppr-machuca-balanca",
    title: "A PPR machuca ou balança",
    icon: '<i class="ti ti-dental-broken"></i>',
    subtitle: "Cheque sela, grampos, apoios e pilares.",
    synonyms: [
      "PPR machuca","PPR balança","PPR está folgada","PPR solta","PPR frouxa",
      "PPR incomoda","PPR ferindo gengiva","PPR machuca ao mastigar",
      "PPR machuca na gengiva","PPR machuca no grampo","PPR apertando",
      "PPR não encaixa","PPR não assenta","PPR sai ao mastigar",
      "ponte móvel machuca","ponte móvel balança","ponte móvel folgada",
      "ponte móvel solta","ponte móvel não encaixa","prótese parcial machuca",
      "prótese parcial balança","prótese parcial removível machuca",
      "prótese parcial removível folgada","grampo machuca","grampo apertado",
      "grampo folgado","roach machuca","roach apertado"
    ],
    quick: "O primeiro caminho é separar se a queixa é dor localizada ou instabilidade da PPR. Dor em um ponto específico geralmente é pressão na sela, borda ou conector. Se balança ou sai fácil, avalie grampos, sela, apoios, oclusão e dentes pilares.",
    changes: [
      "Se houver grampo deformado, apoio sem assentamento, sela muito desadaptada, dente pilar comprometido ou estrutura metálica mal adaptada, não tente resolver apenas apertando grampo.",
      "Nesses casos, avalie reembasamento, ajuste/reparo laboratorial ou novo planejamento da PPR. Se o dente pilar estiver comprometido, resolva o pilar antes de tentar compensar na prótese."
    ],
    behind: [
      "Ponto de pressão na sela acrílica",
      "Borda ou conector comprimindo tecido",
      "Sela desadaptada por reabsorção do rebordo",
      "Grampo frouxo, apertado ou deformado",
      "Apoio mal assentado",
      "Oclusão desequilibrada",
      "Dente pilar com mobilidade, cárie ou perda periodontal",
      "Estrutura metálica mal adaptada"
    ],
    protocols: [
      {id: "protese-incomodando", label: "Prótese Incomodando — Ajuste de Base / Borda"},
      {id: "reemb-prov-ppr", label: "Reembasamento Provisório — PPR"},
      {id: "reemb-def-ppr", label: "Reembasamento Definitivo — PPR"}
    ],
    related: [
      {id: "protese-total-machuca", label: "A prótese total machuca"},
      {id: "protese-total-caindo", label: "A prótese total está caindo"},
      {id: "protese-quebrou-card", label: "A prótese quebrou"},
      {id: "dente-protese-soltou-card", label: "Dente da prótese soltou"}
    ]
  },
  "dente-protese-soltou-card": {
    id: "dente-protese-soltou-card",
    title: "Dente da prótese soltou",
    icon: '<i class="ti ti-puzzle"></i>',
    subtitle: "Decida reparo em boca ou envio ao laboratório.",
    synonyms: [
      "dente da prótese soltou","dente da dentadura soltou","dente da prótese caiu",
      "dente da dentadura caiu","dente artificial soltou","dente artificial caiu",
      "dente da PPR soltou","dente da PPR caiu","dente da PT soltou","dente da PT caiu",
      "caiu um dente da prótese","saiu um dente da dentadura","prótese sem dente",
      "dentadura sem dente","dente da prótese saiu","dente da prótese descolou",
      "dente da ponte móvel soltou","dente da ponte móvel caiu",
      "paciente chegou com dente da prótese na mão"
    ],
    quick: "O primeiro caminho é avaliar se é um reparo simples ou se existe fratura/desadaptação associada. Se o dente soltou, mas a base está íntegra e o espaço está preservado, pode ser possível reparar na cadeira. Se há base fraturada, dente perdido, espaço fechado ou prótese muito desgastada, o laboratório tende a ser mais seguro.",
    changes: [
      "Se houver fratura extensa da base, perda de adaptação, vários dentes soltos, prótese muito antiga ou comprometimento estético/funcional importante, não trate como simples colagem.",
      "Nesses casos, encaminhe ao laboratório ou avalie nova prótese, principalmente se o reparo na cadeira não devolver resistência e previsibilidade."
    ],
    behind: [
      "Falha de retenção do dente na base acrílica",
      "Trauma mastigatório",
      "Oclusão desequilibrada",
      "Desgaste ou envelhecimento da prótese",
      "Base acrílica fraturada",
      "Dente artificial muito desgastado",
      "Reparo anterior mal executado"
    ],
    protocols: [
      {id: "dente-protese-soltou", label: "Reparo na Cadeira — Dente da Prótese Soltou"},
      {id: "dente-protese-laboratorio", label: "Encaminhar Laboratório — Dente da Prótese"},
      {id: "protese-quebrada-lab", label: "Prótese Quebrada — Envio ao Laboratório"}
    ],
    related: [
      {id: "protese-quebrou-card", label: "A prótese quebrou"},
      {id: "protese-total-machuca", label: "A prótese total machuca"},
      {id: "protese-total-caindo", label: "A prótese total está caindo"},
      {id: "ppr-machuca-balanca", label: "A PPR machuca ou balança"}
    ]
  },
  "protese-quebrou-card": {
    id: "protese-quebrou-card",
    title: "A prótese quebrou",
    icon: '<i class="ti ti-tool"></i>',
    subtitle: "Identifique a fratura e organize o envio.",
    synonyms: [
      "prótese quebrou","dentadura quebrou","prótese rachou","dentadura rachou",
      "prótese partiu","dentadura partiu","prótese trincou","dentadura trincou",
      "quebrou a base da prótese","quebrou a base da dentadura","prótese total quebrou",
      "PPR quebrou","ponte móvel quebrou","prótese parcial quebrou",
      "prótese removível quebrou","grampo quebrou","grampo da PPR quebrou",
      "estrutura metálica quebrou","conector da PPR quebrou","prótese quebrou no meio",
      "paciente quebrou a dentadura","prótese caiu e quebrou","prótese quebrou na mão",
      "dentadura quebrou no meio"
    ],
    quick: "O primeiro caminho é identificar o que quebrou e enviar ao laboratório com as referências corretas. Base acrílica quebrada pede prótese completa, todos os fragmentos e moldagem auxiliar. Se dente artificial soltou ou quebrou, envie o dente junto quando o paciente trouxer. Se grampo, apoio, conector ou estrutura metálica quebrou, não tente compensar com resina.",
    changes: [
      "Se a prótese estiver muito antiga, desadaptada, com dentes desgastados, base frágil ou fraturas repetidas, o reparo tende a ser provisório.",
      "Nesses casos, envie para reparo quando necessário, mas explique ao paciente que pode ser o momento de planejar uma nova prótese."
    ],
    behind: [
      "Queda ou trauma da prótese",
      "Base acrílica fina ou fragilizada",
      "Prótese antiga",
      "Desadaptação da base",
      "Oclusão desequilibrada",
      "Dentes artificiais desgastados",
      "Reparo anterior frágil",
      "Estrutura metálica sobrecarregada"
    ],
    protocols: [
      {id: "protese-quebrada-lab", label: "Prótese Quebrada — Envio ao Laboratório"},
      {id: "dente-protese-soltou", label: "Reparo na Cadeira — Dente da Prótese Soltou"},
      {id: "dente-protese-laboratorio", label: "Encaminhar Laboratório — Dente da Prótese"},
      {id: "reemb-prov-pt", label: "Reembasamento Provisório — PT"},
      {id: "reemb-def-pt", label: "Reembasamento Definitivo — PT"},
      {id: "reemb-prov-ppr", label: "Reembasamento Provisório — PPR"},
      {id: "reemb-def-ppr", label: "Reembasamento Definitivo — PPR"}
    ],
    related: [
      {id: "dente-protese-soltou-card", label: "Dente da prótese soltou"},
      {id: "protese-total-machuca", label: "A prótese total machuca"},
      {id: "protese-total-caindo", label: "A prótese total está caindo"},
      {id: "ppr-machuca-balanca", label: "A PPR machuca ou balança"}
    ]
  }
};
