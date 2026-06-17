import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    totalTransactions,
    capturedCount,
    failedCount,
    totalVolume,
    agentLogs,
    recentTransactions,
    riskDistribution,
  ] = await Promise.all([
    prisma.transaction.count({ where: { createdAt: { gte: since24h } } }),
    prisma.transaction.count({ where: { status: "CAPTURED", createdAt: { gte: since24h } } }),
    prisma.transaction.count({ where: { status: "FAILED", createdAt: { gte: since24h } } }),
    prisma.transaction.aggregate({
      where: { status: "CAPTURED", createdAt: { gte: since24h } },
      _sum: { amount: true },
    }),
    prisma.agentLog.findMany({
      where: { createdAt: { gte: since24h } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { agentLogs: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
    prisma.transaction.groupBy({
      by: ["riskLevel"],
      where: { createdAt: { gte: since24h }, riskLevel: { not: null } },
      _count: true,
    }),
  ]);

  const approvalRate = totalTransactions > 0 ? (capturedCount / totalTransactions) * 100 : 0;
  const avgLatency =
    agentLogs.reduce((sum, l) => sum + (l.latencyMs ?? 0), 0) / (agentLogs.length || 1);

  return Response.json({
    summary: {
      totalTransactions,
      capturedCount,
      failedCount,
      approvalRate: approvalRate.toFixed(1),
      totalVolumeBRL: (totalVolume._sum.amount ?? 0).toFixed(2),
      avgAgentLatencyMs: avgLatency.toFixed(0),
    },
    recentAgentLogs: agentLogs,
    recentTransactions,
    riskDistribution,
  });
}
