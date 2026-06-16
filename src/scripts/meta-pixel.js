// ==================== META PIXEL ====================
// Instala o Meta Pixel no app sem alterar fluxo de login, cadastro ou pagamentos.
(function initOdontoDexMetaPixel() {
  const META_PIXEL_ID = "5474838429194052";

  if (!window.__odontodexMetaPixelInitialized) {
    window.__odontodexMetaPixelInitialized = true;
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    if (window.fbq) window.fbq("init", META_PIXEL_ID);
  }

  window.trackMetaPixelEvent = function(eventName, eventData) {
    if (!window.fbq) return;
    window.fbq("track", eventName, eventData || {});
  };

  window.trackMetaPageViewOnce = function(surface) {
    window.__odontodexMetaPixelPageViews = window.__odontodexMetaPixelPageViews || {};
    const key = surface || window.location.pathname || "app";
    if (window.__odontodexMetaPixelPageViews[key]) return;
    window.__odontodexMetaPixelPageViews[key] = true;
    // Evento Meta Pixel: PageView do app.
    window.trackMetaPixelEvent("PageView", { surface: key });
  };

  window.trackMetaCompleteRegistrationOnce = function(userId, method) {
    if (!userId) return;
    const storageKey = "odontodex_meta_complete_registration_" + userId;
    if (localStorage.getItem(storageKey) === "1") return;
    localStorage.setItem(storageKey, "1");
    // Evento Meta Pixel: CompleteRegistration após cadastro concluído com sucesso.
    window.trackMetaPixelEvent("CompleteRegistration", {
      content_name: "OdontoDex",
      status: "success",
      method: method || "firebase_auth"
    });
  };
})();
