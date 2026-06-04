function initData(){
  const DATA_VERSION = "v21";
  const storedVersion = localStorage.getItem("guiaOdontoDataVersion");
  if(storedVersion !== DATA_VERSION){
    localStorage.clear();
    localStorage.setItem("guiaOdontoDataVersion", DATA_VERSION);
  }
  DATA = loadData();
  FAVS = loadFavs();
  HISTORY = loadHistory();
  USAGE_COUNT = loadUsageCount();
}
function loadData(){try{const s=localStorage.getItem("guiaOdontoV3");return s?JSON.parse(s):JSON.parse(JSON.stringify(INITIAL_DATA));}catch{return JSON.parse(JSON.stringify(INITIAL_DATA));}}
function saveData(){try{localStorage.setItem("guiaOdontoV3",JSON.stringify(DATA));}catch{}}
function loadFavs(){try{return JSON.parse(localStorage.getItem("guiaOdontoFavs")||'[]');}catch{return[];}}
function saveFavs(){try{localStorage.setItem("guiaOdontoFavs",JSON.stringify(FAVS));}catch{}}
function loadHistory(){try{return JSON.parse(localStorage.getItem("guiaOdontoHistory")||'[]');}catch{return[];}}
function saveHistory(){try{localStorage.setItem("guiaOdontoHistory",JSON.stringify(HISTORY.slice(0,20)));}catch{}}
function loadUsageCount(){try{return JSON.parse(localStorage.getItem("guiaOdontoUsage")||'{}');}catch{return{};}}
function saveUsageCount(){try{localStorage.setItem("guiaOdontoUsage",JSON.stringify(USAGE_COUNT));}catch{}}
