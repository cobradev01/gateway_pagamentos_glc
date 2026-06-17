interface Summary {
  totalTransactions: number;
  capturedCount: number;
  failedCount: number;
  approvalRate: string;
  totalVolumeBRL: string;
  avgAgentLatencyMs: string;
}

export function StatsCards({ summary }: { summary: Summary }) {
  const approvalPct = parseFloat(summary.approvalRate);
  const latencyMs = parseInt(summary.avgAgentLatencyMs);

  const cards = [
    {
      kpi: "kpi-blue",
      label: "Transações (24h)",
      value: summary.totalTransactions.toLocaleString("pt-BR"),
      sub: `${summary.capturedCount} aprovadas · ${summary.failedCount} falhas`,
    },
    {
      kpi: approvalPct >= 90 ? "kpi-green" : "kpi-amber",
      label: "Taxa de Aprovação",
      value: `${summary.approvalRate}%`,
      sub: "Últimas 24 horas",
    },
    {
      kpi: "kpi-purple",
      label: "Volume Processado",
      value: `R$ ${parseFloat(summary.totalVolumeBRL).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      sub: "Transações capturadas",
    },
    {
      kpi: latencyMs < 2000 ? "kpi-teal" : "kpi-amber",
      label: "Latência dos Agentes",
      value: `${summary.avgAgentLatencyMs}ms`,
      sub: "Tempo médio de decisão IA",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {cards.map((card) => (
        <div
          key={card.label}
          className={card.kpi}
          style={{ borderRadius: 12, padding: "20px 22px" }}
        >
          <p style={{ fontSize: 11, fontWeight: 500, opacity: 0.8, marginBottom: 8, letterSpacing: "0.03em", textTransform: "uppercase" }}>{card.label}</p>
          <p style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, marginBottom: 6, fontFamily: "'Roboto Mono', monospace" }}>{card.value}</p>
          <p style={{ fontSize: 11, opacity: 0.7 }}>{card.sub}</p>
        </div>
      ))}
      <style>{`@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </div>
  );
}
