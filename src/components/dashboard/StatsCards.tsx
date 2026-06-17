interface Summary {
  totalTransactions: number;
  capturedCount: number;
  failedCount: number;
  approvalRate: string;
  totalVolumeBRL: string;
  avgAgentLatencyMs: string;
}

export function StatsCards({ summary }: { summary: Summary }) {
  const cards = [
    {
      label: "Transações (24h)",
      value: summary.totalTransactions.toLocaleString("pt-BR"),
      sub: `${summary.capturedCount} aprovadas · ${summary.failedCount} falhas`,
      color: "blue",
    },
    {
      label: "Taxa de Aprovação",
      value: `${summary.approvalRate}%`,
      sub: "Últimas 24 horas",
      color: parseFloat(summary.approvalRate) >= 90 ? "green" : "yellow",
    },
    {
      label: "Volume Processado",
      value: `R$ ${parseFloat(summary.totalVolumeBRL).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      sub: "Transações capturadas",
      color: "purple",
    },
    {
      label: "Latência dos Agentes",
      value: `${summary.avgAgentLatencyMs}ms`,
      sub: "Tempo médio de decisão de IA",
      color: parseInt(summary.avgAgentLatencyMs) < 2000 ? "green" : "yellow",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border p-5 ${colorMap[card.color]}`}>
          <p className="text-xs font-medium opacity-70 mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="text-xs mt-1 opacity-60">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
