import { runAgent, AgentResult } from "./base";
import { Transaction, TransactionEvent } from "@prisma/client";

type TransactionWithEvents = Transaction & { events: TransactionEvent[] };

export async function detectFailure(transaction: TransactionWithEvents): Promise<AgentResult> {
  const systemPrompt = `Você é o DetectorAgent de um gateway de pagamento da GLC Tecnologia.
Sua função é analisar transações e detectar falhas, anomalias e padrões de erro.

Regras de detecção:
- Timeout após 30s = falha de integração bancária
- 3+ tentativas = possível bloqueio do emissor
- Valor > R$50.000 sem autorização prévia = suspeito
- Falha em horário atípico (00h-05h) = risco elevado
- Múltiplas falhas do mesmo pagador em <1h = possível fraude

Responda SEMPRE em JSON válido:
{
  "decision": "FAILURE_DETECTED|ANOMALY|TIMEOUT|BANK_ERROR|OK",
  "confidence": 0.95,
  "humanRequired": false,
  "reasoning": "Explicação clara",
  "actions": ["RETRY", "NOTIFY_SUPPORT", "BLOCK_PAYER", "ESCALATE"],
  "data": { "failureType": "...", "suggestedRetryDelay": 30 }
}`;

  const userMessage = `Analise esta transação:
ID: ${transaction.id}
Método: ${transaction.method}
Valor: R$ ${transaction.amount.toFixed(2)}
Status atual: ${transaction.status}
Tentativas: ${transaction.retryCount}/${transaction.maxRetries}
Criada em: ${transaction.createdAt.toISOString()}
Falhou em: ${transaction.failedAt?.toISOString() ?? "N/A"}

Eventos recentes:
${transaction.events.slice(-5).map((e) => `- ${e.type}: ${e.message} (${e.createdAt.toISOString()})`).join("\n")}`;

  return runAgent({
    agentType: "DETECTOR",
    systemPrompt,
    userMessage,
    transactionId: transaction.id,
    tenantId: transaction.tenantId,
  });
}
