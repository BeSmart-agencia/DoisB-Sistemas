import type { Metadata } from "next"
import { LegalLayout } from "@/components/site/legal-layout"

export const metadata: Metadata = {
  title: "Política de Privacidade — AgendaB",
  description:
    "Como o AgendaB (DoisB Sistemas) trata os dados das clínicas e dos pacientes, em conformidade com a LGPD.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/agendab/privacidade" },
}

export default function PrivacidadeAgendabPage() {
  return (
    <LegalLayout title="Política de Privacidade — AgendaB" updated="28 de julho de 2026">
      <p>
        Esta política descreve como o <strong>AgendaB</strong>, sistema de gestão para clínicas
        fornecido pela <strong>DoisB Sistemas</strong>, trata dados pessoais, em conformidade com a
        Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Ao contratar e utilizar o
        AgendaB, a clínica concorda com os termos aqui descritos.
      </p>

      <h2>1. Papéis: quem é Controlador e quem é Operador</h2>
      <p>
        A LGPD distingue quem <em>decide</em> sobre os dados (Controlador) de quem apenas os
        <em> processa</em> em nome de outro (Operador):
      </p>
      <ul>
        <li>
          <strong>Dados dos pacientes</strong> (nome, contato, prontuário, exames, documentos):
          a <strong>clínica é a Controladora</strong> — é ela quem coleta e decide sobre esses
          dados no exercício da sua atividade de saúde. A{" "}<strong>DoisB atua como Operadora</strong>,
          tratando os dados exclusivamente para fornecer o sistema, seguindo as instruções da clínica.
        </li>
        <li>
          <strong>Dados de cadastro da clínica</strong> (responsável, e-mail, telefone, CNPJ,
          dados de assinatura): a <strong>DoisB é a Controladora</strong>, pois são necessários
          para a relação contratual.
        </li>
      </ul>
      <p>
        Cabe à clínica garantir a base legal adequada para tratar os dados de seus pacientes
        (ex.: tutela da saúde, art. 11, II, alínea f, da LGPD) e informar seus pacientes sobre esse
        tratamento.
      </p>

      <h2>2. Dados tratados</h2>
      <ul>
        <li><strong>Da clínica:</strong> nome do responsável, e-mail, telefone, CNPJ, endereço e dados de acesso (login).</li>
        <li><strong>Inseridos pela clínica sobre pacientes:</strong> nome, CPF, data de nascimento, contato, endereço, convênio e <strong>dados de saúde</strong> (evoluções/prontuário, exames anexados, receitas, atestados e laudos). Dados de saúde são <strong>dados pessoais sensíveis</strong> e recebem proteção reforçada.</li>
        <li><strong>De pagamento:</strong> processados diretamente pelo Stripe. A DoisB <strong>não</strong> armazena números de cartão.</li>
        <li><strong>Técnicos:</strong> registros de acesso e uso, necessários à segurança e ao funcionamento.</li>
      </ul>

      <h2>3. Finalidade e base legal</h2>
      <p>Tratamos os dados para:</p>
      <ul>
        <li>Fornecer as funcionalidades do AgendaB (agenda, pacientes, prontuário, financeiro);</li>
        <li>Autenticar usuários e garantir a segurança do sistema;</li>
        <li>Processar a assinatura e a cobrança;</li>
        <li>Prestar suporte e enviar comunicações operacionais.</li>
      </ul>
      <p>
        Bases legais (LGPD art. 7º e 11): execução de contrato, cumprimento de obrigação legal,
        legítimo interesse (segurança) e, para dados de saúde, o tratamento realizado pela clínica
        para a tutela da saúde do próprio paciente.
      </p>

      <h2>4. Isolamento e segurança</h2>
      <p>
        Os dados de cada clínica são <strong>totalmente isolados</strong> dos das demais: a
        separação é aplicada no próprio banco de dados (regras de acesso por linha), de modo que
        uma clínica nunca acessa dados de outra. Adotamos ainda:
      </p>
      <ul>
        <li>Criptografia em trânsito (HTTPS/TLS) e em repouso;</li>
        <li>Controle de acesso por autenticação individual (cada usuário com login e senha);</li>
        <li>Arquivos (exames/documentos) em armazenamento privado, acessível apenas mediante autorização e por tempo limitado;</li>
        <li>Backups automáticos e monitoramento;</li>
        <li>Limite de usuários por clínica e trilhas de acesso.</li>
      </ul>

      <h2>5. Compartilhamento e suboperadores</h2>
      <p>
        Para operar o AgendaB, utilizamos prestadores de tecnologia que atuam como suboperadores,
        tratando os dados apenas para viabilizar o serviço:
      </p>
      <ul>
        <li><strong>Supabase:</strong> banco de dados e armazenamento de arquivos;</li>
        <li><strong>Vercel:</strong> hospedagem da aplicação;</li>
        <li><strong>Stripe:</strong> processamento de pagamentos;</li>
        <li><strong>Resend:</strong> envio de e-mails transacionais.</li>
      </ul>
      <p>
        A DoisB <strong>não vende</strong> dados e não os utiliza para finalidades alheias à
        prestação do serviço. Alguns prestadores podem processar dados fora do Brasil; nesses
        casos, a transferência observa as salvaguardas da LGPD.
      </p>

      <h2>6. Retenção e eliminação</h2>
      <p>
        Os dados são mantidos enquanto a assinatura estiver ativa. Em caso de suspensão por falta
        de pagamento, os dados são <strong>preservados</strong> e o acesso fica bloqueado até a
        regularização. Após o encerramento definitivo do contrato, os dados podem ser exportados
        mediante solicitação e são eliminados em até 90 dias, ressalvadas obrigações legais de
        guarda (ex.: prontuários, sujeitos a prazos da legislação de saúde, sob responsabilidade
        da clínica Controladora).
      </p>

      <h2>7. Direitos dos titulares</h2>
      <p>
        Pacientes que queiram exercer seus direitos (acesso, correção, eliminação, portabilidade,
        entre outros previstos no art. 18 da LGPD) devem procurar <strong>a clínica</strong>, que
        é a Controladora dos seus dados. A DoisB apoiará a clínica no atendimento a essas
        solicitações. Para dados de cadastro da própria clínica, o contato é com a DoisB.
      </p>

      <h2>8. Cookies</h2>
      <p>
        O AgendaB utiliza apenas cookies essenciais (autenticação e sessão), necessários para
        manter o usuário conectado com segurança. Não há cookies de publicidade.
      </p>

      <h2>9. Encarregado de Dados (DPO)</h2>
      <p>
        Dúvidas ou solicitações relacionadas à proteção de dados podem ser enviadas ao Encarregado
        da DoisB Sistemas: <a href="mailto:contato@doisbsistemas.com.br">contato@doisbsistemas.com.br</a>.
      </p>

      <h2>10. Alterações</h2>
      <p>
        Esta política pode ser atualizada periodicamente. A versão vigente estará sempre disponível
        nesta página; mudanças relevantes serão comunicadas às clínicas por e-mail.
      </p>
    </LegalLayout>
  )
}
