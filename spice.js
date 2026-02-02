// spice.js — provocações inspiradas (sem citações literais)

export const SPICES = [
  {
    tag: "Rosa",
    text: "Provocação à moda de Guimarães Rosa: estranhe o óbvio. Reescreva sua ideia como se fosse a primeira vez que alguém vê isso."
  },
  {
    tag: "Drummond",
    text: "Provocação à moda de Drummond: encontre o obstáculo concreto. Qual é a “pedra” específica no seu caminho — em 1 frase?"
  },
  {
    tag: "Adélia",
    text: "Provocação à moda de Adélia Prado: traga o sagrado do cotidiano. Que detalhe comum (objeto/gesto) carrega o sentido do seu texto?"
  },
  {
    tag: "Evaristo",
    text: "Provocação à moda de Conceição Evaristo: escreva com memória e corpo. Quem é afetado por isso — e como isso marca a vida real?"
  },
  // Afro-brasileiro: “gestos” culturais (sem folclorizar)
  {
    tag: "Oralidade",
    text: "Tempero de oralidade: diga sua ideia como se fosse contar para alguém na calçada. O que você cortaria para ficar mais direto?"
  },
  {
    tag: "Ritmo",
    text: "Tempero de ritmo: transforme um adjetivo em ação. Em vez de “é X”, escreva “faz X” ou “acontece X”."
  },
  {
    tag: "Imagem",
    text: "Tempero de imagem: troque explicação por cena. Onde isso acontece? Quem está lá? O que se vê/ouve?"
  },
  {
    tag: "Voz",
    text: "Tempero de voz: escolha um ponto de vista. Você fala como “eu”, como “nós” ou como observador? Por quê?"
  }
];

// opcional: reduzir repetição do tempero
export function pickSpice(excludeTag = null) {
  const pool = excludeTag ? SPICES.filter(s => s.tag !== excludeTag) : SPICES;
  return pool[Math.floor(Math.random() * pool.length)];
}
