import { runAgent, AgentResult } from "./base";
import { detectFailure } from "./detector";
import { analyzeFraud } from "./fraud";
import { prisma } from "@/lib/prisma";
import { Transaction, TransactionEvent } from "@prisma/client";

type TransactionWithEvents = Transaction & { events: TransactionEvent[] };

export interface OrchestratorResult {
  finalDecision: string;
  agentsInvoked: string[];
  fraudResult?: AgentResult;
  detectorResult?: AgentResult;
  orchestratorResult?: AgentResult;
  humanRequired: boolean;
  actions: string[];
}

export async function orchestrate(transactionId: string): Promise<OrchestratorResult> {
  const transaction = await prisma.transaction.findUniqueOrThrow({
    where: { id: transactionId },
    include: { events: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  const agentsInvoked: string[] = [];
  const allActions: string[] = [];

  // Always run fraud check first
  const recentCount = await prisma.transaction.count({
    where: {
      payerDocument: transaction.payerDocument,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  const recentVolume = await prisma.transaction.aggregate({
    where: {
      payerDocument: transaction.payerDocument,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    _sum: { amount: true },
  });

  const fraudResult = await analyzeFraud({
    transaction,
    recentTransactionsByPayer: recentCount,
    totalAmountLast24h: recentVolume._sum.amount ?? 0,
  });
  agentsInvoked.push("FRAUD");
  allActions.push(...fraudResult.actions);

  // If fraud score HIGH/CRITICAL, don't process further
  if (fraudResult.data?.riskScore && (fraudResult.data.riskScore as number) > 60) {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        riskScore: fraudResult.data.riskScore as number,
        riskLevel: (fraudResult.data.riskLevel as string) as never,
        status: "FAILED",
        failedAt: new Date(),
      },
    });

    return {
      finalDecision: "BLOCKED_FRAUD",
      agentsInvoked,
      fraudResult,
      humanRequired: fraudResult.humanRequired,
      actions: allActions,
    };
  }

  // Run detector if transaction failed or suspicious
  let detectorResult: AgentResult | undefined;
  if (transaction.status === "FAILED" || transaction.retryCount > 0) {
    detectorResult = await detectFailure(transaction as TransactionWithEvents);
    agentsInvoked.push("DETECTOR");
    allActions.push(...detectorResult.actions);
  }

  // Orchestrator makes final decision
  const systemPrompt = `Você é o OrchestratorAgent da GLC Tecnologia.
Você recebe análises de outros agentes e decide a ação final sobre uma transação.

Decisões possíveis:
- APPROVE: aprovar e processar
- RETRY: tentar novamente (com delay)
- BLOCK: bloquear definitivamente
- ESCALATE_HUMAN: escalonar para operador humano
- REFUND: reembolso automático
- MONITOR: aprovar mas monitorar de perto

Critérios para escalonamento humano:
- Confiança dos agentes < 70%
- Valor > R$10.000 com qualquer risco
- Divergência entre agentes
- Chargeback ou fraude confirmada

Responda em JSON:
{
  "decision": "APPROVE|RETRY|BLOCK|ESCALATE_HUMAN|REFUND|MONITOR",
  "confidence": 0.92,
  "humanRequired": false,
  "reasoning": "...",
  "actions": [],
  "data": { "retryDelaySeconds": 0, "escalateTo": null }
}`;

  const userMessage = `Transação: ${transactionId}
Valor: R$ ${transaction.amount.toFixed(2)} via ${transaction.method}
Status: ${transaction.status}

Resultado do FraudAgent:
- Decisão: ${fraudResult.decision}
- Score de risco: ${fraudResult.data?.riskScore ?? "N/A"}
- Nível: ${fraudResult.data?.riskLevel ?? "N/A"}
- Confiança: ${(fraudResult.confidence * 100).toFixed(0)}%

${detectorResult ? `Resultado do DetectorAgent:
- Decisão: ${detectorResult.decision}
- Confiança: ${(detectorResult.confidence * 100).toFixed(0)}%
- Ações sugeridas: ${detectorResult.actions.join(", ")}` : "DetectorAgent: não invocado"}`;

  const orchestratorResult = await runAgent({
    agentType: "ORCHESTRATOR",
    systemPrompt,
    userMessage,
    transactionId,
    tenantId: transaction.tenantId,
  });
  agentsInvoked.push("ORCHESTRATOR");
  allActions.push(...orchestratorResult.actions);

  // Update transaction with fraud score
  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      riskScore: (fraudResult.data?.riskScore as number) ?? null,
      riskLevel: (fraudResult.data?.riskLevel as string) as never ?? null,
    },
  });

  return {
    finalDecision: orchestratorResult.decision,
    agentsInvoked,
    fraudResult,
    detectorResult,
    orchestratorResult,
    humanRequired: orchestratorResult.humanRequired,
    actions: [...new Set(allActions)],
  };
}
