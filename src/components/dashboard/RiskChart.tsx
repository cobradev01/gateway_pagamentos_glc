"use client";

const RISK_CONFIG: Record<string, { label: string; color: string }> = {
  LOW: { label: "Baixo", color: "#22c55e" },
  MEDIUM: { label: "Médio", color: "#eab308" },
  HIGH: { label: "Alto", color: "#f97316" },
  CRITICAL: { label: "Crítico", color: "#ef4444" },
};

interface RiskDist {
  riskLevel: string;
  _count: number;
}

export function RiskChart({ distribution }: { distribution: RiskDist[] }) {
  const total = distribution.reduce((s, d) => s + d._count, 0);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <h2 className="font-semibold text-sm mb-4">Distribuição de Risco (24h)</h2>
      {total === 0 ? (
        <p className="text-xs text-gray-600 text-center py-4">Sem dados de risco</p>
      ) : (
        <div className="space-y-3">
          {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((level) => {
            const found = distribution.find((d) => d.riskLevel === level);
            const count = found?._count ?? 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            const cfg = RISK_CONFIG[level];
            return (
              <div key={level}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: cfg.color }}>{cfg.label}</span>
                  <span className="text-gray-400">{count} ({pct.toFixed(0)}%)</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
