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
    protese:[{id:"hdr-fixa",label:"PRÓTESE FIXA",type:"header"},{id:"p1",label:"Dente com pouca estrutura"},{id:"p2",label:"Preciso de provisório"},{id:"p3",label:"Coroa solta"},{id:"p4",label:"Cimentação definitiva"},{id:"p5",label:"Ajuste oclusal"},{id:"p9",label:"Coroa não entra — Ajuste e decisão"},{id:"p10",label:"Moldagem para Coroa/Ponte"},{id:"p11",label:"Reparo de Porcelana/Cerâmica"},{id:"hdr-removivel",label:"PRÓTESE REMOVÍVEL",type:"header"},{id:"p13",label:"Nova prótese total"},{id:"p14",label:"Nova PPRG"},{id:"p6",label:"Prótese incomodando"},{id:"p7",label:"Prótese folgada"},{id:"p8",label:"Dente da prótese soltou"},{id:"p12",label:"Prótese quebrada — Laboratório"},{id:"hdr-implante",label:"PRÓTESE SOBRE IMPLANTE",type:"header"},{id:"imp_pilar",label:"Escolher o pilar certo"},{id:"imp_provisorio",label:"Provisório sobre implante"},{id:"imp_moldagem_aberta",label:"Moldagem aberta"},{id:"imp_moldagem_fechada",label:"Moldagem fechada"},{id:"imp_instalar_coroa",label:"Instalar coroa unitária"},{id:"imp_carga_imediata",label:"Carga imediata"},{id:"imp_afrouxamento",label:"Afrouxamento de parafuso"},{id:"imp_parafuso_fraturado",label:"Parafuso fraturado"},{id:"imp_fratura_dente",label:"Fratura de dente em protocolo"},{id:"imp_cimento_extravasado",label:"Remoção de cimento extravasado"}],
    endodontia:[{id:"e1",label:"Urgência endodôntica"},{id:"e2",label:"Medicação e retorno"}],
    cirurgia:[{id:"c1",label:"Extração simples"},{id:"c2",label:"Dente impactado / siso"},{id:"c3",label:"Sangramento pós-extração"},{id:"c4",label:"Alveolite"},{id:"c5",label:"Sutura"},{id:"c6",label:"Infecção odontogênica"},{id:"c7",label:"Espícula óssea"}],
    perio:[{id:"pe1",label:"Sangramento gengival"},{id:"pe3",label:"Abscesso periodontal"},{id:"pe4",label:"Aumento de coroa cl\u00ednica"}],
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
    p3:[{id:"recimentar-metal",label:"Recimentar — Metalo-cerâmica / Metal",free:true},{id:"recimentar-ceramica",label:"Recimentar — Porcelana / Zircônia / Disilicato",free:true},{id:"recimentacao-coroa-pino-nucleo",label:"Recimentação coroa + pino/núcleo",free:true},{id:"nova-coroa",label:"Planejar Nova Coroa",free:false}],
    p4:[{id:"cimentacao-metal",label:"Cimentação — Metalo-cerâmica / Metal",free:true},{id:"cimentacao-ceramica",label:"Cimentação — Porcelana / Zircônia / Disilicato",free:true}],
    p5:[{id:"ajuste-oclusal",label:"Ajuste Oclusal",free:true}],p9:[{id:"coroa-nao-entra",label:"Coroa não entra — Ajuste e decisão",free:true}],p10:[{id:"moldagem-coroa-ponte",label:"Moldagem — Silicone de Adição (1 passo)",free:false}],p11:[{id:"reparo-porcelana",label:"Reparo Intraoral de Porcelana/Cerâmica",free:false}],p6:[{id:"protese-incomodando",label:"Ajuste de Base / Borda",free:true}],p7:[{id:"reemb-prov-pt",label:"Reembasamento Provisório — PT",free:true},{id:"reemb-prov-ppr",label:"Reembasamento Provisório — PPR",free:true},{id:"reemb-def-pt",label:"Reembasamento Definitivo — PT",free:false},{id:"reemb-def-ppr",label:"Reembasamento Definitivo — PPR",free:false}],p8:[{id:"dente-protese-soltou",label:"Reparo na Cadeira",free:true},{id:"dente-protese-laboratorio",label:"Encaminhar Laboratório",free:false}],p12:[{id:"protese-quebrada-lab",label:"Prótese Quebrada — Envio ao Laboratório",free:false}],p12:[{id:"protese-quebrada-lab",label:"Prótese Quebrada — Envio ao Laboratório",free:false}],
    p14:[{id:"nova-pprg",label:"Confecção de Nova PPRG",free:false}],
    p13:[{id:"nova-protese-total",label:"Confecção de Nova Prótese Total",free:false}],
    e1:[{id:"endo-urgencia",label:"Urgência Endodôntica",free:true},{id:"pulpite-reversivel",label:"Pulpite Reversível / Fase de Transição",free:true},{id:"pulpite-irreversivel",label:"Pulpite Irreversível — Urgência",free:true},{id:"avaliacao-fratura-radicular",label:"Avalia\u00e7\u00e3o de Fratura Radicular",free:true}],
    e2:[{id:"medicacao",label:"Medicação + Retorno",free:true}],
    
    
    
    c1:[{id:"extracao-simples",label:"Extração Simples",free:true}],
    c2:[{id:"extracao-cirurgica",label:"Extração Cirúrgica",free:false}],
    c3:[{id:"hemostasia",label:"Hemostasia de Urgência",free:true}],
    c4:[{id:"alveolite-seca",label:"Alveolite Seca",free:true},{id:"alveolite-umida",label:"Alveolite Úmida",free:true}],
    c5:[{id:"sutura-tecnica",label:"Técnica de Sutura",free:true}],
    c7:[{id:"remocao-espicula-ossea",label:"Remoção/Regularização de Espícula Óssea",free:true}],
    c6:[{id:"drenagem-abscesso",label:"Drenagem de Abscesso",free:true},{id:"infeccao-odontogenica-sinais-sistemicos",label:"Infecção Odontogênica com Sinais Sistêmicos",free:true}],
    pe1:[{id:"raspagem-supragengival",label:"Raspagem Supragengival",free:true}],
    
    pe3:[{id:"abscesso-perio",label:"Abscesso Periodontal",free:true}],
    pe4:[{id:"aumento-coroa-clinica",label:"Aumento de Coroa Cl\u00ednica",free:false}],
    
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
    "pino-nucleo":{title:"Pino de Fibra + Núcleo em Resina",free:true,steps:["[CONDUTO] Remover guta: Broca Gates Glidden #2–#4 nos 4–5mm iniciais → Broca Largo #1–#3 para terço médio e cervical — preservar 4mm apicais","[CONDUTO] Prova do pino — deve assentar passivamente, nunca forçar","[CONDUTO] Lavar com NaOCl + EDTA 17% → secar com cones de papel","[CONDUTO] Ácido fosfórico 35–37% por 15s → lavar abundantemente → secar com cones de papel (deixar levemente úmido)","[CONDUTO] Adesivo com microbrush dentro do canal → fotopolimerizar 20s","[PINO] Jatear com óxido de alumínio 50µm (2–3s, 2cm, 45°) → limpar com álcool 70°","[PINO] Silano: aguardar 60s — NÃO SOPRAR","[PINO] Adesivo no pino → fotopolimerizar 20s","[CIMENTAÇÃO] Resina dual: aplicar dentro do canal com ponteira e no pino → remover excessos → fotopolimerizar 40s por face (mínimo 3 faces)","Construir núcleo em resina composta (incrementos ≤2mm) → encaminhar para coroa"],errors:["Remover além de 2/3 da guta — compromete vedamento apical","Não fazer condicionamento ácido no conduto","Condicionar >15s — pode sensibilizar a dentina","Não jatear o pino — falha adesiva previsível","Soprar o silano antes de 60s","Forçar pino sem calibrar — risco de fratura radicular","Usar cimento de fosfato de zinco — usar sempre resina dual"],decisions:[{if:"Canal largo (diâmetro > 1/3 da raiz)",then:"Reembasar pino com resina flow antes de cimentar"},{if:"Estrutura coronária < 50% após núcleo",then:"Coroa obrigatória — não restaurar diretamente"},{if:"Canal muito curvo",then:"Pino curto + núcleo longo — nunca force"},{if:"Menos de 1mm de estrutura",then:"Avaliar prognóstico — pode ser exodontia"}],crises:[{label:"Pino soltou",target:"pino-nucleo"}]},"coroa-nao-entra":{title:"Coroa não entra — Ajuste e Decisão",free:true,steps:["Remova o provisório e limpe completamente o preparo — elimine cimento provisório, resíduos e detritos.","Prove a coroa sem cimento e observe se ela assenta completamente.","Teste os contatos proximais com fio dental — se o fio não passa, desfia ou entra com muita resistência, o contato está apertado.","Ajuste o contato proximal da coroa de forma conservadora — nunca desgaste o dente adjacente.","Se os proximais estiverem adequados e a coroa ainda não assentar, use spray indicador ou silicone tipo Fit Checker na parte interna da coroa.","Desgaste apenas os pontos internos marcados e teste novamente.","Confira a margem com explorador em toda a volta — a coroa deve assentar completamente antes de qualquer cimentação.","Se houver tecido mole interferindo, afaste/maneje o tecido e teste novamente.","Se mesmo após ajustes conservadores a coroa não assentar, não force e não cimente — devolva ao laboratório ou refaça.","Só depois de confirmar assentamento completo, cheque oclusão e siga para cimentação conforme o material."],errors:["Cimentar coroa que não assentou completamente","Forçar a coroa para tentar encaixar","Ajustar no olho sem identificar onde está travando","Desgastar o dente adjacente em vez da coroa","Checar oclusão antes de confirmar assentamento","Cimentar com margem aberta"],decisions:[{if:"Fio dental não passa ou desfia",then:"Ajuste o contato proximal da coroa"},{if:"Proximais estão bons, mas a coroa não assenta",then:"Use indicador interno e alivie apenas os pontos marcados"},{if:"A margem continua aberta após ajustes conservadores",then:"Não cimente; devolva ao laboratório ou refaça"},{if:"O preparo foi alterado após a moldagem/escaneamento",then:"Nova moldagem/escaneamento e nova coroa"}],crises:[]},"moldagem-coroa-ponte":{title:"Moldagem para Coroa/Ponte — Silicone de Adição, Técnica Simultânea",free:false,steps:["Confirme que a gengiva está saudável, sem inflamação ou sangramento ativo.","Remova o provisório e limpe completamente o preparo com pedra-pomes.","Selecione e prove a moldeira total de estoque.","Aplique adesivo específico para silicone de adição na moldeira e aguarde secar.","Isole o campo, controle saliva e seque bem os preparos.","Selecione o fio retrator conforme o caso: fio fino #000 ou #00 para sulco delicado; fio #0 ou #1 quando precisar de maior afastamento. Em margens subgengivais, considerar técnica de fio duplo.","Insira o fio retrator com agente hemostático/adstringente compatível e aguarde o tempo indicado pelo fabricante.","Remova o fio superficial, seque o sulco e injete o silicone leve ao redor dos preparos, mantendo a ponta sempre próxima à margem.","Carregue a moldeira com silicone pesado e assente imediatamente em boca, com movimento único e firme.","Mantenha a moldeira imóvel até a presa completa, conforme o tempo do fabricante.","Remova o molde com movimento único, firme e no longo eixo.","Inspecione o molde antes de dispensar o paciente: margens nítidas, sem bolhas, sem rasgos cervicais e sem descolamento do material da moldeira.","Faça moldagem do antagonista e registro oclusal.","Registre a cor e envie ao laboratório a referência completa: cor escolhida, escala utilizada, fotos se possível e observações relevantes.","Lave, desinfete conforme protocolo/fabricante e envie ao laboratório.","Confeccione ou recimente o provisório antes de o paciente sair."],errors:["Moldar com gengiva inflamada ou sangrando","Manipular silicone de adição com luva de látex","Não usar adesivo na moldeira","Não controlar saliva e umidade","Perder o tempo de trabalho do material","Movimentar a moldeira durante a presa","Enviar molde com bolha ou rasgo na margem","Enviar ao laboratório sem antagonista, registro oclusal ou referência de cor","Não informar a escala de cor utilizada"],decisions:[{if:"Gengiva inflamada ou sangrando",then:"Não molde; controle tecido, ajuste provisório e remarque."},{if:"Margem subgengival",then:"Use fio duplo; se ainda não houver acesso à margem, reavalie o preparo ou considere aumento de coroa clínica."},{if:"Sangrou ao remover o fio",then:"Controle a hemostasia antes de injetar o silicone leve."},{if:"Molde tem bolha, rasgo ou margem incompleta",then:"Refaça; não envie ao laboratório."},{if:"São múltiplos preparos e o tempo estiver difícil de controlar",then:"Considere técnica de 2 passos ou escaneamento, se disponível."}],crises:[]},"reparo-porcelana":{title:"Reparo Intraoral de Porcelana/Cerâmica",free:false,steps:["Avalie se a coroa está bem adaptada, sem mobilidade, sem margem aberta e sem infiltração.","Identifique o que ficou exposto no lascamento: porcelana/cerâmica, metal ou zircônia.","Cheque a oclusão antes do reparo — se a área fraturada recebe carga pesada, o reparo tende a falhar.","Isole bem o campo e proteja tecidos moles, principalmente se for usar ácido fluorídrico.","Asperize a área fraturada com ponta diamantada ou jateamento com óxido de alumínio, se disponível.","Se for porcelana/cerâmica vítrea: condicione com ácido fluorídrico conforme fabricante → lave abundantemente → seque → aplique silano.","Se for metal ou zircônia: não use fluorídrico como etapa principal → jateie/asperize e aplique primer específico com MDP.","Aplique adesivo conforme o sistema escolhido e fotopolimerize.","Reconstrua a área com resina composta em incrementos pequenos, devolvendo forma, contato e estética.","Ajuste oclusão, acabamento e polimento cuidadoso da área reparada.","Oriente o paciente de que o reparo aumenta a longevidade da peça, mas pode não ter a mesma previsibilidade de uma nova coroa."],errors:["Reparar coroa com margem aberta, infiltração ou má adaptação","Ignorar contato oclusal pesado na área fraturada","Usar ácido fluorídrico em zircônia como se fosse porcelana vítrea","Não proteger tecidos moles ao usar ácido fluorídrico","Não usar silano em porcelana/cerâmica vítrea condicionada","Não usar primer MDP em metal ou zircônia","Fazer reparo sem acabamento e polimento adequado","Prometer ao paciente que o reparo terá a mesma durabilidade de uma nova coroa"],decisions:[{if:"Lascamento pequeno, sem carga oclusal importante",then:"Polimento ou reparo simples podem ser suficientes."},{if:"Porcelana/cerâmica vítrea está exposta",then:"Asperização + ácido fluorídrico conforme fabricante + silano + adesivo + resina composta."},{if:"Metal está exposto",then:"Asperização/jateamento + primer para metal/MDP + adesivo + resina composta."},{if:"Zircônia está exposta",then:"Asperização/jateamento + primer MDP para zircônia + adesivo/resina composta."},{if:"A fratura envolve margem, adaptação ou contato proximal importante",then:"Não trate como reparo simples; avalie laboratório ou nova coroa."},{if:"A área fraturada recebe carga oclusal pesada",then:"Ajuste a causa ou considere nova peça; o reparo isolado tende a falhar."}],crises:[]},
    
    "coroa-direta":{title:"Coroa Direta",free:false,steps:["Preparo do dente: linha de término cervical intrasulcular, remover ângulos vivos, espessura uniforme — brocas tronco-cônicas + ponta fina para acabamento de margens","Afastamento gengival duplo: fio 00 no sulco durante o preparo → após refinamento, fio 0 para afastamento vertical e horizontal — hemostático à base de cloreto de alumínio (evitar sulfato férrico)","Seleção de cor em luz natural — antes do isolamento","Seleção do material: silicone de adição ou condensação — técnica de dois passos (pesado + leve) ou dupla mistura — moldeira total","Moldagem: posicionar material pesado na moldeira → remover 2º fio → secar margem cervical → aplicar material leve no preparo e dentro do sulco → posicionar moldeira → aguardar 4–5 min","Remover moldagem com cuidado → lavar em água corrente → desinfetar (hipoclorito ou glutaraldeído até 10 min) → enviar ao laboratório","Provisório em bis-acryl → ajustar oclusão e contatos proximais → cimentar com TempBond","Cimentação definitiva com cimento resinoso na instalação da coroa","Checar oclusão em MIC e lateralidade"],errors:["Não usar fio afastador — margem cervical não copiada","Usar sulfato férrico como hemostático — interfere na polimerização do silicone","Não secar a margem antes de aplicar o material leve — bolha na moldagem","Provisório mal adaptado — desconforto e infiltração","Não verificar lateralidade — ponto alto em excursão"],decisions:[{if:"Pouca estrutura remanescente",then:"Pino de Fibra + Núcleo em Resina antes do preparo"},{if:"Gengiva inflamada",then:"Tratamento periodontal antes — moldagem imprecisa com gengiva sangrante"},{if:"Margem subgengival muito profunda",then:"Cirurgia de aumento de coroa clínica antes"}],crises:[]},
    "provisorio-resina":{title:"Provisório em Resina",free:true,steps:["Pegar molde antes do preparo (alginato ou PVS)","Executar o preparo do dente","Preencher o molde com bis-acryl","Levar ao dente no início da presa","Remover na fase borrachosa (1,5–2 min)","Aguardar polimerização fora da boca","Ajustar com broca multilaminada","Polir com disco de feltro + pasta","Cimentar com TempBond"],errors:["Não pegar molde antes do preparo","Deixar resina endurecer dentro da boca","Não polir — provisório rugoso acumula placa"],decisions:[{if:"Sem molde prévio",then:"Usar matriz de cera ou modelar manualmente"},{if:"Baixa retenção",then:"Usar cimento mais resistente (Freegenol)"}],crises:[]},
    "provisorio-bisacril":{title:"Bis-acryl Direto",free:false,steps:["Selecionar cor do bis-acryl","Preencher matriz/molde","Posicionar sobre o preparo","Remover na fase borrachosa (~1,5 min)","Aguardar cura completa fora da boca","Ajustar oclusão e contatos proximais","Polir levemente","Cimentar com TempBond"],errors:["Deixar endurecer completamente na boca","Não verificar contatos proximais"],decisions:[{if:"Múltiplos dentes",then:"Usar matriz em segmentos separados"}],crises:[]},
    "recimentar-metal":{title:"Recimentar — Metalo-cerâmica / Metal",free:true,steps:["Remover coroa com remoedor ou fio de pesca — sem forçar","Limpar o dente: pedra-pomes + taça de borracha → checar cárie secundária","Preparar superfície interna da coroa: jatear com óxido de alumínio 50µm → limpar com álcool 70°","Secar o dente com jato de ar","Testar adaptação — coroa deve assentar completamente sem força","Aplicar cimento de ionômero de vidro ou fosfato de zinco na coroa","Assentar com pressão digital + rolete de gaze por 3–5 min","Remover excessos com fio dental antes da presa completa","Checar oclusão em MIC e lateralidade"],errors:["Não jatear a superfície interna — falha adesiva","Cimentar com resíduos de cimento antigo","Não checar oclusão após cimentação"],decisions:[{if:"Soltou mais de 2 vezes",then:"Avaliar novo preparo"},{if:"Cárie no remanescente",then:"Tratar antes de recimentar"},{if:"Coroa íntegra mas preparo insuficiente",then:"Nova coroa"}],crises:[]},
    "recimentar-ceramica":{title:"Recimentar — Porcelana / Zircônia / Disilicato",free:true,steps:["Remover coroa com remoedor ou fio de pesca — sem forçar","Limpar o dente: pedra-pomes + taça de borracha → checar cárie secundária","Preparar superfície interna da coroa:","→ Porcelana / Disilicato: jatear + ácido fluorídrico 10% por 60s → lavar → silano por 60s → secar","→ Zircônia: jatear com óxido de alumínio 50µm + primer de zircônia → secar","Preparar o dente: condicionamento ácido + adesivo → fotoativar","Testar adaptação — coroa deve assentar completamente sem força","Aplicar cimento resinoso dual na coroa → assentar → fotopolimerizar 40s por face","Remover excessos com fio dental antes da presa completa","Checar oclusão em MIC e lateralidade"],errors:["Usar cimento de fosfato ou ionômero em zircônia ou disilicato — não adere","Não aplicar silano em porcelana — falha adesiva garantida","Não fazer primer de zircônia — o silano sozinho não funciona em zircônia","Cimentar com resíduos de cimento antigo","Não checar oclusão após cimentação"],decisions:[{if:"Soltou mais de 2 vezes",then:"Avaliar novo preparo"},{if:"Cárie no remanescente",then:"Tratar antes de recimentar"},{if:"Coroa íntegra mas preparo insuficiente",then:"Nova coroa"}],crises:[]},
    "recimentacao-coroa-pino-nucleo":{title:"Recimentação do Conjunto Coroa + Pino/Núcleo",free:true,steps:["Examine o conjunto que saiu: coroa e pino/núcleo.","Examine o remanescente: procure cárie, fratura, mobilidade, infiltração, margem subgengival ou perda importante de estrutura.","Faça RX periapical antes de recimentar: avalie conduto, remanescente radicular, adaptação do pino e suspeita de fratura.","Remova todo cimento antigo do pino, do núcleo, da coroa e do conduto.","Prove o conjunto sem cimento: ele deve entrar passivamente e assentar totalmente, sem pressão.","Se o conjunto não assentar, identifique onde trava: resíduo no conduto, pino deformado, contato proximal, coroa desalinhada ou fratura do remanescente.","Se estiver favorável, isole o campo e controle umidade.","Limpe o conduto com irrigação e seque com cones de papel: não deixe úmido demais nem ressecado demais.","Trate a superfície do pino conforme o material: pino de fibra → limpeza, silano/adesivo conforme sistema.","Aplique cimento resinoso dual no conduto e no pino.","Assente o conjunto em posição, mantenha pressão estável e remova excessos.","Fotopolimerize conforme o cimento utilizado.","Confira RX final, adaptação marginal e oclusão em MIC e lateralidade."],errors:["Recimentar sem RX periapical.","Forçar o pino dentro do conduto.","Recimentar com cimento antigo dentro do canal.","Ignorar cárie ou fratura do remanescente.","Recimentar pino curto, frouxo ou mal adaptado.","Usar cimento provisório como solução definitiva.","Não controlar umidade durante a cimentação.","Não checar oclusão depois: contato alto faz o conjunto soltar de novo.","Prometer longevidade em um dente com prognóstico duvidoso."],decisions:[{if:"O conjunto entra passivamente e o remanescente está favorável",then:"A recimentação pode ser considerada."},{if:"Há cárie no remanescente",then:"Não recimente direto; remova cárie e reavalie reconstrução."},{if:"Há suspeita de fratura radicular",then:"Não recimente; confirme com RX/TC e reavalie prognóstico."},{if:"O pino está curto ou frouxo",then:"Recimentar tende a falhar; refaça pino/núcleo."},{if:"O conduto está alargado",then:"Avalie reembasamento do pino ou novo pino/núcleo."},{if:"A coroa está íntegra, mas o núcleo está comprometido",then:"Refaça o núcleo e reaproveite a coroa apenas se ela readaptar perfeitamente."},{if:"A margem da coroa fica aberta após a prova",then:"Não cimente; ajuste, devolva ao laboratório ou refaça."},{if:"Soltou mais de uma vez",then:"Procure causa: retenção, cárie, oclusão, pino curto ou fratura."},{if:"Há dor à percussão ou sensação de dente “crescido”",then:"Avalie trauma oclusal, lesão periapical ou fratura antes de recimentar."}],crises:[]},
    "nova-coroa":{title:"Planejar Nova Coroa",free:false,steps:["RX periapical — avaliar raiz, osso, lesão apical e altura do remanescente","Teste de vitalidade pulpar — dente sem vitalidade exige endodontia + pino antes","Checar espaço oclusal: mínimo 1,5mm para cerâmica, 0,5mm para zircônia monolítica","Escolher o material: Zircônia monolítica (posterior, bruxismo, espaço reduzido) / Disilicato de lítio (anterior ou pré-molar, alta estética) / Metalo-cerâmica (quando custo é limitante)","Avaliar necessidade de aumento de coroa clínica — margem subgengival > 2mm","Preparo + moldagem + provisório — seguir protocolo de Coroa Direta","Instalação: prova → ajuste de contatos → ajuste oclusal → cimentação conforme material"],errors:["Não avaliar espaço oclusal antes do preparo — coroa vai fraturar","Selecionar cor com luz artificial — resultado diferente do esperado","Cimentar sem ajustar contatos proximais","Não fazer provisório — dente migra e inviabiliza a coroa"],decisions:[{if:"Dente sem vitalidade",then:"Endodontia + Pino de Fibra + Núcleo em Resina antes do preparo"},{if:"Espaço oclusal insuficiente",then:"Desgastar antagonista ou avaliação ortodôntica"},{if:"Margem muito subgengival",then:"Cirurgia de aumento de coroa clínica antes"},{if:"Bruxismo",then:"Zircônia monolítica + placa de bruxismo pós-instalação"}],crises:[]},
    "cimentacao-metal":{title:"Cimentação — Metalo-cerâmica / Metal",free:true,steps:["Testar adaptação, contatos proximais e oclusão ANTES de qualquer cimento","Limpar o dente: remover provisório, pedra-pomes + taça de borracha, secar","[NA COROA] Jatear superfície interna com óxido de alumínio 50µm → limpar com álcool 70°","[NO DENTE] Secar com jato de ar","Aplicar ionômero de vidro ou fosfato de zinco na coroa → assentar com pressão digital → rolete de gaze por 3–5 min","Remover excessos com fio dental antes da presa completa","Checar oclusão em MIC e lateralidade"],errors:["Não jatear a superfície interna da coroa — falha adesiva","Cimentar com resíduos de provisório — falha garantida","Não checar oclusão após cimentação"],decisions:[{if:"Coroa solta mais de 2 vezes",then:"Avaliar novo preparo — retenção insuficiente"},{if:"Dente com pouca estrutura",then:"Pino de Fibra + Núcleo em Resina antes de novo preparo"}],crises:[]},
    "cimentacao-ceramica":{title:"Cimentação — Porcelana / Zircônia / Disilicato",free:true,steps:["Testar adaptação, contatos proximais e oclusão ANTES de qualquer cimento","Limpar o dente: remover provisório, pedra-pomes + taça de borracha, secar","[NA COROA — PORCELANA / DISILICATO] Jatear + ácido fluorídrico 10% por 60s → lavar → silano por 60s → secar","[NA COROA — ZIRCÔNIA] Jatear com óxido de alumínio 50µm → primer de zircônia → secar","[NO DENTE] Condicionamento ácido + adesivo → fotoativar","Aplicar cimento resinoso dual na coroa → assentar → fotopolimerizar 40s por face","Remover excessos com fio dental antes da presa completa","Checar oclusão em MIC e lateralidade"],errors:["Usar fosfato ou ionômero em porcelana / zircônia / disilicato — não adere","Não aplicar silano em porcelana — falha adesiva garantida","Usar silano em zircônia sem primer específico — não funciona","Cimentar com resíduos de provisório","Não checar oclusão após cimentação"],decisions:[{if:"Porcelana / disilicato",then:"Fluorídrico + silano + resinoso dual"},{if:"Zircônia",then:"Primer de zircônia + resinoso dual"},{if:"Coroa solta mais de 2 vezes",then:"Avaliar novo preparo"}],crises:[]},
    "protese-incomodando":{title:"Prótese Incomodando — Ajuste de Base / Borda",free:true,steps:["Perguntar ao paciente onde dói e quando — o relato direciona o ajuste","Examinar a mucosa: localizar úlcera ou ponto de pressão","Aplicar pasta de evidenciação (Kerr) na base interna → inserir na boca → remover → identificar marcas","Em PPR: checar também se grampo está pressionando dente ou mucosa","Acoplar a broca Maxicut na peça reta → desgastar os pontos marcados — pequenos e progressivos","Reinserir → verificar conforto → repetir até eliminação do desconforto","Trocar para broca de polimento do kit → polir a área desgastada","Orientar: úlcera leva 7–10 dias para cicatrizar — retorno em 1 semana"],errors:["Desgastar sem pasta de evidenciação — desgaste às cegas","Desgaste excessivo de uma vez — enfraquece a base","Não polir após desgaste — superfície rugosa irrita o tecido","Dispensar sem verificar conforto imediato"],decisions:[{if:"Múltiplos pontos de pressão",then:"Prótese folgada — indicar reembasamento"},{if:"PPR com grampo machucando",then:"Ajuste com alicate 139 ou encaminhar laboratório"},{if:"Úlcera não cicatriza em 14 dias",then:"Encaminhar — descartar lesão suspeita"},{if:"Dor generalizada em PT",then:"Prótese folgada — reembasamento"}],crises:[]},
    "reemb-prov-pt":{title:"Reembasamento Provisório — PT",free:true,steps:["Confirmar indicação: PT folgada, instável, sem retenção por reabsorção óssea","Remover material reembasador antigo e superfícies irregulares com broca Maxicut na peça reta","Manipular a resina Soft para reembasamento conforme o fabricante","Aplicar camada de 2–3mm na superfície interna com espátula — cobrir toda área em contato com mucosa","Assentar a prótese na boca com paciente em MIC — realizar movimentos funcionais: sorriso, sugar bochechas, abrir a boca — para copiar inserções musculares","Aguardar presa completa conforme fabricante → remover → deixar polimerizar fora da boca","Recortar excessos com bisturi ou tesoura","Reinserir → verificar retenção, estabilidade e conforto","Orientar: tempo de duração conforme fabricante — retorno para troca periódica → indicar reembasamento definitivo em laboratório"],errors:["Não remover material antigo — nova camada não adere","Não realizar movimentos funcionais — prótese perde retenção nas bordas","Paciente fora de MIC durante a presa — distorce a DVO","Usar como solução definitiva — é provisório"],decisions:[{if:"PT completamente folgada",then:"Provisório agora + agendar definitivo em laboratório"},{if:"Mucosa inflamada",then:"Deixar sem prótese por 48–72h antes de reembasar"},{if:"Prótese antiga >5 anos com desgaste oclusal",then:"Avaliar nova prótese"}],crises:[]},
    "reemb-prov-ppr":{title:"Reembasamento Provisório — PPR Rígida de Resina",free:true,steps:["Confirmar indicação: PPR rígida de resina folgada/instável por reabsorção óssea","Remover material antigo e irregularidades com Maxicut — preservar apoios e ganchos","Manipular resina Soft para reembasamento conforme fabricante","Aplicar 2–3mm na superfície interna da sela — sem invadir retenções","Assentar em MIC → movimentos funcionais: sorriso, sugar bochechas, abrir, laterais","Aguardar presa completa conforme fabricante → remover → polimerizar fora da boca","Recortar excessos com bisturi ou tesoura","Reinserir → verificar retenção, estabilidade, conforto e assentamento","Orientar: é provisório — agendar reembasamento definitivo em laboratório"],errors:["Obstruir apoios ou ganchos com a resina","Não fazer movimentos funcionais","Paciente fora da MIC durante a presa","Usar como solução definitiva"],decisions:[{if:"PPR completamente folgada",then:"Provisório agora + agendar definitivo em laboratório"},{if:"Mucosa inflamada",then:"Deixar sem prótese por 48–72h antes de reembasar"},{if:"Prótese antiga >5 anos com desgaste oclusal",then:"Avaliar nova PPR"},{if:"Apoios sem contato",then:"Reembasamento não resolve — nova PPR"}],crises:[]},
    "reemb-def-pt":{title:"Reembasamento Definitivo — PT",free:false,steps:["Confirmar indicação: PT folgada com estrutura e dentes em bom estado","Inspecionar a base interna — remover material antigo e eliminar retenções com broca Maxicut na peça reta","Realizar moldagem funcional com a própria prótese usando silicone de adição leve → assentar em MIC → movimentos funcionais: sorriso, sugar, abrir, laterais → aguardar presa → remover","Desinfetar moldagem → lavar em água corrente → encaminhar ao laboratório","Na instalação: verificar retenção, estabilidade e oclusão","Ajustes com pasta de evidenciação de pressão (zinco-enólica, apenas a base branca) se necessário","Controles periódicos até adaptação completa"],errors:["Não fazer moldagem funcional — resultado impreciso","Paciente fora de MIC durante a presa — oclusão errada","Enviar ao laboratório sem desinfetar","Não fazer controles periódicos após instalação"],decisions:[{if:"Estrutura da prótese comprometida",then:"Nova prótese"},{if:"Prótese antiga >5 anos com desgaste oclusal severo",then:"Nova prótese"},{if:"Reembasamento provisório recente",then:"Aguardar mucosa estabilizar antes do definitivo"}],crises:[]},
    "reemb-def-ppr":{title:"Reembasamento Definitivo — PPRG",free:false,steps:["Confirmar indicação: PPRG folgada com estrutura metálica, apoios e ganchos em bom estado","Inspecionar a base interna — remover material antigo e eliminar retenções com broca Maxicut na peça reta — preservar apoios e ganchos","Realizar moldagem funcional com a própria PPRG usando silicone de adição leve → assentar em MIC garantindo assentamento correto dos apoios → movimentos funcionais: sorriso, sugar, abrir, laterais → aguardar presa → remover","Desinfetar moldagem → lavar em água corrente → encaminhar ao laboratório","Na instalação: verificar assentamento dos apoios, retenção, estabilidade e oclusão","Se ganchos frouxos: apertar com alicate 139 (Nance) — dobras pequenas e progressivas na ponta ativa do gancho, sempre no terço médio — nunca na conexão com a estrutura metálica","Ajustes com pasta de evidenciação de pressão (zinco-enólica, apenas a base branca) se necessário","Controles periódicos até adaptação completa"],errors:["Não fazer moldagem funcional — resultado impreciso","Paciente fora de MIC durante a presa — oclusão errada","Obstruir apoios ou ganchos durante a moldagem","Apertar gancho na conexão com a estrutura — fratura metálica","Enviar ao laboratório sem desinfetar","Não fazer controles periódicos após instalação"],decisions:[{if:"Estrutura metálica fraturada ou gancho quebrado",then:"Laboratório para reparo antes de reembasar"},{if:"PPRG antiga >5 anos com desgaste oclusal severo",then:"Avaliar nova PPRG"},{if:"Reembasamento provisório recente",then:"Aguardar mucosa estabilizar antes do definitivo"}],crises:[]},
    "dente-protese-soltou":{title:"Reparo na Cadeira — Dente da Prótese Soltou",free:true,steps:["Remover resíduos de resina antiga do dente e do alvéolo da prótese","Verificar se o dente se encaixa perfeitamente no local — conferir alinhamento e oclusão","Criar retenções no alvéolo e na base do dente com lixa ou broca pequena — melhora adesão da resina","Misturar resina acrílica autopolimerizável (pó + líquido) → aplicar no alvéolo e na base do dente","Pressionar o dente no local na posição correta → remover excessos antes da presa","Aguardar polimerização completa fora da boca conforme fabricante","Polir a região com broca de polimento na peça reta","Verificar oclusão — ajustar se necessário"],errors:["Não remover resíduos antigos — dente solta novamente","Não criar retenções — adesão insuficiente","Deixar excesso de resina — irrita a mucosa","Não verificar oclusão — dente alto causa descolamento"],decisions:[{if:"Alvéolo fraturado ou base comprometida",then:"Encaminhar laboratório"},{if:"Dente fraturado",then:"Encaminhar laboratório"},{if:"Múltiplos dentes soltos",then:"Prótese muito antiga — avaliar nova prótese"}],crises:[]},"protese-quebrada-lab":{title:"Prótese Quebrada — Envio ao Laboratório",free:false,steps:["Avalie o que quebrou: base acrílica, dente artificial, grampo, apoio, conector ou estrutura metálica.","Reúna a prótese completa e todos os fragmentos, mesmo os pequenos.","Se um dente artificial soltou, envie o dente junto quando o paciente trouxer.","Verifique se os fragmentos encaixam corretamente entre si — isso ajuda o laboratório a recuperar a posição original.","Faça uma moldagem auxiliar da boca para orientar o reparo e a adaptação da prótese.","Se a fratura comprometer a relação entre os arcos, a dimensão vertical ou a posição dos dentes, faça também registro oclusal e envie o antagonista.","Fotografe a prótese, os fragmentos e, se possível, a prótese posicionada em boca.","Envie ao laboratório com ordem clara: tipo de fratura, região quebrada, urgência, necessidade de reembasamento associado e observações clínicas.","Explique ao paciente que o reparo pode devolver função temporariamente, mas nem sempre tem a mesma resistência da prótese original.","Se a prótese for muito antiga, desadaptada, com dentes desgastados ou já tiver quebrado outras vezes, converse sobre a necessidade de nova prótese."],errors:["Tentar colar a prótese em boca como solução definitiva","Enviar a prótese sem todos os fragmentos","Não fazer moldagem auxiliar para orientar o reparo","Enviar sem registro oclusal quando há perda de referência entre os arcos","Ignorar que fraturas repetidas indicam causa não resolvida","Prometer que o reparo terá a mesma resistência da prótese original","Não informar ao laboratório se precisa de reembasamento associado","Não avaliar se a prótese já está antiga ou desadaptada demais"],decisions:[{if:"Quebrou apenas um dente artificial e a base está íntegra",then:"Enviar o dente, a prótese e moldagem auxiliar; avaliar reparo simples."},{if:"A base acrílica quebrou e os fragmentos encaixam bem",then:"Enviar prótese completa, fragmentos e moldagem auxiliar para reparo laboratorial."},{if:"A prótese quebrou em vários pedaços ou perdeu referência de posição",then:"Enviar moldagem auxiliar, fotos e registro oclusal quando necessário."},{if:"Quebrou grampo, apoio, conector ou estrutura metálica",then:"Não reparar com resina em boca; enviar ao laboratório e reavaliar planejamento da PPR."},{if:"A prótese está antiga, desadaptada ou quebra sempre na mesma região",then:"Tratar o reparo como provisório e iniciar conversa sobre nova prótese."},{if:"Há desadaptação associada",then:"Solicitar avaliação de reembasamento junto com o reparo."}],crises:[]},
    "dente-protese-laboratorio":{title:"Encaminhar Laboratório — Dente da Prótese",free:false,steps:["Guardar o dente e a prótese — não descartar nada","Fazer moldagem da arcada antagonista com alginato","Fazer registro oclusal com lâmina de cera 7 aquecida com a prótese em boca — especialmente em dentes posteriores","Encaminhar ao laboratório: prótese + dente + moldagem do antagonista + registro oclusal + instruções de cor e posicionamento","Na instalação: verificar oclusão e conforto","Ajustes com pasta de evidenciação se necessário"],errors:["Descartar o dente — laboratório precisa dele ou da referência de tamanho e cor","Não enviar moldagem do antagonista — laboratório não consegue ajustar oclusão","Não fazer registro oclusal em dentes posteriores"],decisions:[{if:"Base fraturada junto com o dente",then:"Laboratório para reparo completo da base"},{if:"Múltiplos dentes soltos",then:"Avaliar nova prótese"},{if:"Paciente sem condições de ficar sem prótese",then:"Reparo provisório na cadeira antes de encaminhar"}],crises:[]},
    "imp_pilar_protocolo":{title:"Escolher o Pilar Certo",free:false,steps:["Remova o cicatrizador do implante","Meça com sonda periodontal a distância da plataforma até a margem gengival (ponto mais apical da parábola)","Escolha o pilar com altura 1mm menor que a medida obtida (ex: 5mm → pilar de 4mm)","Alturas disponíveis: 0,8mm / 1,5mm / 2,5mm / 3,5mm / 4,5mm / 5,5mm","Para prótese cimentada → linha de cimentação próxima ao nível gengival","Para prótese parafusada → pode deixar mais subgengival","Confirme a adaptação com radiografia"],errors:["Medir até o zênite gengival em vez do ponto mais apical","Não confirmar radiograficamente a adaptação do pilar","Escolher altura errada que dificulta a higienização"],decisions:[{if:"Altura transmucosa < 3mm",then:"Use UCLA direto sobre o implante"},{if:"Múltiplos implantes com inclinação",then:"Mini pilar angulado (17° ou 30°)"},{if:"Espaço interoclusal < 4,5mm",then:"UCLA é a melhor opção"}],crises:[]},
    "imp_provisorio_protocolo":{title:"Provisório sobre Implante",free:false,steps:["Selecione o cilindro provisório compatível","Parafuse o cilindro sobre o implante","Marque 2mm aquém da incisal/oclusal com caneta","Remova o cilindro e corte no local (anteriores: bisel 45° / posteriores: corte reto)","Faça um furo na região oclusal/palatina do dente de estoque","Aplique resina acrílica pó/líquido entre cilindro e dente","Aguarde a presa, retire o provisório e acrescente resina até a cinta","Remova excessos e realize polimento","Parafuse em boca, feche acesso com Teflon e resina"],errors:["Não deixar espaço para resina entre dente e cilindro","Não fazer o furo de encaixe do dente no cilindro","Perfil de emergência convexo","Provisório em oclusão"],decisions:[{if:"Implante bem posicionado",then:"Provisório direto sobre o implante"},{if:"Implante inclinado",then:"Mini pilar angulado antes do provisório"},{if:"Osseointegração comprometida",then:"Converta para carga tardia"}],crises:[]},
    "imp_moldagem_aberta_protocolo":{title:"Moldagem Aberta",free:false,steps:["Parafuse o transferente aberto no implante e radiografe","Para múltiplos implantes: una os transferentes com fio dental + resina pattern","Corte a moldeira na região dos parafusos e sele com cera 7","Injete silicona leve ao redor dos transferentes","Leve a moldeira com silicona pesada à boca","Aguarde 4–5 min, desparafuse os transferentes (saem presos no molde)","Parafuse os análogos (sem forçar)","Coloque gengiva artificial e vaze com gesso"],errors:["Não esplintar os transferentes em casos múltiplos","Forçar o aperto do análogo","Não radiografar os transferentes"],decisions:[{if:"Um implante",then:"Não precisa esplintar"},{if:"Múltiplos implantes",then:"Obrigatório esplintar"},{if:"Distância entre implantes > 15mm",then:"Seccionar a união e reunir após 24h"}],crises:[]},
    "imp_moldagem_fechada_protocolo":{title:"Moldagem Fechada",free:false,steps:["Parafuse o transferente fechado no implante e radiografe","Injete silicona leve ao redor do transferente","Leve moldeira com silicona pesada à boca","Aguarde 4–5 min, remova a moldeira (transferente fica no implante)","Desparafuse o transferente do implante","Parafuse o análogo no transferente","Encaixe no molde respeitando as ranhuras","Vaze com gesso"],errors:["Transferente mal encaixado no molde (ranhuras fora de posição)","Não radiografar o transferente","Maior chance de distorção em casos múltiplos"],decisions:[{if:"Limitação de abertura ou náusea",then:"Prefira moldeira fechada"},{if:"Caso múltiplo ou definitivo",then:"Prefira moldeira aberta"}],crises:[]},
    "imp_instalar_coroa_protocolo":{title:"Instalar Coroa Unitária",free:false,steps:["Remova o provisório, cicatrizador ou cilindro de proteção","Limpe a plataforma do implante/pilar","Instale a coroa parafusada","Verifique contatos interproximais com fio dental","Radiografe para verificar adaptação","Ajuste a oclusão com papel carbono","Aplique o torque recomendado","Feche o acesso com Teflon","Sele com resina composta","Polimento final"],errors:["Não radiografar a coroa antes de torquear","Torque insuficiente ou excessivo","Esquecer o Teflon antes da resina"],decisions:[{if:"Contato proximal passivo",then:"Solicite acréscimo de cerâmica ao laboratório"},{if:"Contato muito justo",then:"Desgaste com ponta diamantada"}],crises:[]},
    "imp_carga_imediata_protocolo":{title:"Carga Imediata Provisória — Captura de PT",free:false,steps:["Instale os mini pilares","Parafuse os cilindros provisórios","Posicione a PT perfurada sobre os cilindros","Marque 2mm aquém da oclusal com caneta","Remova os cilindros e corte na marcação com disco de carborundum","Parafuse os cilindros cortados em boca","Una os cilindros à PT com resina acrílica","Aguarde a presa, desparafuse o conjunto","Preencha com acrílico até a cinta","Desgaste excessos (formato ferradura)","Mantenha região interna convexa","Polimento","Parafuse em boca e radiografe"],errors:["Não deixar espaço para resina entre cilindro e PT","Superfície interna côncava","Não radiografar a adaptação final"],decisions:[{if:"Carga imediata",then:"Carga distribuída entre todos os implantes"},{if:"Osseointegração comprometida",then:"Converta para carga tardia"}],crises:[]},
    "imp_afrouxamento_protocolo":{title:"Afrouxamento de Parafuso",free:false,steps:["Remova a resina do acesso com ponta diamantada","Selecione a chave: quadrada 1.3mm / hexagonal 1.2mm / hexagonal 0.9mm","Teste qual encaixa sem folga","Aperte o parafuso","Dê o torque recomendado pelo fabricante","Limpe o acesso","Coloque Teflon e feche com resina"],errors:["Usar chave incorreta ou desgastada","Forçar chave que não encaixa","Não dar o torque correto"],decisions:[{if:"Afrouxou 1 vez",then:"Aperte com torque correto e monitore"},{if:"Afrouxou 2 ou mais vezes",then:"Verifique adaptação da infraestrutura — problema oclusal ou de passividade"}],crises:[]},
    "imp_parafuso_fraturado_protocolo":{title:"Parafuso Fraturado",free:false,steps:["Técnica 1 — Sonda reta: encoste na irregularidade do parafuso e gire anti-horário","Técnica 2 — Chave de fenda: faça canaleta com broca + use chave de fenda","Técnica 3 — Cotonete: só funciona se fraturado acima do nível do mini pilar","Último recurso — Canaleta no mini pilar: use chave de fenda e depois troque o mini pilar"],errors:["Tentar remover sem técnica adequada","Forçar sentido horário","Não proteger a plataforma do implante"],decisions:[{if:"Fratura superficial",then:"Técnica do cotonete ou sonda"},{if:"Fratura profunda",then:"Canaleta no mini pilar + chave de fenda"},{if:"Não conseguiu remover",then:"Encaminhe para especialista em implante"}],crises:[]},
    "imp_fratura_dente_protocolo":{title:"Fratura de Dente em Protocolo",free:false,steps:["Faça retenções com broca esférica na área fraturada","Inclua fio ortodôntico como reforço se necessário (fratura grande)","Acrescente acrílico da cor compatível (66 para dentes / rosa para gengiva)","Aguarde a presa","Remova excessos e acabe","Polimento","Ajuste oclusal"],errors:["Confundir resina autopolimerizável com termopolimerizável","Não fazer retenções mecânicas antes de reparar","Usar acrílico da cor errada"],decisions:[{if:"Fratura pequena",then:"Apenas resina, sem reforço"},{if:"Fratura grande",then:"Inclua fio ortodôntico"},{if:"Dente perdido",then:"Use dente de estoque compatível"}],crises:[]},
    "imp_cimento_extravasado_protocolo":{title:"Remoção de Cimento Extravasado",free:false,steps:["Identifique o excesso (radiografia se necessário)","Use cureta periodontal fina","Remova delicadamente entre gengiva e coroa","Movimentos suaves corono-apicais","Complete com fio dental","Irrigue com água ou clorexidina 0,12%","Verifique radiograficamente","Oriente higienização intensa"],errors:["Usar instrumento muito rígido — arranha o pilar","Deixar cimento remanescente","Não radiografar após remoção"],decisions:[{if:"Cimento superficial",then:"Cureta + fio dental"},{if:"Cimento profundo",then:"Radiografia + ultrassom"},{if:"Inflamação instalada",then:"Clorexidina 0,12% por 7 dias"}],crises:[]},    "ajuste-oclusal":{title:"Ajuste Oclusal",free:true,steps:["Anamnese: dor, clique, travamento, desgaste","Papel carbono fino (8µ) em máxima intercuspidação","Marcar contatos e identificar pontos altos","Desgaste seletivo com broca multilaminada esférica","Papel carbono em lateralidade e protrusão","Ajustar guia canino e anterior","Polir todos os desgastes com borracha abrasiva","Reavaliar em 7–15 dias"],errors:["Desgastar sem papel carbono","Não polir após desgaste","Ajustar sem avaliar DTM associada"],decisions:[{if:"DTM associada",then:"Placa estabilizadora antes do ajuste definitivo"},{if:"Desgaste generalizado",then:"Avaliar bruxismo — placa + reabilitação"}],crises:[]},
    "restauracao-carie":{title:"Restauração Direta (Cárie)",free:true,steps:["Anestesiar (opcional)","Isolamento absoluto ou relativo","Remoção completa da cárie — cureta de dentina + broca carbide em baixa rotação nas paredes. NUNCA ponta diamantada","Condicionamento ácido: esmalte 35–37% (15–30s) + dentina (se adesivo convencional)","Lavar 30s — secar levemente (dentina úmida, não ressecada)","Adesivo: 2 camadas, aplicação ativa 20s cada, fotopolimerizar 20–40s","Resina em incrementos ≤2mm — fotopolimerizar 40s cada (ou bulk-fill até 4mm)","Acabamento: pontas F/FF → discos flexíveis → borrachas abrasivas → pasta óxido de alumínio","Verificar oclusão"],errors:["Usar ponta diamantada para remover cárie","Ressecar a dentina — colapso de colágeno","Incrementos grossos em resina convencional","Não checar oclusão — causa sensibilidade e fratura"],decisions:[{if:"Cavidade grande",then:"Avaliar onlay ou coroa"},{if:"Dente sensível após restauração",then:"Verificar ponto alto antes de qualquer outra hipótese"}],crises:[{label:"Restauração soltou",target:"restauracao-carie"},{label:"Contaminou o adesivo",target:"restauracao-carie"}]},
    "remocao-seletiva":{title:"Remoção Seletiva de Cárie",free:false,steps:["Anestesiar","Isolamento absoluto","RX bite-wing + teste térmico frio antes de iniciar (dor que cessa = reversível; dor >30s = irreversível)","Cavidade profunda (terço interno): remover cárie das paredes, manter dentina coriácea no fundo","Cavidade muito profunda: manter tecido amolecido no fundo — não arriscar exposição","Instrumentos: cureta de dentina (prioridade) → broca de polímero autolimitante → broca carbide baixa rotação","Proteção do fundo: CIV se dentina coriácea / Ca(OH)₂ + CIV ou MTA/Biodentine se tecido amolecido","Restaurar normalmente sobre a proteção"],errors:["Remover toda a cárie em cavidade profunda — expõe a polpa desnecessariamente","Condicionar ácido sobre dentina coriácea ou amolecida mantida — prejudica adesão","Não agendar retorno na técnica stepwise — risco de progressão da cárie"],decisions:[{if:"Dentina coriácea mantida",then:"Apenas CIV como base"},{if:"Tecido amolecido mantido",then:"Ca(OH)₂ + CIV ou MTA/Biodentine"},{if:"Teste frio positivo com dor >30s",then:"Suspeita de pulpite irreversível — reavaliar antes de restaurar"}],crises:[]},
    "protecao-pulpar":{title:"Proteção Pulpar",free:false,steps:["Confirmar vitalidade pulpar — teste frio obrigatório","Isolamento absoluto rigoroso","Hemostasia: algodão seco por 2–3 min. Se não ceder → endodontia","Irrigar com clorexidina 2% ou soro fisiológico — não usar NaOCl concentrado","Secar com bolinhas de algodão — nunca jato de ar","Aplicar MTA ou Biodentine diretamente sobre a exposição","Aguardar presa inicial (15–20 min para MTA)","Base de CIV sobre o MTA","Restauração definitiva em resina","RX de controle + retorno em 30, 90 e 180 dias"],errors:["Capear exposição por cárie com sangramento ativo — indica endodontia","Usar Ca(OH)₂ no lugar do MTA em exposição direta — prognóstico inferior","Aplicar adesivo diretamente sobre a polpa","Não agendar controle — falha pode ser silenciosa"],decisions:[{if:"Exposição acidental por trauma/instrumento + polpa vital",then:"Capeamento direto com MTA"},{if:"Exposição por cárie",then:"Pulpotomia ou endodontia — não capear"},{if:"Sangramento não controlado em 5 min",then:"Endodontia obrigatória"},{if:"Dente assintomático com necrose no RX de controle",then:"Endodontia"}],crises:[]},
    
    
    "restauracao-fratura":{title:"Restauração Direta em Fratura",free:true,steps:["Avaliar extensão da fratura, oclusão e expectativa — fraturas extensas ou dente desvitalizado: considerar pino de fibra","Selecionar cor ANTES do isolamento, com dente hidratado — dentina, esmalte e translúcida","Isolamento absoluto","Bisel em esmalte — se colagem de fragmento: condicionar dente e fragmento","Matriz de silicone ou BRB para guiar anatomia palatina","Ácido fosfórico: 30s esmalte / 15s dentina → lavar → secar","Adesivo: evaporar solvente + fotopolimerizar","Parede palatina com resina translúcida","Estratificar: dentina opaca + esmalte translúcido + flow entre mamelos para efeito incisal","Acabamento: multilaminada → discos → borrachas → espiral + pasta","Checar oclusão em MIC e lateralidade"],errors:["Selecionar cor após isolamento — dente desidratado distorce o resultado","Não fazer bisel — transição visível e frágil","Não estratificar em fraturas extensas — resultado monocromático","Fotopolimerizar sem evaporar o solvente — falha adesiva","Não checar lateralidade — restauração fratura em dias"],decisions:[{if:"Fragmento viável",then:"Colagem direta — ótima estética, menor desgaste"},{if:"Fratura só em esmalte",then:"Resina de opacidade única, sem estratificação"},{if:"Fratura extensa / dente desvitalizado",then:"Pino de fibra antes de restaurar"},{if:"Exposição pulpar",then:"Capeamento com MTA ou endodontia — nunca restaure direto"},{if:"Fratura radicular",then:"Endodontia + avaliar prognóstico"}],crises:[]},
    "pino-fratura":{title:"Cimentação de Pino de Fibra",free:false,steps:["[CONDUTO] Remover guta: Broca Gates preservando 4mm apical → Broca Largo no diâmetro do pino","[CONDUTO] Prova do pino — deve assentar passivamente, nunca forçar","[CONDUTO] Lavar com NaOCl + EDTA 17% → secar com cones de papel","[CONDUTO] Ácido fosfórico 35–37% por 15s → lavar abundantemente → secar com cones de papel","[CONDUTO] Adesivo com microbrush dentro do canal → fotopolimerizar 20s","[PINO] Jatear com óxido de alumínio 50µm (2–3s, 2cm, 45°) → limpar com álcool 70°","[PINO] Silano: aguardar 60s — NÃO SECAR","[PINO] Adesivo no pino → fotopolimerizar 20s","[CIMENTAÇÃO] Resina dual: aplicar dentro do canal com ponteira e no pino → remover excessos → fotopolimerizar 40s por face (mínimo 3 faces)","Construir núcleo em resina composta (incrementos ≤2mm) → restauração direta ou coroa"],errors:[" Remover além de 2/3 da guta — compromete vedamento apical","Não fazer condicionamento ácido","Condicionar >15s — pode sensibilizar","Não jatear o pino — falha adesiva previsível","Soprar ar no silano antes de 60s","Forçar pino sem calibrar — fratura radicular","Usar cimento de fosfato de zinco — usar sempre resina dual"],decisions:[{if:"Canal largo (diâmetro > 1/3 da raiz)",then:"Reembasar pino com resina flow antes de cimentar"},{if:"Estrutura coronária < 50% após núcleo",then:"Não fazer restauração direta → preparo para coroa"},{if:"Canal muito curvo",then:"Pino curto + núcleo longo — nunca force"},{if:"Sem microjato no consultório",then:"Ácido fluorídrico 10% por 60s (apenas pinos com sílica)"}],crises:[]},
    "trocar-rest":{title:"Restauração de Rotina",free:true,steps:["Isolamento absoluto ou relativo","Preparo cavitário — remover cárie e remanescente de restauração antiga","Ácido fosfórico 37%: esmalte 30s / dentina 15s → lavar 30s → secar controlado (dentina levemente úmida)","Primer/bond: aplicação ativa em esmalte e dentina → evaporar solvente → fotopolimerizar","Inserir resina em incrementos oblíquos ≤2mm → fotopolimerizar 40s cada","Acabamento e polimento","Ajuste oclusal final"],errors:["Ressecar a dentina — colapso das fibras de colágeno, falha adesiva","Incrementos grossos >2mm — contração de polimerização excessiva","Não evaporar o solvente do adesivo — falha adesiva","Não checar oclusão — sensibilidade e fratura precoce"],decisions:[{if:"Cavidade extensa (>50% da estrutura perdida)",then:"Avaliar onlay ou coroa"},{if:"Classe II com contato proximal ruim",then:"Usar matriz seccionada + cunha"},{if:"Sensibilidade pós-operatória",then:"Checar ponto alto antes de qualquer outra hipótese"}],crises:[]},
    "acabamento-proximal-restauracao":{title:"Acabamento Proximal em Restauração",free:true,steps:["Identificar exatamente onde o fio trava ou rasga usando fio dental","Confirmar se o problema é excesso/overhang ou apenas contato muito justo","Isolar e garantir boa visualização da região proximal","Se houver excesso leve → iniciar com tira de lixa interproximal fina","Se o contato estiver muito travado ou houver excesso mais rígido → considerar tira metálica serrilhada/diamantada (tipo ContacEZ, GC, Komet, EVA/IPR)","Movimentar a tira com pressão controlada, sem serrar agressivamente o ponto de contato","Se houver degrau maior ou sobrecontorno → usar multilaminada fina ou ponta de acabamento adequada","Reavaliar frequentemente com fio dental durante o ajuste","O fio deve passar com leve resistência, sem ficar frouxo","Após ajuste → realizar acabamento e polimento proximal","Checar presença de impacto alimentar e conforto do paciente"],tip:{text:"Sem tira serrilhada disponível? É possível improvisar usando tira de matriz metálica fina e criando pequenas serrilhas com broca diamantada ou multilaminada.",note:"Use apenas para pequenos excessos e com muito controle, porque o desgaste pode ficar agressivo e abrir o contato rapidamente."},errors:["Desgastar sem localizar exatamente onde o fio trava","Abrir demais o contato proximal","Usar tira serrilhada agressivamente em contato saudável","Ajustar sem repolir — superfície rugosa retém placa e rasga fio","Ignorar excesso subgengival ou cálculo confundindo com contato apertado","Desgastar dente hígido apenas porque o contato é naturalmente justo"],decisions:[{if:"Fio não passa, mas não rasga",then:"Tente técnica de serra, fita dental ou fio PTFE antes de desgastar"},{if:"Fio rasga/desfia no mesmo ponto",then:"Suspeite de overhang, excesso, cálculo ou margem irregular"},{if:"Excesso pequeno e localizado",then:"Tira de lixa interproximal costuma resolver"},{if:"Contato muito travado ou excesso mais resistente",then:"Tira serrilhada/diamantada pode facilitar o desgaste controlado"},{if:"Sobrecontorno grande ou degrau importante",then:"Reanatomização ou troca da restauração pode ser mais previsível"},{if:"Houver impacto alimentar após ajuste",then:"Provavelmente o contato proximal foi aberto demais"}],crises:[]},
    "restauracao-proximal-classe-ii":{title:"Restauração Proximal Classe II em Resina",free:true,steps:["Confirmar extensão da lesão clinicamente e na radiografia, avaliando também o dente adjacente","Anestesia + isolamento absoluto","Remover cárie/restauração antiga de forma conservadora, protegendo o dente vizinho","Fazer pré-cunhamento quando possível","Adaptar matriz seccional, cunha e anel separador","Confirmar adaptação cervical da matriz antes de restaurar","Se o contato remanescente impedir passagem da matriz, aliviar com tira diamantada fina","Realizar protocolo adesivo corretamente: condicionamento, adesivo, evaporação do solvente e fotopolimerização","Construir primeiro a parede proximal, transformando a Classe II em Classe I","Inserir resina em incrementos oblíquos de até 2 mm, fotopolimerizando cada camada","Esculpir anatomia, remover matriz/cunha e checar contato proximal com fio dental","Fazer acabamento, polimento e ajuste oclusal final"],errors:["Matriz mal adaptada na cervical","Contato proximal frouxo","Overhang cervical","Não usar cunha ou anel separador","Incremento grande/horizontal gerando tensão excessiva","Não evaporar solvente do adesivo","Não checar fio dental antes de finalizar","Liberar sem ajuste oclusal"],decisions:[{if:"Contato proximal ficou aberto",then:"Refaça a parede proximal com matriz seccional bem adaptada"},{if:"A matriz não passa pelo contato",then:"Alivie com tira diamantada fina antes de forçar"},{if:"A matriz não adapta na cervical",then:"Reajuste cunha/matriz antes de restaurar"},{if:"O contato ficou frouxo",then:"Provavelmente faltou separação proximal adequada"},{if:"O fio rasga após restauração",then:"Procure overhang ou excesso cervical"},{if:"Cavidade muito extensa/profunda",then:"Avalie onlay ou coroa conforme remanescente"}],crises:[]},
    "ajuste-oclusal-restauracao":{title:"Ajuste Oclusal em Restauração",free:true,steps:["Secar bem os dentes antes de marcar com papel articular/carbono","Marcar a restauração e os dentes vizinhos em máxima intercuspidação (MIC)","Pedir para o paciente fechar leve, sem apertar forte","Se apenas a restauração marcar forte e os dentes vizinhos não tocarem, confirmar hiperoclusão","Se o paciente ainda estiver anestesiado, avaliar visualmente os contatos e reavaliar depois da anestesia quando necessário","Ajustar os pontos altos com broca fina/em acabamento, removendo pouco por vez","Remarcar frequentemente durante o ajuste","Após estabilizar a mordida em MIC, checar lateralidade e protrusão","Remover interferências excêntricas sem destruir anatomia saudável","Se disponível, confirmar equilíbrio dos contatos com shimstock","Polir toda área desgastada","Confirmar conforto do paciente antes de finalizar"],errors:["Desgastar baseado apenas no tamanho da marca do carbono","Pedir mordida forte em restauração recém-feita","Ajustar excessivamente e achatar anatomia oclusal","Ignorar contatos em lateralidade/protrusão","Confiar totalmente na percepção do paciente ainda anestesiado","Não polir após ajuste","Liberar sem remarcar os contatos"],decisions:[{if:"Só a restauração marca forte no carbono",then:"Hiperoclusão praticamente confirmada"},{if:"O desconforto melhora imediatamente após ajuste",then:"A causa era provavelmente contato prematuro"},{if:"A dor continua mesmo após ajuste adequado",then:"Avalie sensibilidade pulpar, trinca ou outra causa"},{if:"A restauração marca em lateralidade/protrusão",then:"Existe interferência dinâmica"},{if:"O paciente ainda está anestesiado",then:"Reavalie depois da anestesia se houver dúvida"}],crises:[]},
    "dessensibilizante":{title:"Dessensibilizante",free:true,steps:["Identificar origem: cervical leve, generalizada ou pós-clareamento","Verificar cárie cervical antes de qualquer aplicação","Profilaxia com taça de borracha + pasta profilática","Aplicar dessensibilizante (Gluma, Admira Protect) ou verniz de flúor 5%","Fotopolimerizar se necessário","Orientar: evitar ácido e frio por 24h","Reavaliar em 14 dias"],errors:["Aplicar sobre cárie não tratada","Não identificar a causa real","Não orientar dieta e hábitos"],decisions:[{if:"Sem melhora em 30 dias",then:"Suspeitar de pulpite — avaliar endodontia"},{if:"Pós-clareamento",then:"Flúor neutro + potássio — intervalo entre sessões"}],crises:[]},
    "recessao-gengival":{title:"Sensibilidade Cervical por Recessão Gengival",free:true,steps:["Confirmar se há recessão gengival, dentina cervical exposta ou raiz exposta","Descartar outras causas: cárie cervical, restauração infiltrada, trinca, hiperoclusão ou dor pulpar","Identificar o gatilho principal: frio, ar, escovação, doce ou toque cervical","Corrigir fatores causais: escovação traumática, escova dura, dieta ácida, refluxo, bruxismo ou trauma oclusal","Orientar dentifrício dessensibilizante de uso contínuo","Se precisar de alívio mais rápido, aplicar dessensibilizante em consultório","Considerar verniz fluoretado, oxalato, nitrato de potássio, adesivo/selante dentinário ou ionômero conforme o caso","Se houver lesão cervical não cariosa com perda de estrutura, restaurar a área cervical","Se houver demanda estética, progressão da recessão ou necessidade de tecido queratinizado, encaminhar para Periodontia","Reavaliar resposta clínica e escalar tratamento apenas se a sensibilidade persistir"],errors:["Tratar toda sensibilidade cervical como “normal”","Aplicar dessensibilizante sem corrigir escovação traumática","Ignorar cárie cervical ou restauração infiltrada","Não investigar hiperoclusão ou bruxismo","Restaurar raiz exposta sem perda real de estrutura","Indicar cirurgia periodontal só por sensibilidade leve","Não orientar uso contínuo do dessensibilizante domiciliar"],decisions:[{if:"Dor curta ao frio/ar e cervical exposta",then:"Provável hipersensibilidade dentinária por recessão"},{if:"Há retração, mas sem cavidade cervical",then:"Comece com controle de causa + dessensibilizante domiciliar"},{if:"Precisa de alívio mais rápido",then:"Aplicar dessensibilizante em consultório"},{if:"Existe lesão cervical com perda de estrutura",then:"Restaurar a cervical"},{if:"Há estética comprometida, recessão progressiva ou pouca faixa de gengiva",then:"Encaminhar para Periodontia"},{if:"Dor persiste, lateja ou aparece sozinha",then:"Não trate como sensibilidade cervical; avaliar pulpite"}],crises:[]},
    "resina-comp":{title:"Troca de Amálgama por Resina",free:true,steps:["Avaliar indicação: cárie secundária, fratura, infiltração ou estética — amálgama íntegro sem sintomas não precisa ser trocado","RX periapical pré-operatório","Isolamento absoluto — obrigatório para conter fragmentos e vapores","Remover amálgama em blocos com broca multilaminada em alta rotação + irrigação abundante + sugador de alta potência","Verificar e remover cárie secundária completamente","Avaliar profundidade — proteção pulpar se necessário","Ácido fosfórico 37%: esmalte 30s / dentina 15s → lavar → secar controlado","Primer/bond: aplicação ativa → evaporar solvente → fotopolimerizar","Resina em incrementos oblíquos ≤2mm → fotopolimerizar 40s cada","Acabamento, polimento e ajuste oclusal"],errors:["Trocar amálgama íntegro sem indicação clínica — desgaste desnecessário","Não usar isolamento absoluto — fragmentos e vapores de mercúrio","Deixar cárie secundária — falha garantida","Não fazer proteção pulpar em cavidade profunda"],decisions:[{if:"Cavidade extensa após remoção",then:"Avaliar onlay ou coroa"},{if:"Amálgama com cárie + cavidade profunda",then:"Proteção pulpar antes de restaurar"},{if:"Amálgama íntegro sem sintomas",then:"Não trocar — orientar o paciente"}],crises:[]},
    "clareamento-consultorio":{title:"Clareamento em Consultório",free:false,steps:["Avaliar cor com escala Vita — fotografar antes e depois de cada sessão","Verificar: dentes vitais, saudáveis, sem cárie ou restaurações extensas no sorriso","Profilaxia para remoção de placa","Aplicar dessensibilizante em gel (ex: Desensibilize KF 2%) por 10 min","Afastador labial + barreira gengival fotopolimerizável cobrindo margem gengival e 0,5mm da superfície dental","Preparar gel clareador (peróxido de hidrogênio 35%) — misturar peróxido + espessante 3:1 por 40s até viscosidade adequada","Aplicar camada fina na face vestibular — aguardar 15 min — remover com sugador","Repetir 3x de 15 min na mesma sessão","Remover barreira gengival → polimento com pasta diamantada + disco de feltro","Orientar: sem corantes por 48h — retorno em 7 dias (total: 3 sessões)"],errors:["Não aplicar dessensibilizante antes — sensibilidade intensa previsível","Não proteger a gengiva — queimadura química","Aplicar em dentes com cárie ou restaurações extensas","Não avisar sobre restaurações — não clareiam junto com o dente","Trocar restaurações antes do clareamento — a cor ainda vai mudar"],decisions:[{if:"Dente escurecido por trauma ou endodontia",then:"Clareamento interno (walking bleach) — protocolo diferente"},{if:"Sensibilidade intensa",then:"Aumentar intervalo entre sessões + dessensibilizante reforçado"},{if:"Restaurações no sorriso",then:"Clarear primeiro, trocar restaurações depois"}],crises:[]},
    "clareamento-caseiro":{title:"Clareamento Caseiro",free:true,steps:["Avaliar cor com escala Vita — fotografar","Verificar: dentes vitais, saudáveis, sem cárie","Moldagem para confecção das moldeiras","Orientar o paciente: aplicar gel de peróxido de carbamida ou hidrogênio 10–22% na moldeira","Usar por 2–4h/dia (ou overnight para 10%) — conforme indicação do fabricante","Duração: 3–4 semanas","Retorno em 14 dias para avaliação e controle de cor","Ao finalizar: polimento profissional + fotografia final"],errors:["Usar concentrações acima de 22% sem supervisão — risco de sensibilidade grave","Não avisar sobre corantes durante o tratamento","Não fazer moldeira individual — gel vaza e queima a gengiva","Não advertir sobre restaurações — não clareiam"],decisions:[{if:"Sensibilidade",then:"Reduzir tempo de uso + dessensibilizante fluoretado pós-aplicação"},{if:"Sem resultado em 2 semanas",then:"Reavaliar — considerar consultório"},{if:"Paciente grávida ou lactante",then:"Contraindicado"}],crises:[]},
    "endo-urgencia":{title:"Urgência Endodôntica",free:true,steps:["Anamnese rápida + RX periapical + teste de vitalidade + percussão","Usar widget de diagnóstico de pulpite acima para orientar a conduta","Anestesia infiltrativa — se não funcionar: intraligamentar ou intrapulpar","Isolamento absoluto","Abertura coronária com broca esférica — acessar a câmara pulpar","Remoção do conteúdo pulpar com lima ou broca — alívio imediato da pressão","Irrigação com soro fisiológico ou NaOCl 1%","Curativo de hidróxido de cálcio ou pellet de algodão seco","Selamento provisório com Cavit ou IRM","Prescrição: ibuprofeno 600mg 8/8h + encaminhar especialista"],errors:["Não fazer RX antes — risco de perfuração","Instrumentar o canal completo — não é papel do clínico geral","Selar com abscesso ativo — drenagem obrigatória antes","Não encaminhar para especialista"],decisions:[{if:"Dor espontânea + teste positivo",then:"Pulpite irreversível — abertura de urgência"},{if:"Sem vitalidade + lesão apical",then:"Necrose — abertura + drenagem"},{if:"Abscesso flutuante",then:"Drenar antes de selar"},{if:"Dente sem condições",then:"Extrair em vez de tratar"}],crises:[]},
    "pulpite-reversivel":{title:"Pulpite Reversível / Fase de Transição",free:true,steps:["Remover o agente causal completamente — cárie, restauração fraturada ou fator irritante","Avaliar se há exposição pulpar","Sem exposição → capeamento indireto com hidróxido de cálcio ou CIV","Exposição pequena e acidental → capeamento direto com MTA ou hidróxido de cálcio","Cimento provisório (TempBond ou ionômero de vidro)","Reavaliação em 1–2 semanas — avaliar sintomas e teste de vitalidade","Sem melhora ou dor espontânea → indicar endodontia — encaminhar especialista","Com melhora completa → restauração definitiva"],errors:["Indicar endodontia sem necessidade — polpa tem potencial de recuperação","Não remover completamente o fator causal — inflamação persiste","Restaurar definitivamente sem reavaliar — pode estar evoluindo silenciosamente","Não informar o paciente que pode precisar de endodontia"],decisions:[{if:"Sem exposição pulpar",then:"Capeamento indireto"},{if:"Exposição pequena acidental",then:"Capeamento direto com MTA"},{if:"Melhora completa em 1–2 semanas",then:"Restauração definitiva"},{if:"Dor persiste ou piora",then:"Pulpite irreversível — encaminhar especialista"},{if:"Dor espontânea noturna",then:"Não esperar — endodontia"}],crises:[]},
    "pulpite-irreversivel":{title:"Pulpite Irreversível — Urgência",free:true,steps:["RX periapical + confirmar diagnóstico","Anestesia — se não funcionar: intraligamentar ou intrapulpar","Acesso à câmara pulpar com broca esférica + Endo-Z","Remover polpa coronária com extirpa nervos — alívio imediato da dor","Irrigação com hipoclorito de sódio 2,5%","Algodão quase seco com formocresol — apenas o suficiente para sentir o cheiro, sem excesso de líquido + cimento provisório (TempBond ou ionômero de vidro)","Ibuprofeno 600mg 6/6h por 3–5 dias","Encaminhar para endodontista — urgência não é tratamento definitivo"],errors:["Não fazer RX — risco de perfuração","Selar com abscesso ativo — drenar antes","Algodão encharcado de formocresol — risco de extravasamento e necrose periapical","Não encaminhar — urgência não é tratamento definitivo"],decisions:[{if:"Abscesso flutuante",then:"Drenar antes de selar"},{if:"Dente irrestaurável",then:"Avaliar extração"},{if:"Alérgico a AINE",then:"Paracetamol 500mg 6/6h"}],crises:[]},
    "medicacao":{title:"Medicação + Retorno",free:true,steps:["Confirmar: dor sem abscesso visível ou fístula","Ibuprofeno 600mg de 8/8h por 3 dias","Se infecção evidente: amoxicilina 500mg 8/8h por 7 dias","Se alergia à penicilina: clindamicina 300mg 8/8h","Se dor muito intensa: adicionar dipirona 1g 6/6h","Agendar endodontia em 24–48h","Orientar: gelo, dieta mole, não morder no dente"],errors:["Antibiótico sem infecção","Não agendar retorno","Dipirona isolada em dor pulpar — insuficiente"],decisions:[{if:"Febre + trismo + edema",then:"Urgência — drenagem cirúrgica ou UPA"},{if:"Paciente grávida",then:"Paracetamol — ibuprofeno contraindicado"}],crises:[]},
    
    
    
    
    "extracao-simples":{title:"Extração Simples",free:true,steps:["Anamnese detalhada","Aferir PA antes de iniciar","Anestesia infiltrativa + bloqueio se necessário","Aguardar 3–5 min","Sindesmotomia com descolador","Luxação: movimentos vestíbulo-linguais progressivos","Rotação suave em raízes cônicas","Avulsão controlada — não torça com fórceps","Curetagem alveolar","Comprimir corticais com os dedos","Compressa de gaze por 30 min","Orientações por escrito"],errors:["Não fazer sindesmotomia","Forçar sem luxar","Ignorar anticoagulante","Não orientar pós-operatório","Não curetejar o alvéolo"],decisions:[{if:"Paciente anticoagulado",then:"Contato com médico — protocolo local de hemostasia"},{if:"Raiz fraturada",then:"Converter para cirúrgica com retalho"},{if:"PA > 180/110",then:"Adiar — controlar PA antes"},{if:"Paciente grávida",then:"Evitar 1º trimestre — se urgência, 2º trimestre é mais seguro"},{if:"Diabético descompensado",then:"Adiar — glicemia > 200 mg/dL aumenta risco de infecção"},{if:"Paciente com bisfosfonato",then:"Não extrair sem protocolo — risco de osteonecrose"},{if:"Dente com abscesso agudo",then:"Drenar primeiro, extrair após antibiótico 48h"},{if:"Raiz muito curva no RX",then:"Luxar com cuidado — alto risco de fratura"},{if:"Paciente muito ansioso",then:"Considerar pré-medicação ansiolítica"}],crises:[{label:"Raiz partiu na extração",target:"extracao-simples"},{label:"Sangramento não para",target:"hemostasia"}]},
    "extracao-cirurgica":{title:"Extração Cirúrgica",free:false,steps:["RX panorâmica + periapical","Anamnese completa + PA","Anestesia: bloqueio + infiltrativa","Incisão: envelope ou triangular","Descolamento mucoperiosteal","Osteotomia com broca cirúrgica COM irrigação","Odontosecção se raízes divergentes","Luxação e extração por partes","Curetagem + irrigação abundante com SF","Sutura: pontos simples ou em X","Compressa + orientações","Prescrição: amoxicilina 500mg + ibuprofeno 600mg"],errors:["RX insuficiente","Retalho mal planejado","Osteotomia sem irrigação — osteonecrose","Não suturar"],decisions:[{if:"Siso vertical",then:"Muitas vezes extração simples"},{if:"Siso horizontal/mesioangular",then:"Cirúrgica com odontosecção"},{if:"Próximo ao nervo alveolar inferior",then:"Tomografia + discutir risco de parestesia"}],crises:[]},
    "hemostasia":{title:"Hemostasia de Urgência",free:true,steps:["Compressão com gaze SECA por 5 min ininterruptos — sem trocar","Avaliar origem do sangramento: alvéolo ou tecido mole?","→ Alvéolo: esponja hemostática absorvível dentro + sutura em X","→ Tecido mole: pressão direta + sutura simples se necessário","Irrigar com SF para visualizar bem a origem","Ácido tranexâmico tópico se disponível","Morder por 30 min — orientar: não cuspir, não bochechar, não usar canudo — deslocam o coágulo","Compressa de gaze gelada externamente — auxilia na vasoconstrição","Verificar histórico de anticoagulante","Orientar: sem líquidos quentes, sem cigarro, sem esforço físico por 24h"],errors:["Trocar gaze a cada minuto — remove o coágulo","Não verificar anticoagulante","Não suturar quando o alvéolo exige","Bochechar com líquido quente"],decisions:[{if:"Sangramento não cede em 30 min",then:"Sutura + encaminhar UPA"},{if:"Anticoagulante oral",then:"Ácido tranexâmico + contato médico"},{if:"Hemofilia",then:"UPA imediatamente"}],crises:[{label:"Sangramento não para",target:"hemostasia"}]},
    "alveolite-seca":{title:"Alveolite Seca",free:true,steps:["Diagnóstico: alvéolo vazio sem coágulo, dor intensa irradiada, halitose — 2–4 dias após extração","Anestesia local — obrigatória, é muito doloroso","Irrigação abundante com SF + clorexidina 0,12%","Curetagem SUAVE para estimular sangramento e formação de novo coágulo","Curativo com Alvogyl ou gaze iodofórmio dentro do alvéolo","Trocar curativo a cada 2–3 dias por 1–2 semanas","Ibuprofeno 600mg 8/8h","Orientar: não fumar, não usar canudo, não cuspir, higiene suave"],errors:["Curetagem agressiva — piora o quadro","Não trocar o curativo — infecção secundária","Não anestesiar antes de trocar o curativo","Não orientar sobre cigarro — principal fator de risco"],decisions:[{if:"Sem melhora em 7 dias",then:"RX para descartar fragmento ósseo"},{if:"Febre associada",then:"Suspeitar de alveolite úmida — antibiótico sistêmico"}],crises:[]},
    "alveolite-umida":{title:"Alveolite Úmida",free:true,steps:["Diagnóstico: alvéolo com tecido necrótico, pus, odor fétido, febre — infecção bacteriana","Anestesia local — obrigatória","Curetagem do tecido necrótico — mais agressiva que na alveolite seca","Irrigação abundante com SF + clorexidina 0,12%","Drenagem do pus se necessário","Amoxicilina 500mg 8/8h por 7 dias + ibuprofeno 600mg 8/8h","Curativo com gaze iodofórmio — trocar a cada 2–3 dias","Retorno em 48h para reavaliação"],errors:["Não prescrever antibiótico — alveolite úmida tem componente infeccioso","Curetagem insuficiente — tecido necrótico deve ser removido","Não drenar o pus se presente","Confundir com alveolite seca — conduta diferente"],decisions:[{if:"Febre alta + trismo + edema",then:"Encaminhar hospital — risco de infecção disseminada"},{if:"Sem melhora em 5 dias com antibiótico",then:"Trocar antibiótico ou encaminhar"}],crises:[]},
    "sutura-tecnica":{title:"Técnica de Sutura",free:true,steps:["Fio: nylon 4-0 (anterior), seda 3-0 (posterior/gengiva)","Porta-agulha no 1/3 posterior da agulha","Entrar perpendicular ao tecido a 3mm da borda","Passar pela borda oposta de dentro para fora","Nó cirúrgico: 2 laçadas + 1 + 1","Bordas coaptadas sem tensão","Ponto em X: alvéolo com sangramento","Remoção: 7 dias anterior, 10 dias posterior"],errors:["Suturar sob tensão — deiscência certa","Nó frouxo — abre no 1° dia","Pontos muito apertados — isquemia"],decisions:[{if:"Retalho tenso",then:"Incisão de alívio periosteal antes de suturar"}],crises:[]},
    "raspagem-supragengival":{title:"Raspagem Supragengival",free:true,steps:["Sondagem periodontal completa (6 pontos por dente)","Índice de sangramento à sondagem","RX periapicais se indicado","Ultrassom: ponta supragengival para remoção de cálculo","Alisamento coronorradicular com curetas Gracey — alisar a superfície radicular e remover biofilme aderido","Polimento com taça de borracha + pasta profilática","Aplicação de flúor","Instrução de higiene personalizada","Retorno em 45–60 dias para reavaliação"],errors:["Não fazer sondagem pré-raspagem","Não reinstruir sobre higiene","Raspagem sem polimento"],decisions:[{if:"Bolsa > 4mm",then:"Encaminhar periodontista"},{if:"Sangramento generalizado",then:"Intensificar higiene + controle semanal"}],crises:[]},
    
    "abscesso-perio":{title:"Abscesso Periodontal",free:true,steps:["Diagnóstico: bolsa periodontal + flutuação + dor à palpação — diferenciar de abscesso periapical","RX periapical + teste de vitalidade pulpar","Anestesia a distância","Drenagem do pus pela bolsa periodontal — se abscesso volumoso ou drenagem insuficiente: pequena incisão","Raspagem e alisamento radicular do sítio — remover biofilme e tártaro como fator causal","Irrigação com clorexidina 0,12%","Antibiótico apenas se comprometimento sistêmico (febre, mal-estar, edema): amoxicilina 500mg 8/8h por 5 dias — alérgico: clindamicina ou azitromicina","Ibuprofeno 600mg 8/8h","Orientar: higiene rigorosa + enxágue com água morna e sal","Retorno em 48h — se não melhora: encaminhar periodontista"],errors:["Confundir com abscesso periapical — conduta completamente diferente","Usar antibiótico sem necessidade sistêmica","Não remover o fator causal — abscesso vai recorrer","Não drenar — antibiótico sozinho não resolve"],decisions:[{if:"Dente vital + bolsa + flutuação",then:"Abscesso periodontal"},{if:"Dente sem vitalidade + lesão apical",then:"Abscesso periapical — endodontia"},{if:"Febre + trismo + edema difuso",then:"Encaminhar hospital"},{if:"Sequelas após tratamento",then:"Cirurgia periodontal — encaminhar periodontista"}],crises:[]},
    
    "alergia-protocolo":{title:"Reação Alérgica / Anafilaxia",free:true,steps:["Interromper agente suspeito IMEDIATAMENTE","Avaliar: leve (urticária, prurido) ou grave (dispneia, edema, hipotensão)?","LEVE: prometazina 25mg IM + observar 30 min","GRAVE — ANAFILAXIA: chamar SAMU 192 AGORA","Adrenalina 1:1000 — 0,3–0,5ml IM na coxa lateral","Deitar com pernas elevadas","O₂ por máscara 5–8 L/min","Repetir adrenalina a cada 5–15 min se não melhorar","Monitorar sinais vitais continuamente"],errors:["Aguardar em anafilaxia — risco de morte","Não ter adrenalina no kit de emergência","Não chamar SAMU"],decisions:[{if:"Urticária localizada sem dispneia",then:"Anti-histamínico IM + observar 30 min"},{if:"Edema de laringe / broncoespasmo",then:"Adrenalina IM + SAMU 192"},{if:"Hipotensão + perda de consciência",then:"Anafilaxia — RCP se necessário + SAMU"}],crises:[{label:"Reação alérgica no consultório",target:"alergia-protocolo"}]},
    "sincope-protocolo":{title:"Síncope (Desmaio)",free:true,steps:["Interromper o procedimento","Deitar em posição supina","Elevar pernas acima do coração (Trendelenburg)","Afrouxar roupas","Verificar respiração e pulso","O₂ por máscara (5 L/min)","Amoníaco aromático se disponível","Aguardar recuperação 1–3 min","SAMU 192 se não recuperar em 3 min"],errors:["Sentar o paciente — piora perfusão cerebral","Dar líquido com paciente inconsciente","Não acionar emergência"],decisions:[{if:"Recuperou em < 3 min",then:"Monitorar 15 min — não continuar procedimento"},{if:"Não recuperou em 3 min",then:"SAMU 192"},{if:"Dor no peito + síncope",then:"IAM suspeito — SAMU + iniciar RCP se necessário"}],crises:[{label:"Paciente desmaiou",target:"sincope-protocolo"}]},
    "infarto-protocolo":{title:"Infarto / Dor no Peito",free:true,steps:["Interromper procedimento imediatamente","SAMU 192 IMEDIATAMENTE","Posição semi-sentada (Fowler)","O₂ por máscara 5–8 L/min","AAS 300mg mastigado (se disponível e sem contraindicação)","Monitorar pulso e respiração a cada 2 min","RCP se parada cardíaca","DEA se disponível","Não deixar o paciente sozinho"],errors:["Não chamar SAMU imediatamente","Deitar paciente com insuficiência respiratória","Não iniciar RCP em parada cardíaca"],decisions:[{if:"Dor típica + sudorese + náusea",then:"IAM provável — SAMU 192 sem hesitar"},{if:"Parada cardíaca",then:"RCP 30:2 + DEA + SAMU"}],crises:[{label:"Dor no peito / Infarto",target:"infarto-protocolo"}]},
    "hipoglicemia-protocolo":{title:"Hipoglicemia",free:true,steps:["Reconhecer: sudorese, palidez, tremor, confusão, taquicardia","Perguntar: diabético? Comeu antes? Tomou insulina?","Consciente: suco de laranja, refrigerante, sachê de mel","Repetir em 15 min se não melhorar","Inconsciente: NÃO dê nada pela boca","Gel de glicose na mucosa gengival","SAMU 192","Glucagon 1mg IM se disponível"],errors:["Dar açúcar a paciente inconsciente — aspiração","Não reconhecer os sinais","Não chamar socorro grave"],decisions:[{if:"Consciente + glicemia > 70",then:"Glicose oral + observar"},{if:"Inconsciente ou < 50",then:"SAMU + glucagon IM"}],crises:[{label:"Paciente em hipoglicemia",target:"hipoglicemia-protocolo"}]},
    "hipertensao-protocolo":{title:"Crise Hipertensiva",free:true,steps:["Sempre aferir PA antes de iniciar","PA > 180/110: suspender procedimento eletivo","Ambiente calmo, paciente sentado confortavelmente","Identificar causa: dor, ansiedade, medicação esquecida","Analgesia se dor for causa","PA > 180/110 sem melhora em 15 min: SAMU 192","Não use vasoconstritor se PA > 200/120"],errors:["Não aferir PA","Usar vasoconstritor em PA muito alta","Cirurgia eletiva em hipertenso descompensado"],decisions:[{if:"PA 140–180 / 90–110",then:"Vasoconstritor com cautela — máx 2 tubetes"},{if:"PA > 180/110",then:"Adiar + encaminhar médico"},{if:"PA > 200/120 + cefaleia intensa",then:"SAMU — urgência hipertensiva"}],crises:[{label:"Crise hipertensiva",target:"hipertensao-protocolo"}]},
    "corpo-estranho":{title:"Corpo Estranho Engolido",free:true,steps:["Manter calma — maioria passa espontaneamente","Diferenciar: deglutiu (esôfago) ou aspirou (pulmão)?","SE ASPIROU: tosse, cianose, dispneia — SAMU 192","SE deglutiu e assintomático: pronto-socorro para RX","Documentar: objeto, tamanho, material, bordas","Objetos pontiagudos ou > 2,5cm: endoscopia urgente","Orientar: observar fezes 4–7 dias","NÃO induza vômito"],errors:["Confundir deglutição com aspiração","Não encaminhar para imagem","Induzir vômito"],decisions:[{if:"Aspirou (tosse + dispneia)",then:"SAMU — emergência respiratória"},{if:"Lima endodôntica deglutida",then:"RX + gastroenterologista urgente"}],crises:[{label:"Paciente engoliu instrumento",target:"corpo-estranho"}]},
    "epilepsia-protocolo":{title:"Crise Epiléptica",free:true,steps:["Interromper procedimento","Afastar instrumentos e mobiliário","Deitar no chão com proteção para a cabeça","NÃO segurar o paciente","NÃO coloque nada na boca","Posição lateral de recuperação após a crise","Cronometrar duração da crise","Se > 5 min: SAMU 192 — status epiléptico"],errors:["Segurar o paciente — fraturas","Colocar objeto na boca — mito, causa lesão","Não chamar socorro se > 5 min"],decisions:[{if:"Crise < 5 min e autolimitada",then:"Posição lateral + observar"},{if:"> 5 min",then:"Midazolam IM + SAMU 192"}],crises:[{label:"Paciente com convulsão",target:"epilepsia-protocolo"}]},
    "avaliacao-fratura-radicular":{title:"Avalia\u00e7\u00e3o de Fratura Radicular",free:true,steps:["Suspeite quando houver dor localizada ao mastigar, dor ao soltar a mordida, f\u00edstula recorrente ou desconforto que n\u00e3o fecha diagn\u00f3stico.","Fa\u00e7a teste de mordida seletiva: dor em uma c\u00faspide ou ao aliviar a press\u00e3o aumenta suspeita de trinca/fratura.","Sonde o dente inteiro: bolsa estreita, profunda e isolada em uma face \u00e9 sinal forte de fratura radicular.","Fa\u00e7a RX periapical em angula\u00e7\u00f5es diferentes.","Procure sinais indiretos: perda \u00f3ssea vertical localizada, les\u00e3o lateral na raiz, espessamento do ligamento periodontal ou les\u00e3o em \u201cJ\u201d.","Cruze os achados: dor localizada + bolsa isolada + altera\u00e7\u00e3o radiogr\u00e1fica = progn\u00f3stico ruim at\u00e9 prova em contr\u00e1rio.","Se a suspeita for forte, n\u00e3o fa\u00e7a tratamento definitivo. Explique ao paciente e confirme com tomografia ou encaminhamento.","Se a fratura vertical for confirmada, considere o dente de progn\u00f3stico desfavor\u00e1vel."],errors:["Tratar toda dor ao mastigar como ponto alto.","Ignorar bolsa profunda localizada.","Esperar ver a linha de fratura no RX.","Fazer endodontia, restaura\u00e7\u00e3o ou coroa em dente com sinais fortes de fratura.","Prometer que o dente ser\u00e1 mantido antes de fechar o diagn\u00f3stico.","Confundir melhora tempor\u00e1ria da dor com resolu\u00e7\u00e3o do problema."],decisions:[{if:"D\u00f3i ao morder e principalmente ao soltar",then:"Suspeite de trinca/fratura."},{if:"Existe bolsa profunda isolada em uma face",then:"Fratura radicular \u00e9 hip\u00f3tese forte."},{if:"H\u00e1 f\u00edstula recorrente no mesmo dente",then:"Procure fratura antes de repetir tratamento."},{if:"RX mostra les\u00e3o lateral ou perda \u00f3ssea em \u201cJ\u201d",then:"Progn\u00f3stico tende a ser desfavor\u00e1vel."},{if:"S\u00f3 h\u00e1 dor difusa, sem bolsa e sem altera\u00e7\u00e3o radiogr\u00e1fica",then:"Investigue oclus\u00e3o, pulpite, trinca coron\u00e1ria ou periodontal antes de condenar o dente."},{if:"Dois ou mais sinais fortes aparecem juntos",then:"N\u00e3o trate como caso simples."},{if:"Fratura vertical for confirmada",then:"Indicar exodontia ou encaminhar para confirma\u00e7\u00e3o/planejamento."}],crises:[]},
    "aumento-coroa-clinica":{title:"Aumento de Coroa Cl\u00ednica",free:false,steps:["Confirme a indica\u00e7\u00e3o: margem subgengival, c\u00e1rie profunda, fratura coron\u00e1ria ou pouca estrutura para reten\u00e7\u00e3o de coroa.","Fa\u00e7a RX periapical antes de iniciar: avalie crista \u00f3ssea, comprimento radicular, suporte periodontal e propor\u00e7\u00e3o coroa/raiz.","Anestesie a regi\u00e3o.","Sonde a margem do defeito/preparo e a dist\u00e2ncia at\u00e9 a crista \u00f3ssea.","Marque a quantidade de tecido que precisa ser removida para expor estrutura saud\u00e1vel.","Fa\u00e7a incis\u00e3o em bisel interno conforme a quantidade de gengiva queratinizada dispon\u00edvel.","Descole retalho se precisar acessar a crista \u00f3ssea.","Remova tecido gengival em excesso e exponha a margem cl\u00ednica.","Fa\u00e7a osteotomia/osteoplastia quando a crista \u00f3ssea estiver muito pr\u00f3xima da futura margem restauradora.","Mantenha dist\u00e2ncia adequada entre margem restauradora e crista \u00f3ssea para preservar o espa\u00e7o biol\u00f3gico.","Regularize o osso e confira se h\u00e1 estrutura dental suficiente exposta.","Reposicione o retalho sem tens\u00e3o.","Suture com pontos simples.","Fa\u00e7a hemostasia e oriente higiene, alimenta\u00e7\u00e3o e cuidados p\u00f3s-operat\u00f3rios.","Aguarde cicatriza\u00e7\u00e3o antes de moldar ou finalizar a restaura\u00e7\u00e3o definitiva."],errors:["Fazer s\u00f3 gengivectomia quando o problema \u00e9 \u00f3sseo.","Remover gengiva sem avaliar a crista \u00f3ssea.","Invadir espa\u00e7o biol\u00f3gico.","Expor pouca estrutura e ainda assim tentar fazer coroa.","Deixar margem restauradora muito pr\u00f3xima do osso.","Ignorar propor\u00e7\u00e3o coroa/raiz.","Fazer em dente com fratura radicular ou progn\u00f3stico ruim.","N\u00e3o considerar est\u00e9tica em dentes anteriores.","Moldar ou cimentar definitivo antes da cicatriza\u00e7\u00e3o adequada."],decisions:[{if:"A margem est\u00e1 subgengival, mas a crista \u00f3ssea est\u00e1 distante",then:"Gengivectomia pode resolver."},{if:"A crista \u00f3ssea est\u00e1 pr\u00f3xima da margem",then:"Precisa osteotomia/osteoplastia."},{if:"N\u00e3o h\u00e1 gengiva queratinizada suficiente",then:"Evite gengivectomia agressiva; prefira retalho."},{if:"O dente ficar\u00e1 com raiz curta ou mobilidade ap\u00f3s a cirurgia",then:"Progn\u00f3stico ruim; reavalie indica\u00e7\u00e3o."},{if:"For regi\u00e3o anterior est\u00e9tica",then:"Cuidado com assimetria gengival e exposi\u00e7\u00e3o radicular."},{if:"Houver fratura radicular vertical",then:"Aumento de coroa cl\u00ednica n\u00e3o resolve."},{if:"Ap\u00f3s a cirurgia ainda n\u00e3o houver estrutura suficiente para f\u00e9rula",then:"N\u00e3o force coroa; reavalie planejamento."},{if:"Houver sangramento ou inflama\u00e7\u00e3o ativa",then:"Controle tecido antes de moldagem definitiva."}],crises:[]},
    "drenagem-abscesso":{"title":"Drenagem de Abscesso","free":true,"steps":["Avalie gravidade: febre, mal-estar, trismo, disfagia, dispneia, edema difuso, assoalho de boca elevado ou evolução rápida.","Identifique a origem com exame clínico e RX: periapical, periodontal, pericoronarite ou outro foco.","Verifique se há flutuação. Se não houver ponto de drenagem, não incise à toa.","Anestesie à distância ou por bloqueio regional. Não injete no centro do abscesso.","Faça antissepsia, incise na maior área de flutuação e, quando possível, prefira acesso intraoral.","Faça divulsão romba suave, drene sem esmagar tecido e irrigue com soro fisiológico.","Se houver loja maior ou drenagem contínua, considere dreno e retorno breve.","Controle a causa quando possível: acesso endodôntico, exodontia, raspagem periodontal ou remoção do fator causal.","Prescreva quando houver sinais sistêmicos, edema difuso, celulite, imunossupressão, trismo, risco de disseminação ou impossibilidade de controlar a causa.","Oriente sinais de alerta e retorno em 24-48h."],"errors":["Anestesiar no centro do abscesso.","Incisar edema duro sem flutuação.","Drenar e não tratar a causa.","Achar que antibiótico sozinho resolve abscesso com pus.","Prescrever antibiótico para todo abscesso localizado sem critério.","Não diferenciar abscesso periodontal de periapical.","Não irrigar após drenagem.","Mandar para casa paciente com febre, trismo importante, disfagia ou edema difuso."],"decisions":[{"if":"Há flutuação localizada","then":"Drenar."},{"if":"Há edema duro, difuso e sem flutuação","then":"Não incisar à toa; medicar se indicado e reavaliar/encaminhar."},{"if":"O dente está sem vitalidade e há lesão apical","then":"Pense em abscesso periapical."},{"if":"O dente está vital e há bolsa profunda localizada","then":"Pense em abscesso periodontal."},{"if":"É abscesso periodontal","then":"Drenar pela bolsa quando possível e remover cálculo/biofilme do sítio."},{"if":"É abscesso periapical","then":"Controlar a origem com endodontia ou exodontia conforme prognóstico."},{"if":"Há febre, mal-estar, edema difuso, trismo ou risco de disseminação","then":"Abrir prescrição e acompanhar de perto."},{"if":"Há disfagia, dispneia, assoalho de boca elevado ou evolução rápida","then":"Encaminhar para urgência hospitalar."},{"if":"Não consegue anestesiar bem no local","then":"Faça bloqueio regional ou anestesia à distância."},{"if":"Drenou, mas não tratou a causa","then":"O abscesso tende a voltar."},{"if":"Não melhorar em 24-48h","then":"Reavaliar origem, drenagem, antibiótico e necessidade de encaminhamento."}],"crises":[]},
    "infeccao-odontogenica-sinais-sistemicos":{"title":"Infecção Odontogênica com Sinais Sistêmicos","free":true,"steps":["Avalie gravidade: febre, mal-estar, prostração, edema difuso, celulite, trismo, disfagia, dispneia, voz alterada ou evolução rápida.","Aferir sinais vitais: PA, frequência cardíaca, temperatura e saturação, se disponível.","Identifique a origem com exame clínico e RX: periapical, periodontal, pericoronarite, pós-operatório ou outro foco.","Verifique se há flutuação ou ponto de drenagem.","Se houver drenagem possível e o paciente estiver estável, drene e controle a causa quando possível.","Controle a origem: acesso endodôntico, exodontia, raspagem periodontal ou remoção do fator causal, conforme o caso.","Abra prescrição para infecção odontogênica com sinais sistêmicos conforme perfil do paciente.","Oriente retorno em 24-48h para reavaliação obrigatória.","Se houver sinal de risco de via aérea, disseminação profunda ou paciente muito debilitado, não tente resolver no consultório: encaminhe para urgência hospitalar."],"errors":["Achar que antibiótico sozinho resolve infecção odontogênica.","Prescrever e não controlar a causa.","Drenar sem avaliar gravidade sistêmica.","Mandar para casa paciente com trismo importante, disfagia, dispneia ou edema difuso progressivo.","Ignorar assoalho de boca elevado.","Não diferenciar abscesso localizado de celulite disseminada.","Adiar encaminhamento quando há risco de via aérea.","Não marcar retorno curto."],"decisions":[{"if":"Há febre, mal-estar ou prostração","then":"Tratar como infecção com comprometimento sistêmico."},{"if":"Há flutuação e o paciente está estável","then":"Drenar e controlar a causa."},{"if":"Não há flutuação, mas há edema difuso/celulite","then":"Prescrição, controle da causa quando possível e reavaliação curta."},{"if":"Há trismo importante","then":"Risco de disseminação; avaliar encaminhamento."},{"if":"Há disfagia, dispneia, voz abafada, sialorreia ou assoalho de boca elevado","then":"Encaminhar urgência hospitalar."},{"if":"O edema está crescendo rápido","then":"Encaminhar urgência hospitalar."},{"if":"O paciente é imunossuprimido, diabético descompensado, idoso frágil ou tem comorbidade importante","then":"Baixar limiar para encaminhar."},{"if":"Drenou, mas não controlou a causa","then":"A infecção tende a voltar."},{"if":"Não houver melhora em 24-48h","then":"Reavaliar origem, drenagem, prescrição e necessidade de encaminhamento."},{"if":"Houver piora mesmo com prescrição","then":"Encaminhar."}],"crises":[]},
    "remocao-espicula-ossea":{"title":"Remoção/Regularização de Espícula Óssea","free":true,"steps":["Avalie a queixa: dor ao tocar, sensação de “osso espetando”, trauma na mucosa ou dificuldade de cicatrização.","Examine a região e diferencie espícula solta, borda óssea fixa, sequestro ósseo, alveolite ou infecção.","Faça RX se houver dúvida sobre fragmento, raiz residual, sequestro ou alteração óssea maior.","Anestesie a região.","Se a espícula estiver superficial e móvel, remova com pinça clínica, cureta ou pinça hemostática.","Se for borda óssea fixa e cortante, descole tecido apenas o necessário para expor a área.","Regularize a ponta óssea com lima óssea, rongeur ou broca cirúrgica com irrigação abundante.","Passe o dedo ou instrumento sobre a região para confirmar que não há ponta cortante.","Irrigue com soro fisiológico.","Se houve retalho ou tecido móvel, suture sem tensão.","Oriente higiene local, alimentação macia e retorno se houver dor crescente, secreção, febre ou piora do edema.","Se houver suspeita de osteonecrose, exposição óssea persistente, uso de bisfosfonato/anti-reabsortivo ou radioterapia prévia, não trate como espícula simples; encaminhe ou planeje com cautela."],"errors":["Mexer no alvéolo em cicatrização sem indicação.","Confundir espícula pequena com alveolite.","Remover osso demais.","Usar broca sem irrigação.","Deixar borda cortante após regularizar.","Ignorar raiz residual ou sequestro ósseo.","Fechar tecido sob tensão.","Prometer cicatrização imediata em área traumática ou inflamada."],"decisions":[{"if":"É espícula pequena, superficial e móvel","then":"Remova de forma simples."},{"if":"É borda óssea fixa e cortante","then":"Regularize com acesso mínimo."},{"if":"Há dor intensa, mau odor e alvéolo vazio","then":"Pense em alveolite, não só espícula."},{"if":"Há secreção, edema progressivo ou febre","then":"Investigue infecção."},{"if":"Há suspeita de raiz residual ou fragmento profundo","then":"Faça RX antes de remover."},{"if":"A mucosa está muito inflamada ou ulcerada","then":"Remova o trauma e acompanhe cicatrização."},{"if":"A área é extensa ou próxima de estrutura nobre","then":"Encaminhe ou planeje abordagem cirúrgica."},{"if":"Não há dor nem trauma, apenas pequena irregularidade em cicatrização","then":"Indicado fazer acompanhamento."}],"crises":[]},
    "nova-protese-total":{"title":"Confecção de Nova Prótese Total","free":false,"steps":["[Consulta 1 - Moldagem anatômica] Avalie rebordo, mucosa, inserções musculares, saliva, prótese antiga e queixa principal.","[Consulta 1 - Moldagem anatômica] Se houver mucosa machucada ou inflamada, trate antes de moldar.","[Consulta 1 - Moldagem anatômica] Faça moldagem anatômica com alginato.","[Consulta 1 - Moldagem anatômica] Confira se copiou fundo de sulco, freios, rebordo, tuberosidades e região retromolar.","[Consulta 1 - Moldagem anatômica] Envie ao laboratório para confecção da moldeira individual.","[Consulta 2 - Moldagem funcional] Prove a moldeira individual em boca.","[Consulta 2 - Moldagem funcional] Alivie freios, fundo de sulco e áreas de sobreextensão.","[Consulta 2 - Moldagem funcional] Faça selado periférico com godiva ou material indicado.","[Consulta 2 - Moldagem funcional] Faça moldagem funcional com silicone leve ou pasta zinco-enólica.","[Consulta 2 - Moldagem funcional] Confira bordas, estabilidade e área de suporte antes de enviar ao laboratório.","[Consulta 3 - Registro com rodete] Prove a base de prova e confira estabilidade.","[Consulta 3 - Registro com rodete] Ajuste o rodete superior: suporte labial, linha média, linha do sorriso, plano oclusal e corredor bucal.","[Consulta 3 - Registro com rodete] Ajuste DVO e registre relação cêntrica.","[Consulta 3 - Registro com rodete] Escolha cor, formato e tamanho dos dentes com o paciente.","[Consulta 3 - Registro com rodete] Envie ao laboratório para montagem dos dentes.","[Consulta 4 - Prova dos dentes] Avalie estética: linha média, sorriso, suporte labial, exposição dentária e corredor bucal.","[Consulta 4 - Prova dos dentes] Avalie fonética, DVO, relação cêntrica e oclusão.","[Consulta 4 - Prova dos dentes] Mostre ao paciente e confirme aprovação estética.","[Consulta 4 - Prova dos dentes] Se houver dúvida estética, fonética ou oclusal, não aprove.","[Consulta 4 - Prova dos dentes] Se estiver correto, envie para acrilização.","[Consulta 5 - Instalação e ajuste] Instale a prótese e avalie retenção, estabilidade, adaptação e conforto.","[Consulta 5 - Instalação e ajuste] Verifique oclusão em relação cêntrica e movimentos mandibulares.","[Consulta 5 - Instalação e ajuste] Ajuste pontos de pressão com pasta evidenciadora.","[Consulta 5 - Instalação e ajuste] Oriente uso progressivo, higiene, remoção para dormir e cuidados com a prótese.","[Consulta 5 - Instalação e ajuste] Marque retorno para ajustes."],"errors":["Moldar com mucosa inflamada ou machucada.","Não fazer moldeira individual.","Pular selado periférico.","Fazer moldagem funcional com moldeira instável.","Registrar DVO errada.","Registrar relação cêntrica duvidosa.","Aprovar prova de dentes com estética, fonética ou oclusão ruins.","Acrilizar sem aprovação clara do paciente.","Instalar sem ajuste oclusal.","Não marcar retorno pós-instalação."],"decisions":[{"if":"A mucosa está machucada ou inflamada","then":"Trate antes de iniciar a moldagem."},{"if":"A moldagem anatômica não copiou áreas importantes","then":"Refaça."},{"if":"A moldeira individual está instável","then":"Ajuste antes da moldagem funcional."},{"if":"O selado periférico ficou curto","then":"A prótese tende a perder retenção."},{"if":"O selado periférico ficou sobreestendido","then":"A prótese tende a machucar ou deslocar."},{"if":"A DVO parece alta","then":"Procure fala travada, dificuldade de fechar e excesso de exposição dentária."},{"if":"A DVO parece baixa","then":"Procure face colapsada, pouco suporte labial e queilite angular."},{"if":"A relação cêntrica ficou duvidosa","then":"Registre novamente."},{"if":"O paciente não aprovou a estética na prova","then":"Não acrilize."},{"if":"A prótese fica solta logo na entrega","then":"Reavalie bordas, selado periférico, adaptação e oclusão."}],"crises":[]},
    "nova-pprg":{"title":"Confecção de Nova PPRG","free":false,"steps":["[Consulta 1 - Avaliação e moldagem] Avalie dentes pilares, rebordo, mucosa, espaço protético e oclusão.","[Consulta 1 - Avaliação e moldagem] Identifique cárie, mobilidade, restaurações ruins ou necessidade de preparo nos pilares.","[Consulta 1 - Avaliação e moldagem] Prepare nichos, planos-guia e ajustes necessários nos dentes pilares.","[Consulta 1 - Avaliação e moldagem] Faça moldagem com alginato copiando bem pilares, nichos, rebordo e fundo de sulco.","[Consulta 1 - Avaliação e moldagem] Ao enviar o modelo, envie em gesso especial tipo IV.","[Consulta 1 - Avaliação e moldagem] Envie ao laboratório com planejamento da estrutura: apoios, grampos e selas.","[Consulta 2 - Prova da estrutura metálica] Prove a estrutura sem forçar.","[Consulta 2 - Prova da estrutura metálica] Confira assentamento dos apoios, passividade, estabilidade e retenção dos grampos.","[Consulta 2 - Prova da estrutura metálica] Se a estrutura não assenta ou fica elevada, não siga para montagem.","[Consulta 3 - Registro e montagem] Com a estrutura assentada, adapte o rodete.","[Consulta 3 - Registro e montagem] Registre DVO e relação cêntrica quando necessário.","[Consulta 3 - Registro e montagem] Escolha cor, formato e tamanho dos dentes.","[Consulta 3 - Registro e montagem] Envie para montagem dos dentes.","[Consulta 4 - Prova dos dentes] Avalie estética, fonética, DVO, relação cêntrica e oclusão.","[Consulta 4 - Prova dos dentes] Confirme aprovação do paciente.","[Consulta 4 - Prova dos dentes] Se houver dúvida, não acrilize.","[Consulta 5 - Instalação] Instale a PPRG e confira assentamento dos apoios.","[Consulta 5 - Instalação] Avalie retenção, estabilidade, conforto e oclusão.","[Consulta 5 - Instalação] Ajuste pontos de pressão e grampos apenas quando necessário.","[Consulta 5 - Instalação] Oriente inserção, remoção, higiene e retorno."],"errors":["Fazer PPRG sem avaliar dentes pilares.","Não preparar nichos e planos-guia.","Moldar sem copiar bem pilares, apoios e rebordo.","Forçar estrutura metálica que não assenta.","Seguir para montagem com apoio elevado.","Apertar grampo na conexão com a estrutura.","Acrilizar sem aprovação estética e funcional.","Instalar sem checar oclusão."],"decisions":[{"if":"O dente pilar tem mobilidade, cárie ou restauração ruim","then":"Trate antes da PPRG."},{"if":"Não há nicho adequado","then":"Prepare antes da moldagem de trabalho."},{"if":"A estrutura não assenta passivamente","then":"Não siga para montagem."},{"if":"O apoio fica elevado","then":"Ajuste ou devolva ao laboratório."},{"if":"O grampo machuca","then":"Confira primeiro se a estrutura assentou totalmente."},{"if":"O grampo está frouxo","then":"Ajuste na ponta ativa, nunca na conexão."},{"if":"A estética não agradou","then":"Não acrilize."},{"if":"A PPRG desloca ao mastigar","then":"Reavalie apoio, retenção, extensão da sela e oclusão."}],"crises":[]}
  },
  panicItems:[
    {id:"pi1",label:"Pino soltou",protocol:"pino-nucleo"},
    {id:"pi2",label:"Restauração fraturou",protocol:"restauracao-carie"},
    {id:"pi3",label:"Contaminou o adesivo",protocol:"restauracao-carie"},
    {id:"pi4",label:"Sangramento não para",protocol:"hemostasia"},
    {id:"pi5",label:"Paciente desmaiou",protocol:"sincope-protocolo"},    {id:"pi7",label:"Raiz partiu na extração",protocol:"extracao-simples"},
    {id:"pi8",label:"Crise alérgica no consultório",protocol:"alergia-protocolo"},
    {id:"pi9",label:"Paciente engoliu instrumento",protocol:"corpo-estranho"},
    {id:"pi10",label:"Crise hipertensiva",protocol:"hipertensao-protocolo"},
    {id:"pi11",label:"Dente errado extraído",protocol:"extracao-simples"},    {id:"pi13",label:"Crise epiléptica",protocol:"epilepsia-protocolo"},
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

const ANESTESICOS_AVISO = `Este conteúdo é uma referência clínica de apoio. Antes de anestesiar, confirme anamnese, alergias, pressão arterial, condição sistêmica, medicamentos em uso, peso do paciente e quantidade total de tubetes.

A escolha final é responsabilidade exclusiva do profissional habilitado.`;
const ANESTESICOS_AVISO_HTML = `<span class="protocol-inline-icon"><i class="ti ti-shield-check"></i></span><span>${ANESTESICOS_AVISO.replace(/\n/g, "<br>")}</span>`;

const ANESTESICOS_LIST = [
  {id:"odontopediatria", label:"Odontopediatria", icon:'<i class="ti ti-baby-bottle"></i>', free:false},
  {id:"gestantes-lactantes", label:"Gestantes e lactantes", icon:'<i class="ti ti-baby-carriage"></i>', free:false},
  {id:"idosos", label:"Idosos", icon:'<i class="ti ti-user-heart"></i>', free:false},
  {id:"cardiopatas", label:"Cardiopatas", icon:'<i class="ti ti-heartbeat"></i>', free:false},
  {id:"diabeticos", label:"Diabéticos", icon:'<i class="ti ti-vaccine"></i>', free:false},
  {id:"asmaticos", label:"Asmáticos", icon:'<i class="ti ti-lungs"></i>', free:false},
  {id:"epilepticos", label:"Epilépticos", icon:'<i class="ti ti-brain"></i>', free:false},
  {id:"coagulopatas", label:"Coagulopatas", icon:'<i class="ti ti-droplet"></i>', free:false},
  {id:"hepatopatas", label:"Hepatopatas", icon:'<i class="ti ti-flask"></i>', free:false},
  {id:"nefropatas", label:"Nefropatas", icon:'<i class="ti ti-medical-cross"></i>', free:false},
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

const ANESTESICOS_DATA = {
  "odontopediatria": {
    titulo: "Odontopediatria",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Biopressin, Citocaína.",
        "Lidocaína com vasoconstrictor: Lidocaína."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Calcule a quantidade total pelo peso da criança.",
        "Considere idade, comportamento, procedimento e tempo de anestesia esperado.",
        "Oriente o responsável sobre risco de mordedura de lábio, bochecha ou língua após o atendimento."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Evitar excesso de tubetes.",
        "Cuidado com anestesia prolongada de tecido mole.",
        "Cuidado em crianças muito pequenas ou com histórico médico relevante."
      ]},
    ]
  },

  "gestantes-lactantes": {
    titulo: "Gestantes e lactantes",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Lidocaína 2% com adrenalina 1:100.000: Xilocaína®, Lidocaína® 2% Adrenalina."
      ]},
      {secao:"Recomendações", itens:[
        "Evitar o uso de Prilocaína (Citanest®, Biopressin®) e Fenilefrina (vasoconstrictor do Novocol®), pois são tóxicos ao feto e ao recém-nascido.",
        "Contactar sempre o Obstetra da paciente."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Confirmar trimestre gestacional, pressão arterial e histórico de risco obstétrico.",
        "Em caso complexo, entrar em contato com o obstetra."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Cuidado em gestantes hipertensas, com pré-eclâmpsia ou gestação de risco.",
        "Não deixar dor ou infecção sem tratamento apenas por medo da gestação."
      ]},
    ]
  },

  "idosos": {
    titulo: "Idosos",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Lidocaína 2% com vasoconstrictor - adrenalina 1:100.000: Xilocaína, Lidocaína com adrenalina.",
        "Mepivacaína 2% com adrenalina (1:100.000): Mepivacaína 2%."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Avaliar pressão arterial, cardiopatias, diabetes, polifarmácia e fragilidade do paciente.",
        "Fazer aspiração e injeção lenta."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Cuidado com pacientes descompensados ou sem acompanhamento médico.",
        "Evitar excesso de anestésico em procedimentos longos."
      ]},
    ]
  },

  "cardiopatas": {
    titulo: "Cardiopatas",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin.",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine 3%, Scandicaine 3%."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Aferir pressão arterial antes do atendimento.",
        "Confirmar se a condição cardíaca está controlada.",
        "Fazer aspiração obrigatória e injeção lenta."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Evitar atendimento eletivo em cardiopata instável.",
        "Cuidado com excesso de vasoconstrictor.",
        "Se houver dor no peito, falta de ar, mal-estar ou PA muito elevada, adiar e encaminhar."
      ]},
    ]
  },

  "diabeticos": {
    titulo: "Diabéticos",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Confirmar se o paciente se alimentou e usou a medicação corretamente.",
        "Verificar sinais de hipoglicemia antes do procedimento.",
        "Priorizar bom controle da dor para reduzir estresse."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Evitar atendimento se houver sinais de hipoglicemia, mal-estar ou descompensação.",
        "Cuidado com procedimentos longos em paciente em jejum."
      ]},
    ]
  },

  "asmaticos": {
    titulo: "Asmáticos",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Lidocaína 2%, Mepivacaína 2% ou Articaína 4% com epinefrina 1:100.000 ou 1:200.000.",
        "Pacientes alérgicos aos sulfitos: Prilocaína 3% com felipressina 0,03 UI/ml."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Perguntar sobre crise recente, uso de bombinha e alergia a sulfitos.",
        "Manter broncodilatador do paciente acessível durante o atendimento."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Se houver alergia a sulfitos, seguir a opção indicada no material-base.",
        "Adiar atendimento eletivo se houver crise asmática ativa, falta de ar ou chiado no peito."
      ]},
    ]
  },

  "epilepticos": {
    titulo: "Epilépticos",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin.",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine 3%, Scandicaine 3%."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Confirmar controle das crises e uso regular da medicação.",
        "Reduzir estresse, dor e gatilhos durante o atendimento."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Evitar atendimento eletivo se houve crise recente ou descontrole importante.",
        "Não deixar o paciente em jejum prolongado."
      ]},
    ]
  },

  "coagulopatas": {
    titulo: "Coagulopatas",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin.",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine 3%, Scandicaine 3%."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Confirmar diagnóstico, medicações em uso e risco de sangramento.",
        "Planejar técnica anestésica com menor trauma possível."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Cuidado com técnicas profundas em paciente com alto risco de sangramento.",
        "Se houver dúvida sobre segurança, solicitar avaliação médica antes do procedimento eletivo."
      ]},
    ]
  },

  "hepatopatas": {
    titulo: "Hepatopatas",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Prilocaína com vasoconstrictor: Citanest®, Citocaína®, Biopressin®.",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine® 3%, Scandicaine® 3%."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Confirmar grau de comprometimento hepático e medicações em uso.",
        "Evitar excesso de anestésico."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Cuidado em hepatopata grave, descompensado ou sem acompanhamento.",
        "Se houver icterícia, sangramento espontâneo ou sinais sistêmicos importantes, adiar e encaminhar."
      ]},
    ]
  },

  "nefropatas": {
    titulo: "Nefropatas",
    blocos: [
      {secao:"Opções compatíveis com este perfil", itens:[
        "Prilocaína com vasoconstrictor: Citanest, Citocaína, Biopressin.",
        "Mepivacaína 3% sem vasoconstrictor: Mepivacaine® 3%, Scandicaine® 3%."
      ]},
      {secao:"Atenção antes de usar", itens:[
        "Confirmar estágio da doença renal, diálise e medicações em uso.",
        "Verificar pressão arterial e condição geral antes do procedimento."
      ]},
      {secao:"Evitar/cuidado", itens:[
        "Cuidado em paciente renal descompensado.",
        "Se houver mal-estar, PA muito elevada ou dúvida sobre segurança, adiar e encaminhar."
      ]},
    ]
  },
};

