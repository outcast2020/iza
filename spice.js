// spice.js — IZA (v2) | provocações inspiradas (sem citações literais)
// Objetivo: 1 linha de "tempero" + microtarefa concreta.
// Mantém: pickSpice(excludeTag) compatível com seu app.js.

const SPICES = [
  // -------------------------
  // GESTOS LITERÁRIOS (Brasil)
  // -------------------------
  {
    tag: "Rosa",
    items: [
      "Estranhe o óbvio: reescreva sua ideia como se fosse a primeira vez que alguém vê isso. Qual palavra você precisa inventar (ou torcer) para dizer melhor?",
      "Dê nome ao que não tem nome: em vez de explicar, batize. Se sua ideia fosse um bicho, um lugar ou um estado do tempo, qual seria?",
      "Troque o 'certo' pelo 'vivo': corte duas palavras genéricas e coloque duas concretas. O que muda no sentido?",
      "Faça o texto andar: transforme um conceito em percurso. De onde isso vem e para onde isso vai, em 2 frases?",
    ],
  },
  {
    tag: "Drummond",
    items: [
      "Encontre a pedra concreta: qual é o obstáculo específico aqui — em 1 frase sem adjetivos?",
      "Diga o que pesa sem drama: o que está duro, exatamente — e por quê?",
      "Tire uma foto mental: o que no seu texto é 'fato' e o que é 'juízo'? Separe em duas linhas.",
      "Faça a pergunta que incomoda: qual dúvida você está evitando encarar nessa frase?",
    ],
  },
  {
    tag: "Adélia",
    items: [
      "Traga o sagrado do cotidiano: que detalhe comum (objeto/gesto) carrega o sentido do seu texto?",
      "Desça a ideia para a cozinha: como isso aparece num dia normal, numa cena pequena?",
      "Deixe o corpo entrar: onde isso toca (no peito, na garganta, no passo, no silêncio)? Escreva em 1 linha.",
      "Troque solenidade por intimidade: diga a mesma coisa como se estivesse falando para alguém querido.",
    ],
  },
  {
    tag: "Evaristo",
    items: [
      "Escreva com memória e corpo: quem é afetado por isso — e como isso marca a vida real?",
      "Faça o texto ter chão: qual território (rua, casa, escola, trabalho) aparece por trás dessa ideia?",
      "Nomeie o que costuma ser apagado: quem está ausente na sua frase? Como incluir sem estereótipo?",
      "Cuidado com a voz: você está falando *sobre* ou falando *com*? Ajuste uma frase para virar convite, não sentença.",
    ],
  },

  // -------------------------
  // TEMPEROS DE ESCRITA (neutros, universais)
  // -------------------------
  {
    tag: "Oralidade",
    items: [
      "Diga como se fosse contar na calçada: o que você corta para ficar direto — e o que não pode sair?",
      "Troque 'discurso' por 'fala': escreva sua frase do jeito que você falaria em áudio de 15 segundos.",
      "Se isso fosse uma conversa, que pergunta o outro faria na hora? Responda com 1 linha.",
      "Faça caber no fôlego: escreva sua ideia em uma frase só, sem vírgula.",
    ],
  },
  {
    tag: "Ritmo",
    items: [
      "Transforme adjetivo em ação: em vez de “é X”, escreva “faz X” ou “acontece X”. O que muda?",
      "Reduza a frase pela metade: o que sobra é o núcleo? Se não, qual é o núcleo?",
      "Troque duas palavras longas por duas curtas. O texto fica mais forte ou mais fraco?",
      "Alterne frases curtas e longas: escreva 1 curta + 1 longa sobre a mesma ideia.",
    ],
  },
  {
    tag: "Imagem",
    items: [
      "Troque explicação por cena: onde isso acontece? Quem está lá? O que se vê/ouve?",
      "Escolha um objeto: qual coisa simples representa sua ideia? Diga por quê em 1 frase.",
      "Mostre o antes e depois: como era antes dessa ideia e como fica depois?",
      "Enquadre: você quer zoom (detalhe) ou panorâmica (contexto)? Reescreva escolhendo um.",
    ],
  },
  {
    tag: "Voz",
    items: [
      "Escolha ponto de vista: você fala como “eu”, “nós” ou observador? Por quê?",
      "Troque o narrador: reescreva a mesma frase em 'eu' e em 'nós'. Qual fica mais honesta?",
      "Para quem você está escrevendo de verdade? Escreva o nome desse leitor (mesmo que seja simbólico).",
      "Ajuste o tom: isso pede convite, denúncia, relato ou pergunta? Reescreva a primeira frase nesse tom.",
    ],
  },

  // -------------------------
  // CUIDADO ÉTICO (sem moralismo; útil no Brasil)
  // -------------------------
  {
    tag: "Cuidado",
    items: [
      "Cheque cuidado: essa frase respeita diferenças (raça, gênero, religião, povos indígenas)? Se houver risco, como você reformula com precisão e dignidade?",
      "Troque rótulo por descrição: em vez de nomear um grupo com uma etiqueta, descreva a situação concreta.",
      "Evite generalização: onde você pode trocar “todo mundo/ninguém” por algo mais verdadeiro e verificável?",
      "Escreva sem apagar: quem pode estar sendo invisibilizado aqui? Como incluir sem estereótipo?",
    ],
  },
];

// Flatten de itens para facilitar sorteio com anti-repetição por texto
const FLAT = SPICES.flatMap((s) => s.items.map((text, idx) => ({ tag: s.tag, key: `${s.tag}:${idx}`, text })));

// Anti-repetição por TAG e por TEXTO
let lastKey = null;

export function pickSpice(excludeTag = null) {
  let pool = FLAT;

  if (excludeTag) {
    pool = pool.filter((s) => s.tag !== excludeTag);
  }
  if (lastKey) {
    pool = pool.filter((s) => s.key !== lastKey);
  }

  // fallback se o pool ficou pequeno
  if (pool.length === 0) pool = FLAT;

  const picked = pool[Math.floor(Math.random() * pool.length)];
  lastKey = picked.key;
  return { tag: picked.tag, text: picked.text };
}
