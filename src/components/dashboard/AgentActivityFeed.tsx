interface AgentLog {
  id: string;
  agentType: string;
  decision: string | null;
  confidence: number | null;
  humanRequired: boolean;
  latencyMs: number | null;
  createdAt: string;
}

const AGENT_COLORS: Record<string, string> = {
  DETECTOR: "bg-blue-500/20 text-blue-300",
  FRAUD: "bg-red-500/20 text-red-300",
  SUPPORT: "bg-purple-500/20 text-purple-300",
  ORCHESTRATOR: "bg-yellow-500/20 text-yellow-300",
};

const AGENT_ICONS: Record<string, string> = {
  DETECTOR: "🔍",
  FRAUD: "🛡️",
  SUPPORT: "💬",
  ORCHESTRATOR: "🤖",
};

export function AgentActivityFeed({ logs }: { logs: AgentLog[] }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="px-5 py-4 border-b border-gray-800">
        <h2 className="font-semibold text-sm">Atividade dos Agentes</h2>
        <p className="text-xs text-gray-500 mt-0.5">Últimas decisões de IA</p>
      </div>
      <div className="divide-y divide-gray-800/50 max-h-64 overflow-y-auto">
        {logs.length === 0 && (
          <p className="text-center text-gray-600 text-xs py-6">Sem atividade recente</p>
        )}
        {logs.map((log) => (
          <div key={log.id} className="px-5 py-3 flex items-start gap-3">
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${AGENT_COLORS[log.agentType] ?? "bg-gray-500/20 text-gray-300"}`}>
              {AGENT_ICONS[log.agentType]} {log.agentType}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">{log.decision ?? "—"}</p>
              <p className="text-xs text-gray-500">
                {log.confidence != null ? `${(log.confidence * 100).toFixed(0)}% confiança · ` : ""}
                {log.latencyMs}ms
                {log.humanRequired && " · ⚠️ humano"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
