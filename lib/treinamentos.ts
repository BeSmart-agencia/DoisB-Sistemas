// ============================================================
// Treinamentos de venda — apresentações visuais para o portal do vendedor.
// Fonte: docs/Vendas/*.md (Framework 3A, 5 problemas, ofertas & iscas).
// Conteúdo estático, renderizado pela aba "Treinamentos" (TreinamentosView).
// ============================================================

export type Bloco =
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "destaque"; texto: string; tom?: "info" | "alerta" | "sucesso" }
  | { tipo: "citacao"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "passos"; itens: { titulo: string; texto: string; exemplo?: string }[] }
  | { tipo: "cards"; itens: { titulo: string; texto: string }[] }
  | { tipo: "tabela"; colunas: [string, string]; linhas: [string, string][] }

export interface SecaoTreino {
  titulo: string
  blocos: Bloco[]
}

export type CorTreino = "blue" | "indigo" | "emerald"

export interface Treinamento {
  id: string
  numero: number
  etiqueta: string
  titulo: string
  subtitulo: string
  resumo: string
  cor: CorTreino
  // Sinaliza quem deve estudar: "vendedor" = ensine no treinamento da equipe;
  // "estudo" = base de estratégia, mais pra gestão do que pra passar ao vendedor.
  publico: { tipo: "vendedor" | "estudo"; nota: string }
  secoes: SecaoTreino[]
  aplicacao: Bloco[]
}

