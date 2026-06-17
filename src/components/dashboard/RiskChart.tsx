"use client";

const RISK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  LOW:      { label: "Baixo",   color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  MEDIUM:   { label: "Médio",   color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  HIGH:     { label: "Alto",    color: "#f97316", bg: "rgba(249,115,22,0.15)" },
  CRITICAL: { label: "Crítico", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

interface RiskDist {
  riskLevel: string;
  _count: number;
}

export function RiskChart({ distribution }: { distribution: RiskDist[] }) {
  const total = distribution.reduce((s, d) => s + d._count, 0);

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
      <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Distribuição de Risco (24h)</h2>
      {total === 0 ? (
        <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>Sem dados de risco</p>
      ) : (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((level) => {
            const found = distribution.find((d) => d.riskLevel === level);
            const count = found?._count ?? 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            const cfg = RISK_CONFIG[level];
            return (
              <div key={level}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: cfg.color }}>{cfg.label}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace" }}>
                    {count} ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: "var(--bg-elevated)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      background: cfg.color,
                      width: `${pct}%`,
                      transition: "width 0.5s ease",
                    }}
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
