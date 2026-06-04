// ==================== ANALYTICS FIRESTORE ====================
async function registrarUsoProtocolo(protocoloId) {
  if (!currentUser) return; // só registra se usuário logado
  
  const protocolo = DATA.protocols[protocoloId];
  if (!protocolo) return;
  
  try {
    const agora = new Date();
    const dataStr = agora.toISOString().split('T')[0];
    const mesStr = dataStr.substring(0, 7);
    const hora = agora.getHours();
    const diaSemana = agora.getDay(); // 0=Domingo, 1=Segunda...
    
    await db.collection('analytics_uso_protocolos').add({
      protocoloId: protocoloId,
      protocoloTitulo: protocolo.title,
      usuarioId: currentUser.uid,
      usuarioEmail: currentUser.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      data: dataStr,
      mes: mesStr,
      hora: hora,
      diaSemana: diaSemana
    });
    
    console.log('Analytics: uso registrado', protocolo.title);
  } catch (error) {
    console.error('Erro ao registrar uso:', error);
  }
}
