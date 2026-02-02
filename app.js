import { RULES } from "./rules.js";
import { MODES } from "./stages.js";
import { pickSpice } from "./spice.js";

const $ = (sel) => document.querySelector(sel);

const state = {
  modeId: "sprint",
  stageIndex: 0,
  history: [], // {stageId, stageTitle, userText}
  started: false,
  lastSpiceTag: null, // evita repetição do tempero
};

// ---- Consentimento (Termo + LGPD) ----
const CONSENT_KEY = "iza_consent_v1";
const PEDAGOGIC_KEY = "iza_pedagogic_consent_v1";

function hasConsent() {
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}
function setConsentAccepted() {
  localStorage.setItem(CONSENT_KEY, "accepted");
}
function setPedagogicConsent(isAccepted) {
  localStorage.setItem(PEDAGOGIC_KEY, isAccepted ? "accepted" : "declined");
}
export function allowPedagogicUse() {
  return localStorage.getItem(PEDAGOGIC_KEY) === "accepted";
}

function blockUI(isBlocked) {
  $("#input").disabled = isBlocked;
  $("#send").disabled = isBlocked;
  $("#restart").disabled = isBlocked;
  $("#exportTxt").disabled = isBlocked;
  $("#exportPdf").disabled = isBlocked;
  $("#emailDraft").disabled = isBlocked;
  $("#mode").disabled = isBlocked;

  // transparência sempre disponível:
  $("#openTerms").disabled = false;
}

// ---- Texto / helpers ----
function normalize(text) {
  return text.trim().replace(/\s+/g, " ");
}
function pickSnippet(text, maxLen = 90) {
  const t = normalize(text);
  return t.length > maxLen ? t.slice(0, maxLen) + "…" : t;
}
function chooseRule(text) {
  for (const rule of RULES) {
    const m = text.match(rule.pattern);
    if (m) return { rule, groups: m.slice(1) };
  }
  return { rule: RULES[RULES.length - 1], groups: [text] };
}
function format(template, groups) {
  return template.replace(/\{(\d+)\}/g, (_, i) => pickSnippet(groups[Number(i)] ?? ""));
}

function currentMode() {
  return MODES[state.modeId];
}
function currentStage() {
  return currentMode().stages[state.stageIndex];
}

