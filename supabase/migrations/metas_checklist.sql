-- ============================================================
-- DoisB — Checklist de Metas Ano 1 (jul/2026 → jul/2027)
-- Execute no Supabase Dashboard → SQL Editor → New query.
-- Alimenta a tela /admin/metas. Seguro rodar de novo:
-- o seed só insere se a tabela estiver vazia.
--
-- Se a tabela JÁ foi semeada antes deste reajuste, rode também
-- supabase/migrations/metas_checklist_reajuste.sql.
-- ============================================================

create table if not exists metas_checklist (
  id uuid primary key default gen_random_uuid(),
  mes date not null,                 -- primeiro dia do mês (ex.: 2026-07-01)
  responsavel text not null,         -- 'laisa' | 'abel' | 'vendedora' | 'ambos'
  categoria text not null,           -- 'zweb' | 'sob_medida' | 'industria' | 'gestao'
  tarefa text not null,
  ordem int default 0,
  concluido boolean default false,
  concluido_em timestamptz,
  concluido_por text,
  created_at timestamptz default now()
);

create index if not exists metas_checklist_mes_idx on metas_checklist (mes, ordem);

-- ------------------------------------------------------------
-- Seed: metas mês a mês, derivadas do plano Ano 1
-- ZWeb (Laisa + vendedora externa): 4→60 clientes
-- Indústria (Abel): 0→6 clientes | Sob medida: 1 projeto/mês
-- ordem: 1=ZWeb  2=vendedora  3=sob medida  4=indústria  5/6=gestão
-- ------------------------------------------------------------
insert into metas_checklist (mes, responsavel, categoria, tarefa, ordem)
select v.mes, v.responsavel, v.categoria, v.tarefa, v.ordem
from (values
  -- JUL/26
  ('2026-07-01'::date,'laisa','zweb','ZWeb: chegar a 4 clientes ativos',1),
  ('2026-07-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2026-07-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2026-07-01'::date,'abel','industria','Zucchetti: confirmar nome do produto, preço de tabela e margem da revenda (R1)',4),
  ('2026-07-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- AGO/26
  ('2026-08-01'::date,'laisa','zweb','ZWeb: chegar a 8 clientes ativos',1),
  ('2026-08-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2026-08-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2026-08-01'::date,'abel','industria','Indústria: mapear e sondar 10 indústrias da região',4),
  ('2026-08-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- SET/26
  ('2026-09-01'::date,'laisa','zweb','ZWeb: chegar a 12 clientes ativos',1),
  ('2026-09-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2026-09-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2026-09-01'::date,'abel','industria','Indústria: agendar demonstrações com 3 indústrias',4),
  ('2026-09-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- OUT/26 (marco T1)
  ('2026-10-01'::date,'laisa','zweb','ZWeb: chegar a 16 clientes ativos (marco T1)',1),
  ('2026-10-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2026-10-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2026-10-01'::date,'abel','industria','Indústria: fechar o 1º cliente (marco T1)',4),
  ('2026-10-01'::date,'ambos','gestao','Validar os 3 modelos de receita com números reais (marco T1)',5),
  ('2026-10-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',6),
  -- NOV/26
  ('2026-11-01'::date,'laisa','zweb','ZWeb: chegar a 21 clientes ativos',1),
  ('2026-11-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2026-11-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2026-11-01'::date,'abel','industria','Indústria: manter prospecção com 2 negociações abertas',4),
  ('2026-11-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- DEZ/26
  ('2026-12-01'::date,'laisa','zweb','ZWeb: chegar a 25 clientes ativos',1),
  ('2026-12-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2026-12-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2026-12-01'::date,'abel','industria','Indústria: fechar o 2º cliente',4),
  ('2026-12-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- JAN/27 (marco T2)
  ('2027-01-01'::date,'laisa','zweb','ZWeb: chegar a 30 clientes ativos (marco T2)',1),
  ('2027-01-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2027-01-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2027-01-01'::date,'abel','industria','Indústria: fechar o 3º cliente (marco T2)',4),
  ('2027-01-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- FEV/27
  ('2027-02-01'::date,'laisa','zweb','ZWeb: chegar a 35 clientes ativos',1),
  ('2027-02-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2027-02-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2027-02-01'::date,'abel','industria','Indústria: agendar 2 novas demonstrações',4),
  ('2027-02-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- MAR/27
  ('2027-03-01'::date,'laisa','zweb','ZWeb: chegar a 40 clientes ativos',1),
  ('2027-03-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2027-03-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2027-03-01'::date,'abel','industria','Indústria: fechar o 4º cliente',4),
  ('2027-03-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- ABR/27 (marco T3)
  ('2027-04-01'::date,'laisa','zweb','ZWeb: chegar a 45 clientes ativos (marco T3)',1),
  ('2027-04-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2027-04-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2027-04-01'::date,'abel','industria','Indústria: fechar o 5º cliente (marco T3)',4),
  ('2027-04-01'::date,'ambos','gestao','Receita > R$ 20 mil: DoisB absorve o 1º salário (Douglas ou Ailla)',5),
  ('2027-04-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',6),
  -- MAI/27
  ('2027-05-01'::date,'laisa','zweb','ZWeb: chegar a 50 clientes ativos',1),
  ('2027-05-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2027-05-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2027-05-01'::date,'abel','industria','Indústria: manter os 5 clientes e prospectar o 6º',4),
  ('2027-05-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- JUN/27
  ('2027-06-01'::date,'laisa','zweb','ZWeb: chegar a 55 clientes ativos',1),
  ('2027-06-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2027-06-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2027-06-01'::date,'abel','industria','Indústria: negociação final do 6º cliente',4),
  ('2027-06-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',5),
  -- JUL/27 (marco T4 — meta-mãe)
  ('2027-07-01'::date,'laisa','zweb','ZWeb: chegar a 60 clientes ativos (marco T4)',1),
  ('2027-07-01'::date,'vendedora','zweb','Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)',2),
  ('2027-07-01'::date,'laisa','sob_medida','Sob medida: entregar 1 projeto e ativar a mensalidade de R$ 450',3),
  ('2027-07-01'::date,'abel','industria','Indústria: fechar o 6º cliente (marco T4)',4),
  ('2027-07-01'::date,'ambos','gestao','Folha completa (R$ 18,5 mil) e agência encerrada — meta-mãe R$ 30 mil/mês',5),
  ('2027-07-01'::date,'ambos','gestao','Revisar as metas no relatório de segunda com o Estrategista',6)
) as v(mes, responsavel, categoria, tarefa, ordem)
where not exists (select 1 from metas_checklist);
