interface Transaction {
  id: string;
  method: string;
  status: string;
  amount: number;
  payerName: string | null;
  riskScore: number | null;
  riskLevel: string | null;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  CAPTURED:   { bg: "rgba(16,185,129,0.12)", color: "#10b981", label: "CAPTURADO" },
  FAILED:     { bg: "rgba(239,68,68,0.12)",  color: "#ef4444", label: "FALHOU" },
  PROCESSING: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", label: "PROCESSANDO" },
  PENDING:    { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "PENDENTE" },
  CANCELLED:  { bg: "rgba(107,114,128,0.12)", color: "#6b7280", label: "CANCELADO" },
  CHARGEBACK: { bg: "rgba(249,115,22,0.12)", color: "#f97316", label: "CHARGEBACK" },
};

const RISK_COLOR: Record<string, string> = {
  LOW: "#10b981", MEDIUM: "#f59e0b", HIGH: "#f97316", CRITICAL: "#ef4444",
};

const METHOD_ICON: Record<string, string> = {
  PIX: "⚡", CREDIT_CARD: "💳", DEBIT_CARD: "🏦", BOLETO: "📄",
};

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Transações Recentes</h2>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Monitoradas pelos agentes de IA em tempo real</p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["ID", "Método", "Pagador", "Valor", "Risco", "Status"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    textAlign: i >= 3 && i <= 3 ? "right" : "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  Nenhuma transação. Clique em "Simular Transação" para começar.
                </td>
              </tr>
            )}
            {transactions.map((tx) => {
              const st = STATUS_CONFIG[tx.status] ?? { bg: "rgba(107,114,128,0.12)", color: "#6b7280", label: tx.status };
              return (
                <tr
                  key={tx.id}
                  style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "13px 16px", fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: "var(--text-muted)" }}>
                    {tx.id.slice(0, 8)}…
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 16 }}>{METHOD_ICON[tx.method] ?? "💰"}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{tx.method}</span>
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>{tx.payerName ?? "—"}</td>
                  <td style={{ padding: "13px 16px", textAlign: "right", fontFamily: "'Roboto Mono', monospace", fontWeight: 500 }}>
                    R$ {tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    {tx.riskLevel ? (
                      <span style={{ fontSize: 12, fontWeight: 600, color: RISK_COLOR[tx.riskLevel] ?? "#6b7280" }}>
                        {tx.riskScore?.toFixed(0)} · {tx.riskLevel}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
