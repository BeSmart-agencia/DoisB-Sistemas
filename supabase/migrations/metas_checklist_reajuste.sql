-- ============================================================
-- Reajuste das Metas Ano 1 (2026-07-20)
-- Salários: Douglas 2.500, Ailla 2.000 (folha R$ 18,5 mil)
-- Motores: Indústria R$ 16k · ZWeb R$ 10k · Sob medida R$ 4k
-- meta-mãe R$ 30 mil · + vendedora externa (5 ZWeb/mês)
--
-- Rode SE a tabela metas_checklist já foi semeada antes deste
-- reajuste. É idempotente — pode rodar mais de uma vez sem duplicar.
-- (Ambiente novo já nasce correto pelo metas_checklist.sql.)
-- ============================================================

-- 1) Vendedora externa: 1 meta recorrente por mês (só insere se faltar)
insert into metas_checklist (mes, responsavel, categoria, tarefa, ordem)
select d.mes, 'vendedora', 'zweb',
       'Vendedora externa: fechar 5 novos clientes ZWeb (comissão = 1ª mensalidade)', 2
from (select distinct mes from metas_checklist) d
where not exists (
  select 1 from metas_checklist m where m.mes = d.mes and m.responsavel = 'vendedora'
);

-- 2) Normaliza a ordem dentro de cada mês (idempotente)
update metas_checklist set ordem = 1 where categoria = 'zweb' and responsavel <> 'vendedora';
update metas_checklist set ordem = 2 where responsavel = 'vendedora';
update metas_checklist set ordem = 3 where categoria = 'sob_medida';
update metas_checklist set ordem = 4 where categoria = 'industria';
update metas_checklist set ordem = 5 where categoria = 'gestao' and tarefa not like 'Revisar%';
update metas_checklist set ordem = 6 where categoria = 'gestao' and tarefa like 'Revisar%';

-- 3) Ajusta o texto do marco final (jul/27) para os novos números
update metas_checklist
set tarefa = 'Folha completa (R$ 18,5 mil) e agência encerrada — meta-mãe R$ 30 mil/mês'
where mes = '2027-07-01' and categoria = 'gestao' and tarefa like 'Folha completa%';