export const TREINAMENTOS: Treinamento[] = [
  // ---------------------------------------------------------------
  // 1 · Framework 3A de Reenquadramento
  // ---------------------------------------------------------------
  {
    id: "reenquadramento",
    numero: 1,
    etiqueta: "Técnica de conversa",
    titulo: "Framework 3A de Reenquadramento",
    subtitulo: "A habilidade que separa os melhores vendedores do resto.",
    resumo:
      "São as 1 a 3 frases que você diz depois que o cliente responde qualquer coisa que não seja 'sim' — e que aumentam a chance de que a próxima coisa que você falar leve ele a comprar.",
    cor: "indigo",
    publico: { tipo: "vendedor", nota: "Essencial — ensine a todos os vendedores." },
    secoes: [
      {
        titulo: "A ideia central",
        blocos: [
          { tipo: "destaque", texto: "Quem faz as perguntas é quem controla a conversa.", tom: "info" },
          {
            tipo: "paragrafo",
            texto:
              "No momento em que o cliente começa a fazer perguntas, você entra na defensiva — e defensiva não é onde você quer estar. O reenquadramento serve pra devolver a pergunta sem responder, mantendo o controle e o rapport.",
          },
          {
            tipo: "citacao",
            texto:
              "O cliente acredita em quase nada do que VOCÊ diz, e em quase tudo que ELE mesmo diz.",
          },
          {
            tipo: "paragrafo",
            texto:
              "Por isso o objetivo nunca é dizer pra ele que ele é um bom cliente. É fazer perguntas até que ele mesmo conclua que faz sentido comprar. Você leva ele até a solução lógica como quem deixa um rastro de migalhas.",
          },
        ],
      },
      {
        titulo: "O erro que quase todo vendedor comete",
        blocos: [
          {
            tipo: "paragrafo",
            texto:
              "Quando o cliente faz uma pergunta, o vendedor iniciante assume que já sabe o que ele quer, tenta adivinhar a 'resposta certa' — e erra. Ao responder, você entrega o poder: o cliente vira juiz da sua resposta e usa ela como desculpa pra não comprar.",
          },
          {
            tipo: "destaque",
            texto:
              "Hack mestre: se você não sabe como responder uma pergunta, você sempre pode fazer mais perguntas sobre a pergunta dele.",
            tom: "sucesso",
          },
        ],
      },
      {
        titulo: "Os 3 passos (3A)",
        blocos: [
          {
            tipo: "passos",
            itens: [
              {
                titulo: "1 · Acknowledge — Reconhecer",
                texto:
                  "Repita de volta o que a pessoa disse. Ela sente que você está escutando de verdade, e você ganha tempo pra pensar no que dizer.",
                exemplo: "\"Então você está curioso sobre isso…\"",
              },
              {
                titulo: "2 · Associate — Associar",
                texto:
                  "A parte mais poderosa. Associe a pergunta dele ao comportamento de quem tem os melhores resultados. Dê um rótulo positivo pra ele viver à altura — e guarde esse rótulo pro fechamento.",
                exemplo:
                  "\"Ótima pergunta — é exatamente o tipo de pergunta que nossos melhores clientes fazem. Mostra que você é racional e está levando isso a sério.\"",
              },
              {
                titulo: "3 · Ask / Attack — Perguntar",
                texto:
                  "Faça uma pergunta sobre a pergunta dele. Você só responde DEPOIS de entender o que realmente importa — senão pode perder a venda ali.",
                exemplo: "\"Quais certificações especificamente você está procurando? Por que essas?\"",
              },
            ],
          },
          {
            tipo: "citacao",
            texto:
              "\"Então você quer saber X (reconhece) — ótima pergunta, mostra que você leva isso a sério (associa). O que exatamente você tem em mente? (pergunta)\"",
          },
        ],
      },
      {
        titulo: "As 5 regras de uso ético",
        blocos: [
          {
            tipo: "cards",
            itens: [
              {
                titulo: "1 · Não responda: pergunte",
                texto:
                  "Nunca pergunte 'você tem alguma dúvida?' — é pedir pra pessoa criar objeção. Assim que você responde, o cliente vira juiz das suas respostas.",
              },
              {
                titulo: "2 · Ninguém discorda de uma pergunta",
                texto:
                  "Seja como fumaça: a cada fala, devolva 'deixa eu te perguntar uma coisa sobre isso…'. Você nunca ganha a venda ganhando a discussão.",
              },
              {
                titulo: "3 · Diga o que a objeção significa",
                texto:
                  "Reinterprete o 'não' como sinal de bom cliente. 'Já tenho consultor' → '90% dos que migram já tinham um — você sobe a curva mais rápido'.",
              },
              {
                titulo: "4 · Use a 'terceira voz'",
                texto:
                  "Pra verdades duras, não jogue na cara: cite outro cliente ('teve um hoje com essa mesma dúvida…') ou empreste a autoridade da Zucchetti.",
              },
              {
                titulo: "5 · Curiosidade de criança",
                texto:
                  "O objetivo é entender, não vencer. 'Hã, interessante você perguntar isso — posso te perguntar mais?' Mantenha o humano em primeiro lugar.",
              },
            ],
          },
          {
            tipo: "destaque",
            texto:
              "Overcome pronto pra 'por que você não responde minhas perguntas?': \"Seria antiético eu responder o que tem de errado no seu carro sem olhar embaixo do capô primeiro. Depois que eu entender sua operação, te dou respostas muito melhores.\"",
            tom: "info",
          },
        ],
      },
      {
        titulo: "Reenquadramentos prontos",
        blocos: [
          {
            tipo: "tabela",
            colunas: ["Objeção", "Resposta (Reconhece → Associa → Pergunta)"],
            linhas: [
              [
                "\"Preciso pensar.\"",
                "Total. Quais são as coisas que você está pesando? Qual sua maior preocupação — o que faria disso um não? E o que precisaria acontecer pra ser um sim?",
              ],
              [
                "\"O momento não é bom.\"",
                "Entendo, tá corrido. Inteligente já pensar na implementação — nossos melhores cases pensavam assim. O que faria disso um bom momento?",
              ],
              [
                "\"Preciso falar com meu sócio/contador.\"",
                "Super sensato. Quais partes você acha que ele ia querer entender melhor? A gente já tem o material pronto pra passar pra ele.",
              ],
              [
                "\"Quanto custa?\" (cedo)",
                "Depende do que você precisa. Você emite nota? Trabalha com grade? Vende em marketplace? Deixa eu entender sua operação pra indicar o plano certo.",
              ],
            ],
          },
        ],
      },
    ],
    aplicacao: [
      {
        tipo: "lista",
        itens: [
          "Pergunta-armadilha clássica: \"Quanto custa?\" — antes de dizer o preço, ataque o enquadramento: \"Depende do que você precisa hoje. Você emite NFC-e? Trabalha com grade? Precisa de e-commerce? Deixa eu entender sua operação pra te indicar o plano certo.\"",
          "Associação da marca: \"Quem mais pergunta isso são os donos que já se queimaram com sistema barato sem suporte. Você já tá pensando certo.\"",
          "Straw man de autoridade: o ZWeb é da Zucchetti (software house italiana). Use a Zucchetti como a 'terceira voz' em vez de bancar você o especialista.",
          "\"Preciso falar com meu contador\" (vai aparecer muito com a Reforma): trate como o 'falar com o sócio' — \"Quais partes ele ia querer entender? A gente já tem o material da Reforma pronto.\"",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------
  // 2 · Os 5 problemas que travam qualquer negócio
  // ---------------------------------------------------------------
  {
    id: "cinco-problemas",
    numero: 2,
    etiqueta: "Visão de negócio",
    titulo: "Os 5 problemas que travam qualquer negócio",
    subtitulo: "Entenda a cabeça do dono pra vender pra ele.",
    resumo:
      "Todo negócio precisa resolver estes problemas pra crescer. Cada um é uma sinuca de bico onde a maioria dos donos fica anos parada. Conhecer isso te faz enxergar a dor real do lojista — e vender melhor.",
    cor: "blue",
    publico: { tipo: "estudo", nota: "Base de estudo (visão de dono). Opcional com vendedores — serve mais pra você e pra entender o cliente." },
    secoes: [
      {
        titulo: "Problema 1 — Definir QUEM você atende",
        blocos: [
          {
            tipo: "paragrafo",
            texto:
              "No começo, você vende pra todo mundo (a pessoa tem pulso e cartão). Mas conforme cresce, a complexidade explode: clientes diferentes, promessas diferentes, preços diferentes. A solução é aprender a dizer não a quem não é o cliente ideal.",
          },
          {
            tipo: "destaque",
            texto:
              "Exercício das 4 colunas: liste TODOS os clientes que já teve e marque quais você (1) ama atender, (2) gastaram mais, (3) deram mais lucro, (4) foram mais fáceis de entregar. Quem aparece em 3-4 colunas é o seu cliente ideal.",
            tom: "info",
          },
          {
            tipo: "citacao",
            texto:
              "Se hoje 10% dos seus clientes são ideais, imagine 100% assim: mesma estrutura, normalmente 5 a 10x mais dinheiro.",
          },
        ],
      },
      {
        titulo: "Problema 2 — Cobra de menos ou paga demais",
        blocos: [
          {
            tipo: "paragrafo",
            texto:
              "Dois lados da mesma moeda: você precisa acertar o modelo da unidade individual — ganhar dinheiro suficiente com uma unidade em capacidade total. Se a unidade central não dá lucro nem cheia, o modelo está furado.",
          },
          {
            tipo: "destaque",
            texto:
              "Síndrome do impostor no preço: você só se sente impostor quando está mentindo. Se o cliente quer pagar, você entrega valor e a troca é voluntária — cobre pelo VALOR que entrega, não pelo que tem na sua carteira.",
            tom: "sucesso",
          },
        ],
      },
      {
        titulo: "Problema 3 — Não passar do ponto",
        blocos: [
          {
            tipo: "paragrafo",
            texto:
              "Quando você não ganha dinheiro no core, pensa 'vou fazer mais disso' — mas 'mais' é mais da coisa errada. A raiz é o ego em torno de crescer o faturamento. Receita é consequência, não meta: foque nos inputs de qualidade e a receita acontece.",
          },
          {
            tipo: "destaque",
            texto:
              "Qualidade gera crescimento. Crescimento gera inchaço. Faça de 'ficar melhor' a meta e você fica maior. Faça de 'ficar maior' a meta e você fica maior E pior.",
            tom: "alerta",
          },
        ],
      },
      {
        titulo: "Problema 4 — Foco",
        blocos: [
          {
            tipo: "paragrafo",
            texto:
              "O mais traiçoeiro. Empreendedores são recompensados por 'dar o salto' — e isso ensina a pular de novo toda vez que fica difícil. Toda oportunidade nova parece perfeita no primeiro encontro (a mulher de vestido vermelho): você só conhece o bom dela, e ainda não viu as armadilhas.",
          },
          {
            tipo: "cards",
            itens: [
              {
                titulo: "Compromisso = eliminar alternativas",
                texto:
                  "Quer ser mais comprometido? Elimine alternativas. Como o porco no café da manhã: a galinha se interessa, o porco se compromete.",
              },
              {
                titulo: "Decidir = cortar/matar",
                texto:
                  "A pergunta certa: o que você está matando hoje? Que oportunidade sexy você recusa porque assumiu um compromisso?",
              },
            ],
          },
          {
            tipo: "citacao",
            texto:
              "A melhor dieta é a que você segue. O melhor negócio é o que você não larga. 9 de 10 vezes: empurre, não pivote.",
          },
        ],
      },
      {
        titulo: "Problema bônus — Produto ≠ Negócio",
        blocos: [
          {
            tipo: "paragrafo",
            texto:
              "Vender um item, uma vez, pra uma pessoa, sem recorrência, é um 'emprego turbinado' que morre quando você para. A solução é fazer a pessoa comprar de novo: recorrente (assinatura/SaaS) ou re-ocorrente (Coca-Cola: sabe que você volta).",
          },
          {
            tipo: "destaque",
            texto:
              "Todo negócio tem as mesmas peças: marketing, vendas, TI, jurídico, financeiro, operações e sucesso do cliente. No topo, seu dia é o mesmo em qualquer negócio — por isso trocar de barco pra fugir do destino é ilógico.",
            tom: "info",
          },
        ],
      },
    ],
    aplicacao: [
      {
        tipo: "lista",
        itens: [
          "Cliente ideal: rode o exercício das 4 colunas com quem já fechou. Qual segmento a DoisB ama atender, dá menos suporte e paga o plano mais alto? Mire nele com linguagem específica, não em 'sistema pra qualquer comércio'.",
          "Precificação: o preço do ZWeb é fixo (revenda). A alavanca é o modelo da unidade DoisB — custo de captar + onboarding + suporte por cliente precisa fechar dentro do pró-labore.",
          "Não superexpandir: afinar o onboarding e o suporte PRIMEIRO, depois escalar a captação. Cliente mal atendido vira churn e reputação ruim.",
          "Produto vs negócio: boa notícia — o ZWeb já é recorrência (SaaS). O foco é retenção: reduzir churn com o 'atendimento do seu vizinho'.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------
  // 3 · Consertando ofertas e iscas digitais
  // ---------------------------------------------------------------
  {
    id: "ofertas-iscas",
    numero: 3,
    etiqueta: "Oferta & atração",
    titulo: "Ofertas irresistíveis e iscas digitais",
    subtitulo: "Como deixar de ser comparável e baratear o lead.",
    resumo:
      "Oferta ruim ou isca ruim deixa o lead caro. Aqui está o troubleshooting: vencer em velocidade, risco ou facilidade — e dar um bom motivo pra pessoa te dar o contato.",
    cor: "emerald",
    publico: { tipo: "vendedor", nota: "Os 3 vetores de valor: ensine aos vendedores. A parte de iscas/sorteios é pra marketing." },
    secoes: [
      {
        titulo: "Os 3 vetores de valor",
        blocos: [
          {
            tipo: "paragrafo",
            texto:
              "Num mercado onde é fácil te comparar (serviços, sistema de gestão…), você precisa vencer em pelo menos UM destes três vetores. Não precisa dos três — escolha um, martele nele e faça muito bem.",
          },
          {
            tipo: "cards",
            itens: [
              {
                titulo: "⚡ Mais rápido",
                texto:
                  "Pergunta-guia: 'O que seria preciso pra entregar tudo em 1/3 do tempo?' Sempre existe um jeito de ser mais rápido.",
              },
              {
                titulo: "🛡️ Menos arriscado",
                texto:
                  "Pergunta-guia: 'Dá pra garantir contra o maior medo do cliente?' Use garantias, coberturas ou até um seguro embutido no preço.",
              },
              {
                titulo: "✨ Mais fácil",
                texto:
                  "Pergunta-guia: 'Quanto do caminho a gente prepara pro cliente com antecedência?' Intake, onboarding e pré-trabalho quase ninguém faz — quando você faz, o cliente percebe.",
              },
            ],
          },
          {
            tipo: "destaque",
            texto:
              "\"Não posso arcar com isso\" → é por isso que você SOBE o preço pra refletir o prêmio. Você deixou de ser um produto comoditizado, e as pessoas pagam por isso.",
            tom: "sucesso",
          },
        ],
      },
      {
        titulo: "Ofertas de atração (embrulhe o que já tem)",
        blocos: [
          {
            tipo: "tabela",
            colunas: ["Mecanismo", "Quando usar"],
            linhas: [
              ["Sorteio (giveaway)", "Sorteie algo grande e depois ligue pra quem não ganhou com um 'prêmio de consolação' (desconto)."],
              ["Ganhe seu dinheiro de volta", "Bom pra serviço onde o cliente faz parte do trabalho."],
              ["Chamariz (decoy)", "Bom pra negócios transacionais."],
              ["Pague menos agora, mais depois", "Alivia a barreira de entrada."],
              ["Compre X, leve Y grátis", "Dê de graça mais do que a pessoa paga e ajuste o preço unitário."],
            ],
          },
          {
            tipo: "destaque",
            texto:
              "⚠️ Leis de promoção mudam por região. No Brasil, cheque Procon e regras de sorteio/promoção comercial com um advogado/contador antes.",
            tom: "alerta",
          },
        ],
      },
      {
        titulo: "A isca digital (lead magnet)",
        blocos: [
          {
            tipo: "paragrafo",
            texto:
              "Um CTA direto ('compre agora') só alcança a fatia mais quente do público, que é pequena. A isca digital alcança muito mais gente no topo do funil e escala melhor no total.",
          },
          {
            tipo: "destaque",
            texto:
              "O erro clássico: 'Solicite um orçamento'. Ninguém quer solicitar orçamento. Dê algo que a pessoa realmente quer, na linguagem dela: ❌ 'Solicite um orçamento' → ✅ 'As 11 estruturas que usamos pra construir academias absurdamente lucrativas'.",
            tom: "alerta",
          },
          {
            tipo: "cards",
            itens: [
              {
                titulo: "1 · Revelar um problema",
                texto: "'7 erros que donos de comércio cometem ao emitir nota (e como evitar cada um).'",
              },
              {
                titulo: "2 · Amostra da solução",
                texto:
                  "Dê um pedaço real de graça. Ex: 'A gente migra seus produtos pro sistema de graça e liga em 7 dias pra ver se você quer manter.'",
              },
              {
                titulo: "3 · Oferta estilhaço (splinter)",
                texto:
                  "Puxe UM componente do pacote, dê com 80-90% de desconto ou grátis — depois faça o upsell do resto.",
              },
            ],
          },
        ],
      },
      {
        titulo: "O princípio que sustenta tudo",
        blocos: [
          {
            tipo: "citacao",
            texto:
              "Quanto mais 'real' a isca — quanto mais ela tem custo verdadeiro — maior a chance de funcionar. O favorito: dê de graça algo que outras pessoas cobram.",
          },
          {
            tipo: "paragrafo",
            texto:
              "Se você não consegue leads baratos, é porque sua oferta não promete velocidade, não promete facilidade, não reverte risco e você não tem isca dando um motivo pra pessoa te dar o contato. Conserta isso.",
          },
        ],
      },
    ],
    aplicacao: [
      {
        tipo: "cards",
        itens: [
          {
            titulo: "⚡ Velocidade no ZWeb",
            texto: "Migração/importação rápida via XML, onboarding em poucos dias e suporte que responde no mesmo dia — reforça o 'atendimento do seu vizinho'.",
          },
          {
            titulo: "🛡️ Risco no ZWeb",
            texto: "Sem fidelidade, cancela quando quiser, migração dos dados sem custo. 'Se não for melhor, é só sair' — reversão de risco pura.",
          },
          {
            titulo: "✨ Facilidade no ZWeb",
            texto: "A DoisB já importa os dados, configura a tributação e deixa o PDV pronto. Deixe esse trabalho de bastidor EXPLÍCITO — quase ninguém percebe se você não conta.",
          },
        ],
      },
      {
        tipo: "lista",
        itens: [
          "Trocar 'Solicite um orçamento' por isca real: ex. '7 erros que o comércio vai cometer na Reforma Tributária (e como o sistema evita cada um)'.",
          "Amostra da solução: 'Migramos seus produtos e cadastros pro ZWeb de graça — você decide depois se continua.'",
          "Oferta estilhaço: puxe um módulo (NFC-e, etiquetas, controle de caixa) e ofereça a configuração com desconto pesado, depois faça upsell pro plano completo.",
        ],
      },
    ],
  },
]
