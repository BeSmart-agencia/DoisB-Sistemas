-- =============================================================================
-- DoisB Marketing OS — Seed: brand_kit + ICPs
-- Local sugerido: supabase/seed/marketing_os_seed.sql
-- Rodar APÓS as migrations do schema (Fase 1).
--
-- >>> ANTES DE RODAR: revise os campos marcados com [REVISAR] — são os pontos
-- >>> onde só você e o Abel sabem a resposta exata (preços da oferta, cidades).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- BRAND KIT
-- -----------------------------------------------------------------------------
insert into brand_kit (key, value) values

('posicionamento', '{
  "frase_central": "O sistema mundial. Com o atendimento do seu vizinho.",
  "explicacao": "A DoisB une dois mundos que normalmente não andam juntos: a robustez de um software global (ZWeb, da Zucchetti — maior software house da Itália, 700 mil clientes no mundo) e o atendimento próximo de uma empresa familiar do RS, onde o cliente fala direto com quem resolve, pelo nome, sem fila de chamado.",
  "tensao_criativa": "global vs. local — toda peça deve carregar os dois lados: a prova de escala E a promessa de proximidade. Nunca usar só um.",
  "inimigo_comum": "sistemas caros e impessoais de grandes fornecedores, planilhas improvisadas, e o medo de ficar na mão quando algo dá errado"
}'::jsonb),

('tagline', '{"principal": "Venda. Controle. Cresça.", "uso": "assinatura de peças, fim de vídeos, bio"}'::jsonb),

('tom_de_voz', '{
  "somos": ["direto", "caloroso", "concreto", "de vizinho que entende do assunto", "confiante sem arrogância"],
  "nao_somos": ["corporativo", "robótico", "prometedor de milagre", "técnico sem necessidade"],
  "regras": [
    "Falar como se estivesse no balcão da loja do cliente, não numa sala de reunião",
    "Cena concreta antes de conceito: ''fechou o caixa às 22h de novo?'' em vez de ''otimize sua gestão''",
    "Você/tu conforme o canal; nunca ''Prezado''",
    "Números e provas sempre que existirem; adjetivo sozinho não vende",
    "Humor leve permitido nos conteúdos orgânicos; nunca em comunicação fiscal/tributária"
  ]
}'::jsonb),

('identidade_visual', '{
  "cor_primaria": "#1472B5",
  "fontes": {"display": "Bungee", "detalhe_retro": "Press Start 2P", "mono": "JetBrains Mono"},
  "estetica": "terminal retrô-futurista",
  "nota": "contraste visual proposital: estética tech/global + linguagem de vizinho"
}'::jsonb),

('estrutura_antes_depois', '{
  "descricao": "Estrutura-assinatura de copy: Sem ZWeb vs. Com ZWeb, aplicada às 6 categorias",
  "categorias": {
    "vendas":     {"sem": "PDV lento, fila no caixa, venda perdida quando a internet cai",            "com": "PDV rápido com retaguarda offline: vende sempre, mesmo sem internet"},
    "estoque":    {"sem": "contagem no caderno, produto que ''some'', compra no chute",                "com": "estoque em tempo real, inventário, grade por cor/tamanho, ordem de compra"},
    "financeiro": {"sem": "contas a pagar na cabeça, sem saber se o mês fechou no azul",               "com": "contas, saldos, boletos (Inter, Sicredi, Sicoob, Santander), DRE e metas"},
    "fiscal":     {"sem": "medo do contador ligar, nota emitida errado, pânico com a Reforma",        "com": "NFe, NFCe, NFSe, MDF-e, SPED e Sintegra nativos — e ZWeb já adequado à Reforma Tributária"},
    "os":         {"sem": "ordem de serviço em bloquinho, peça esquecida, cliente sem retorno",        "com": "OS completa com status, peças e serviços, vira nota em um clique — até pelo celular"},
    "gestao":     {"sem": "decidir no feeling, sem relatório, refém de uma pessoa que ''sabe tudo''",  "com": "relatórios, metas, usuários com permissões, tudo na nuvem"}
  }
}'::jsonb),

('oferta_atual', '{
  "nome": "Promo CNPJ Novo",
  "publico": "empresas com CNPJ recém-aberto",
  "mecanica": "primeira mensalidade por preço promocional, pagamento em cartão de crédito",
  "preco_promocional": "[REVISAR: valor exato]",
  "planos": {
    "essencial": {"usuarios": 1,  "preco": "[REVISAR]"},
    "standard":  {"usuarios": 3,  "preco": "[REVISAR]"},
    "premium":   {"usuarios": "ilimitados", "preco": "[REVISAR]"}
  },
  "regras_de_uso_em_copy": "urgência apenas legítima; nunca inventar prazo falso; sempre citar que a condição é para CNPJ novo"
}'::jsonb),

