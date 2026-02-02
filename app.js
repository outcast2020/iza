import { RULES } from "./rules.js";
import { MODES } from "./stages.js";
import { pickSpice } from "./spice.js";

const $ = (sel) => document.querySelector(sel);

const state = {
  modeId: "sprint",
  stageIndex: 0,
  history: [], // {stageId, stageTitle, userText}
  started: false,

  // evita repetição do tempero
  lastSpiceTag: null,
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
  $("#openTerms").disabled = false; // transparência sempre disponível
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

// “Tempero” literário (sem citações literais)
function stageNumberForSpice() {
  // Nós chamamos o tempero após incrementar stageIndex em nextTurn(),
  // então a "etapa recém-respondida" é state.stageIndex (1-based conceitual).
  // Ex.: após responder etapa 1, stageIndex vira 1.
  return state.stageIndex; // 1,2,3...
}

function pickSpiceFromAllowed(allowedTags) {
  // tenta algumas vezes até acertar um tempero do conjunto permitido
  for (let i = 0; i < 12; i++) {
    const spice = pickSpice(state.lastSpiceTag);
    if (allowedTags.includes(spice.tag)) {
      state.lastSpiceTag = spice.tag;
      return spice;
    }
  }
  // fallback: qualquer um (mas ainda evita repetir a mesma tag imediatamente)
  const fallback = pickSpice(state.lastSpiceTag);
  state.lastSpiceTag = fallback.tag;
  return fallback;
}

function pickSpiceFromAllowed(allowedTags) {
  // tenta algumas vezes até acertar um tempero do conjunto permitido
  for (let i = 0; i < 14; i++) {
    const spice = pickSpice(state.lastSpiceTag);
    if (allowedTags.includes(spice.tag)) {
      state.lastSpiceTag = spice.tag;
      return spice;
    }
  }
  // fallback: qualquer um (ainda evita repetir tag imediatamente)
  const fallback = pickSpice(state.lastSpiceTag);
  state.lastSpiceTag = fallback.tag;
  return fallback;
}

function allowedSpiceTagsForStage(modeId, stageId) {
  // Mapeamento coerente com o seu stages.js
  if (modeId === "sprint") {
    switch (stageId) {
      case 1: // Foco (núcleo)
        return ["Drummond", "Ritmo"];
      case 2: // Tensão
        return ["Drummond", "Voz"];
      case 3: // Concretização (exemplo/cena)
        return ["Imagem", "Adélia"];
      case 4: // Tese
        return ["Ritmo", "Voz"];
      default:
        return ["Ritmo", "Voz", "Imagem"];
    }
  }

  // path7
  switch (stageId) {
    case 1: // Tema-núcleo
      return ["Drummond", "Ritmo"];
    case 2: // Tensão / problema
      return ["Drummond", "Voz"];
    case 3: // Intenção do autor
      return ["Voz", "Ritmo"];
    case 4: // Cena concreta
      return ["Imagem", "Adélia"];
    case 5: // Suposição escondida
      return ["Cuidado", "Evaristo"];
    case 6: // Contra-ideia
      return ["Cuidado", "Evaristo"];
    case 7: // Tese + próximo parágrafo
      return ["Ritmo", "Voz", "Drummond"];
    default:
      return ["Ritmo", "Voz", "Imagem"];
  }
}

function maybeAddSpice(lastAnsweredStageId) {
  // Frequência: mais “temperado” no path7
  const chance = state.modeId === "path7" ? 0.45 : 0.25;
  if (Math.random() > chance) return "";

  // Curadoria por etapa (baseada no stages.js)
  const allowed = allowedSpiceTagsForStage(state.modeId, lastAnsweredStageId);
  const spice = pickSpiceFromAllowed(allowed);

  return `\n\n_<strong>Tempero Iza</strong> (${spice.tag}):_ ${spice.text}`;
}

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

  // adiciona tempero (opcional)
  reply += maybeAddSpice();

  // conectar a partir da etapa 2 (conforme stages.js)
  if (stage.connect) reply += connectTwoSnippets();

  addMessage("bot", reply);
}

function reset() {
  state.stageIndex = 0;
  state.history = [];
  state.started = true;

  // zera memória de tempero ao reiniciar
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
  // PDF “simples” = usa a impressão do navegador com @media print
  window.print();
}

function openEmailDraft() {
  const mode = currentMode();
  const subject = encodeURIComponent(`IZA — Escrita Reflexiva — ${mode.name}`);
  const body = encodeURIComponent(
    state.history
      .map((h) => `${h.stageTitle}:\n${h.userText}\n`)
      .join("\n") + "\n" + buildFinalWritingPlan().replace(/\*\*/g, "")
  );

  const to = "";
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

function closeConsentOverlay() {
  $("#consentOverlay").classList.remove("show");
}

// Modal com 2 modos:
// - required: bloqueia e exige aceite do termo
// - view: só mostra (transparência), sem bloquear
function showConsentModal(mode = "required") {
  const overlay = $("#consentOverlay");
  const checkWrap = $("#consentCheck").parentElement;
  const pedWrap = $("#pedagogicCheck").parentElement;

  const isViewOnly = mode === "view";

  overlay.classList.add("show");

  // Ajustes de UI conforme modo
  $(".modalSub").textContent = isViewOnly
    ? "Transparência: você pode rever este termo a qualquer momento."
    : "Para usar a IZA, é preciso aceitar este termo.";

  checkWrap.style.display = isViewOnly ? "none" : "flex";
  pedWrap.style.display = isViewOnly ? "none" : "flex";

  const btnDecline = $("#consentDecline");
  const btnAccept = $("#consentAccept");

  btnDecline.textContent = isViewOnly ? "Fechar" : "Não aceitar";
  btnAccept.style.display = isViewOnly ? "none" : "inline-block";

  // Evita acumular listeners: clona botões e inputs
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

    check.addEventListener("change", () => {
      accept.disabled = !check.checked;
    });

    accept.addEventListener("click", () => {
      setConsentAccepted();
      setPedagogicConsent(pedagogic.checked);
      closeConsentOverlay();
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
      closeConsentOverlay();
    });
  }
}

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
