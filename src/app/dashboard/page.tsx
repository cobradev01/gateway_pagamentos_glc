"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { AgentActivityFeed } from "@/components/dashboard/AgentActivityFeed";
import { RiskChart } from "@/components/dashboard/RiskChart";
import { SimulateButton } from "@/components/dashboard/SimulateButton";

interface DashboardData {
  summary: {
    totalTransactions: number;
    capturedCount: number;
    failedCount: number;
    approvalRate: string;
    totalVolumeBRL: string;
    avgAgentLatencyMs: string;
  };
  recentAgentLogs: AgentLog[];
  recentTransactions: Transaction[];
  riskDistribution: { riskLevel: string; _count: number }[];
}

interface AgentLog {
  id: string;
  agentType: string;
  decision: string | null;
  confidence: number | null;
  humanRequired: boolean;
  latencyMs: number | null;
  createdAt: string;
}

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

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/stats", {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_INTERNAL_API_KEY ?? "" },
      });
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-app)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(59,130,246,0.3)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "'Roboto', sans-serif" }}>Conectando aos agentes de IA...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-app)", color: "var(--text-primary)", fontFamily: "'Roboto', sans-serif" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "rgba(15,17,23,0.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href="/"
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", textDecoration: "none", padding: "5px 10px", border: "1px solid var(--border)", borderRadius: 7 }}
            >
              ← Início
            </Link>
            <div style={{ width: 1, height: 20, background: "var(--border)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>G</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>GLC Tecnologia</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1, marginTop: 2 }}>Gateway de Pagamentos com IA</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#22c55e" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Agentes ativos
            </div>
            <SimulateButton onSimulated={fetchData} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 28 }}>
        {data ? (
          <>
            <StatsCards summary={data.summary} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
              <TransactionTable transactions={data.recentTransactions} />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <RiskChart distribution={data.riskDistribution} />
                <AgentActivityFeed logs={data.recentAgentLogs} />
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)", fontSize: 14 }}>
            Nenhum dado disponível. Configure o banco de dados e rode uma simulação.
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          main > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