('area_de_atuacao', '{
  "base": "Rio Grande do Sul",
  "cidades_prioritarias": "[REVISAR: listar as 20+ cidades configuradas no GMB]",
  "diferencial_local": "Abel visita presencialmente; suporte fala o dialeto do lojista gaúcho"
}'::jsonb),

('provas', '{
  "zucchetti": ["primeira software house da Itália", "mais de 700.000 clientes no mundo", "soluções para indústria, varejo, RH e gestão"],
  "produto": ["retaguarda offline", "integração Vero/Stone/PagSeguro e ZPOS", "boletos Inter/Sicredi/Sicoob/Santander", "e-commerce e integração Mercado Livre", "adequado à Reforma Tributária"],
  "doisb": ["empresa familiar pai e filha", "atendimento direto com quem resolve", "configuração e treinamento inclusos [REVISAR: confirmar promessa]"],
  "depoimentos": "[REVISAR: adicionar conforme os primeiros clientes fecharem]"
}'::jsonb)

on conflict (key) do update set value = excluded.value, updated_at = now();

-- -----------------------------------------------------------------------------
-- ICPs — os 6 segmentos atendidos pelo ZWeb
-- Dores/objeções/gatilhos ancorados em funcionalidades reais confirmadas na
-- base de conhecimento (OS, grade, balança+PDV Híbrido offline, boletos, fiscal).
-- -----------------------------------------------------------------------------

insert into icp (nome, segmento, dores, objecoes, gatilhos, ativo) values

('Dono de assistência técnica', 'assistencia_tecnica',
'[
  "OS no bloquinho ou WhatsApp: aparelho entra, ninguém sabe o status, cliente liga cobrando",
  "peça pedida e esquecida; orçamento aprovado que se perde",
  "não sabe quanto ganha de verdade por conserto (peça + mão de obra misturados)",
  "na correria, emite nota errado ou não emite — e o contador reclama"
]'::jsonb,
'[
  "\"meu bloquinho funciona\" → funciona até o dia que some; OS digital com status e histórico protege você E o cliente",
  "\"sistema é complicado\" → a DoisB configura, treina e fica do lado; OS abre até pelo celular",
  "\"é caro\" → uma OS perdida por mês já custa mais que a mensalidade"
]'::jsonb,
'[
  "OS completa: objetos, situações, peças e serviços — e vira NFe/NFCe/NFSe em um clique",
  "abrir e consultar OS pelo celular (AppsCloud), na bancada ou na rua",
  "status da OS acaba com o \"me liga que eu vejo\"",
  "controle real de margem: peça separada de serviço"
]'::jsonb, true),

('Dono de loja de vestuário/calçados', 'vestuario_calcados',
'[
  "estoque cego de variações: sabe que tem a camiseta, não sabe se tem a M preta",
  "troca de coleção e liquidação sem saber custo e margem por item",
  "fiado e crediário anotados no caderno",
  "cliente desiste na fila porque o caixa é lento"
]'::jsonb,
'[
  "\"minha loja é pequena pra sistema\" → é pequena pra perder venda por não achar o tamanho; grade é exatamente pra loja como a sua",
  "\"já tentei sistema e era confuso\" → grade do ZWeb: cores e tamanhos vinculados ao produto, preço/custo/estoque individuais",
  "\"não tenho tempo de cadastrar tudo\" → importação via XML das notas de compra alimenta o estoque"
]'::jsonb,
'[
  "controle de grade: cada cor/tamanho com estoque, custo e preço próprios",
  "tabelas de preço para liquidação sem retrabalho",
  "etiquetas com código de barras direto do sistema",
  "PDV rápido + maquininha integrada (Vero/Stone/PagSeguro)"
]'::jsonb, true),

