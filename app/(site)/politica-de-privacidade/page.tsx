import type { Metadata } from 'next'
import { LegalLayout } from '@/components/site/legal-layout'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a DoisB Sistemas coleta, usa e protege seus dados pessoais (LGPD).',
  robots: { index: false, follow: false },
}

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" updated="01 de junho de 2025">
      <p>
        A <strong>DoisB Sistemas</strong> está comprometida com a proteção dos seus dados pessoais,
        em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e demais
        legislações aplicáveis.
      </p>

      <h2>1. Dados que Coletamos</h2>
      <p>Coletamos os seguintes dados quando você utiliza nossos serviços:</p>
      <ul>
        <li><strong>Dados de cadastro:</strong> nome, CNPJ, e-mail, telefone e endereço</li>
        <li><strong>Dados de uso:</strong> páginas acessadas, interações com o sistema, chamados de suporte</li>
        <li><strong>Dados de pagamento:</strong> processados diretamente pelo Stripe (não armazenamos dados de cartão)</li>
        <li><strong>Dados de comunicação:</strong> conteúdo de mensagens de suporte e e-mails trocados</li>
      </ul>

      <h2>2. Como Usamos seus Dados</h2>
      <p>Utilizamos seus dados para:</p>
      <ul>
        <li>Prestação dos serviços contratados e suporte técnico</li>
        <li>Processamento de pagamentos e emissão de cobranças</li>
        <li>Comunicações sobre atualizações do sistema e novidades</li>
        <li>Melhoria contínua dos nossos serviços</li>
        <li>Cumprimento de obrigações legais e regulatórias</li>
      </ul>

      <h2>3. Base Legal para o Tratamento</h2>
      <p>O tratamento dos seus dados se baseia nas seguintes hipóteses legais previstas na LGPD:</p>
      <ul>
        <li>Execução de contrato (art. 7º, V)</li>
        <li>Legítimo interesse (art. 7º, IX)</li>
        <li>Cumprimento de obrigação legal (art. 7º, II)</li>
        <li>Consentimento, quando aplicável (art. 7º, I)</li>
      </ul>

      <h2>4. Compartilhamento de Dados</h2>
      <p>
        Seus dados podem ser compartilhados com terceiros essenciais à prestação dos serviços:
      </p>
      <ul>
        <li><strong>Zucchetti do Brasil:</strong> para operação do sistema ZWeb</li>
        <li><strong>Stripe:</strong> processamento de pagamentos</li>
        <li><strong>Supabase:</strong> armazenamento seguro de dados</li>
        <li><strong>Resend:</strong> envio de e-mails transacionais</li>
      </ul>
      <p>Não vendemos seus dados a terceiros.</p>

      <h2>5. Seus Direitos (LGPD)</h2>
      <p>Como titular dos dados, você tem direito a:</p>
      <ul>
        <li>Confirmar a existência de tratamento dos seus dados</li>
        <li>Acessar seus dados pessoais</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
        <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários</li>
        <li>Revogar o consentimento a qualquer momento</li>
        <li>Solicitar a portabilidade dos dados</li>
      </ul>
      <p>
        Para exercer esses direitos, entre em contato pelo e-mail{' '}
        <a href="mailto:contato@doisbsistemas.com.br">contato@doisbsistemas.com.br</a>.
      </p>

      <h2>6. Retenção dos Dados</h2>
      <p>
        Mantemos seus dados pelo período necessário para cumprir as finalidades descritas nesta
        política, respeitando as obrigações legais (ex.: dados fiscais são mantidos por 5 anos).
        Após o cancelamento do contrato, os dados são anonimizados ou eliminados em até 90 dias.
      </p>

      <h2>7. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
        autorizado, perda ou alteração, incluindo criptografia em trânsito (HTTPS), controle de
        acesso por autenticação e backups regulares.
      </p>

      <h2>8. Cookies</h2>
      <p>
        Utilizamos cookies essenciais para o funcionamento do sistema (autenticação e sessão) e
        cookies analíticos (Vercel Analytics) para melhoria do serviço. Nenhum dado identificável
        é associado aos dados analíticos.
      </p>

      <h2>9. Encarregado de Dados (DPO)</h2>
      <p>
        Nosso Encarregado de Proteção de Dados pode ser contatado em{' '}
        <a href="mailto:contato@doisbsistemas.com.br">contato@doisbsistemas.com.br</a>.
      </p>

      <h2>10. Alterações nesta Política</h2>
      <p>
        Esta Política pode ser atualizada periodicamente. A versão mais recente estará sempre
        disponível nesta página. Em caso de mudanças significativas, notificaremos por e-mail.
      </p>
    </LegalLayout>
  )
}
