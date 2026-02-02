// rules.js — IZA (v2) | Mais variedade, menos repetição, com "gestos" literários brasileiros
// - Sem citações literais longas (evita direitos autorais).
// - Mantém o espírito ELIZA: espelha o dito + pergunta que aprofunda.
// - Use junto do app.js atual (não exige mudanças).

export const RULES = [
  // 1) Trava / bloqueio
  {
    name: "nao_consigo",
    pattern: /\bn[aã]o\s+consigo\s+(.+)/i,
    responses: [
      "Você escreveu: **não consigo {0}**. O que acontece logo antes dessa trava?",
      "Quando vem **não consigo {0}**, o que você está tentando acertar de primeira?",
      "O que deixaria **{0}** 10% mais possível hoje — só 10%?",
      "Se você pudesse começar torto, como começaria **{0}** em uma linha?",
      "Qual pedaço de **{0}** está pesado: começo, meio ou fim?",
      "O que você está evitando dizer quando tenta **{0}**?",
    ],
  },

  // 2) Travado/empacado
  {
    name: "travado",
    pattern: /\b(trav(ad[oa])|empac(ad[oa])|emperr(ad[oa])|bloque(ad[oa]))\b/i,
    responses: [
      "Você disse que está **{0}**. Em quê exatamente: na primeira frase, na ideia central ou no final?",
      "Quando você fica **{0}**, o que você quer proteger no texto?",
      "Se eu pedisse só uma frase agora, qual seria — mesmo **{0}**?",
      "Qual é o menor passo que você consegue dar estando **{0}**?",
      "O que acontece no seu corpo (respiração/pressa/expectativa) quando vem **{0}**?",
    ],
  },

  // 3) Emoção / sensação
  {
    name: "eu_sinto",
    pattern: /\beu\s+(?:me\s+)?sinto\s+(.+)/i,
    responses: [
      "Você se sente **{0}**. Onde isso aparece mais forte no que você quer escrever?",
      "Quando surge **{0}**, qual palavra do seu tema puxa isso?",
      "Se **{0}** virasse uma cena, o que a gente veria primeiro?",
      "Esse **{0}** te aproxima do texto ou te afasta? Como?",
      "O que você gostaria que o leitor entendesse sobre esse **{0}**?",
      "Qual detalhe do cotidiano acende esse **{0}**?",
    ],
  },

  // 4) Medo / insegurança / vergonha
  {
    name: "medo",
    pattern: /\b(medo|inseguranç[ao]|vergonha|ansiedade|receio)\b(.+)?/i,
    responses: [
      "Você mencionou **{0}**. Do que exatamente você teme a reação: do leitor, de você, ou do tema?",
      "Quando aparece **{0}**, o que você tenta controlar no texto?",
      "O que seria uma versão segura (mas verdadeira) do que você quer dizer?",
      "Qual parte você consegue dizer com coragem em uma linha — apesar do **{0}**?",
      "Se você escrevesse só para você, o que mudaria aqui?",
    ],
  },

  // 5) Desejo / intenção
  {
    name: "eu_quero",
    pattern: /\beu\s+quero\s+(.+)/i,
    responses: [
      "Você quer **{0}**. Como isso fica em uma frase simples, sem explicações?",
      "Qual seria um sinal concreto de que você alcançou **{0}**?",
      "O que em **{0}** é essencial — e o que é enfeite?",
      "Se você tivesse que escolher: clareza, força ou beleza em **{0}** — qual vem primeiro?",
      "Se **{0}** fosse um título, qual seria?",
      "Você quer **{0}** para quê, no fundo: entender, convencer, atravessar, lembrar?",
    ],
  },

  // 6) Precisar / dever / obrigação
  {
    name: "preciso_tenho",
    pattern: /\b(eu\s+preciso|tenho\s+que|devo|precisaria)\s+(.+)/i,
    responses: [
      "Você disse **{0} {1}**. Isso vem de você ou de uma exigência externa?",
      "O que acontece se você não **{1}** agora?",
      "Qual parte de **{1}** é negociável e qual é inegociável?",
      "Se você fizer **{1}** em versão mínima, o que entra?",
      "Quem colocou esse 'tenho que' aí — e o que você colocaria no lugar?",
    ],
  },

  // 7) Dúvida / indecisão
  {
    name: "nao_sei",
    pattern: /\b(n[aã]o\s+sei|talvez|acho\s+que|quem\s+sabe|pode\s+ser)\b([\s\S]*)?/i,
    responses: [
      "Você está oscilando. Entre quais duas direções você está dividido(a)?",
      "O que você sabe com certeza aqui — mesmo que seja pouco?",
      "Qual pergunta, se respondida, destrava essa dúvida?",
      "Se você tivesse 15 minutos para apostar numa direção, qual seria?",
      "O que você não quer perder, aconteça o que acontecer?",
      "Se você escolhesse uma direção errada, como perceberia rápido?",
    ],
  },

  // 8) Contraste (mas/porém/só que)
  {
    name: "contraste",
    pattern: /\b(mas|por[ée]m|s[óo]\s+que)\b\s*([\s\S]+)/i,
    responses: [
      "Você abriu um contraste (**{0}**). O que está batendo de frente com o quê?",
      "Depois do **{0}**, o que muda de sentido?",
      "Qual lado do contraste você quer defender mais — e por quê?",
      "Se você tivesse que escrever só a frase do **{0}**, qual seria?",
      "Que palavra do trecho depois do **{0}** carrega o peso do texto?",
    ],
  },

  // 9) Causa / "porque"
  {
    name: "porque",
    pattern: /\bporque\b([\s\S]+)/i,
    responses: [
      "Você trouxe um **porque**. Qual é o núcleo disso em 6–10 palavras?",
      "Esse **porque** explica ou justifica? Qual dos dois?",
      "O que ainda ficaria verdadeiro se você tirasse o resto e deixasse só o essencial?",
      "Se alguém discordasse do seu **porque**, onde atacaria primeiro?",
      "Que evidência (cena, dado, experiência) sustenta esse **porque**?",
    ],
  },

  // 10) Definição / explicação ("é", "significa", etc.)
  {
    name: "definicao",
    pattern: /\b(significa|quer\s+dizer|se\s+trata|é\s+quando|é\s+tipo)\b\s*([\s\S]+)/i,
    responses: [
      "Você está definindo algo. Para quem você está explicando isso?",
      "O que não pode faltar nessa definição para ela continuar verdadeira?",
      "Qual exemplo curto prova essa definição?",
      "Como você diria isso sem termos técnicos — só com palavras do dia a dia?",
      "Se você deixasse essa definição em uma frase, qual seria?",
    ],
  },

  // 11) Pergunta explícita
  {
    name: "pergunta",
    pattern: /\?+\s*$/i,
    responses: [
      "Vou te devolver uma pergunta menor: o que você quer realmente decidir aqui?",
      "Se essa pergunta virasse o título do texto, como ela ficaria?",
      "O que torna essa pergunta importante agora?",
      "Que resposta você tem medo de encontrar para essa pergunta?",
      "Qual seria a pergunta mais honesta por trás dessa pergunta?",
    ],
  },

  // 12) Comparação / semelhança / diferença
  {
    name: "comparacao",
    pattern: /\b(como|igual|diferente|parece|semelhante|comparar)\b([\s\S]+)/i,
    responses: [
      "Você comparou coisas. O que você quer que essa comparação revele?",
      "O que é parecido na superfície — e diferente por dentro?",
      "Se você tirar a comparação, o que sobra como ideia principal?",
      "Qual exemplo concreto sustenta essa comparação?",
      "A comparação ajuda a ver melhor ou está escondendo algo? O quê?",
    ],
  },

  // 13) Tempo / urgência / prazo
  {
    name: "tempo",
    pattern: /\b(hoje|amanh[ãa]|prazo|correria|rápido|urgente|semana|mês|agora)\b([\s\S]*)?/i,
    responses: [
      "Entendi que o tempo pesa. Qual é o mínimo aceitável de texto para hoje?",
      "Se você tivesse 12 minutos, o que escreveria primeiro?",
      "O que pode ficar imperfeito agora para você conseguir andar?",
      "Qual é sua próxima frase — uma só — para ganhar movimento?",
      "O que você consegue entregar em 3 frases sem trair a ideia?",
    ],
  },

  // 14) Estrutura do texto (introdução, tese, conclusão etc.)
  {
    name: "estrutura_texto",
    pattern: /\b(introduç[ãa]o|conclus[ãa]o|par[áa]grafo|tese|resumo|artigo|cap[íi]tulo|metodologia|resultados)\b([\s\S]*)?/i,
    responses: [
      "Você citou estrutura (**{0}**). Qual função ela precisa cumprir: situar, provar ou fechar?",
      "Se seu **{0}** tivesse só 3 frases, quais seriam?",
      "Qual ideia não pode faltar no **{0}**?",
      "O que você quer que o leitor faça depois de ler seu **{0}**?",
      "Qual frase do **{0}** você quer que seja inesquecível?",
    ],
  },

  // 15) Gesto literário: cena / imagem / metáfora (sem citações)
  {
    name: "cena_imagem",
    pattern: /\b(cena|imagem|met[áa]fora|símbolo|po[ée]tico|descrever|mostrar)\b([\s\S]*)?/i,
    responses: [
      "Se isso virasse uma cena curta, onde acontece e quem aparece primeiro?",
      "Qual objeto simples carrega o sentido do que você quer dizer?",
      "Em vez de explicar, o que você pode **mostrar** em uma ação?",
      "Se sua ideia fosse uma imagem, qual seria o enquadramento (perto/longe)?",
      "Que som, cheiro ou gesto daria corpo a esse trecho?",
    ],
  },

  // 16) Voz / ponto de vista (eu/nós/ele)
  {
    name: "voz",
    pattern: /\b(eu|nós|a\s+gente|eles|elas|alguém)\b([\s\S]*)/i,
    responses: [
      "Quem fala aqui — e quem fica sem voz? Isso é intencional?",
      "Você quer falar como **eu**, como **nós** ou como observador? Por quê?",
      "Se você trocasse o narrador (eu ↔ nós), o que mudaria no sentido?",
      "De que lugar você está falando (experiência, estudo, memória, testemunho)?",
      "Quem é o leitor implícito desse trecho?",
    ],
  },

  // 17) Corte / excesso / confusão
  {
    name: "excesso",
    pattern: /\b(confuso|embolado|muito|demais|exagerado|longo|bagunçado|perdido)\b([\s\S]*)?/i,
    responses: [
      "Você percebeu excesso. O que dá para cortar sem perder o núcleo?",
      "Se você deixasse só 2 frases, quais ficariam?",
      "Qual parte está tentando dizer duas coisas ao mesmo tempo?",
      "O que aqui é explicação — e o que é essencial?",
      "Que palavra você pode remover agora e o texto continuar verdadeiro?",
    ],
  },

  // 18) Afirmação forte / absoluto (sempre/nunca/todo mundo)
  {
    name: "absolutos",
    pattern: /\b(sempre|nunca|todo\s+mundo|ninguém|tudo|nada)\b([\s\S]*)?/i,
    responses: [
      "Você usou um absoluto (**{0}**). Isso é literal ou é força de estilo?",
      "Qual exceção você aceitaria sem destruir sua ideia?",
      "Se você trocasse **{0}** por “muitas vezes”, o que mudaria?",
      "Que exemplo real sustenta esse **{0}**?",
      "Isso é argumento ou desabafo? Qual dos dois você quer que seja?",
    ],
  },

  // 19) Tema social/identidade (gatilho para cuidado ético — sem policiar)
  {
    name: "cuidado_diversidade",
    pattern: /\b(negro|preto|branco|racismo|afro|quilomb|ind[íi]gena|índio|lgbt|lgbtqia|gay|lésbica|trans|travesti|relig[ií]a|candombl[ée]|umbanda|evang[ée]lic|cat[oó]lic|ateu)\b([\s\S]*)?/i,
    responses: [
      "Você tocou um tema sensível (**{0}**). Quer revisar a linguagem para garantir respeito e cuidado com diferentes vivências?",
      "Esse trecho pode ser lido de modos distintos. Como você pode escrever com mais precisão e menos estigma?",
      "O que você quer afirmar aqui sem apagar a dignidade de ninguém?",
      "Se alguém do grupo citado lesse esse trecho, o que você gostaria que ela/ele sentisse?",
      "Quer transformar isso em pergunta (em vez de sentença) para abrir pensamento e evitar rótulos?",
    ],
  },

  // 20) Default (sempre por último)
  {
    name: "default",
    pattern: /([\s\S]+)/i,
    responses: [
      "Entendi: **{0}**. Qual é a parte mais viva disso para você?",
      "Se eu recortar o que você disse em uma palavra-chave, qual seria?",
      "O que você quer que fique na cabeça do leitor depois disso?",
      "Qual é o próximo passo: explicar melhor, dar exemplo ou assumir uma tese?",
      "Onde isso acontece na prática? (uma cena pequena já serve)",
      "Se você tivesse que começar por uma frase só, qual seria?",
      "Que pergunta você gostaria que o texto respondesse?",
    ],
  },
];
