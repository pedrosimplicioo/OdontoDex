var CLINICAL_SEARCH_INTENTS = {
  dor_inflamacao: {
    label: "Dor / inflamação",
    badges: ["Urgência"],
    synonyms: [
      "dente doente", "dente doendo", "dor forte", "dor intensa", "latejando",
      "dor espontânea", "dor noturna", "inflamado", "inflamação", "pulpite",
      "sensibilidade intensa", "dor ao frio", "dor ao mastigar"
    ]
  },
  dor_mastigar: {
    label: "Dor ao mastigar",
    badges: [],
    synonyms: [
      "dor ao mastigar", "dor ao morder", "dói quando mastiga", "doi quando mastiga",
      "dor ao fechar a boca", "dente dói ao mastigar", "dente doi ao mastigar",
      "dor na mordida", "dor quando aperta os dentes", "dor ao encostar o dente",
      "dor ao morder comida", "dente sensível ao mastigar", "dente sensivel ao mastigar"
    ]
  },
  sensibilidade_cervical: {
    label: "Sensibilidade cervical",
    badges: [],
    synonyms: [
      "dente sensível", "dente sensivel", "sensibilidade", "sensibilidade leve",
      "sensibilidade curta", "sensibilidade localizada", "sensibilidade cervical",
      "hipersensibilidade", "hipersensibilidade dentinária", "hipersensibilidade dentinaria",
      "recessão gengival", "recessao gengival", "retração gengival", "retracao gengival",
      "raiz exposta", "dentina exposta", "água gelada", "agua gelada",
      "frio no dente", "ar no dente", "escovação dói", "escovacao doi",
      "doce dói", "doce doi", "toque cervical"
    ]
  },
  infeccao: {
    label: "Infecção",
    badges: ["Urgência", "Prescrição"],
    synonyms: [
      "infecção", "infeccionado", "abscesso", "pus", "edema", "inchaço",
      "rosto inchado", "febre", "trismo", "fístula", "drenagem"
    ]
  },
  anestesia: {
    label: "Anestesia",
    badges: [],
    synonyms: [
      "anestesia", "não anestesia", "nao anestesia", "anestesia não pega",
      "anestesia nao pega", "não pegou anestesia", "não adormeceu",
      "dor mesmo anestesiado", "intraligamentar", "intrapulpar"
    ]
  },
  coroa_protese_fixa: {
    label: "Coroa / prótese fixa",
    badges: [],
    synonyms: [
      "coroa", "coroa caiu", "coroa soltou", "coroa não entra",
      "coroa nao entra", "pino soltou", "núcleo soltou", "nucleo soltou",
      "pino núcleo", "pino nucleo", "prótese fixa", "protese fixa", "jaqueta"
    ]
  },

  restauracao_procedimento: {
    label: "Restaura??o / resina",
    badges: ["Dent?stica"],
    synonyms: [
      "restauracao", "restaura??o", "restau", "restaurar", "fazer restauracao",
      "fazer restaura??o", "como fazer restauracao", "como fazer restaura??o",
      "restauracao de rotina", "restaura??o de rotina", "restauracao direta",
      "restaura??o direta", "resina composta", "resina", "obtura??o",
      "obturacao", "protocolo de restauracao", "protocolo de restaura??o",
      "dentistica restauradora", "dent?stica restauradora", "classe i",
      "classe 1", "classe ii", "classe 2"
    ]
  },
  acabamento_proximal: {
    label: "Acabamento proximal",
    badges: [],
    synonyms: [
      "acabamento proximal", "polimento proximal", "contato proximal",
      "fio rasga", "fio desfia", "fio trava", "fio dental rasga",
      "fio dental desfia", "fio não passa", "fio nao passa", "overhang",
      "excesso proximal", "sobrecontorno proximal", "tira serrilhada",
      "tira interproximal", "tira de lixa", "classe ii", "classe 2",
      "restauração proximal", "restauracao proximal", "matriz seccional",
      "anel separador", "cunha", "pré-cunhamento", "pre cunhamento",
      "parede proximal"
    ]
  },
  ajuste_oclusal_restauracao: {
    label: "Ajuste oclusal em restauração",
    badges: [],
    synonyms: [
      "ajuste oclusal em restauração", "ajuste oclusal em restauracao",
      "restauração alta", "restauracao alta", "mordida alta",
      "batendo alto", "papel articular", "papel carbono", "carbono",
      "hiperoclusão", "hiperoclusao", "contato prematuro", "mic",
      "máxima intercuspidação", "maxima intercuspidacao", "lateralidade",
      "protrusão", "protrusao", "shimstock", "interferência dinâmica",
      "interferencia dinamica"
    ]
  },
  restauracao_solto_fratura: {
    label: "Restauração caiu / fraturou",
    badges: [],
    synonyms: [
      "restauração caiu", "restauracao caiu", "obturação caiu", "obturacao caiu",
      "restauração soltou", "restauracao soltou", "restauração descolou",
      "restauracao descolou", "perdeu a restauração", "perdeu a restauracao",
      "caiu a resina", "caiu a obturação", "caiu a obturacao",
      "restauração fraturou", "restauracao fraturou", "restauração quebrou",
      "restauracao quebrou", "resina quebrou", "resina lascou",
      "lascou a restauração", "lascou a restauracao"
    ]
  },
  protese_removivel: {
    label: "Prótese removível",
    badges: [],
    synonyms: [
      "ppr", "pr\u00f3tese remov\u00edvel", "protese removivel", "pr\u00f3tese total",
      "protese total", "dentadura", "machuca", "balan\u00e7a", "balanca",
      "nova protese total", "nova pr\u00f3tese total", "fazer dentadura nova",
      "dentadura nova", "confeccao de protese total", "confec\u00e7\u00e3o de pr\u00f3tese total",
      "moldagem funcional", "moldeira individual", "selado periferico",
      "selado perif\u00e9rico", "rodete", "dvo", "nova pprg", "nova ppr",
      "confeccao de pprg", "confec\u00e7\u00e3o de pprg", "estrutura metalica ppr",
      "estrutura met\u00e1lica ppr", "dentes pilares", "nichos", "planos guia",
      "planos-guia", "grampos ppr", "apoios ppr"
    ]
  },
  sangramento: {
    label: "Sangramento",
    badges: ["Urgência"],
    synonyms: [
      "sangramento", "sangra", "sangrando", "hemorragia", "não para sangue",
      "nao para sangue", "sangramento não para", "sangramento nao para",
      "hemostasia", "coágulo", "coagulo"
    ]
  },
  trauma: {
    label: "Trauma",
    badges: ["Urgência"],
    synonyms: [
      "trauma", "bateu o dente", "dente quebrou", "fratura", "avulsão",
      "avulsao", "luxação", "luxacao"
    ]
  },
  espicula_ossea: {
    label: "Esp\u00edcula \u00f3ssea",
    badges: [],
    synonyms: [
      "espicula ossea", "esp\u00edcula \u00f3ssea", "osso espetando",
      "osso exposto", "ponta de osso", "borda ossea", "borda \u00f3ssea",
      "regularizacao ossea", "regulariza\u00e7\u00e3o \u00f3ssea", "sequestro osseo",
      "sequestro \u00f3sseo", "fragmento osseo", "fragmento \u00f3sseo",
      "alveolo espetando", "alv\u00e9olo espetando", "pos operatorio osso",
      "p\u00f3s-operat\u00f3rio osso"
    ]
  },
  fratura_radicular: {
    label: "Fratura radicular",
    badges: ["Urg\u00eancia"],
    synonyms: [
      "fratura radicular", "fratura vertical", "trinca radicular", "raiz fraturada",
      "dor ao soltar a mordida", "dor ao aliviar a mordida", "dor localizada ao mastigar",
      "bolsa profunda isolada", "bolsa estreita profunda", "fistula recorrente",
      "f\u00edstula recorrente", "lesao em j", "les\u00e3o em j", "perda ossea vertical",
      "perda \u00f3ssea vertical", "dente trincado", "suspeita de fratura"
    ]
  },
  aumento_coroa_clinica: {
    label: "Aumento de coroa cl\u00ednica",
    badges: [],
    synonyms: [
      "aumento de coroa", "aumento de coroa clinica", "aumento de coroa cl\u00ednica",
      "margem subgengival", "carie subgengival", "c\u00e1rie subgengival",
      "fratura subgengival", "pouca estrutura", "pouco remanescente",
      "sem ferrula", "sem f\u00e9rula", "ferrula", "f\u00e9rula",
      "espaco biologico", "espa\u00e7o biol\u00f3gico", "osteotomia",
      "osteoplastia", "gengivectomia", "retencao de coroa", "reten\u00e7\u00e3o de coroa"
    ]
  },
  prescricao: {
    label: "Prescrição",
    badges: ["Prescrição"],
    synonyms: [
      "prescrição", "prescricao", "receita", "remédio", "remedio",
      "medicação", "medicacao", "tomar", "nimesulida", "ibuprofeno",
      "paracetamol", "dipirona", "amoxicilina", "antibiótico", "antibiotico",
      "anti-inflamatório", "anti inflamatorio", "analgésico", "analgesico"
    ]
  },
  gestante: {
    label: "Gestante",
    badges: ["Gestante", "Prescrição"],
    synonyms: [
      "gestante", "grávida", "gravida", "lactante", "amamentando",
      "pode tomar grávida", "pode tomar gravida", "gravidez", "obstetra"
    ]
  },
  crianca: {
    label: "Pediátrico",
    badges: ["Pediátrico", "Prescrição"],
    synonyms: [
      "criança", "crianca", "infantil", "pediátrico", "pediatrico",
      "odontopediatria", "bebê", "bebe", "kg", "dose pediátrica",
      "dose pediatrica"
    ]
  },
  anticoagulado: {
    label: "Anticoagulado",
    badges: ["Anticoagulado", "Urgência"],
    synonyms: [
      "anticoagulado", "anticoagulante", "marevan", "varfarina", "xarelto",
      "rivaroxabana", "eliquis", "apixabana", "coagulopata", "coagulopatas",
      "hemofilia", "inr"
    ]
  },
  exodontia_extracao: {
    label: "Exodontia / extração",
    badges: ["Cirurgia"],
    synonyms: [
      "exodontia", "extracao", "extração", "extrair", "extrair dente",
      "tirar dente", "arrancar dente", "remover dente", "dente para extrair",
      "dente para tirar", "dente incluso", "dente impactado", "siso",
      "terceiro molar", "raiz partiu na extracao", "raiz partiu na extração",
      "raiz fraturou na extracao", "raiz fraturou na extração",
      "pos extracao", "pós extração", "pos exodontia", "pós exodontia"
    ]
  },
  urgencia: {
    label: "Urgência",
    badges: ["Urgência"],
    synonyms: [
      "urgência", "urgencia", "emergência", "emergencia", "agudo",
      "aguda", "rápido", "rapido", "socorro", "não aguenta", "nao aguenta"
    ]
  }
};

