import { MarketingChat } from "./_components/marketing-chat"

export const metadata = { title: "Marketing OS | DoisB Admin" }

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Marketing OS</h1>
        <p className="text-sm text-slate-500 mt-1">
          Seus agentes de marketing e vendas. Estratégia, copy e execução sobre a memória compartilhada da DoisB.
        </p>
      </div>
      <MarketingChat />
    </div>
  )
}
