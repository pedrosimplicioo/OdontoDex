var ua = navigator.userAgent;

  function isInstagram() {
    return /Instagram/i.test(ua);
  }
  function isFacebook() {
    return /FBAN|FBAV/i.test(ua);
  }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(ua);
  }
  function isSafari() {
    return /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  }
  function isInAppBrowser() {
    return isInstagram() || isFacebook() || (!isIOS() && /Instagram|FBAN|FBAV/i.test(ua));
  }
  function copiarLinkOdontodex() {
    navigator.clipboard.writeText('https://www.odontodex.com.br').then(function() {
      alert('Link copiado! Agora abra o Chrome ou Safari e cole na barra de endereço.');
    }).catch(function() {
      alert('Copie o link: https://www.odontodex.com.br');
    });
  }

  function passoPasso(num, texto) {
    return '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;"><div style="min-width:22px;height:22px;border-radius:50%;background:#7C3FA0;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;">' + num + '</div><div style="font-size:13px;color:#CBD5E1;line-height:1.5;">' + texto + '</div></div>';
  }

  var mostrar = false;
  var subtitulo = '';
  var passos = '';

  if (isInstagram() || isFacebook()) {
    mostrar = true;
    subtitulo = 'Você está acessando pelo app do Instagram. Para instalar o OdontoDex, abra no navegador do seu celular. É rapidinho!';
    if (isIOS()) {
      passos =
        passoPasso(1, 'Toque nos 3 pontinhos (···) no canto superior direito da tela') +
        passoPasso(2, 'Escolha "Abrir no Safari"') +
        passoPasso(3, 'No Safari, toque em "Compartilhar" e depois "Adicionar à Tela Inicial"');
    } else {
      passos =
        passoPasso(1, 'Toque nos 3 pontinhos (⋮) no canto superior direito da tela') +
        passoPasso(2, 'Escolha "Abrir no Chrome" ou "Abrir no navegador"') +
        passoPasso(3, 'No Chrome, toque em "Instalar app" quando aparecer o banner');
    }
  } else if (isIOS() && !isSafari()) {
    mostrar = true;
    subtitulo = 'Para instalar o OdontoDex no seu iPhone, você precisa usar o Safari. É rapidinho!';
    passos =
      passoPasso(1, 'Copie o link abaixo') +
      passoPasso(2, 'Abra o Safari no seu iPhone') +
      passoPasso(3, 'Cole o link e acesse o app') +
      passoPasso(4, 'Toque em "Compartilhar" e depois "Adicionar à Tela Inicial"');
  }

  if (mostrar) {
    document.getElementById('iab-subtitulo').textContent = subtitulo;
    document.getElementById('iab-passos').innerHTML = passos;
    var w = document.getElementById('ios-browser-warning');
    if (w) w.style.display = 'flex';
  }