function mdToHtml(md) {
  return md
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

function addMessage(role, md) {
  const box = $("#chat");
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.innerHTML = mdToHtml(md);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function buildStagePrompt() {
  const mode = currentMode();
  const stage = currentStage();
  const total = mode.stages.length;
  return `**Etapa ${stage.id}/${total} — ${stage.title}**\n\n${stage.prompt}`;
}

// conexão curta: no máximo 2 recortes
function connectTwoSnippets() {
  if (state.history.length < 2) return "";
  const a = state.history[state.history.length - 1].userText;
  const b = state.history[state.history.length - 2].userText;
  return `\n\nConecte: **“${pickSnippet(b)}”** + **“${pickSnippet(a)}”**. Qual é a relação?`;
}

// ---- Tempero por etapa ----
function pickSpiceFromAllowed(allowedTags) {
  // tenta algumas vezes até acertar tag do conjunto permitido
  for (let i = 0; i < 14; i++) {
    const spice = pickSpice(state.lastSpiceTag);
    if (allowedTags.includes(spice.tag)) {
      state.lastSpiceTag = spice.tag;
      return spice;
    }
  }
  // fallback: qualquer um
  const fallback = pickSpice(state.lastSpiceTag);
  state.lastSpiceTag = fallback.tag;
  return fallback;
}

function allowedSpiceTagsForStage(modeId, stageId) {
  if (modeId === "sprint") {
    switch (stageId) {
      case 1: return ["Drummond", "Ritmo"];       // Foco (núcleo)
      case 2: return ["Drummond", "Voz"];         // Tensão
      case 3: return ["Imagem", "Adélia"];        // Concretização (cena)
      case 4: return ["Ritmo", "Voz"];            // Tese
      default: return ["Ritmo", "Voz", "Imagem"];
    }
  }

  // path7
  switch (stageId) {
    case 1: return ["Drummond", "Ritmo"];         // Tema-núcleo
    case 2: return ["Drummond", "Voz"];           // Tensão / problema
    case 3: return ["Voz", "Ritmo"];              // Intenção do autor
    case 4: return ["Imagem", "Adélia"];          // Cena concreta
    case 5: return ["Cuidado", "Evaristo"];       // Suposição escondida
    case 6: return ["Cuidado", "Evaristo"];       // Contra-ideia
    case 7: return ["Ritmo", "Voz", "Drummond"];  // Tese + próximo parágrafo
    default: return ["Ritmo", "Voz", "Imagem"];
  }
}

function maybeAddSpice(lastAnsweredStageId) {
  // Ajuste a frequência:
  const chance = state.modeId === "path7" ? 0.45 : 0.25;
  if (Math.random() > chance) return "";

  const allowed = allowedSpiceTagsForStage(state.modeId, lastAnsweredStageId);
  const spice = pickSpiceFromAllowed(allowed);

  return `\n\n_<strong>Tempero Iza</strong> (${spice.tag}):_ ${spice.text}`;
}

// ---- Core do chat ----
function buildElizaMirror(userText) {
  const { rule, groups } = chooseRule(userText);
  const response = rule.responses[Math.floor(Math.random() * rule.responses.length)];
  const safeGroups = (groups?.length ? groups : [userText]).map((g) => pickSnippet(g));
  return format(response, safeGroups);
}

function buildFinalWritingPlan() {
  const mode = currentMode();
  const items = state.history
    .map((h) => `- (${h.stageTitle}) ${pickSnippet(h.userText, 140)}`)
    .join("\n");

  return (
`**Roteiro de escrita (8–12 linhas, usando suas palavras)**

Recortes do seu percurso:
${items}

Agora escreva:
1) Abra com o seu núcleo (primeiro recorte) em 1 frase.
2) Mostre a tensão: por que isso importa?
3) Traga a cena/exemplo como evidência (se você escreveu um).
4) Reconheça uma objeção (se apareceu).
5) Feche com sua tese e o próximo passo do texto.

*(Modo: ${mode.name})*`
  );
}

function isFinished() {
  return state.stageIndex >= currentMode().stages.length;
}

function nextTurn(userText) {
  const stage = currentStage();
  const clean = normalize(userText);

  state.history.push({ stageId: stage.id, stageTitle: stage.title, userText: clean });

  addMessage("user", pickSnippet(clean, 500));

  const mirror = buildElizaMirror(clean);

  // avança etapa
  state.stageIndex += 1;

  if (isFinished()) {
    addMessage("bot", mirror);
    addMessage("bot", buildFinalWritingPlan());
    $("#input").disabled = true;
    $("#send").disabled = true;
    return;
  }

  const nextPrompt = buildStagePrompt();
  let reply = `${mirror}\n\n${nextPrompt}`;

  // tempero por etapa respondida
  reply += maybeAddSpice(stage.id);

  // conectar a partir da etapa 2 (conforme stages.js)
  if (stage.connect) reply += connectTwoSnippets();

  addMessage("bot", reply);
}

function reset() {
  state.stageIndex = 0;
  state.history = [];
  state.started = true;
  state.lastSpiceTag = null;

  $("#chat").innerHTML = "";
  $("#input").disabled = false;
  $("#send").disabled = false;
  $("#input").value = "";

  addMessage(
    "bot",
    `Vamos no modo **${currentMode().name}**.\n\nResponda com 1–3 frases.\n\n${buildStagePrompt()}`
  );
}

// ---- Export ----
function exportText() {
  const mode = currentMode();
  const lines = [];
  lines.push(`IZA — Escrita Reflexiva — ${mode.name}`);
  lines.push(`Site: www.cordel2pontozero.com`);
  lines.push(`Data: ${new Date().toLocaleString()}`);
  lines.push("");

  for (const h of state.history) {
    lines.push(`[${h.stageTitle}]`);
    lines.push(h.userText);
    lines.push("");
  }

  lines.push("=== Roteiro final ===");
  lines.push(buildFinalWritingPlan().replace(/\*\*/g, ""));
  lines.push("");

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `iza-escrita-${state.modeId}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportPdfSimple() {
  window.print();
}

function openEmailDraft() {
  const mode = currentMode();
  const subject = encodeURIComponent(`IZA — Escrita Reflexiva — ${mode.name}`);
  const body = encodeURIComponent(
    state.history.map((h) => `${h.stageTitle}:\n${h.userText}\n`).join("\n") +
    "\n" + buildFinalWritingPlan().replace(/\*\*/g, "")
  );
  const to = "";
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// ---- Modal ----
function openOverlay() {
  const overlay = $("#consentOverlay");
  overlay.hidden = false;
  overlay.classList.add("show");
  overlay.focus?.();
}

function closeOverlay() {
  const overlay = $("#consentOverlay");
  overlay.classList.remove("show");
  overlay.hidden = true;
}

function showConsentModal(mode = "required") {
  const isViewOnly = mode === "view";
  const overlay = $("#consentOverlay");

  const checkWrap = $("#consentCheck").parentElement;
  const pedWrap = $("#pedagogicCheck").parentElement;

  $(".modalSub").textContent = isViewOnly
    ? "Transparência: você pode rever este termo a qualquer momento."
    : "Para usar a IZA, é preciso aceitar este termo.";

  // view-only: esconde checkboxes e botão continuar; botão vira “Fechar”
  checkWrap.style.display = isViewOnly ? "none" : "flex";
  pedWrap.style.display = isViewOnly ? "none" : "flex";

  $("#consentAccept").style.display = isViewOnly ? "none" : "inline-block";
  $("#consentDecline").textContent = isViewOnly ? "Fechar" : "Não aceitar";

  // sempre abre overlay no topo (mesmo se CSS falhar)
  openOverlay();

  // Evita acumular listeners: clonar elementos interativos
  const oldCheck = $("#consentCheck");
  const oldPed = $("#pedagogicCheck");
  const oldDecline = $("#consentDecline");
  const oldAccept = $("#consentAccept");

  const newCheck = oldCheck.cloneNode(true);
  const newPed = oldPed.cloneNode(true);
  const newDecline = oldDecline.cloneNode(true);
  const newAccept = oldAccept.cloneNode(true);

  oldCheck.parentElement.replaceChild(newCheck, oldCheck);
  oldPed.parentElement.replaceChild(newPed, oldPed);
  oldDecline.parentElement.replaceChild(newDecline, oldDecline);
  oldAccept.parentElement.replaceChild(newAccept, oldAccept);

  const check = $("#consentCheck");
  const pedagogic = $("#pedagogicCheck");
  const decline = $("#consentDecline");
  const accept = $("#consentAccept");

  if (!isViewOnly) {
    check.checked = false;
    pedagogic.checked = false;
    accept.disabled = true;

    blockUI(true);

    // habilita botão de forma direta
    check.addEventListener("change", () => {
      accept.disabled = !check.checked;
    });

    accept.addEventListener("click", () => {
      setConsentAccepted();
      setPedagogicConsent(pedagogic.checked);
      closeOverlay();
      blockUI(false);
      reset();
    });

    decline.addEventListener("click", () => {
      addMessage(
        "bot",
        "Sem o aceite do Termo de Uso, a IZA não pode iniciar.\n\n" +
        "Se você quiser usar a IZA, marque a caixa de concordância e toque em **Continuar**."
      );
    });
  } else {
    decline.addEventListener("click", () => {
      closeOverlay();
    });
  }
}

// ---- UI wiring ----
function wireUI() {
  $("#mode").addEventListener("change", (e) => {
    state.modeId = e.target.value;
    reset();
  });

  $("#openTerms").addEventListener("click", () => {
    showConsentModal(hasConsent() ? "view" : "required");
  });

  $("#restart").addEventListener("click", reset);
  $("#exportTxt").addEventListener("click", exportText);
  $("#exportPdf").addEventListener("click", exportPdfSimple);
  $("#emailDraft").addEventListener("click", openEmailDraft);

  $("#send").addEventListener("click", () => {
    const val = $("#input").value;
    if (!val.trim()) return;
    $("#input").value = "";
    nextTurn(val);
  });

  $("#input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      $("#send").click();
    }
  });

  // ESC fecha o termo somente no modo view (transparência).
  // No modo required, ESC não fecha (para garantir aceite).
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hasConsent()) {
      closeOverlay();
    }
  });
}

function start() {
  wireUI();
  state.modeId = $("#mode").value;

  if (hasConsent()) {
    reset();
  } else {
    addMessage("bot", "Antes de começar, preciso que você aceite o Termo de Uso.");
    showConsentModal("required");
  }
}

start();
