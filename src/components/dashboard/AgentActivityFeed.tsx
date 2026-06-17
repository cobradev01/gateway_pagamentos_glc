interface AgentLog {
  id: string;
  agentType: string;
  decision: string | null;
  confidence: number | null;
  humanRequired: boolean;
  latencyMs: number | null;
  createdAt: string;
}

const AGENT_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  DETECTOR:     { icon: "🔍", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  FRAUD:        { icon: "🛡️", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  SUPPORT:      { icon: "💬", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  ORCHESTRATOR: { icon: "🤖", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

export function AgentActivityFeed({ logs }: { logs: AgentLog[] }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Atividade dos Agentes</h2>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Últimas decisões de IA</p>
      </div>
      <div style={{ maxHeight: 260, overflowY: "auto" }}>
        {logs.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, padding: "28px 0" }}>Sem atividade recente</p>
        ) : (
          logs.map((log, i) => {
            const cfg = AGENT_CONFIG[log.agentType] ?? { icon: "⚙️", color: "#6b7280", bg: "rgba(107,114,128,0.1)" };
            return (
              <div
                key={log.id}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 20px",
                  borderBottom: i < logs.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: cfg.bg, color: cfg.color, flexShrink: 0, whiteSpace: "nowrap" }}>
                  {cfg.icon} {log.agentType}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>
                    {log.decision ?? "—"}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace" }}>
                    {log.confidence != null ? `${(log.confidence * 100).toFixed(0)}% conf · ` : ""}
                    {log.latencyMs}ms
                    {log.humanRequired && " · ⚠️ humano"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
