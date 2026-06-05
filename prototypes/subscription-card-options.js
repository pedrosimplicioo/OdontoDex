const states = {
  assinatura: {
    icon: "↻",
    kicker: "Renovação ativa",
    title: "Premium mensal",
    short: "Válido até 4 de julho",
    text: "Sua assinatura renova automaticamente.",
    validity: "4 de julho de 2026",
    renewal: "Ativa",
    action: "Cancelar renovação",
    disabled: false,
    note: "O cancelamento interrompe a renovação, mantendo o acesso já pago."
  },
  pix: {
    icon: "✓",
    kicker: "Acesso já pago",
    title: "Premium por pagamento avulso",
    short: "Sem renovação automática",
    text: "Você pode iniciar uma assinatura agora sem perder o período já pago.",
    validity: "4 de julho de 2026",
    renewal: "Sem recorrência",
    action: "Iniciar assinatura",
    disabled: false,
    note: "Seu acesso atual será preservado."
  },
  trial: {
    icon: "7",
    kicker: "Período de teste",
    title: "Trial Premium",
    short: "Teste ativo até 12 de junho",
    text: "Você pode assinar antes do fim do trial para manter o acesso sem interrupção.",
    validity: "12 de junho de 2026",
    renewal: "Não renova",
    action: "Assinar Premium",
    disabled: false,
    note: "A assinatura entra pelo fluxo normal de pagamento do app."
  },
  free: {
    icon: "○",
    kicker: "Plano gratuito",
    title: "Sem assinatura ativa",
    short: "Premium disponível",
    text: "Assine para liberar os recursos Premium e manter acesso contínuo.",
    validity: "Sem Premium ativo",
    renewal: "Inativa",
    action: "Assinar Premium",
    disabled: false,
    note: "O pagamento só libera Premium depois da confirmação segura."
  },
  cancelada: {
    icon: "✓",
    kicker: "Renovação cancelada",
    title: "Premium ativo até o fim do período",
    short: "Acesso até 4 de julho",
    text: "Você mantém o acesso até a validade atual e pode reativar a renovação.",
    validity: "4 de julho de 2026",
    renewal: "Cancelada",
    action: "Reativar assinatura",
    disabled: false,
    note: "Seu acesso atual será preservado."
  }
};

const els = {
  icon: document.getElementById("subIcon"),
  kicker: document.getElementById("subKicker"),
  title: document.getElementById("subTitle"),
  text: document.getElementById("subText"),
  short: document.getElementById("subShort"),
  validity: document.getElementById("subValidity"),
  renewal: document.getElementById("subRenewal"),
  action: document.getElementById("subAction"),
  note: document.getElementById("subNote"),
  tabs: [...document.querySelectorAll(".state-tabs button")],
  theme: document.getElementById("themeBtn")
};

function renderState(name) {
  const state = states[name];
  els.icon.textContent = state.icon;
  els.kicker.textContent = state.kicker;
  els.title.textContent = state.title;
  els.short.textContent = state.short;
  els.text.textContent = state.text;
  els.validity.textContent = state.validity;
  els.renewal.textContent = state.renewal;
  els.action.textContent = state.action;
  els.action.disabled = state.disabled;
  els.note.textContent = state.note;
  els.tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.state === name));
}

els.tabs.forEach(tab => {
  tab.addEventListener("click", () => renderState(tab.dataset.state));
});

els.theme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("subToggle").addEventListener("click", () => {
  const card = document.getElementById("subscriptionCard");
  const expanded = !card.classList.contains("expanded");
  card.classList.toggle("expanded", expanded);
  document.getElementById("subToggle").setAttribute("aria-expanded", String(expanded));
});
