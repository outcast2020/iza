import { RULES } from "./rules.js";
import { MODES } from "./stages.js";

const $ = (sel) => document.querySelector(sel);

const state = {
  modeId: "sprint",
  stageIndex: 0,
  history: [], // {stageId, stageTitle, userText}
  started: false,
};

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
  return `**Etapa ${stage.id}/${total — 0 ? total : total} — ${stage.title}**\n\n${stage.prompt}`;
}

// conexão curta: no máximo 2 recortes
function connectTwoSnippets() {
  if (state.history.length < 2) return "";
  const a = state.history[state.history.length - 1].userText;
  const b = state.history[state.history.length - 2].userText;
  return `\n\nConecte: **“${pickSnippet(b)}”** + **“${pickSnippet(a)}”**. Qual é a relação?`;
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

  // conectar a partir da etapa 2
  if (stage.connect) reply += connectTwoSnippets();

  addMessage("bot", reply);
}

function reset() {
  state.stageIndex = 0;
  state.history = [];
  state.started = true;

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
  lines.push(`ELIZA de Escrita — ${mode.name}`);
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
  a.download = `eliza-escrita-${state.modeId}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportPdfSimple() {
  // PDF “simples” = usa a impressão do navegador (Ctrl+P) com @media print
  window.print();
}

function openEmailDraft() {
  const mode = currentMode();
  const subject = encodeURIComponent(`ELIZA de Escrita — ${mode.name}`);
  const body = encodeURIComponent(
    state.history
      .map((h) => `${h.stageTitle}:\n${h.userText}\n`)
      .join("\n") + "\n" + buildFinalWritingPlan().replace(/\*\*/g, "")
  );

  // Você pode colocar seu e-mail aqui (ou deixar em branco):
  const to = ""; // ex: "carlos@exemplo.com"
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

function wireUI() {
  $("#mode").addEventListener("change", (e) => {
    state.modeId = e.target.value;
    reset();
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
  reset();
}

start();
