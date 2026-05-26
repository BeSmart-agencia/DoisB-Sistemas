import type { Metadata } from 'next'
import { LegalLayout } from '@/components/site/legal-layout'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso dos serviços da DoisB Sistemas.',
  robots: { index: false, follow: false },
}

export default function TermosDeUsoPage() {
  return (
    <LegalLayout title="Termos de Uso" updated="01 de junho de 2025">
      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao acessar e utilizar os serviços da <strong>DoisB Sistemas</strong> (&quot;DoisB&quot;, &quot;nós&quot; ou
        &quot;nosso&quot;), incluindo o sistema ZWeb e quaisquer funcionalidades relacionadas, você concorda
        em cumprir e estar vinculado a estes Termos de Uso. Se não concordar com alguma parte
        destes termos, não utilize nossos serviços.
      </p>

      <h2>2. Descrição dos Serviços</h2>
      <p>
        A DoisB Sistemas é revenda autorizada do sistema de gestão ZWeb, desenvolvido pela
        Zucchetti do Brasil. Oferecemos licenciamento, implantação, treinamento e suporte técnico
        do software de gestão empresarial ZWeb para o varejo brasileiro.
      </p>

      <h2>3. Cadastro e Conta</h2>
      <p>
        Para utilizar os serviços, você deverá fornecer informações verdadeiras, completas e
        atualizadas durante o processo de cadastro. Você é responsável por manter a
        confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em
        sua conta.
      </p>

      <h2>4. Pagamentos e Assinatura</h2>
      <p>
        Os planos são cobrados mensalmente via cartão de crédito, processados com segurança pela
        plataforma Stripe. O cancelamento pode ser solicitado a qualquer momento, com efeito ao
        final do período vigente. Não realizamos reembolsos por períodos parciais.
      </p>

      <h2>5. Uso Permitido</h2>
      <p>Você concorda em utilizar os serviços apenas para fins legais e de acordo com estes Termos. É vedado:</p>
      <ul>
        <li>Reproduzir, duplicar ou revender qualquer parte dos serviços sem autorização expressa</li>
        <li>Utilizar os serviços para fins fraudulentos ou ilegais</li>
        <li>Tentar acessar áreas restritas do sistema sem autorização</li>
        <li>Transmitir vírus ou qualquer código malicioso</li>
      </ul>

      <h2>6. Propriedade Intelectual</h2>
      <p>
        O sistema ZWeb é propriedade da Zucchetti do Brasil. A marca DoisB Sistemas, materiais
        de marketing, tutoriais e documentação própria são propriedade da DoisB Sistemas. Nenhum
        conteúdo pode ser reproduzido sem autorização prévia por escrito.
      </p>

      <h2>7. Limitação de Responsabilidade</h2>
      <p>
        A DoisB Sistemas não se responsabiliza por interrupções temporárias do serviço, perda de
        dados decorrente de uso inadequado, ou danos indiretos resultantes da utilização dos
        serviços. Nossa responsabilidade máxima está limitada ao valor pago pelo cliente nos
        últimos 3 meses.
      </p>

      <h2>8. Suporte Técnico</h2>
      <p>
        O suporte técnico é prestado em horário comercial (segunda a sexta, 8h às 18h), por meio
        dos canais oficiais: portal de chamados, WhatsApp e e-mail. O tempo de resposta varia
        conforme o plano contratado.
      </p>

      <h2>9. Alterações nos Termos</h2>
      <p>
        Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos os
        usuários sobre mudanças significativas por e-mail. O uso continuado dos serviços após a
        notificação constitui aceitação dos novos termos.
      </p>

      <h2>10. Foro e Lei Aplicável</h2>
      <p>
        Estes Termos são regidos pela legislação brasileira. Qualquer disputa será submetida ao
        foro da comarca de domicílio do cliente, com preferência para mediação e resolução
        amigável.
      </p>

      <h2>11. Contato</h2>
      <p>
        Dúvidas sobre estes Termos podem ser enviadas para{' '}
        <a href="mailto:contato@doisbsistemas.com.br">contato@doisbsistemas.com.br</a>.
      </p>
    </LegalLayout>
  )
}