('Dono de oficina mecânica', 'oficina_mecanica',
'[
  "orçamento falado no balcão, cliente \"esquece\" o que aprovou",
  "carro parado esperando peça que ninguém pediu",
  "não separa quanto é peça e quanto é serviço no fim do mês",
  "nota fiscal de serviço é um sufoco à parte"
]'::jsonb,
'[
  "\"oficina não precisa de sistema\" → precisa de OS: quem aprovou o quê, qual peça entrou, quando fica pronto",
  "\"meu negócio é embaixo do carro, não no computador\" → o Abel configura, e a OS abre pelo celular",
  "\"e o contador?\" → NFSe e NFe saem do próprio sistema, importadas direto da OS"
]'::jsonb,
'[
  "OS com peças e serviços separados, status e aprovação registrada",
  "da OS para a nota (NFe/NFSe) em um clique",
  "ordem de compra pra peça não ficar no esquecimento",
  "financeiro com contas a pagar/receber e boleto pelo banco que já usa (Sicredi/Sicoob/Inter/Santander)"
]'::jsonb, true),

('Dono de mercado/minimercado', 'mercado_minimercado',
'[
  "internet caiu = fila parada e cliente largando a compra no caixa (dor máxima do segmento)",
  "balança separada do caixa: erro de digitação e perda no pesável",
  "validade e quebra sem controle; compra por repetição, não por giro",
  "SPED/Sintegra na mão do contador com dados incompletos"
]'::jsonb,
'[
  "\"sistema trava e para meu caixa\" → argumento invertido: o ZWeb tem PDV Híbrido com retaguarda offline — é justamente o sistema que NÃO para quando a internet cai",
  "\"balança não conversa com sistema barato\" → balança de checkout integrada ao PDV: pesou, lançou",
  "\"mercado grande que precisa disso\" → minimercado sente MAIS a fila parada, porque cada cliente conta"
]'::jsonb,
'[
  "retaguarda offline: vende mesmo sem internet — argumento matador, liderar toda copy do segmento",
  "balança de checkout integrada ao PDV (pesáveis lançados automaticamente)",
  "balança de etiquetas para o setor de frios/padaria interna",
  "SPED Fiscal e Sintegra gerados pelo sistema — contador feliz",
  "NFCe direto do caixa"
]'::jsonb, true),

('Prestador de serviços', 'prestador_servicos',
'[
  "orçamento no WhatsApp que se perde no meio das conversas",
  "esquece de cobrar; recebe atrasado porque não tem boleto profissional",
  "NFSe emitida manualmente no site da prefeitura, com erro e retrabalho",
  "agenda e serviços na cabeça — quando cresce, vira caos"
]'::jsonb,
'[
  "\"sou só eu, não preciso de sistema\" → plano Essencial é exatamente para 1 usuário; profissionaliza sem pesar",
  "\"meu serviço é na rua\" → orçamento, pedido e OS pelo celular (AppsCloud)",
  "\"emitir nota é complicado\" → NFSe configurada uma vez, emitida do sistema em diante"
]'::jsonb,
'[
  "orçamento profissional em minutos, do celular, com a sua marca",
  "boleto registrado pelos principais bancos — cobra sem constrangimento",
  "NFSe sem depender do site da prefeitura",
  "agenda integrada ao atendimento"
]'::jsonb, true),

('Dono de empório/padaria', 'emporio_padaria',
'[
  "produto pesável + produto de prateleira no mesmo caixa = confusão e perda",
  "produção própria sem saber custo real (quanto custa o pão que sai?)",
  "movimento concentrado em horários de pico: caixa lento espanta cliente",
  "internet oscilando no interior e o caixa refém dela"
]'::jsonb,
'[
  "\"padaria é simples, não precisa disso\" → simples até somar quebra + fila + pesável errado todo dia",
  "\"tenho medo de parar a loja pra trocar de sistema\" → a DoisB faz a virada junto, com treinamento, e o PDV Híbrido segura a operação até sem internet",
  "\"balança e etiqueta são outro mundo\" → balança de etiquetas e de checkout integradas ao ZWeb"
]'::jsonb,
'[
  "retaguarda offline para nunca parar o caixa no pico",
  "balança de etiquetas + balança de checkout integradas",
  "kits e produção própria com custo controlado (cadastro de kits)",
  "NFCe ágil no balcão; fiscal (SPED/Sintegra) resolvido"
]'::jsonb, true);

-- -----------------------------------------------------------------------------
-- Notas de uso:
-- 1. Os campos [REVISAR] precisam de você: preços da oferta, cidades do GMB,
--    promessas de onboarding (configuração/treinamento incluso?) e depoimentos.
-- 2. Os agentes recebem tudo isso via placeholders {{BRAND_KIT}} e {{ICP}}.
--    O orquestrador deve serializar: brand_kit inteiro + apenas ICPs ativos.
-- 3. Quando os primeiros clientes fecharem, atualize ''provas.depoimentos'' —
--    o Copywriter passa a usar prova social real automaticamente.
-- =============================================================================
