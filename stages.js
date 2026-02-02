export const MODES = {
  sprint: {
    id: "sprint",
    name: "Sprint (4 turnos)",
    stages: [
      { id: 1, title: "Foco", prompt: "Qual é o núcleo do que você quer escrever, em 1–2 frases?", connect: false },
      { id: 2, title: "Tensão", prompt: "O que está em jogo aqui (dúvida, conflito, risco, desejo)?", connect: true },
      { id: 3, title: "Concretização", prompt: "Traga um exemplo/cena em 2–3 linhas.", connect: true },
      { id: 4, title: "Tese", prompt: "Escreva uma frase-tese (o que você quer que fique).", connect: true },
    ],
  },
  path7: {
    id: "path7",
    name: "Percurso (7 etapas)",
    stages: [
      { id: 1, title: "Tema-núcleo", prompt: "Sobre o que é isso, em 7 palavras?", connect: false },
      { id: 2, title: "Tensão / problema", prompt: "O que está em jogo aqui (conflito, fricção, dúvida)?", connect: true },
      { id: 3, title: "Intenção do autor", prompt: "O que você quer provocar no leitor: entender, sentir, decidir, lembrar?", connect: true },
      { id: 4, title: "Cena concreta", prompt: "Traga uma cena real (ou exemplo) em 2–3 linhas.", connect: true },
      { id: 5, title: "Suposição escondida", prompt: "O que você está assumindo como verdade aqui?", connect: true },
      { id: 6, title: "Contra-ideia", prompt: "Qual seria a melhor objeção ao que você está dizendo?", connect: true },
      { id: 7, title: "Tese + próximo parágrafo", prompt: "Escreva uma frase-tese. Depois, qual seria a 1ª frase do parágrafo seguinte?", connect: true },
    ],
  },
};
