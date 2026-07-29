// ============================================================
// Roteiros de venda — kit de argumentação para os vendedores externos.
// Escrito como um estrategista de vendas: para quem é, ganchos de abertura,
// dores a investigar, argumentos de valor, quebra de objeções e fechamento.
// Conteúdo estático (fonte única) usado no portal do vendedor.
// ============================================================

export interface Objecao {
  objecao: string
  resposta: string
}

export interface Roteiro {
  id: "zweb" | "agendab" | "sobmedida"
  produto: string
  tagline: string
  preco: string
  comoGanho: string
  paraQuem: string[]
  ganchos: string[]
  dores: string[]
  argumentos: { titulo: string; texto: string }[]
  objecoes: Objecao[]
  fechamento: string[]
  regraDeOuro: string
}

export const ROTEIROS: Roteiro[] = [
  {
    id: "zweb",
    produto: "ZWeb",
    tagline: "Venda. Controle. Cresça.",
    preco: "R$ 129,90 a R$ 249,90/mês · sem fidelidade",
    comoGanho:
      "Comissão automática pelo seu link: quando o lojista assina pelo seu link, você recebe 100% da 1ª mensalidade do plano escolhido.",
    paraQuem: [
      "Lojas e comércio varejista: roupas, calçados, mercados, autopeças, materiais de construção, papelaria, pet, farmácia.",
      "Quem já vende, mas controla tudo no caderno, na planilha ou 'na cabeça'.",
      "Lojista que paga o contador avulso por cada nota fiscal.",
      "Dono que quer abrir uma 2ª loja e precisa enxergar os números.",
    ],
    ganchos: [
      "\"Sem abrir nenhuma planilha, você me diz agora quanto vendeu hoje e quais foram os 3 produtos que mais saíram?\"",
      "\"Quando falta um produto na prateleira, você descobre na hora ou só quando o cliente pede e não tem?\"",
      "\"Quanto você paga hoje pro contador só pra emitir nota fiscal?\"",
      "\"Seu caixa fecha certinho todo dia ou quase sempre sobra/falta um troco que ninguém sabe explicar?\"",
    ],
    dores: [
      "Estoque no caderno ou na cabeça — perde venda por falta e compra demais do que não gira.",
      "Não sabe o que dá lucro: vende muito e no fim do mês o dinheiro não aparece.",
      "Nota fiscal dependendo do contador: caro, lento e trava a venda.",
      "Caixa que não bate, fiado sem controle, contas a pagar espalhadas.",
      "Cresceu e não consegue acompanhar 2 balconistas / 2 lojas ao mesmo tempo.",
    ],
    argumentos: [
      {
        titulo: "Frente de caixa (PDV) de verdade",
        texto:
          "Venda rápida no balcão, integra com a maquininha, e cada venda já baixa o estoque e entra no financeiro. Acabou a digitação em 3 lugares.",
      },
      {
        titulo: "Emite a própria nota",
        texto:
          "NF-e, NFC-e, boleto, MDF-e direto no sistema. O lojista para de pagar o contador por nota avulsa — muitas vezes isso sozinho já paga a mensalidade.",
      },
      {
        titulo: "O dono enxerga tudo",
        texto:
          "Quanto vendeu, o que mais saiu, quem deve, quanto tem em caixa — em tempo real, do celular. Decisão com número, não com achismo.",
      },
      {
        titulo: "Migração sem dor",
        texto:
          "Importação assistida dos dados do sistema atual e suporte no WhatsApp. Ninguém começa do zero nem fica na mão.",
      },
    ],
    objecoes: [
      {
        objecao: "\"Já tenho um sistema.\"",
        resposta:
          "Ótimo, então você já sabe o valor de ter um. A pergunta é: ele te dá o número na hora, no celular, e emite tudo sem depender de ninguém? A gente importa seus dados do atual sem custo e sem fidelidade — se não for melhor, é só sair.",
      },
      {
        objecao: "\"É caro.\"",
        resposta:
          "Dá menos que R$ 7 por dia no plano mais vendido. Uma venda perdida por falta de estoque, ou uma nota que o contador cobrou avulsa, já custa mais que isso. E não tem fidelidade nem multa.",
      },
      {
        objecao: "\"É complicado, minha equipe não vai aprender.\"",
        resposta:
          "O PDV é feito pra balconista usar no corre. Tem guia dentro do sistema e suporte no WhatsApp de gente de verdade. A maioria está vendendo no mesmo dia.",
      },
      {
        objecao: "\"Meu contador já cuida disso.\"",
        resposta:
          "Ele continua cuidando do imposto. O que muda é que a NOTA sai na hora, por você, sem pagar avulso e sem esperar. O contador vai gostar de receber tudo organizado.",
      },
    ],
    fechamento: [
      "Recomende o Standard: é o queridinho do varejo (8 em cada 10 escolhem) — tem PDV + financeiro completo.",
      "\"Vou te mandar o link. Você preenche em 3 minutos, escolhe cartão ou boleto, e o acesso já entra em liberação.\"",
      "Mande SEU link (o do seu portal) — é ele que garante a sua comissão.",
    ],
    regraDeOuro:
      "Não venda 'um sistema'. Venda enxergar o próprio negócio: estoque, caixa e lucro na palma da mão.",
  },
  {
    id: "agendab",
    produto: "AgendaB",
    tagline: "A gestão da clínica, simples e moderna.",
    preco: "R$ 175/mês · plano único · até 5 usuários · sem fidelidade",
    comoGanho:
      "Levantou uma clínica interessada? Passe o contato pra equipe DoisB fechar — a comissão do AgendaB é combinada e paga por fora (fale com a Laisa). O roteiro abaixo é pra você qualificar e despertar o interesse.",
    paraQuem: [
      "Clínicas e consultórios de qualquer especialidade: odontologia, medicina, psicologia, fisioterapia, estética, nutrição.",
      "Profissional que atende sozinho ou com 1 secretária e ainda usa agenda de papel.",
      "Quem perde dinheiro com paciente que falta (no-show) e prontuário espalhado.",
    ],
    ganchos: [
      "\"Quantos pacientes furaram a consulta esse mês? Cada falta é uma cadeira vazia que já estava paga.\"",
      "\"Onde está o histórico do paciente que veio há 2 anos? Se for no papel, quanto tempo você leva pra achar?\"",
      "\"Receita e atestado você ainda escreve à mão, um por um?\"",
    ],
    dores: [
      "Faltas e buracos na agenda que ninguém preenche.",
      "Agenda no caderno: rasura, remarcação bagunçada, secretária refém do papel.",
      "Prontuário espalhado — ficha aqui, exame ali, foto no WhatsApp.",
      "Documentos escritos à mão, sem padrão e sem timbre.",
      "Se a secretária falta ou sai, a clínica trava.",
    ],
    argumentos: [
      {
        titulo: "Agenda que organiza o dia",
        texto:
          "Visão clara do dia e da semana, remarcação em segundos, cada profissional com seu login. A recepção para de depender do caderno.",
      },
      {
        titulo: "Prontuário que conta a história",
        texto:
          "Linha do tempo única: cada evolução, exame anexado (foto ou PDF) e documento com data e profissional. Histórico de todos os anos num clique.",
      },
      {
        titulo: "Receita e atestado em segundos",
        texto:
          "Modelos prontos com impressão em papel timbrado da clínica. Profissionalismo que o paciente percebe.",
      },
      {
        titulo: "Funciona no celular como app",
        texto:
          "Adiciona na tela do celular e usa em tela cheia. Sem instalar nada, dados isolados por clínica, com backup automático.",
      },
    ],
    objecoes: [
      {
        objecao: "\"Minha secretária dá conta.\"",
        resposta:
          "E no dia que ela falta ou tira férias? Com o AgendaB a agenda e o histórico ficam no sistema, não na cabeça de uma pessoa. Ela vira mais produtiva, não substituída.",
      },
      {
        objecao: "\"É caro pra mim.\"",
        resposta:
          "É R$ 175 no mês inteiro, sem fidelidade. Uma única consulta que deixaria de faltar já paga isso. E até 5 pessoas usam no mesmo valor.",
      },
      {
        objecao: "\"Tenho medo de mudar de sistema / do papel.\"",
        resposta:
          "Não instala nada, funciona no navegador, e tem um guia passo a passo dentro do próprio sistema. O acesso sai na hora que confirma. Se não gostar, cancela quando quiser.",
      },
    ],
    fechamento: [
      "\"Posso te mandar o link pra você já criar a conta da clínica? O acesso libera na hora que o pagamento confirma.\"",
      "Se a pessoa titubear, ofereça mostrar a tela: o painel e o prontuário vendem sozinhos.",
      "Anotou o interesse? Manda o contato pra equipe pra garantir sua comissão.",
    ],
    regraDeOuro:
      "Venda tempo e tranquilidade, não software. O médico quer atender — não quer gerenciar papel.",
  },
  {
    id: "sobmedida",
    produto: "Sob Medida",
    tagline: "Sua empresa não é genérica. Por que o sistema seria?",
    preco: "Orçamento fechado + mensalidade de manutenção · diagnóstico grátis",
    comoGanho:
      "Aqui você NÃO fecha na hora — você qualifica e agenda o diagnóstico gratuito. Trouxe uma empresa que virou projeto? A comissão é combinada por projeto (fale com a Laisa). Seu ouro aqui é enxergar a dor certa e marcar a conversa.",
    paraQuem: [
      "PMEs cujo processo vive em planilha, papel e WhatsApp — e já passaram do ponto do sistema de prateleira.",
      "Indústrias, distribuidoras, prestadores de serviço com um jeito próprio de trabalhar.",
      "Empresa que tentou sistema pronto e teve que se contorcer pra caber nele.",
      "Negócio que depende de UMA planilha que só uma pessoa sabe mexer.",
    ],
    ganchos: [
      "\"Existe uma planilha na sua empresa que, se a pessoa que cuida dela sair amanhã, para tudo?\"",
      "\"Quantas vezes o mesmo pedido é digitado até virar entrega? WhatsApp, planilha, caderno...?\"",
      "\"Pra saber como o mês está indo, você olha numa tela ou precisa perguntar pra alguém e esperar?\"",
    ],
    dores: [
      "A planilha virou um monstro: quebra toda semana e ninguém confia no número.",
      "O mesmo dado digitado 3 vezes — cada cópia é um erro e uma hora perdida.",
      "O dono no escuro, sem número em tempo real pra decidir.",
      "Sistema de prateleira que não encaixa no processo real da empresa.",
    ],
    argumentos: [
      {
        titulo: "O sistema se adapta a você",
        texto:
          "Em vez de mudar o jeito da empresa trabalhar pra caber num software genérico, a gente desenvolve exatamente o fluxo que já funciona — só que digital, rápido e à prova de erro.",
      },
      {
        titulo: "Diagnóstico grátis, sem vendedor no meio",
        texto:
          "Uma conversa de 20 minutos pra entender onde trava e o que dói. Sem compromisso. Só isso já entrega clareza pro dono.",
      },
      {
        titulo: "Escopo, prazo e preço fechados",
        texto:
          "A proposta vem com tudo definido. Sem surpresa no boleto, sem 'hora extra de desenvolvimento'.",
      },
      {
        titulo: "Entrega por fase",
        texto:
          "O sistema entra em uso por partes, começando pela dor maior. Dá pra começar pequeno e crescer com a empresa.",
      },
    ],
    objecoes: [
      {
        objecao: "\"Deve ser caríssimo.\"",
        resposta:
          "Começa pequeno, pela dor que mais custa hoje, com preço fechado. Muitas vezes a hora perdida com retrabalho e erro já paga o projeto. O diagnóstico pra descobrir isso é gratuito.",
      },
      {
        objecao: "\"Não tenho tempo pra isso agora.\"",
        resposta:
          "O diagnóstico são 20 minutos e é justamente pra você ganhar tempo depois. Não custa nada e não tem compromisso — só clareza.",
      },
      {
        objecao: "\"Meu sobrinho / um freela faz mais barato.\"",
        resposta:
          "E quando quebrar, quem mantém? Aqui tem escopo fechado, entrega por fase e mensalidade de manutenção — o sistema não fica órfão no meio do caminho.",
      },
    ],
    fechamento: [
      "Não force a venda: ofereça o diagnóstico gratuito. \"Topa uma conversa de 20 minutos, sem compromisso, pra mapear onde dá pra melhorar?\"",
      "Colete: nome da empresa, o que trava hoje, melhor horário. Passe pra equipe DoisB.",
      "Seu papel é abrir a porta com a dor certa — a equipe técnica conduz o resto.",
    ],
    regraDeOuro:
      "Não prometa sistema. Ofereça uma conversa que já vale por si só. Quem tem a dor, reconhece na hora.",
  },
]
