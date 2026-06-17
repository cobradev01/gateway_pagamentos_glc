"use client";

import { useEffect, useState, useCallback } from "react";
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Conectando aos agentes de IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">G</div>
            <div>
              <h1 className="font-semibold text-white">GLC Tecnologia</h1>
              <p className="text-xs text-gray-400">Gateway de Pagamentos com IA</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Agentes ativos
            </div>
            <SimulateButton onSimulated={fetchData} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {data && (
          <>
            <StatsCards summary={data.summary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TransactionTable transactions={data.recentTransactions} />
              </div>
              <div className="space-y-6">
                <RiskChart distribution={data.riskDistribution} />
                <AgentActivityFeed logs={data.recentAgentLogs} />
              </div>
            </div>
          </>
        )}

        {!data && (
          <div className="text-center py-20 text-gray-500">
            Nenhum dado disponível. Configure o banco de dados e rode uma simulação.
          </div>
        )}
      </main>
    </div>
  );
}
