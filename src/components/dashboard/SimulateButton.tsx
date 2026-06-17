"use client";

import { useState } from "react";

export function SimulateButton({ onSimulated }: { onSimulated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  async function simulate() {
    setLoading(true);
    setLast(null);
    try {
      const res = await fetch("/api/v1/simulate", {
        method: "POST",
        headers: { "x-api-key": process.env.NEXT_PUBLIC_INTERNAL_API_KEY ?? "" },
      });
      const data = await res.json();
      setLast(data.orchestratorResult?.finalDecision ?? "OK");
      onSimulated();
    } catch {
      setLast("ERRO");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {last && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${last.includes("BLOCK") || last === "ERRO" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
          {last}
        </span>
      )}
      <button
        onClick={simulate}
        disabled={loading}
        className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-1.5"
      >
        {loading ? (
          <>
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processando...
          </>
        ) : (
          "⚡ Simular Transação"
        )}
      </button>
    </div>
  );
}
