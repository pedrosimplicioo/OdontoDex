// ==================== FUNÇÕES DE RASTREAMENTO DO APP ====================

// Função para registrar data de primeiro acesso e atualizar último acesso
async function registrarAcessoUsuario(userId) {
  if (!userId) return;
  
  const hoje = new Date().toISOString().split('T')[0];
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    const updates = {
      ultimoAcesso: firebase.firestore.FieldValue.serverTimestamp(),
      [`acessosPorDia.${hoje}`]: firebase.firestore.FieldValue.increment(1)
    };
    
    // Se não tem dataPrimeiroAcesso, registra agora
    if (!userData?.dataPrimeiroAcesso) {
      updates.dataPrimeiroAcesso = firebase.firestore.FieldValue.serverTimestamp();
    }
    
    await db.collection('users').doc(userId).update(updates);
    console.log('Acesso registrado para', userId);
    
  } catch (error) {
    console.error('Erro ao registrar acesso:', error);
  }
}

// Função para registrar ações do usuário (para AHA, profundidade, tipo de uso)
async function registrarAcaoUsuario(userId, actionType, details = {}) {
  if (!userId) return;
  
  try {
    await db.collection('user_actions').add({
      userId: userId,
      actionType: actionType, // 'open_protocol', 'search', 'favorite', 'forceps', 'diagnostico', 'home_view'
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      data: new Date().toISOString().split('T')[0],
      ...details
    });
    console.log('Ação registrada:', actionType);
  } catch (error) {
    console.error('Erro ao registrar ação:', error);
  }
}

// Função para vincular sessionId da landing com o usuário logado (conversão)
async function vincularSessionIdUsuario(userId) {
  const sessionId = localStorage.getItem('odontodex_session_id');
  if (!sessionId) return;
  
  try {
    // Calcula tempo entre page_view e cadastro
    const pageViewDoc = await db.collection('landing_stats')
      .where('sessionId', '==', sessionId)
      .where('event', '==', 'page_view')
      .limit(1)
      .get();
    
    let tempoEntrePageViewECadastro = null;
    if (!pageViewDoc.empty) {
      const pageViewTime = pageViewDoc.docs[0].data().timestamp?.toDate();
      if (pageViewTime) {
        tempoEntrePageViewECadastro = Math.round((Date.now() - pageViewTime.getTime()) / 1000);
      }
    }
    
    // Salva a conversão
    await db.collection('conversoes_landing').add({
      sessionId: sessionId,
      userId: userId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      tempoEntrePageViewECadastro: tempoEntrePageViewECadastro,
      deviceType: getDeviceType(),
      source: getSource()
    });
    
    console.log('Conversão da landing registrada para sessionId:', sessionId);
    
  } catch (error) {
    console.error('Erro ao vincular sessionId:', error);
  }
}

// Função auxiliar para pegar tipo de dispositivo
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet/i.test(ua)) return 'tablet';
  return 'desktop';
}

// Função auxiliar para pegar fonte de tráfego
function getSource() {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  if (utmSource) return utmSource;
  
  const referrer = document.referrer;
  if (referrer.includes('google')) return 'google';
  if (referrer.includes('facebook')) return 'facebook';
  if (referrer.includes('instagram')) return 'instagram';
  if (referrer.includes('linkedin')) return 'linkedin';
  if (referrer.includes('twitter')) return 'twitter';
  if (referrer) return 'referrer';
  return 'direct';
}
