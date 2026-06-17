"use client";

import { useState } from "react";

export function SimulateButton({ onSimulated }: { onSimulated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  async function simulate() {
    setLoading(true);
    setLast(null);
    setShowInfo(false);
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

  const isDecisionError = last === "ERRO";
  const isBlock = last?.includes("BLOCK");
  const isError = isDecisionError || isBlock;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
      {last && (
        <div style={{ position: "relative" }}>
          <button
            onClick={() => isDecisionError && setShowInfo((v) => !v)}
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 6,
              background: isError ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
              color: isError ? "#ef4444" : "#10b981",
              fontFamily: "'Roboto Mono', monospace",
              border: isDecisionError ? "1px solid rgba(239,68,68,0.25)" : "none",
              cursor: isDecisionError ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              gap: 5,
              letterSpacing: "0.04em",
            }}
          >
            {last}
            {isDecisionError && (
              <span style={{ fontSize: 10, opacity: 0.7 }}>ⓘ</span>
            )}
          </button>

          {/* Tooltip informativo */}
          {showInfo && isDecisionError && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: 320,
              background: "#1e2130",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 10,
              padding: "16px 18px",
              zIndex: 100,
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}>
              {/* seta */}
              <div style={{ position: "absolute", top: -6, right: 20, width: 10, height: 10, background: "#1e2130", border: "1px solid rgba(239,68,68,0.25)", borderBottom: "none", borderRight: "none", transform: "rotate(45deg)" }} />

              <p style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                ⚠️ Agentes de IA desativados — ambiente de demo
              </p>
              <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.65, marginBottom: 12 }}>
                Os 4 agentes (Detector, Antifraude, Suporte, Orquestrador) requerem uma chave válida da API Anthropic para processar transações com IA em tempo real.
              </p>
              <div style={{ background: "#0f1117", borderRadius: 7, padding: "10px 12px", marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Para ativar em produção:</p>
                <ol style={{ paddingLeft: 16, margin: 0 }}>
                  {[
                    "Obter API key em console.anthropic.com",
                    "Adicionar ANTHROPIC_API_KEY nas variáveis de ambiente da Vercel",
                    "Fazer redeploy do projeto",
                  ].map((step, i) => (
                    <li key={i} style={{ fontSize: 12, color: "#d1d5db", marginBottom: 4, lineHeight: 1.5 }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <p style={{ fontSize: 11, color: "#4b5563" }}>
                ✅ Banco, API REST, dashboard e idempotência funcionam normalmente neste ambiente.
              </p>
              <button
                onClick={() => setShowInfo(false)}
                style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          )}
        </div>
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
