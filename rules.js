export const RULES = [
  {
    name: "nao_consigo",
    pattern: /\bn[aã]o\s+consigo\s+(.+)/i,
    responses: [
      "Você disse: **não consigo {0}**. O que acontece imediatamente antes dessa trava?",
      "Quando aparece **não consigo {0}**, o que você tenta controlar demais?",
    ],
  },
  {
    name: "eu_sinto",
    pattern: /\beu\s+(?:me\s+)?sinto\s+(.+)/i,
    responses: [
      "Você disse que se sente **{0}**. O que, exatamente, puxa isso no seu tema?",
      "Quando você diz **{0}**, qual palavra do seu texto mais carrega esse sentimento?",
    ],
  },
  {
    name: "eu_quero",
    pattern: /\beu\s+quero\s+(.+)/i,
    responses: [
      "Você quer **{0}**. Como isso fica em uma frase simples, sem explicações?",
      "Se você conseguisse **{0}**, o que mudaria hoje no seu parágrafo?",
    ],
  },
  {
    name: "contraste",
    pattern: /\b(mas|por[ée]m|s[óo]\s+que)\b(.+)/i,
    responses: [
      "Você usou um contraste (**{0}**). O que exatamente está se chocando com o que você disse antes?",
      "Quando você diz **{0}**, o que fica em dúvida — e o que permanece firme?",
    ],
  },
  {
    name: "default",
    pattern: /(.+)/i,
    responses: [
      "Entendi: **{0}**. Qual é a parte mais importante disso para você agora?",
      "Você disse: **{0}**. O que você quer explorar primeiro — e por quê?",
    ],
  },
];
