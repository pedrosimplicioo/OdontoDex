const items = [
  {
    title: 'A coroa caiu',
    type: 'Conduta rápida',
    summary: 'Fluxo simulado para orientar a primeira decisão clínica sem trocar de tela.',
    sections: [
      ['Conduta', ['Avaliar se há dor, mobilidade ou fratura visível.', 'Limpar a peça e o preparo antes de qualquer tentativa de recimentação.', 'Se houver dúvida de adaptação, interromper e indicar avaliação completa.']],
      ['Atenção', ['Não cimentar em caso de fratura, sangramento persistente ou margem claramente aberta.', 'Registrar orientação ao paciente e necessidade de retorno.']]
    ]
  },
  {
    title: 'O pino/núcleo soltou',
    type: 'Conduta rápida',
    summary: 'Exemplo de painel com conteúdo completo preservando a busca ao fundo.',
    sections: [
      ['Conduta', ['Confirmar se o pino saiu inteiro ou fraturado.', 'Avaliar remanescente coronário e condição do conduto.', 'Planejar recimentação ou reconstrução conforme retenção e prognóstico.']],
      ['Erros comuns', ['Forçar reposicionamento sem checar adaptação.', 'Ignorar suspeita de fratura radicular.']]
    ]
  },
  {
    title: 'Moldagem funcional',
    type: 'Protocolo',
    summary: 'Protocolo fictício para visualizar como um conteúdo maior aparece no bottom sheet.',
    sections: [
      ['Sequência', ['Selecionar moldeira individual bem adaptada.', 'Realizar selamento periférico por regiões.', 'Carregar material e assentar com estabilidade até a presa.']],
      ['Checklist', ['Bordas contínuas.', 'Ausência de bolhas relevantes.', 'Registro adequado das áreas de suporte.']]
    ]
  },
  {
    title: 'Prescrição para dor',
    type: 'Protocolo',
    summary: 'Conteúdo simulado para testar leitura, rolagem e fechamento do painel.',
    sections: [
      ['Avaliação', ['Identificar intensidade, origem provável e contraindicações.', 'Checar alergias, gestação, uso de anticoagulantes e histórico gástrico.']],
      ['Orientação', ['Explicar posologia de forma simples.', 'Reforçar sinais de alerta e retorno em caso de piora.']]
    ]
  }
];

const searchCombo = document.getElementById('search-combo');
const searchInput = document.getElementById('search-input');
const clearSearch = document.getElementById('clear-search');
const resultList = document.getElementById('result-list');
const resultCount = document.getElementById('result-count');
const sheetLayer = document.getElementById('sheet-layer');
const sheetBackdrop = document.getElementById('sheet-backdrop');
const sheetClose = document.getElementById('sheet-close');
const bottomSheet = document.getElementById('bottom-sheet');
const sheetType = document.getElementById('sheet-type');
const sheetTitle = document.getElementById('sheet-title');
const sheetSummary = document.getElementById('sheet-summary');
const sheetContent = document.getElementById('sheet-content');

let preservedTerm = '';
let touchStartY = 0;

function normalize(value){
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

function setDropdown(open){
  const shouldOpen = open && searchInput.value.trim().length > 0;
  searchCombo.classList.toggle('open',shouldOpen);
  searchCombo.classList.toggle('has-text',searchInput.value.trim().length > 0);
}

function renderResults(){
  const term = normalize(searchInput.value.trim());
  preservedTerm = searchInput.value;
  searchCombo.classList.toggle('has-text',term.length > 0);

  if(!term){
    resultCount.textContent = '0 resultados';
    resultList.innerHTML = '';
    setDropdown(false);
    return;
  }

  const filtered = items.filter(function(item){
    return normalize(item.title + ' ' + item.type).includes(term);
  });

  resultCount.textContent = filtered.length === 1 ? '1 resultado' : filtered.length + ' resultados';

  if(!filtered.length){
    resultList.innerHTML = '<div class="empty-state">Nenhum resultado simulado para esse termo.</div>';
    setDropdown(true);
    return;
  }

  resultList.innerHTML = filtered.map(function(item){
    return '<button class="result-card" type="button" data-index="' + items.indexOf(item) + '">' +
      '<h3>' + item.title + '</h3>' +
      '<p>' + item.type + '</p>' +
    '</button>';
  }).join('');
  setDropdown(true);
}

function openSheet(item){
  sheetType.textContent = item.type;
  sheetTitle.textContent = item.title;
  sheetSummary.textContent = item.summary;
  sheetContent.innerHTML = item.sections.map(function(section){
    return '<section class="sheet-section">' +
      '<h3>' + section[0] + '</h3>' +
      '<ul>' + section[1].map(function(line){ return '<li>' + line + '</li>'; }).join('') + '</ul>' +
    '</section>';
  }).join('');
  sheetLayer.classList.add('active');
  sheetLayer.setAttribute('aria-hidden','false');
}

function closeSheet(){
  sheetLayer.classList.remove('active');
  sheetLayer.setAttribute('aria-hidden','true');
  searchInput.value = preservedTerm;
  renderResults();
  requestAnimationFrame(function(){ searchInput.focus(); });
}

searchInput.addEventListener('focus',function(){
  if(searchInput.value.trim()) renderResults();
});
searchInput.addEventListener('input',renderResults);

clearSearch.addEventListener('click',function(){
  searchInput.value = '';
  renderResults();
  searchInput.focus();
});

resultList.addEventListener('click',function(event){
  const card = event.target.closest('.result-card');
  if(!card) return;
  preservedTerm = searchInput.value;
  setDropdown(false);
  openSheet(items[Number(card.dataset.index)]);
});

sheetClose.addEventListener('click',closeSheet);
sheetBackdrop.addEventListener('click',closeSheet);

bottomSheet.addEventListener('touchstart',function(event){
  touchStartY = event.touches[0].clientY;
},{passive:true});

bottomSheet.addEventListener('touchend',function(event){
  const diff = event.changedTouches[0].clientY - touchStartY;
  if(bottomSheet.scrollTop === 0 && diff > 80) closeSheet();
},{passive:true});

document.addEventListener('click',function(event){
  if(searchCombo.contains(event.target)) return;
  if(sheetLayer.classList.contains('active')) return;
  setDropdown(false);
});

document.addEventListener('keydown',function(event){
  if(event.key !== 'Escape') return;
  if(sheetLayer.classList.contains('active')) closeSheet();
  else setDropdown(false);
});
