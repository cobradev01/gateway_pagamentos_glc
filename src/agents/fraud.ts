import { runAgent, AgentResult } from "./base";
import { Transaction } from "@prisma/client";

interface FraudContext {
  transaction: Transaction;
  recentTransactionsByPayer: number;
  totalAmountLast24h: number;
  knownBadPatterns?: string[];
}

export async function analyzeFraud(ctx: FraudContext): Promise<AgentResult> {
  const systemPrompt = `Você é o FraudAgent da GLC Tecnologia.
Analisa transações em tempo real para detectar fraudes e calcular score de risco.

Fatores de risco (peso):
- Velocidade: muitas transações em curto período (+30pts)
- Valor atípico para o pagador (+20pts)
- Horário suspeito 00h-05h (+15pts)
- Documento do pagador em lista negra (+50pts)
- País do cartão divergente (+25pts)
- Múltiplos cartões mesmo pagador/hora (+35pts)

Score 0-100:
- 0-30: LOW → aprovar automaticamente
- 31-60: MEDIUM → aprovar com monitoramento
- 61-80: HIGH → bloquear e notificar compliance
- 81-100: CRITICAL → bloquear, notificar e abrir investigação

Responda em JSON:
{
  "decision": "APPROVE|REVIEW|BLOCK|INVESTIGATE",
  "confidence": 0.87,
  "humanRequired": false,
  "reasoning": "...",
  "actions": ["APPROVE_AUTO", "FLAG_REVIEW", "BLOCK_TRANSACTION", "ALERT_COMPLIANCE"],
  "data": { "riskScore": 45, "riskLevel": "MEDIUM", "riskFactors": ["velocidade", "valor_atipico"] }
}`;

  const userMessage = `Avalie o risco desta transação:
Pagador: ${ctx.transaction.payerName ?? "Desconhecido"} (${ctx.transaction.payerDocument ?? "sem doc"})
Email: ${ctx.transaction.payerEmail ?? "N/A"}
Método: ${ctx.transaction.method}
Valor: R$ ${ctx.transaction.amount.toFixed(2)}
Horário: ${ctx.transaction.createdAt.toISOString()}

Contexto do pagador nas últimas 24h:
- Transações realizadas: ${ctx.recentTransactionsByPayer}
- Volume total: R$ ${ctx.totalAmountLast24h.toFixed(2)}
${ctx.knownBadPatterns?.length ? `- Padrões negativos conhecidos: ${ctx.knownBadPatterns.join(", ")}` : ""}`;

  return runAgent({
    agentType: "FRAUD",
    systemPrompt,
    userMessage,
    transactionId: ctx.transaction.id,
    tenantId: ctx.transaction.tenantId,
  });
}
