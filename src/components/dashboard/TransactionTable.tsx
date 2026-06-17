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

const STATUS_STYLES: Record<string, string> = {
  CAPTURED: "bg-green-500/15 text-green-400",
  FAILED: "bg-red-500/15 text-red-400",
  PROCESSING: "bg-blue-500/15 text-blue-400",
  PENDING: "bg-yellow-500/15 text-yellow-400",
  CANCELLED: "bg-gray-500/15 text-gray-400",
  CHARGEBACK: "bg-orange-500/15 text-orange-400",
};

const RISK_STYLES: Record<string, string> = {
  LOW: "text-green-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-orange-400",
  CRITICAL: "text-red-400",
};

const METHOD_ICONS: Record<string, string> = {
  PIX: "⚡",
  CREDIT_CARD: "💳",
  DEBIT_CARD: "🏦",
  BOLETO: "📄",
};

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="px-5 py-4 border-b border-gray-800">
        <h2 className="font-semibold text-sm">Transações Recentes</h2>
        <p className="text-xs text-gray-500 mt-0.5">Monitoradas pelos agentes de IA em tempo real</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-800">
              <th className="text-left px-5 py-3 font-medium">ID</th>
              <th className="text-left px-5 py-3 font-medium">Método</th>
              <th className="text-left px-5 py-3 font-medium">Pagador</th>
              <th className="text-right px-5 py-3 font-medium">Valor</th>
              <th className="text-left px-5 py-3 font-medium">Risco</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-600 text-xs">
                  Nenhuma transação. Clique em "Simular" para começar.
                </td>
              </tr>
            )}
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-400">{tx.id.slice(0, 8)}…</td>
                <td className="px-5 py-3">
                  <span className="text-base">{METHOD_ICONS[tx.method] ?? "💰"}</span>{" "}
                  <span className="text-xs text-gray-400">{tx.method}</span>
                </td>
                <td className="px-5 py-3 text-gray-300">{tx.payerName ?? "—"}</td>
                <td className="px-5 py-3 text-right font-medium">
                  R$ {tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-3">
                  {tx.riskLevel ? (
                    <span className={`text-xs font-medium ${RISK_STYLES[tx.riskLevel] ?? "text-gray-400"}`}>
                      {tx.riskScore?.toFixed(0)} · {tx.riskLevel}
                    </span>
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[tx.status] ?? "bg-gray-500/15 text-gray-400"}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