var CLINICAL_SEARCH_RELATIONS = {
  sensibilidade_cervical: [
    {type: "conduct", id: "dente-sensivel", weight: 180},
    {type: "protocol", id: "recessao-gengival", weight: 150},
    {type: "protocol", id: "dessensibilizante", weight: 130},
    {type: "protocol", id: "ajuste-oclusal-restauracao", weight: 46},
    {type: "protocol", id: "restauracao-carie", weight: 42}
  ],
  dor_inflamacao: [
    {type: "protocol", id: "pulpite-irreversivel", weight: 96, badges: ["Urgência"]},
    {type: "protocol", id: "endo-urgencia", weight: 92, badges: ["Urgência"]},
    {type: "protocol", id: "pulpite-reversivel", weight: 84},
    {type: "protocol", id: "medicacao", weight: 78, badges: ["Prescrição"]},
    {type: "prescription", id: "abscesso-periapical", weight: 62, badges: ["Prescrição"]}
  ],
  dor_mastigar: [
    {type: "conduct", id: "dor-ao-mastigar", weight: 170},
    {type: "conduct", id: "restauracao-ficou-alta", weight: 132},
    {type: "protocol", id: "ajuste-oclusal-restauracao", weight: 102},
    {type: "protocol", id: "pulpite-reversivel", weight: 64},
    {type: "protocol", id: "pulpite-irreversivel", weight: 60, badges: ["Urgência"]}
  ],
  infeccao: [
    
    
    {type: "protocol", id: "drenagem-abscesso", weight: 112, badges: ["Urg\u00eancia"]},{type: "protocol", id: "infeccao-odontogenica-sinais-sistemicos", weight: 118, badges: ["Urg\u00eancia", "Prescri\u00e7\u00e3o"]},{type: "protocol", id: "abscesso-perio", weight: 88},
    {type: "protocol", id: "endo-urgencia", weight: 76, badges: ["Urgência"]},
    {type: "prescription", id: "abscesso-periapical", weight: 82, badges: ["Prescrição"]},
    {type: "prescription", id: "abscesso-periodontal", weight: 78, badges: ["Prescrição"]}
  ],
  anestesia: [
    {type: "protocol", id: "endo-urgencia", weight: 92, badges: ["Urgência"]},
    {type: "protocol", id: "pulpite-irreversivel", weight: 88, badges: ["Urgência"]}
  ],
  coroa_protese_fixa: [
    {type: "conduct", id: "coroa-caiu", weight: 96},
    {type: "conduct", id: "pino-nucleo-soltou", weight: 92},
    {type: "conduct", id: "coroa-nao-entra-card", weight: 90},
    {type: "protocol", id: "recimentacao-coroa-pino-nucleo", weight: 82},
    {type: "protocol", id: "pino-nucleo", weight: 76},
    {type: "protocol", id: "coroa-nao-entra", weight: 74},
    {type: "protocol", id: "nova-coroa", weight: 64}
  ],

  restauracao_procedimento: [
    {type: "protocol", id: "trocar-rest", weight: 190, badges: ["Dent?stica"]},
    {type: "protocol", id: "restauracao-carie", weight: 176, badges: ["Dent?stica"]},
    {type: "protocol", id: "restauracao-proximal-classe-ii", weight: 156, badges: ["Dent?stica"]},
    {type: "protocol", id: "restauracao-fratura", weight: 132, badges: ["Dent?stica"]},
    {type: "protocol", id: "remocao-seletiva", weight: 104},
    {type: "protocol", id: "protecao-pulpar", weight: 92},
    {type: "protocol", id: "acabamento-proximal-restauracao", weight: 82},
    {type: "protocol", id: "resina-comp", weight: 76}
  ],
  acabamento_proximal: [
    {type: "conduct", id: "fio-dental-nao-passa", weight: 150},
    {type: "conduct", id: "contato-proximal-aberto", weight: 132},
    {type: "protocol", id: "acabamento-proximal-restauracao", weight: 106},
    {type: "protocol", id: "restauracao-proximal-classe-ii", weight: 104}
  ],
  ajuste_oclusal_restauracao: [
    {type: "conduct", id: "restauracao-ficou-alta", weight: 156},
    {type: "conduct", id: "dor-ao-mastigar", weight: 124},
    {type: "protocol", id: "ajuste-oclusal-restauracao", weight: 108}
  ],
  restauracao_solto_fratura: [
    {type: "conduct", id: "restauracao-caiu", weight: 172},
    {type: "conduct", id: "restauracao-fraturou", weight: 166},
    {type: "conduct", id: "dente-sensivel", weight: 80},
    {type: "conduct", id: "dor-ao-mastigar", weight: 76},
    {type: "protocol", id: "trocar-rest", weight: 96},
    {type: "protocol", id: "aumento-coroa-clinica", weight: 74},
    {type: "protocol", id: "avaliacao-fratura-radicular", weight: 70, badges: ["Urg\u00eancia"]},
    {type: "protocol", id: "pino-nucleo", weight: 58},
    {type: "protocol", id: "coroa-direta", weight: 54},
    {type: "protocol", id: "extracao-simples", weight: 42}
  ],
  protese_removivel: [
    {type: "protocol", id: "nova-pprg", weight: 114},
    {type: "protocol", id: "nova-protese-total", weight: 118},
    {type: "conduct", id: "protese-total-machuca", weight: 90},
    {type: "conduct", id: "ppr-machuca-balanca", weight: 86}
  ],
  sangramento: [
    {type: "protocol", id: "hemostasia", weight: 96, badges: ["Urgência"]},
    {type: "prescription", id: "hemorragias", weight: 82, badges: ["Prescrição", "Urgência"]},
    {type: "profile", id: "coagulopatas", weight: 76, badges: ["Anticoagulado"]},
    {type: "protocol", id: "extracao-simples", weight: 52}
  ],
  trauma: [
    {type: "protocol", id: "extracao-simples", weight: 62, badges: ["Urgência"]},
    {type: "protocol", id: "hemostasia", weight: 58, badges: ["Urgência"]}
  ],
  exodontia_extracao: [
    {type: "protocol", id: "extracao-simples", weight: 190, badges: ["Cirurgia"]},
    {type: "protocol", id: "extracao-cirurgica", weight: 174, badges: ["Cirurgia"]},
    {type: "protocol", id: "hemostasia", weight: 86, badges: ["Urgência"]},
    {type: "conduct", id: "dor-apos-extracao", weight: 72, badges: ["Pós-operatório"]},
    {type: "protocol", id: "alveolite-seca", weight: 54},
    {type: "protocol", id: "alveolite-umida", weight: 50}
  ],
  espicula_ossea: [
    {type: "protocol", id: "remocao-espicula-ossea", weight: 124},
    {type: "protocol", id: "alveolite-seca", weight: 58},
    {type: "protocol", id: "alveolite-umida", weight: 52}
  ],
  fratura_radicular: [
    {type: "protocol", id: "avaliacao-fratura-radicular", weight: 124, badges: ["Urg\u00eancia"]},
    {type: "conduct", id: "dor-ao-mastigar", weight: 84},
    {type: "protocol", id: "endo-urgencia", weight: 52, badges: ["Urg\u00eancia"]}
  ],
  aumento_coroa_clinica: [
    {type: "protocol", id: "aumento-coroa-clinica", weight: 124},
    {type: "conduct", id: "restauracao-caiu", weight: 84},
    {type: "conduct", id: "restauracao-fraturou", weight: 80},
    {type: "protocol", id: "nova-coroa", weight: 68},
    {type: "protocol", id: "coroa-direta", weight: 56}
  ],
  prescricao: [
    {type: "protocol", id: "medicacao", weight: 82, badges: ["Prescrição"]},
    {type: "prescription", id: "abscesso-periapical", weight: 72, badges: ["Prescrição"]},
    {type: "prescription", id: "abscesso-periodontal", weight: 68, badges: ["Prescrição"]},
    {type: "prescription", id: "odontopediatria", weight: 58, badges: ["Pediátrico", "Prescrição"]}
  ],
  gestante: [
    {type: "alert", id: "gestantes", weight: 112, badges: ["Gestante", "Prescrição"]},
    {type: "protocol", id: "medicacao", weight: 86, badges: ["Gestante", "Prescrição"]},
    {type: "prescription", id: "abscesso-periapical", weight: 78, badges: ["Gestante", "Prescrição"], profile: "gravida"},
    {type: "prescription", id: "abscesso-periodontal", weight: 76, badges: ["Gestante", "Prescrição"], profile: "gravida"}
  ],
  crianca: [
    {type: "prescription", id: "odontopediatria", weight: 98, badges: ["Pediátrico", "Prescrição"], profile: "moderada"},
    {type: "protocol", id: "medicacao", weight: 58, badges: ["Pediátrico", "Prescrição"]},
    {type: "protocol", id: "endo-urgencia", weight: 52, badges: ["Pediátrico", "Urgência"]}
  ],
  anticoagulado: [
    {type: "alert", id: "coagulopatas", weight: 110, badges: ["Anticoagulado", "Urgência"]},
    {type: "protocol", id: "hemostasia", weight: 88, badges: ["Anticoagulado", "Urgência"]},
    {type: "prescription", id: "hemorragias", weight: 76, badges: ["Anticoagulado", "Prescrição"]},
    {type: "protocol", id: "extracao-simples", weight: 64, badges: ["Anticoagulado"]}
  ],
  urgencia: [
    
    
    {type: "protocol", id: "drenagem-abscesso", weight: 84, badges: ["Urg\u00eancia"]},{type: "protocol", id: "infeccao-odontogenica-sinais-sistemicos", weight: 92, badges: ["Urg\u00eancia", "Prescri\u00e7\u00e3o"]},{type: "protocol", id: "endo-urgencia", weight: 78, badges: ["Urgência"]},
    {type: "protocol", id: "hemostasia", weight: 76, badges: ["Urgência"]},
    {type: "protocol", id: "pulpite-irreversivel", weight: 74, badges: ["Urgência"]}
  ]
};

var CLINICAL_SEARCH_COMMON = [
  {type: "conduct", id: "coroa-caiu", weight: 48},
  {type: "conduct", id: "pino-nucleo-soltou", weight: 44},
  {type: "conduct", id: "coroa-nao-entra-card", weight: 42},
  {type: "protocol", id: "endo-urgencia", weight: 38, badges: ["Urgência"]}
];

var CLINICAL_SEARCH_CONTENT_GAPS = {
  dor_inflamacao: "Ainda não existe um card de conduta rápida específico para dor/inflamação.",
  infeccao: "Ainda não existe um card de conduta rápida específico para infecção/abscesso.",
  anestesia: "Ainda não existe um card de conduta rápida específico para falha de anestesia."
};