const QUICK_CONDUCT_CARDS = {
  "fio-dental-nao-passa": {
    "id": "fio-dental-nao-passa",
    "title": "Fio dental não passa",
    "icon": "<i class=\"ti ti-dental\"></i>",
    "subtitle": "Quando o fio dental não passa, diferencie se é contato proximal muito justo ou alguma irregularidade que está travando, rasgando ou desfiando o fio.",
    "intent": "Ajudar o dentista a identificar se o fio não passa por contato proximal muito justo, excesso de restauração/cimento, cálculo, cárie ou falha de acabamento proximal.",
    "synonyms": [
      "fio dental não passa",
      "fio não passa",
      "fio não entra",
      "fio dental prende",
      "fio dental trava",
      "contato apertado",
      "contato proximal apertado",
      "contato muito justo",
      "ponto de contato forte",
      "fio não passa na restauração",
      "fio não passa na coroa",
      "fio rasga",
      "fio dental rasga",
      "fio dental desfia",
      "excesso de resina",
      "excesso interproximal",
      "overhang",
      "excesso de cimento",
      "contato proximal travado"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando o fio dental não passa, diferencie se é contato proximal muito justo ou alguma irregularidade que está travando, rasgando ou desfiando o fio.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "O fio não passa, mas também não rasga?\n→ Pode ser contato proximal muito justo",
      "O fio rasga ou desfia sempre no mesmo ponto?\n→ Suspeite excesso, degrau, cálculo, cárie ou margem irregular",
      "O problema começou após restauração?\n→ Avalie excesso de resina, sobrecontorno ou acabamento proximal insuficiente",
      "O problema começou após cimentação de coroa?\n→ Procure excesso de cimento ou contato proximal apertado",
      "Há sangramento, cálculo ou inflamação interproximal?\n→ Pode não ser só contato apertado",
      "O fio passa frouxo e o paciente relata alimento prendendo?\n→ Pense em contato proximal aberto"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "acabamento-proximal-restauracao",
        "label": "Excesso, degrau ou acabamento proximal deficiente em restauração? → Acabamento Proximal em Restauração"
      },
      {
        "id": "raspagem-supragengival",
        "label": "Suspeita de cálculo interproximal ou inflamação gengival? → Raspagem Supragengival"
      },
      {
        "id": "coroa-nao-entra",
        "label": "Problema relacionado à coroa que não assenta ou contato proximal da coroa? → Coroa não entra — Ajuste e decisão"
      },
      {
        "id": "restauracao-proximal-classe-ii",
        "label": "Fio passa frouxo ou há impactação alimentar? → Restauração Proximal Classe II em Resina"
      },
      {
        "type": "note",
        "label": "Dente hígido com contato justo, sem rasgar o fio? → Não desgastar estrutura sadia; tente técnica de serra, fita dental ou fio PTFE"
      }
    ],
    "related": []
  },
  "contato-proximal-aberto": {
    "id": "contato-proximal-aberto",
    "title": "Contato proximal ficou aberto",
    "icon": "<i class=\"ti ti-arrows-horizontal\"></i>",
    "subtitle": "Quando o contato proximal fica aberto, diferencie se o problema veio da restauração/coroa ou se já existia por posição dentária, perda de espaço ou movimentação dos dentes.",
    "intent": "Ajudar o dentista a identificar se o contato proximal aberto é consequência de restauração/coroa inadequada ou se está relacionado à posição dentária, perda de espaço, inclinação ou movimentação dos dentes.",
    "synonyms": [
      "contato proximal aberto",
      "contato aberto",
      "ponto de contato aberto",
      "contato ficou frouxo",
      "alimento prendendo",
      "comida prendendo entre os dentes",
      "impactação alimentar",
      "resina sem contato",
      "restauração sem contato",
      "ponto de contato fraco",
      "fio dental passa frouxo",
      "dente sem contato proximal",
      "espaço entre os dentes posteriores"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando o contato proximal fica aberto, diferencie se o problema veio da restauração/coroa ou se já existia por posição dentária, perda de espaço ou movimentação dos dentes.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "O alimento prende sempre no mesmo local?\n→ Suspeite ponto de contato deficiente",
      "O contato abriu depois de uma restauração?\n→ Provável falha na reconstrução proximal",
      "O fio dental passa frouxo demais?\n→ O contato pode estar insuficiente",
      "Há inflamação gengival ou dor local entre os dentes?\n→ Pode haver impactação alimentar recorrente",
      "Os dentes estão inclinados, apinhados ou com espaço antigo?\n→ O problema pode não ser apenas restaurador",
      "Existe perda dentária próxima ou movimentação dos dentes?\n→ Avalie necessidade de ortodontia ou reabilitação"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "restauracao-proximal-classe-ii",
        "label": "Contato aberto após restauração proximal? → Restauração Proximal Classe II em Resina"
      },
      {
        "id": "nova-coroa",
        "label": "Contato aberto associado a coroa mal planejada ou adaptação ruim? → Planejar Nova Coroa"
      },
      {
        "id": "raspagem-supragengival",
        "label": "Alimento prendendo com inflamação gengival local? → Raspagem Supragengival"
      },
      {
        "type": "note",
        "label": "Espaço por inclinação, apinhamento ou movimentação dentária? → Avaliar ortodontia ou reabilitação do espaço"
      },
      {
        "type": "note",
        "label": "Contato abriu após ajuste excessivo? → Refazer anatomia proximal; ajuste simples tende a não resolver"
      }
    ],
    "related": []
  },
  "restauracao-ficou-alta": {
    "id": "restauracao-ficou-alta",
    "title": "Restauração ficou alta",
    "icon": "<i class=\"ti ti-adjustments-horizontal\"></i>",
    "subtitle": "Se o paciente relata que o dente “bate primeiro” ou dói ao mastigar após uma restauração recente, pense primeiro em contato prematuro. Antes de suspeitar de endodontia, marque a oclusão e compare com os dentes vizinhos.",
    "intent": "Ajudar o dentista a confirmar se existe hiperoclusão/contato prematuro após restauração ou se a dor pode ter outra origem, como sensibilidade pulpar, trinca ou inflamação.",
    "synonyms": [
      "restauração alta",
      "paciente mordendo alto",
      "dente bate primeiro",
      "restauração incomodando",
      "dor ao morder após restauração",
      "dor depois da restauração",
      "paciente voltou após restauração",
      "oclusão alta",
      "restauração pegando na mordida",
      "dor ao mastigar após restauração",
      "desconforto ao fechar a boca",
      "restauração recém feita doendo"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Se o paciente relata que o dente “bate primeiro” ou dói ao mastigar após uma restauração recente, pense primeiro em contato prematuro. Antes de suspeitar de endodontia, marque a oclusão e compare com os dentes vizinhos.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A restauração marca forte e os dentes vizinhos quase não tocam?\n→ Hiperoclusão praticamente confirmada",
      "O desconforto começou depois que a anestesia passou?\n→ Cheque oclusão antes de pensar em dor pulpar",
      "A dor aparece principalmente ao morder ou mastigar?\n→ Suspeite ponto alto/interferência oclusal",
      "O ajuste melhora imediatamente o desconforto?\n→ Confirma provável origem oclusal",
      "Há dor espontânea, pulsátil ou persistente mesmo sem mastigar?\n→ Não trate como simples ponto alto; avalie comprometimento pulpar",
      "A dor é localizada em cúspide específica ou aparece ao aliviar a mordida?\n→ Pense também em trinca/fratura"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "ajuste-oclusal-restauracao",
        "label": "Contato prematuro ou restauração alta? → Ajuste Oclusal em Restauração"
      },
      {
        "type": "note",
        "label": "Dor persistente mesmo após ajuste adequado? → Avaliar envolvimento pulpar"
      },
      {
        "id": "pulpite-irreversivel",
        "label": "Dor espontânea, pulsátil ou prolongada? → Pulpite Irreversível — Urgência"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Suspeita de trinca, dor em cúspide específica ou dor ao aliviar a mordida? → Avaliação de fratura radicular / prognóstico desfavorável"
      },
      {
        "id": "trocar-rest",
        "label": "Restauração inadequada, extensa ou mal adaptada? → Restauração de Rotina"
      }
    ],
    "related": []
  },
  "dor-ao-mastigar": {
    "id": "dor-ao-mastigar",
    "title": "Dor ao mastigar",
    "icon": "<i class=\"ti ti-activity\"></i>",
    "subtitle": "Dor localizada ao fechar a boca ou mastigar pode indicar contato alto, trinca, inflamação pulpar ou trauma periodontal/apical. O primeiro passo é separar se a dor aparece ao morder, ao soltar a mordida ou mesmo sem mastigar.",
    "intent": "Ajudar o dentista a identificar se a dor ao mastigar vem de contato prematuro, restauração alta, trinca/fratura, envolvimento pulpar ou inflamação periodontal/apical.",
    "synonyms": [
      "dor ao mastigar",
      "dor ao morder",
      "dói quando mastiga",
      "dor ao fechar a boca",
      "dente dói ao mastigar",
      "dor na mordida",
      "dor quando aperta os dentes",
      "dor ao encostar o dente",
      "dor depois da restauração",
      "dor após restauração",
      "dente sensível ao mastigar",
      "dor na oclusão",
      "dor ao morder comida",
      "paciente sente dor ao mastigar"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Dor localizada ao fechar a boca ou mastigar pode indicar contato alto, trinca, inflamação pulpar ou trauma periodontal/apical. O primeiro passo é separar se a dor aparece ao morder, ao soltar a mordida ou mesmo sem mastigar.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "Começou após restauração recente?\n→ Suspeite contato prematuro ou hiperoclusão",
      "A dor melhora logo após ajuste oclusal?\n→ A origem provavelmente era oclusal",
      "A dor aparece em uma cúspide específica?\n→ Pense em trinca ou fratura",
      "Dói principalmente ao soltar a mordida?\n→ Suspeite fortemente de trinca/fratura",
      "Há dor espontânea, latejante ou que demora a passar?\n→ Avalie envolvimento pulpar",
      "Há percussão positiva, mobilidade ou sensação de “dente crescido”?\n→ Pense em inflamação periodontal/apical"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "ajuste-oclusal-restauracao",
        "label": "Dor ao mastigar após restauração recente ou suspeita de ponto alto? → Ajuste Oclusal em Restauração"
      },
      {
        "id": "pulpite-irreversivel",
        "label": "Dor espontânea, latejante ou persistente ao frio/quente? → Pulpite Irreversível — Urgência"
      },
      {
        "id": "pulpite-reversivel",
        "label": "Dor provocada, sem espontaneidade e com sinais reversíveis? → Pulpite Reversível / Fase de Transição"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Dor em cúspide específica ou ao soltar a mordida? → Avaliação de fratura radicular / prognóstico desfavorável"
      },
      {
        "id": "trocar-rest",
        "label": "Restauração inadequada, infiltrada ou extensa? → Restauração de Rotina"
      }
    ],
    "related": []
  },
  "dente-sensivel": {
    "id": "dente-sensivel",
    "title": "Dente sensível",
    "icon": "<i class=\"ti ti-snowflake\"></i>",
    "subtitle": "Na maioria dos casos, dente sensível está ligado à dentina cervical exposta. Diferencie se a dor é sensibilidade dentinária, efeito pós-restauração, envolvimento pulpar, hiperoclusão ou trinca.",
    "intent": "Ajudar o dentista a diferenciar hipersensibilidade dentinária por dentina cervical exposta, sensibilidade pós-restauração, pulpite, hiperoclusão e trinca, direcionando a primeira conduta.",
    "synonyms": [
      "dente sensível",
      "sensibilidade ao frio",
      "sensibilidade ao gelado",
      "sensibilidade ao doce",
      "sensibilidade ao ar",
      "choque no dente",
      "dor no frio",
      "dor ao tomar água gelada",
      "sensibilidade cervical",
      "retração gengival",
      "raiz exposta",
      "dentina exposta",
      "dentina cervical exposta",
      "exposição dentinária",
      "exposição de dentina",
      "sensibilidade após restauração",
      "sensibilidade depois da restauração",
      "dente doendo no gelado",
      "dente sensível ao mastigar"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Na maioria dos casos, dente sensível está ligado à dentina cervical exposta. Diferencie se a dor é sensibilidade dentinária, efeito pós-restauração, envolvimento pulpar, hiperoclusão ou trinca.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "Existe retração gengival, raiz exposta ou dentina cervical exposta?\n→ Suspeite sensibilidade cervical",
      "A dor é curta e passa rápido?\n→ Pode ser hipersensibilidade dentinária ou pulpite reversível",
      "Começou após restauração recente?\n→ Cheque oclusão, adaptação e profundidade da restauração",
      "Há dor espontânea, noturna ou que demora a passar?\n→ Suspeite pulpite irreversível",
      "Há dor ao morder ou sensação de dente alto?\n→ Avalie hiperoclusão ou contato prematuro",
      "A dor é aguda ao morder e melhora ao abrir?\n→ Pense em trinca/fratura",
      "Há cárie, infiltração ou fratura visível?\n→ Corrija a causa antes de usar dessensibilizante"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "recessao-gengival",
        "label": "Sensibilidade cervical com recessão, raiz exposta ou dentina cervical exposta? → Sensibilidade Cervical por Recessão Gengival"
      },
      {
        "id": "dessensibilizante",
        "label": "Dor curta ao frio/ar/doce, sem sinais de pulpite irreversível? → Dessensibilizante"
      },
      {
        "id": "pulpite-reversivel",
        "label": "Suspeita de pulpite reversível ou fase de transição? → Pulpite Reversível / Fase de Transição"
      },
      {
        "id": "pulpite-irreversivel",
        "label": "Dor espontânea, noturna, pulsátil ou prolongada? → Pulpite Irreversível — Urgência"
      },
      {
        "id": "ajuste-oclusal-restauracao",
        "label": "Sensibilidade após restauração com suspeita de ponto alto? → Ajuste Oclusal em Restauração"
      },
      {
        "id": "trocar-rest",
        "label": "Cárie, infiltração ou restauração inadequada? → Restauração de Rotina"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Dor ao morder com suspeita de trinca/fratura? → Avaliação de fratura radicular / prognóstico desfavorável"
      }
    ],
    "related": []
  },
  "restauracao-caiu": {
    "id": "restauracao-caiu",
    "title": "A restauração caiu",
    "icon": "<i class=\"ti ti-bandage-off\"></i>",
    "subtitle": "Quando uma restauração cai, diferencie se foi apenas falha da restauração ou se existe cárie, fratura, pouca estrutura, sobrecarga oclusal ou proximidade pulpar mudando o plano.",
    "intent": "Ajudar o dentista a decidir se o dente pode ser restaurado novamente ou se a perda da restauração indica cárie, fratura, falha adesiva, pouca estrutura remanescente ou necessidade de outro planejamento.",
    "synonyms": [
      "restauração caiu",
      "obturação caiu",
      "restauração soltou",
      "restauração descolou",
      "perdeu a restauração",
      "restauração saiu inteira",
      "restauração quebrou e caiu",
      "paciente perdeu a restauração",
      "caiu a resina",
      "caiu a obturação",
      "resina caiu",
      "obturação soltou",
      "restauração saiu da boca",
      "buraco no dente",
      "caiu a massinha do dente"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando uma restauração cai, diferencie se foi apenas falha da restauração ou se existe cárie, fratura, pouca estrutura, sobrecarga oclusal ou proximidade pulpar mudando o plano.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "O remanescente está íntegro, supragengival e sem cárie?\n→ Pode ser possível restaurar novamente",
      "Há cárie, infiltração ou tecido amolecido?\n→ Corrija a causa antes de restaurar",
      "A restauração já caiu mais de uma vez?\n→ Reavalie retenção, adesão, oclusão e indicação de restauração direta",
      "A cavidade ficou muito profunda ou próxima da polpa?\n→ Avalie risco pulpar antes da restauração definitiva",
      "Sobrou pouca estrutura dentária?\n→ Restauração direta pode não ser previsível",
      "A margem está subgengival ou sem isolamento adequado?\n→ O prognóstico adesivo fica pior",
      "Há dor espontânea ou sensibilidade persistente?\n→ Avalie envolvimento pulpar antes de restaurar"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "trocar-rest",
        "label": "Remanescente favorável e sem sinais de cárie/fratura? → Restauração de Rotina"
      },
      {
        "id": "remocao-seletiva",
        "label": "Cárie profunda ou risco de exposição pulpar? → Remoção Seletiva de Cárie"
      },
      {
        "id": "protecao-pulpar",
        "label": "Cavidade profunda com necessidade de proteção? → Proteção Pulpar"
      },
      {
        "id": "pino-nucleo",
        "label": "Dente tratado endodonticamente ou com pouca retenção? → Pino de Fibra + Núcleo em Resina"
      },
      {
        "id": "aumento-coroa-clinica",
        "label": "Margem subgengival ou impossibilidade de isolamento? → Aumento de coroa clínica / manejo de margem subgengival"
      },
      {
        "id": "pulpite-irreversivel",
        "label": "Dor espontânea, noturna ou persistente? → Pulpite Irreversível — Urgência"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Suspeita de fratura ou prognóstico desfavorável? → Avaliação de fratura radicular / prognóstico desfavorável"
      }
    ],
    "related": []
  },
  "restauracao-fraturou": {
    "id": "restauracao-fraturou",
    "title": "A restauração fraturou",
    "icon": "<i class=\"ti ti-dental-broken\"></i>",
    "subtitle": "Quando a restauração fratura, diferencie se quebrou apenas o material restaurador ou se a fratura envolve dente, cúspide, cárie, trinca ou sobrecarga oclusal.",
    "intent": "Ajudar o dentista a decidir se a fratura é apenas da restauração ou se existe cárie, trinca, fratura dentária, sobrecarga oclusal, pouca estrutura remanescente ou necessidade de outro planejamento.",
    "synonyms": [
      "restauração fraturou",
      "restauração quebrou",
      "obturação quebrou",
      "resina quebrou",
      "resina lascou",
      "restauração lascou",
      "quebrou a restauração",
      "caiu um pedaço da restauração",
      "dente quebrou a restauração",
      "restauração rachou",
      "restauração trincou",
      "restauração quebrada",
      "obturação quebrada",
      "dente quebrou",
      "dente lascou",
      "pedaço do dente quebrou"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando a restauração fratura, diferencie se quebrou apenas o material restaurador ou se a fratura envolve dente, cúspide, cárie, trinca ou sobrecarga oclusal.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A fratura foi pequena e limitada à resina?\n→ Pode ser possível reparar ou refazer a restauração",
      "A fratura envolveu cúspide ou estrutura dentária?\n→ Reavalie indicação de restauração direta",
      "Há cárie, infiltração ou margem escurecida?\n→ A falha pode estar associada à perda de suporte",
      "A restauração era extensa ou substituía muita estrutura?\n→ Pode haver necessidade de proteção cuspídea ou planejamento indireto",
      "Há contato oclusal forte exatamente na área fraturada?\n→ Suspeite sobrecarga ou ajuste oclusal inadequado",
      "Há dor ao morder ou ao soltar a mordida?\n→ Pense em trinca/fratura dentária",
      "A fratura é recorrente no mesmo local?\n→ Não trate como simples “trocar a resina”"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "trocar-rest",
        "label": "Fratura pequena, restrita à restauração e com remanescente favorável? → Restauração de Rotina"
      },
      {
        "id": "ajuste-oclusal-restauracao",
        "label": "Fratura associada a contato alto ou sobrecarga oclusal? → Ajuste Oclusal em Restauração"
      },
      {
        "id": "remocao-seletiva",
        "label": "Cárie, infiltração ou tecido amolecido associado? → Remoção Seletiva de Cárie"
      },
      {
        "id": "protecao-pulpar",
        "label": "Cavidade profunda ou próxima da polpa? → Proteção Pulpar"
      },
      {
        "id": "pino-nucleo",
        "label": "Pouca estrutura remanescente ou dente tratado endodonticamente? → Pino de Fibra + Núcleo em Resina"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Suspeita de trinca, fratura dentária ou prognóstico desfavorável? → Avaliação de fratura radicular / prognóstico desfavorável"
      },
      {
        "id": "nova-coroa",
        "label": "Dente com necessidade de cobertura ou restauração direta sem previsibilidade? → Planejar Nova Coroa"
      }
    ],
    "related": []
  },
  "coroa-caiu": {
    "id": "coroa-caiu",
    "title": "A coroa caiu",
    "icon": "<i class=\"ti ti-crown\"></i>",
    "subtitle": "Quando a coroa cai, diferencie se a peça e o remanescente permitem recimentação ou se há cárie, fratura, perda de retenção ou falha de adaptação que exige novo planejamento.",
    "intent": "Ajudar o dentista a decidir se a coroa pode ser recimentada ou se há cárie, fratura, perda de retenção, falha do preparo ou necessidade de refazer a prótese.",
    "synonyms": [
      "coroa caiu",
      "coroa soltou",
      "coroa descolou",
      "caiu a coroa",
      "jaqueta caiu",
      "pivô caiu",
      "prótese fixa caiu",
      "coroa saiu inteira",
      "coroa provisória caiu",
      "coroa definitiva caiu",
      "coroa não segura",
      "coroa soltando",
      "dente da coroa caiu",
      "recimentar coroa"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando a coroa cai, diferencie se a peça e o remanescente permitem recimentação ou se há cárie, fratura, perda de retenção ou falha de adaptação que exige novo planejamento.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "O remanescente está íntegro, sem cárie/fratura e com preparo retentivo?\n→ Pode ser possível recimentar",
      "A coroa está íntegra, limpa e assenta totalmente?\n→ A recimentação tende a ser mais previsível",
      "Há cárie secundária, fratura do remanescente ou margem comprometida?\n→ Recimentar tende a falhar",
      "A coroa caiu repetidas vezes?\n→ Reavalie retenção, adaptação, oclusão e preparo",
      "A coroa caiu com pino/núcleo junto?\n→ O problema muda de nível; avalie conjunto e raiz",
      "Há mobilidade, fístula, dor ao morder ou suspeita de fratura radicular?\n→ Não trate como simples recimentação"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "recimentar-metal",
        "label": "Coroa íntegra, remanescente favorável e bom assentamento? → Recimentar — Metalo-cerâmica / Metal"
      },
      {
        "id": "recimentar-ceramica",
        "label": "Coroa íntegra, remanescente favorável e bom assentamento? → OU Recimentar — Porcelana / Zircônia / Disilicato"
      },
      {
        "id": "recimentacao-coroa-pino-nucleo",
        "label": "Coroa caiu com pino/núcleo junto? → Recimentação do conjunto coroa + pino/núcleo"
      },
      {
        "id": "nova-coroa",
        "label": "Cárie, fratura, margem comprometida ou coroa sem adaptação? → Planejar Nova Coroa"
      },
      {
        "id": "moldagem-coroa-ponte",
        "label": "Necessidade de moldagem para nova coroa? → Moldagem para Coroa/Ponte — Silicone de Adição"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Suspeita de fratura radicular ou prognóstico desfavorável? → Avaliação de fratura radicular / prognóstico desfavorável"
      },
      {
        "id": "ajuste-oclusal",
        "label": "Contato alto ou sobrecarga associada? → Ajuste Oclusal"
      }
    ],
    "related": []
  },
  "pino-nucleo-soltou": {
    "id": "pino-nucleo-soltou",
    "title": "O pino/núcleo soltou",
    "icon": "<i class=\"ti ti-dental-broken\"></i>",
    "subtitle": "Quando o pino/núcleo solta, diferencie se houve falha de cimentação/retenção ou se há fratura, cárie, pouca estrutura ou raiz sem prognóstico.",
    "intent": "Ajudar o dentista a decidir se o pino/núcleo pode ser recimentado ou se há fratura radicular, perda de retenção, pouca estrutura remanescente ou prognóstico desfavorável.",
    "synonyms": [
      "pino soltou",
      "núcleo soltou",
      "pino caiu",
      "núcleo caiu",
      "coroa caiu com pino",
      "coroa caiu com núcleo",
      "pivô soltou",
      "pivô caiu",
      "pino de fibra soltou",
      "núcleo metálico soltou",
      "retentor intrarradicular soltou",
      "dente com pino solto",
      "recimentar pino",
      "recimentar núcleo"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando o pino/núcleo solta, diferencie se houve falha de cimentação/retenção ou se há fratura, cárie, pouca estrutura ou raiz sem prognóstico.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "O pino saiu inteiro e a raiz parece íntegra?\n→ Pode haver possibilidade de recimentação",
      "Há trinca, dor ao morder, bolsa isolada ou lesão lateral?\n→ Suspeite fratura radicular",
      "Há cárie, margem subgengival ou remanescente insuficiente?\n→ Recimentar tende a não resolver",
      "O canal está curto, largo ou com pouca retenção?\n→ A falha pode ser mecânica",
      "O conjunto já soltou mais de uma vez?\n→ Reavalie indicação do pino e planejamento protético",
      "Há mobilidade ou perda óssea importante?\n→ O problema pode ser de prognóstico, não só retenção"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "recimentacao-coroa-pino-nucleo",
        "label": "Raiz íntegra, pino adaptado e remanescente favorável? → Recimentação do conjunto coroa + pino/núcleo"
      },
      {
        "id": "pino-nucleo",
        "label": "Dente tratado endodonticamente com pouca retenção, mas ainda restaurável? → Pino de Fibra + Núcleo em Resina"
      },
      {
        "id": "aumento-coroa-clinica",
        "label": "Pouca estrutura coronária ou margem subgengival? → Aumento de coroa clínica"
      },
      {
        "id": "nova-coroa",
        "label": "Necessidade de nova coroa após reconstrução? → Planejar Nova Coroa"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Suspeita de fratura radicular ou prognóstico desfavorável? → Avaliação de fratura radicular / prognóstico desfavorável"
      }
    ],
    "related": []
  },
  "coroa-nao-entra-card": {
    "id": "coroa-nao-entra-card",
    "title": "A coroa não entra",
    "icon": "<i class=\"ti ti-adjustments-horizontal\"></i>",
    "subtitle": "Quando a coroa não entra, diferencie se a interferência é proximal, interna, marginal, oclusal ou se a peça precisa ser refeita.",
    "intent": "Ajudar o dentista a identificar por que a coroa não assenta e decidir entre ajuste interno, ajuste proximal, ajuste marginal, repetir moldagem ou refazer a peça.",
    "synonyms": [
      "coroa não entra",
      "coroa não assenta",
      "coroa não adapta",
      "coroa alta",
      "coroa travando",
      "coroa não encaixa",
      "coroa ficou alta",
      "coroa não desce",
      "contato proximal apertado",
      "coroa pega no contato",
      "coroa com interferência interna",
      "coroa com margem aberta",
      "peça não assenta",
      "prótese fixa não entra"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando a coroa não entra, diferencie se a interferência é proximal, interna, marginal, oclusal ou se a peça precisa ser refeita.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A coroa trava antes de assentar?\n→ Suspeite contato proximal apertado ou interferência interna",
      "O fio dental não passa no contato da coroa?\n→ Pode haver contato proximal excessivo",
      "Há marca interna localizada no evidenciador?\n→ Ajuste interno pode resolver",
      "A margem não fecha mesmo após ajuste?\n→ Suspeite distorção, moldagem ruim ou peça inadequada",
      "A coroa assenta, mas fica alta na mordida?\n→ Avalie oclusão após confirmar assentamento",
      "A peça não assenta em várias tentativas ou perde adaptação ao ajustar?\n→ Repetir moldagem/refazer pode ser mais seguro"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "coroa-nao-entra",
        "label": "Coroa não assenta por contato ou interferência? → Coroa não entra — Ajuste e decisão"
      },
      {
        "id": "ajuste-oclusal",
        "label": "Assentou, mas há contato alto/sobrecarga? → Ajuste Oclusal"
      },
      {
        "id": "nova-coroa",
        "label": "Margem, adaptação ou moldagem inadequada? → Planejar Nova Coroa"
      },
      {
        "id": "moldagem-coroa-ponte",
        "label": "Necessidade de nova moldagem? → Moldagem para Coroa/Ponte — Silicone de Adição"
      }
    ],
    "related": []
  },
  "porcelana-lascou": {
    "id": "porcelana-lascou",
    "title": "A porcelana lascou",
    "icon": "<i class=\"ti ti-dental-broken\"></i>",
    "subtitle": "Quando a porcelana lasca, diferencie se o dano é pequeno e reparável em boca ou se compromete adaptação, contato, estética, estrutura ou oclusão.",
    "intent": "Ajudar o dentista a decidir se o lascamento pode ser reparado em boca ou se indica falha estrutural, estética, oclusal ou necessidade de nova coroa.",
    "synonyms": [
      "porcelana lascou",
      "porcelana quebrou",
      "cerâmica lascou",
      "cerâmica quebrou",
      "coroa lascou",
      "coroa quebrou",
      "fragmento da coroa quebrou",
      "lasca na porcelana",
      "metal apareceu na coroa",
      "zircônia lascou",
      "faceta da coroa quebrou",
      "reparar porcelana",
      "reparo de cerâmica",
      "reparo intraoral de porcelana"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando a porcelana lasca, diferencie se o dano é pequeno e reparável em boca ou se compromete adaptação, contato, estética, estrutura ou oclusão.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A lasca é pequena, sem margem aberta e sem perda funcional?\n→ Pode ser possível reparo intraoral",
      "O que ficou exposto: porcelana/cerâmica vítrea, metal ou zircônia?\n→ O tratamento de superfície muda conforme o material",
      "A fratura envolve margem, contato proximal ou adaptação?\n→ Reparo simples pode não ser previsível",
      "Há contato oclusal forte exatamente na área lascada?\n→ Suspeite sobrecarga",
      "A falha é recorrente ou estética importante?\n→ Pode indicar necessidade de nova coroa",
      "A coroa está solta, infiltrada ou com mau assentamento?\n→ Não trate apenas como lasca de porcelana"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "reparo-porcelana",
        "label": "Lascamento pequeno e possível reparo em boca? → Reparo Intraoral de Porcelana/Cerâmica"
      },
      {
        "id": "nova-coroa",
        "label": "Fratura envolvendo margem, adaptação ou contato proximal importante? → Planejar Nova Coroa"
      },
      {
        "id": "moldagem-coroa-ponte",
        "label": "Necessidade de refazer a peça? → Moldagem para Coroa/Ponte — Silicone de Adição"
      },
      {
        "id": "ajuste-oclusal",
        "label": "Contato alto ou sobrecarga? → Ajuste Oclusal"
      }
    ],
    "related": []
  },
  "dente-pouca-estrutura": {
    "id": "dente-pouca-estrutura",
    "title": "Dente com pouca estrutura",
    "icon": "<i class=\"ti ti-dental\"></i>",
    "subtitle": "Avalie se ainda existe remanescente suficiente para reconstruir com previsibilidade. Em dente tratado endodonticamente e com pouca retenção coronária, pense em pino de fibra + núcleo e planejamento de coroa.",
    "intent": "Ajudar o dentista a avaliar se o dente ainda é restaurável e se precisa de pino/núcleo, aumento de coroa clínica, nova coroa ou mudança de plano.",
    "synonyms": [
      "dente com pouca estrutura",
      "pouca estrutura dentária",
      "dente destruído",
      "dente muito quebrado",
      "dente sem parede",
      "dente sem remanescente",
      "dente tratado canal pouca estrutura",
      "dente precisa de pino",
      "dente precisa de núcleo",
      "dente precisa de coroa",
      "margem subgengival",
      "dente sem retenção",
      "dente irrestaurável",
      "dente não dá para restaurar"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Avalie se ainda existe remanescente suficiente para reconstruir com previsibilidade. Em dente tratado endodonticamente e com pouca retenção coronária, pense em pino de fibra + núcleo e planejamento de coroa.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "Existe remanescente supragengival suficiente para isolamento e retenção?\n→ A reconstrução tende a ser mais previsível",
      "A margem está subgengival ou muito próxima da crista óssea?\n→ Pode precisar de aumento de coroa clínica",
      "O dente é tratado endodonticamente e tem pouca retenção?\n→ Pode precisar de pino de fibra + núcleo",
      "Há fratura, trinca, bolsa isolada ou lesão lateral?\n→ Avalie fratura/prognóstico desfavorável",
      "A reconstrução exigiria muitos procedimentos com baixa previsibilidade?\n→ Reavalie se vale manter o dente"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "pino-nucleo",
        "label": "Dente tratado endodonticamente com pouca retenção, mas restaurável? → Pino de Fibra + Núcleo em Resina"
      },
      {
        "id": "aumento-coroa-clinica",
        "label": "Margem subgengival ou necessidade de expor remanescente? → Aumento de coroa clínica"
      },
      {
        "id": "nova-coroa",
        "label": "Necessidade de reabilitar com coroa? → Planejar Nova Coroa"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Suspeita de fratura radicular ou prognóstico desfavorável? → Avaliação de fratura radicular / prognóstico desfavorável"
      },
      {
        "type": "conduct",
        "id": "dente-prognostico-ruim",
        "label": "Dente sem previsibilidade de manutenção? → Dente com prognóstico ruim"
      }
    ],
    "related": []
  },
  "protese-total-machuca": {
    "id": "protese-total-machuca",
    "title": "A prótese total machuca",
    "icon": "<i class=\"ti ti-bandage\"></i>",
    "subtitle": "📍 Dor localizada?",
    "intent": "Ajudar o dentista a diferenciar ponto de pressão, borda sobreestendida, instabilidade, problema oclusal, base desadaptada ou lesão traumática por prótese total.",
    "synonyms": [
      "prótese total machuca",
      "dentadura machuca",
      "prótese machucando",
      "dentadura ferindo",
      "prótese total ferindo",
      "prótese machuca gengiva",
      "ferida por dentadura",
      "úlcera por prótese",
      "dor com prótese total",
      "prótese apertando",
      "borda da prótese machuca",
      "prótese total incomodando"
    ],
    "quickLabel": "Caminho provável",
    "quick": "📍 Dor localizada?\r\n→ Procure ponto de pressão na base.\r\n\r\n📍 Dor no fundo de sulco ou região de freio?\r\n→ Pense em borda sobreestendida.\r\n\r\n📍 Dor ao mastigar ou em vários pontos?\r\n→ Avalie oclusão, estabilidade e adaptação da prótese.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "Há ferida, área esbranquiçada ou úlcera localizada?\n→ Confirma trauma direto da prótese",
      "A marca coincide com a parte interna da base?\n→ O alívio deve ser feito na área correspondente",
      "A prótese desloca quando o paciente fala, mastiga ou abre a boca?\n→ Pode haver perda de estabilidade ou borda interferindo na função",
      "A base parece desadaptada ou sem retenção?\n→ O ajuste isolado pode não resolver",
      "A prótese é antiga ou o rebordo está muito reabsorvido?\n→ Pense em reembasamento ou nova prótese",
      "A lesão não cicatriza após remover o trauma?\n→ Não trate como simples machucado"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "protese-incomodando",
        "label": "Ponto de pressão, borda sobreestendida ou trauma localizado? → Ajuste de Base/Borda"
      },
      {
        "id": "reemb-def-pt",
        "label": "Instabilidade ou base desadaptada em prótese ainda aproveitável? → Reembasamento Definitivo — PT"
      },
      {
        "id": "ajuste-oclusal",
        "label": "Dor associada a contato oclusal inadequado? → Ajuste Oclusal"
      },
      {
        "id": "nova-protese-total",
        "label": "Prótese antiga, instável ou sem previsibilidade? → Confecção de Nova Prótese Total"
      },
      {
        "type": "note",
        "label": "Lesão persistente mesmo após ajuste? → Reavaliar tecido e considerar encaminhamento"
      }
    ],
    "related": []
  },
  "protese-total-caindo": {
    "id": "protese-total-caindo",
    "title": "A prótese total está caindo",
    "icon": "<i class=\"ti ti-arrows-down-up\"></i>",
    "subtitle": "Quando a prótese total está caindo, diferencie se a perda de retenção vem da base, bordas, rebordo, saliva, oclusão ou se a prótese já não tem previsibilidade.",
    "intent": "Ajudar o dentista a diferenciar perda de retenção por base desadaptada, rebordo reabsorvido, borda inadequada, saliva, oclusão ou necessidade de nova prótese total.",
    "synonyms": [
      "prótese total caindo",
      "dentadura caindo",
      "dentadura frouxa",
      "prótese total frouxa",
      "prótese sem retenção",
      "prótese não para",
      "prótese total solta",
      "dentadura solta",
      "prótese perde vácuo",
      "prótese superior caindo",
      "prótese inferior balançando",
      "prótese total instável"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando a prótese total está caindo, diferencie se a perda de retenção vem da base, bordas, rebordo, saliva, oclusão ou se a prótese já não tem previsibilidade.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A prótese é antiga ou o rebordo está reabsorvido?\n→ Pode haver perda de adaptação da base",
      "A prótese desloca ao falar, sorrir ou abrir a boca?\n→ Avalie extensão de borda e freios",
      "A prótese desloca ao mastigar?\n→ Avalie estabilidade e oclusão",
      "Há pouca saliva ou boca seca?\n→ A retenção pode estar prejudicada",
      "A base está íntegra e a prótese ainda é aproveitável?\n→ Reembasamento pode ser opção",
      "A prótese está muito antiga, gasta ou sem suporte adequado?\n→ Nova prótese pode ser mais previsível"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "reemb-def-pt",
        "label": "Base desadaptada, mas prótese ainda aproveitável? → Reembasamento Definitivo — PT"
      },
      {
        "id": "protese-incomodando",
        "label": "Borda interferindo na função? → Ajuste de Base/Borda"
      },
      {
        "id": "ajuste-oclusal",
        "label": "Instabilidade associada à oclusão? → Ajuste Oclusal"
      },
      {
        "id": "nova-protese-total",
        "label": "Prótese antiga, instável ou sem previsibilidade? → Confecção de Nova Prótese Total"
      }
    ],
    "related": []
  },
  "ppr-machuca-balanca": {
    "id": "ppr-machuca-balanca",
    "title": "A PPR machuca ou balança",
    "icon": "<i class=\"ti ti-arrows-shuffle\"></i>",
    "subtitle": "Quando a PPR machuca ou balança, diferencie trauma localizado, sela desadaptada, problema nos grampos/apoios, interferência oclusal ou falha nos dentes pilares.",
    "intent": "Ajudar o dentista a diferenciar trauma localizado, sela desadaptada, problema em grampo/apoio, interferência oclusal ou falha nos dentes pilares.",
    "synonyms": [
      "PPR machuca",
      "PPR balança",
      "PPR frouxa",
      "PPR machucando",
      "ponte móvel machuca",
      "ponte móvel balança",
      "prótese parcial removível machuca",
      "prótese parcial removível balança",
      "sela da PPR machuca",
      "grampo machuca",
      "grampo frouxo",
      "PPR sem estabilidade",
      "PPR desadaptada"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando a PPR machuca ou balança, diferencie trauma localizado, sela desadaptada, problema nos grampos/apoios, interferência oclusal ou falha nos dentes pilares.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A dor é localizada sob a sela?\n→ Procure ponto de pressão ou desadaptação da base",
      "A prótese balança ao mastigar?\n→ Avalie sela, apoio, grampos e oclusão",
      "O grampo está frouxo ou deformado?\n→ Pode haver perda de retenção",
      "O apoio não assenta ou força o dente pilar?\n→ Avalie desenho e adaptação",
      "Há mobilidade, dor ou perda óssea no dente pilar?\n→ A falha pode ser do suporte dentário",
      "A PPR é antiga ou o rebordo mudou muito?\n→ Reembasamento ou nova PPRG pode ser necessário"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "protese-incomodando",
        "label": "Ponto de pressão ou borda machucando? → Ajuste de Base/Borda"
      },
      {
        "id": "reemb-def-ppr",
        "label": "Sela desadaptada, mas PPR aproveitável? → Reembasamento Definitivo — PPRG"
      },
      {
        "id": "ajuste-oclusal",
        "label": "Interferência oclusal ou instabilidade ao mastigar? → Ajuste Oclusal"
      },
      {
        "type": "conduct",
        "id": "mobilidade-dental",
        "label": "Dente pilar com mobilidade ou prognóstico ruim? → Mobilidade dental"
      },
      {
        "type": "conduct",
        "id": "dente-prognostico-ruim",
        "label": "Dente pilar com mobilidade ou prognóstico ruim? → Dente com prognóstico ruim"
      },
      {
        "id": "nova-pprg",
        "label": "PPR antiga, instável ou sem previsibilidade? → Confecção de nova PPRG"
      }
    ],
    "related": []
  },
  "dente-protese-soltou-card": {
    "id": "dente-protese-soltou-card",
    "title": "Dente da prótese soltou",
    "icon": "<i class=\"ti ti-dental-off\"></i>",
    "subtitle": "Quando um dente da prótese solta, diferencie se é reparo simples, falha recorrente, fratura de base ou sinal de que a prótese precisa de laboratório ou substituição.",
    "intent": "Ajudar o dentista a decidir se o dente da prótese pode ser reparado em cadeira ou se precisa de envio ao laboratório, reparo maior ou nova prótese.",
    "synonyms": [
      "dente da prótese soltou",
      "dente da dentadura caiu",
      "dente da prótese caiu",
      "dente artificial soltou",
      "dente da PPR soltou",
      "dente da prótese quebrou",
      "colar dente da prótese",
      "reparar dente da prótese",
      "prótese perdeu dente",
      "dentadura perdeu dente",
      "dente da ponte móvel caiu"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando um dente da prótese solta, diferencie se é reparo simples, falha recorrente, fratura de base ou sinal de que a prótese precisa de laboratório ou substituição.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A base está íntegra e o dente soltou limpo?\n→ Pode ser reparo em cadeira",
      "Há fratura da base junto com o dente?\n→ Pode precisar de laboratório",
      "O dente soltou repetidas vezes?\n→ Reavalie oclusão, espaço, retenção e desgaste",
      "A prótese é antiga, instável ou muito desgastada?\n→ Reparo isolado pode não resolver",
      "O dente perdido compromete estética ou função imediata?\n→ Priorize reparo seguro ou envio com urgência"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "dente-protese-soltou",
        "label": "Dente soltou e a base está íntegra? → Reparo na Cadeira — Dente da Prótese Soltou"
      },
      {
        "id": "dente-protese-laboratorio",
        "label": "Precisa de reparo mais previsível ou acabamento laboratorial? → Encaminhar Laboratório — Dente da Prótese"
      },
      {
        "id": "protese-quebrada-lab",
        "label": "Há fratura de base associada? → Prótese Quebrada — Envio ao Laboratório"
      },
      {
        "id": "ajuste-oclusal",
        "label": "Falha recorrente ou suspeita de sobrecarga? → Ajuste Oclusal"
      },
      {
        "id": "nova-protese-total",
        "label": "Prótese antiga, instável ou sem previsibilidade? → Confecção de Nova Prótese Total"
      },
      {
        "id": "nova-pprg",
        "label": "Prótese antiga, instável ou sem previsibilidade? → Confecção de nova PPRG"
      }
    ],
    "related": []
  },
  "protese-quebrou-card": {
    "id": "protese-quebrou-card",
    "title": "A prótese quebrou",
    "icon": "<i class=\"ti ti-tool\"></i>",
    "subtitle": "Quando a prótese quebra, diferencie se é fratura simples reparável, fratura estrutural importante, desadaptação, sobrecarga oclusal ou prótese sem previsibilidade.",
    "intent": "Ajudar o dentista a decidir se a prótese pode ser reparada, enviada ao laboratório, reembasada, ajustada ou se precisa ser refeita.",
    "synonyms": [
      "prótese quebrou",
      "dentadura quebrou",
      "PPR quebrou",
      "ponte móvel quebrou",
      "prótese rachou",
      "prótese partida",
      "prótese fraturada",
      "fratura da prótese",
      "dentadura rachada",
      "prótese quebrou ao meio",
      "consertar prótese",
      "reparo de prótese",
      "prótese acrílica quebrada"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando a prótese quebra, diferencie se é fratura simples reparável, fratura estrutural importante, desadaptação, sobrecarga oclusal ou prótese sem previsibilidade.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A fratura é limpa, com peças adaptando bem?\n→ Pode ser reparo laboratorial previsível",
      "A fratura envolve área funcional, grampo, sela ou reforço?\n→ Reparo simples pode não ser suficiente",
      "A prótese quebrou mais de uma vez?\n→ Investigue oclusão, adaptação e fadiga da base",
      "A prótese está frouxa ou desadaptada?\n→ Pode precisar reembasamento além do reparo",
      "Há dente solto junto com a fratura?\n→ Planeje reparo do dente e da base",
      "A prótese é antiga, gasta ou instável?\n→ Nova prótese pode ser mais previsível"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "protese-quebrada-lab",
        "label": "Fratura com necessidade de reparo laboratorial? → Prótese Quebrada — Envio ao Laboratório"
      },
      {
        "id": "dente-protese-laboratorio",
        "label": "Dente da prótese soltou junto? → Encaminhar Laboratório — Dente da Prótese"
      },
      {
        "id": "dente-protese-soltou",
        "label": "Reparo simples possível em cadeira? → Reparo na Cadeira — Dente da Prótese Soltou"
      },
      {
        "id": "reemb-def-pt",
        "label": "Prótese desadaptada, mas aproveitável? → Reembasamento Definitivo — PT"
      },
      {
        "id": "reemb-def-ppr",
        "label": "Prótese desadaptada, mas aproveitável? → Reembasamento Definitivo — PPRG"
      },
      {
        "id": "ajuste-oclusal",
        "label": "Suspeita de sobrecarga ou interferência? → Ajuste Oclusal"
      },
      {
        "id": "nova-protese-total",
        "label": "Prótese antiga, instável ou sem previsibilidade? → Confecção de Nova Prótese Total"
      },
      {
        "id": "nova-pprg",
        "label": "Prótese antiga, instável ou sem previsibilidade? → Confecção de nova PPRG"
      }
    ],
    "related": []
  },
  "dente-nao-anestesia": {
    "id": "dente-nao-anestesia",
    "title": "Dente não anestesia",
    "icon": "<i class=\"ti ti-needle\"></i>",
    "subtitle": "Quando o dente não anestesia, diferencie se a falha é técnica, anatômica, inflamatória ou se a dor vem de outro dente/estrutura.",
    "intent": "Ajudar o dentista a entender por que a anestesia não está funcionando e qual caminho seguir antes de insistir no procedimento.",
    "synonyms": [
      "dente não anestesia",
      "anestesia não pega",
      "anestesia não funcionou",
      "paciente não anestesia",
      "dente inflamado não anestesia",
      "não consigo anestesiar",
      "anestesia falhou",
      "falha anestésica",
      "dor mesmo anestesiado",
      "paciente sente dor mesmo com anestesia",
      "pulpite não anestesia",
      "bloqueio não pegou",
      "anestesia mandibular falhou",
      "molar inferior não anestesia",
      "lábio dormiu mas dente dói",
      "dor durante o procedimento",
      "anestesia em dente inflamado"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando o dente não anestesia, diferencie se a falha é técnica, anatômica, inflamatória ou se a dor vem de outro dente/estrutura.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "O dente correto foi anestesiado e houve tempo adequado de latência?\n→ Antes de repetir, confirme técnica, dose, profundidade e tempo de espera",
      "O lábio, língua ou mucosa anestesiaram, mas o dente continua doendo?\n→ Pense em falha pulpar, inflamação intensa ou necessidade de técnica suplementar",
      "É molar inferior com pulpite?\n→ A chance de falha anestésica é maior",
      "O lábio não dormiu após bloqueio mandibular?\n→ Suspeite falha técnica no bloqueio",
      "A dor aparece só em um ponto específico do procedimento?\n→ Pode haver área ainda não anestesiada ou dentina muito sensível",
      "A dor é difusa ou o paciente não localiza bem?\n→ Reavalie diagnóstico e teste dentes vizinhos",
      "O paciente tem condição sistêmica relevante?\n→ Confira o perfil do paciente antes de escolher anestésico e quantidade"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "type": "tool",
        "id": "anesthetic-technique",
        "label": "Dúvida sobre técnica principal para o dente? → Técnica anestésica por dente"
      },
      {
        "type": "tool",
        "id": "anesthetic-technique",
        "label": "Falha anestésica, molar inferior difícil ou pulpite aguda? → Técnica anestésica por dente"
      },
      {
        "type": "tab",
        "id": "anestesicos",
        "label": "Paciente gestante, cardiopata, diabético, idoso, asmático, epiléptico, coagulopata, hepatopata ou nefropata? → Anestésicos por perfil do paciente"
      },
      {
        "id": "pulpite-irreversivel",
        "label": "Dor intensa, espontânea ou pulpite irreversível associada? → Pulpite Irreversível — Urgência"
      },
      {
        "type": "note",
        "label": "Dor persistente mesmo com tecido mole anestesiado? → Reavaliar diagnóstico e testar dentes vizinhos"
      }
    ],
    "related": []
  },
  "anestesico-perfil-paciente": {
    "id": "anestesico-perfil-paciente",
    "title": "Anestésico conforme perfil do paciente",
    "icon": "<i class=\"ti ti-shield-check\"></i>",
    "subtitle": "Quando houver condição sistêmica relevante, diferencie primeiro o perfil do paciente antes de escolher anestésico, vasoconstritor, técnica e quantidade total de tubetes.",
    "intent": "Ajudar o dentista a identificar o perfil sistêmico do paciente antes de escolher anestésico local, vasoconstritor, técnica anestésica e quantidade total de tubetes.",
    "synonyms": [
      "anestésico para gestante",
      "anestesia em gestante",
      "anestesia para lactante",
      "anestésico para lactante",
      "anestesia em criança",
      "anestesia odontopediatria",
      "anestésico infantil",
      "anestesia em idoso",
      "anestésico para idoso",
      "anestesia em cardiopata",
      "anestésico para cardiopata",
      "anestesia em hipertenso",
      "anestésico para hipertenso",
      "anestesia em diabético",
      "anestésico para diabético",
      "anestesia em asmático",
      "anestésico para asmático",
      "anestesia em epiléptico",
      "anestésico para epiléptico",
      "anestesia em coagulopata",
      "anestésico para coagulopata",
      "anestesia em hepatopata",
      "anestésico para hepatopata",
      "anestesia em nefropata",
      "anestésico para nefropata",
      "anestésico para paciente renal",
      "anestésico para paciente com problema no fígado",
      "anestesia em paciente especial",
      "anestesia em paciente sistêmico",
      "qual anestésico usar",
      "qual anestesia usar",
      "anestésico com vasoconstritor",
      "anestésico sem vasoconstritor",
      "Anestesia em gestante",
      "Anestesia em lactante",
      "Anestesia em criança",
      "Anestesia em idoso",
      "Anestesia em cardiopata",
      "Anestesia em diabético",
      "Anestesia em asmático",
      "Anestesia em epiléptico",
      "Anestesia em coagulopata",
      "Anestesia em hepatopata",
      "Anestesia em nefropata",
      "Anestesia em paciente hipertenso",
      "Anestesia em paciente especial"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando houver condição sistêmica relevante, diferencie primeiro o perfil do paciente antes de escolher anestésico, vasoconstritor, técnica e quantidade total de tubetes.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A paciente é gestante ou lactante?\n→ Abrir orientação específica antes de anestesiar",
      "É criança ou idoso?\n→ Ajustar escolha, dose, tempo anestésico e risco de efeitos pós-operatórios",
      "É cardiopata, hipertenso ou diabético?\n→ Confirmar controle sistêmico antes de escolher anestésico e vasoconstritor",
      "É asmático, epiléptico, coagulopata, hepatopata ou nefropata?\n→ Verificar riscos específicos antes da técnica anestésica",
      "Há instabilidade, crise recente, PA elevada, falta de ar, dor no peito ou mal-estar?\n→ Não tratar como atendimento eletivo simples"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "type": "tab",
        "id": "anestesicos",
        "label": "Dúvida sobre anestésico indicado conforme perfil sistêmico? → Anestésicos por perfil do paciente"
      },
      {
        "type": "tool",
        "id": "anesthetic-technique",
        "label": "Dúvida sobre técnica anestésica para o dente específico? → Técnica anestésica por dente"
      },
      {
        "type": "conduct",
        "id": "dente-nao-anestesia",
        "label": "Anestesia não funcionou ou paciente segue sentindo dor? → Dente não anestesia"
      },
      {
        "type": "note",
        "label": "Paciente descompensado, com mal-estar, PA muito elevada, falta de ar, dor no peito, crise recente ou condição sistêmica instável? → Adiar procedimento eletivo e considerar encaminhamento/contato médico"
      }
    ],
    "related": []
  },
  "inchaco-rosto": {
    "id": "inchaco-rosto",
    "title": "Inchaço no rosto",
    "icon": "<i class=\"ti ti-alert-triangle\"></i>",
    "subtitle": "Quando há inchaço no rosto, diferencie se é abscesso localizado, infecção em disseminação ou urgência com risco sistêmico.",
    "intent": "Ajudar o dentista a diferenciar edema odontogênico localizado, abscesso, celulite facial e sinais de risco, direcionando a conduta de urgência.",
    "synonyms": [
      "inchaço no rosto",
      "rosto inchado",
      "face inchada",
      "edema facial",
      "inchaço odontogênico",
      "abscesso facial",
      "abscesso odontogênico",
      "infecção odontogênica",
      "celulite facial",
      "bochecha inchada",
      "inchaço na mandíbula",
      "inchaço na maxila",
      "dente com rosto inchado",
      "paciente com rosto inchado",
      "edema por dente",
      "pus no dente",
      "infecção no dente",
      "abscesso com pus",
      "abscesso com flutuação",
      "drenagem de abscesso"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando há inchaço no rosto, diferencie se é abscesso localizado, infecção em disseminação ou urgência com risco sistêmico.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "O edema é localizado, flutuante e próximo ao dente causador?\n→ Pode haver coleção com possibilidade de drenagem local",
      "O inchaço é difuso, endurecido, quente ou está aumentando?\n→ Suspeite disseminação/celulite",
      "Há febre, mal-estar, prostração ou linfonodos doloridos?\n→ A infecção pode ter repercussão sistêmica",
      "Há trismo importante, disfagia, voz alterada, sialorreia, assoalho de boca elevado ou dificuldade para respirar?\n→ Sinal de risco; não trate como caso simples",
      "O dente tem dor intensa, necrose, fístula, lesão periapical ou mobilidade?\n→ Procure origem endodôntica, periodontal ou fratura",
      "O paciente é diabético descompensado, imunossuprimido, idoso frágil ou tem condição sistêmica importante?\n→ O limiar para encaminhar deve ser menor"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "drenagem-abscesso",
        "label": "Edema localizado com coleção/pus acessível? → Drenagem de abscesso"
      },
      {
        "id": "infeccao-odontogenica-sinais-sistemicos",
        "label": "Edema difuso, celulite, febre, mal-estar ou piora progressiva? → Infecção odontogênica com sinais sistêmicos"
      },
      {
        "id": "endo-urgencia",
        "label": "Suspeita de necrose pulpar, lesão periapical ou abscesso de origem endodôntica? → Urgência Endodôntica"
      },
      {
        "type": "note",
        "label": "Trismo importante, disfagia, voz alterada, sialorreia, assoalho de boca elevado, dificuldade respiratória ou evolução rápida? → Encaminhar para urgência hospitalar"
      },
      {
        "type": "note",
        "label": "Paciente sistêmico de risco ou descompensado? → Avaliar encaminhamento e prescrição com cautela conforme perfil do paciente"
      }
    ],
    "related": []
  },
  "fistula-gengiva": {
    "id": "fistula-gengiva",
    "title": "Fístula na gengiva",
    "icon": "<i class=\"ti ti-droplet\"></i>",
    "subtitle": "Quando há fístula na gengiva, diferencie se a origem é endodôntica, periodontal, endo-perio ou fratura radicular.",
    "intent": "Ajudar o dentista a identificar se a fístula tem origem endodôntica, periodontal, endo-perio ou se sugere fratura/prognóstico desfavorável.",
    "synonyms": [
      "fístula na gengiva",
      "bolinha de pus na gengiva",
      "pus na gengiva",
      "bolha na gengiva",
      "bolinha acima do dente",
      "fístula dental",
      "fístula periapical",
      "abscesso crônico",
      "drenagem de pus",
      "dente com fístula",
      "gengiva com pus",
      "parúlide",
      "trajeto fistuloso",
      "fístula recorrente"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando há fístula na gengiva, diferencie se a origem é endodôntica, periodontal, endo-perio ou fratura radicular.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "Dente sem vitalidade, com lesão periapical ou histórico de endodontia?\n→ Suspeite origem endodôntica",
      "Dente vital com bolsa profunda localizada?\n→ Pense em origem periodontal ou fratura",
      "Fístula recorrente no mesmo dente?\n→ Investigue a causa antes de tratar como abscesso simples",
      "Há mobilidade, perda óssea vertical ou lesão lateral?\n→ Avalie fratura radicular ou prognóstico desfavorável",
      "Há coroa, pino ou tratamento endodôntico antigo?\n→ Reavalie infiltração, retratamento ou fratura"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "endo-urgencia",
        "label": "Suspeita de necrose pulpar, lesão periapical ou origem endodôntica? → Urgência Endodôntica"
      },
      {
        "id": "drenagem-abscesso",
        "label": "Fístula com pus/flutuação acessível? → Drenagem de abscesso"
      },
      {
        "id": "raspagem-supragengival",
        "label": "Bolsa profunda localizada ou suspeita periodontal? → Raspagem Supragengival"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Fístula recorrente, bolsa isolada, lesão lateral ou suspeita de fratura? → Avaliação de fratura radicular / prognóstico desfavorável"
      },
      {
        "id": "infeccao-odontogenica-sinais-sistemicos",
        "label": "Edema difuso, febre, mal-estar ou piora progressiva? → Infecção odontogênica com sinais sistêmicos"
      }
    ],
    "related": []
  },
  "mobilidade-dental": {
    "id": "mobilidade-dental",
    "title": "Mobilidade dental",
    "icon": "<i class=\"ti ti-arrows-shuffle\"></i>",
    "subtitle": "Quando há mobilidade dental, diferencie se é trauma oclusal, perda periodontal, infecção aguda, fratura radicular ou sinal de prognóstico desfavorável.",
    "intent": "Ajudar o dentista a diferenciar se a mobilidade vem de trauma oclusal, doença periodontal, abscesso, fratura radicular ou dente com prognóstico ruim.",
    "synonyms": [
      "mobilidade dental",
      "dente com mobilidade",
      "dente mole",
      "dente amolecido",
      "dente balançando",
      "mobilidade dentária",
      "mobilidade grau 2",
      "mobilidade grau 3",
      "dente muito mole",
      "dente com perda óssea",
      "dente com trauma oclusal",
      "dente com abscesso",
      "dente com bolsa periodontal",
      "dente com fratura radicular",
      "mobilidade após trauma",
      "dente periodontal",
      "dente com prognóstico ruim",
      "dente indicado para extração",
      "dente perdido",
      "dente condenado"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando há mobilidade dental, diferencie se é trauma oclusal, perda periodontal, infecção aguda, fratura radicular ou sinal de prognóstico desfavorável.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A mobilidade é generalizada em vários dentes?\n→ Pense em doença periodontal ou perda óssea avançada",
      "A mobilidade é isolada em um único dente?\n→ Investigue trauma oclusal, abscesso, fratura ou lesão endo-perio",
      "Há contato prematuro, faceta de desgaste ou dor ao morder?\n→ Suspeite trauma oclusal",
      "Há bolsa profunda, sangramento, cálculo ou supuração?\n→ Avalie origem periodontal",
      "Há fístula, lesão periapical ou dente sem vitalidade?\n→ Pense em origem endodôntica ou endo-perio",
      "Há bolsa isolada profunda, lesão lateral ou dor ao soltar a mordida?\n→ Suspeite fratura radicular",
      "Mobilidade grau III, perda óssea avançada ou dente sem suporte suficiente?\n→ Pode indicar prognóstico ruim e necessidade de exodontia/encaminhamento"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "ajuste-oclusal",
        "label": "Mobilidade associada a contato prematuro ou trauma oclusal? → Ajuste Oclusal"
      },
      {
        "id": "raspagem-supragengival",
        "label": "Bolsa periodontal, cálculo, sangramento ou supuração? → Raspagem Supragengival"
      },
      {
        "id": "endo-urgencia",
        "label": "Suspeita de necrose pulpar, lesão periapical ou origem endodôntica? → Urgência Endodôntica"
      },
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Bolsa isolada profunda, lesão lateral, fístula recorrente ou suspeita de fratura? → Avaliação de fratura radicular / prognóstico desfavorável"
      },
      {
        "type": "conduct",
        "id": "dente-prognostico-ruim",
        "label": "Mobilidade severa, perda óssea avançada ou dente sem suporte/função previsível? → Dente com prognóstico ruim"
      },
      {
        "id": "infeccao-odontogenica-sinais-sistemicos",
        "label": "Edema, febre, mal-estar ou piora progressiva associada? → Infecção odontogênica com sinais sistêmicos"
      }
    ],
    "related": []
  },
  "dor-apos-extracao": {
    "id": "dor-apos-extracao",
    "title": "Dor após extração",
    "icon": "<i class=\"ti ti-dental-broken\"></i>",
    "subtitle": "Quando há dor após extração, diferencie se é evolução pós-operatória esperada, alveolite seca/úmida, infecção, espícula óssea, trauma cirúrgico ou sangramento associado.",
    "intent": "Ajudar o dentista a diferenciar dor pós-operatória esperada, alveolite seca, alveolite úmida, infecção, espícula óssea, trauma cirúrgico ou sangramento persistente após exodontia.",
    "synonyms": [
      "dor após extração",
      "dor depois da extração",
      "dor pós extração",
      "dor pós exodontia",
      "dor depois de arrancar dente",
      "dor no alvéolo",
      "alvéolo doendo",
      "alveolite",
      "alveolite seca",
      "alveolite úmida",
      "alvéolo seco",
      "dor forte após extração",
      "dor latejante após extração",
      "dor 3 dias após extração",
      "mau cheiro após extração",
      "gosto ruim após extração",
      "osso aparecendo após extração",
      "espícula óssea",
      "espícula incomodando",
      "dor com osso espetando",
      "borda óssea machucando",
      "sangramento após extração",
      "sangramento pós exodontia",
      "dor após siso",
      "dor depois de tirar siso"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando há dor após extração, diferencie se é evolução pós-operatória esperada, alveolite seca/úmida, infecção, espícula óssea, trauma cirúrgico ou sangramento associado.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "A dor é leve/moderada e melhora progressivamente?\n→ Pode ser evolução pós-operatória esperada",
      "A dor piorou após 2–4 dias, com alvéolo vazio, mau cheiro e pouca ou nenhuma secreção?\n→ Suspeite alveolite seca",
      "Há dor com alvéolo contaminado, coágulo desorganizado, secreção ou tecido inflamado?\n→ Suspeite alveolite úmida",
      "Há febre, edema progressivo, pus, mal-estar ou trismo importante?\n→ Pense em infecção pós-operatória",
      "Há ponta óssea ou área dura machucando a mucosa?\n→ Pode ser espícula óssea ou borda alveolar exposta",
      "A dor é localizada em região de trauma cirúrgico, laceração ou sutura tensionada?\n→ Avalie ferida, sutura e bordas ósseas",
      "Há sangramento persistente ou coágulo instável?\n→ Reavalie hemostasia antes de manipular"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "type": "note",
        "label": "Dor compatível com pós-operatório esperado? → Reforçar orientações pós-operatórias e analgesia conforme necessidade"
      },
      {
        "id": "alveolite-seca",
        "label": "Suspeita de alveolite seca? → Alveolite seca"
      },
      {
        "id": "alveolite-umida",
        "label": "Suspeita de alveolite úmida? → Alveolite úmida"
      },
      {
        "id": "infeccao-odontogenica-sinais-sistemicos",
        "label": "Febre, edema progressivo, pus, mal-estar ou trismo importante? → Infecção odontogênica com sinais sistêmicos"
      },
      {
        "id": "drenagem-abscesso",
        "label": "Flutuação, coleção ou abscesso acessível? → Drenagem de abscesso"
      },
      {
        "id": "remocao-espicula-ossea",
        "label": "Espícula óssea ou borda alveolar machucando? → Remoção/regularização de espícula óssea"
      },
      {
        "id": "hemostasia",
        "label": "Sangramento persistente após extração? → Hemostasia de urgência"
      }
    ],
    "related": []
  },
  "dente-prognostico-ruim": {
    "id": "dente-prognostico-ruim",
    "title": "Dente com prognóstico ruim",
    "icon": "<i class=\"ti ti-alert-octagon\"></i>",
    "subtitle": "Quando o dente parece ter prognóstico ruim, diferencie se o problema principal é periodontal, estrutural, endodôntico, fratura radicular ou impossibilidade restauradora.",
    "intent": "Ajudar o dentista a decidir quando um dente tem baixa previsibilidade de manutenção e pode exigir exodontia, encaminhamento ou mudança no plano restaurador/periodontal/endodôntico.",
    "synonyms": [
      "dente com prognóstico ruim",
      "dente condenado",
      "dente perdido",
      "dente sem prognóstico",
      "dente sem previsibilidade",
      "dente indicado para extração",
      "dente para extrair",
      "dente sem suporte",
      "dente com muita perda óssea",
      "dente com mobilidade severa",
      "dente com fratura radicular",
      "dente com pouca estrutura",
      "dente irrestaurável",
      "dente não dá para restaurar",
      "vale a pena manter o dente",
      "exodontia ou manter",
      "manter ou extrair"
    ],
    "quickLabel": "Caminho provável",
    "quick": "Quando o dente parece ter prognóstico ruim, diferencie se o problema principal é periodontal, estrutural, endodôntico, fratura radicular ou impossibilidade restauradora.",
    "changesLabel": "O que ajuda a diferenciar?",
    "changes": [
      "Há mobilidade grau III, perda óssea avançada ou dente sem suporte suficiente?\n→ O prognóstico periodontal pode ser desfavorável",
      "Há bolsa profunda isolada, lesão lateral ou dor ao soltar a mordida?\n→ Suspeite fratura radicular",
      "Há pouca estrutura coronária, margem subgengival profunda ou impossibilidade de isolamento?\n→ Avalie se o dente ainda é restaurável",
      "Há lesão endodôntica extensa, fístula recorrente ou retratamento com baixa previsibilidade?\n→ Reavalie o custo/benefício de manter o dente",
      "O dente é pilar de prótese, tem coroa/pino ou recebe muita carga?\n→ A exigência funcional pode piorar o prognóstico",
      "A manutenção exige múltiplos procedimentos com baixa previsibilidade?\n→ Considere exodontia ou encaminhamento antes de prometer manutenção"
    ],
    "protocolsLabel": "Próximo passo",
    "protocols": [
      {
        "id": "avaliacao-fratura-radicular",
        "label": "Suspeita de fratura radicular, bolsa isolada ou lesão lateral? → Avaliação de fratura radicular / prognóstico desfavorável"
      },
      {
        "type": "note",
        "label": "Mobilidade severa, perda óssea avançada ou suporte periodontal insuficiente? → Avaliar exodontia, encaminhamento periodontal ou planejamento reabilitador"
      },
      {
        "type": "conduct",
        "id": "dente-pouca-estrutura",
        "label": "Pouca estrutura remanescente, margem subgengival ou dúvida de restaurabilidade? → Dente com pouca estrutura"
      },
      {
        "id": "pino-nucleo",
        "label": "Dente tratado endodonticamente com pouca retenção, mas ainda restaurável? → Pino de Fibra + Núcleo em Resina"
      },
      {
        "id": "nova-coroa",
        "label": "Necessidade de nova coroa para reabilitar o dente? → Planejar Nova Coroa"
      },
      {
        "type": "conduct",
        "id": "inchaco-rosto",
        "label": "Infecção, edema, fístula ou sinais sistêmicos associados? → Inchaço no rosto"
      },
      {
        "type": "conduct",
        "id": "fistula-gengiva",
        "label": "Infecção, edema, fístula ou sinais sistêmicos associados? → Fístula na gengiva"
      }
    ],
    "related": []
  }
};
