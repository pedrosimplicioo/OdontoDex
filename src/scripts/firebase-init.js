// ==================== FIREBASE ====================
const firebaseConfig = {
  apiKey:"AIzaSyBGYluL3f0yuaZnpc-fX8sIQhlCeVo6bwk",
  authDomain:"guia-odonto-a24ed.firebaseapp.com",
  projectId:"guia-odonto-a24ed",
  storageBucket:"guia-odonto-a24ed.firebasestorage.app",
  messagingSenderId:"822223061470",
  appId:"1:822223061470:web:8b1447dcfb37e7eeda1d4f"
};
if(window.firebase) {
  firebase.initializeApp(firebaseConfig);
}
const auth = window.firebase ? firebase.auth() : {
  currentUser: null,
  onAuthStateChanged(callback){
    setTimeout(() => callback(null), 0);
    return () => {};
  }
};
const db = window.firebase ? firebase.firestore() : {
  collection(){
    throw new Error("Firestore indisponível offline.");
  }
};

// ==================== VARIÁVEIS GLOBAIS ====================
let currentUser = null;
let DATA = null;
let FAVS = [];
let HISTORY = [];
let USAGE_COUNT = {};
let selCat = null;
let selSit = null;
let currentProtoId = '';
let currentCondutaId = '';
let navigationHistory = [];
