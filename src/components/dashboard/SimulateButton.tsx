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

  const isError = last?.includes("BLOCK") || last === "ERRO";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {last && (
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          padding: "3px 10px",
          borderRadius: 6,
          background: isError ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
          color: isError ? "#ef4444" : "#10b981",
          fontFamily: "'Roboto Mono', monospace",
        }}>
          {last}
        </span>
      )}
      <button
        onClick={simulate}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 18px",
          background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg,#2563eb,#3b82f6)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Roboto', sans-serif",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 2px 8px rgba(59,130,246,0.4)",
          transition: "all 0.15s",
        }}
      >
        {loading ? (
          <>
            <span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            Processando...
          </>
        ) : (
          <>⚡ Simular Transação</>
        )}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
