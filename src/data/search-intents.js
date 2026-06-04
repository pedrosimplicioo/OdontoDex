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
  protese_removivel: {
    label: "Prótese removível",
    badges: [],
    synonyms: [
      "ppr", "prótese removível", "protese removivel", "prótese total",
      "protese total", "dentadura", "machuca", "balança", "balanca"
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
  infeccao: [
    {type: "protocol", id: "abscesso-drenagem", weight: 96, badges: ["Urgência"]},
    {type: "protocol", id: "abscesso-perio", weight: 88},
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
    {type: "protocol", id: "pino-nucleo", weight: 76},
    {type: "protocol", id: "coroa-nao-entra", weight: 74},
    {type: "protocol", id: "nova-coroa", weight: 64}
  ],
  acabamento_proximal: [
    {type: "protocol", id: "acabamento-proximal-restauracao", weight: 106},
    {type: "protocol", id: "restauracao-proximal-classe-ii", weight: 104}
  ],
  ajuste_oclusal_restauracao: [
    {type: "protocol", id: "ajuste-oclusal-restauracao", weight: 108}
  ],
  protese_removivel: [
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
    {type: "protocol", id: "endo-urgencia", weight: 78, badges: ["Urgência"]},
    {type: "protocol", id: "abscesso-drenagem", weight: 78, badges: ["Urgência"]},
    {type: "protocol", id: "hemostasia", weight: 76, badges: ["Urgência"]},
    {type: "protocol", id: "pulpite-irreversivel", weight: 74, badges: ["Urgência"]}
  ]
};

var CLINICAL_SEARCH_COMMON = [
  {type: "conduct", id: "coroa-caiu", weight: 48},
  {type: "conduct", id: "pino-nucleo-soltou", weight: 44},
  {type: "conduct", id: "coroa-nao-entra-card", weight: 42},
  {type: "protocol", id: "endo-urgencia", weight: 38, badges: ["Urgência"]},
  {type: "protocol", id: "abscesso-drenagem", weight: 36, badges: ["Urgência"]}
];

var CLINICAL_SEARCH_CONTENT_GAPS = {
  dor_inflamacao: "Ainda não existe um card de conduta rápida específico para dor/inflamação.",
  infeccao: "Ainda não existe um card de conduta rápida específico para infecção/abscesso.",
  anestesia: "Ainda não existe um card de conduta rápida específico para falha de anestesia."
};
