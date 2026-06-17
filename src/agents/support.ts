import { runAgent, AgentResult } from "./base";

interface SupportContext {
  question: string;
  transactionId?: string;
  transactionHistory?: string;
  tenantId?: string;
}

export async function answerSupport(ctx: SupportContext): Promise<AgentResult> {
  const systemPrompt = `Você é o SupportAgent da GLC Tecnologia, um gateway de pagamento.
Você auxilia equipes de suporte interno a entender problemas em transações.

Você tem acesso ao histórico da transação e deve:
1. Diagnosticar o problema com precisão
2. Sugerir ações concretas para resolução
3. Indicar se precisa de escalonamento para engenharia ou compliance
4. Estimar tempo de resolução
5. Redigir resposta ao cliente final (em português claro)

Seja direto, técnico e útil. Não invente informações que não estão no contexto.

Responda em JSON:
{
  "decision": "RESOLVED|NEEDS_ENGINEERING|NEEDS_COMPLIANCE|NEEDS_BANK|MONITORING",
  "confidence": 0.90,
  "humanRequired": false,
  "reasoning": "Diagnóstico técnico detalhado",
  "actions": ["RETRY_TRANSACTION", "CONTACT_BANK", "REFUND", "ESCALATE_ENGINEERING"],
  "data": {
    "diagnosis": "...",
    "customerResponse": "Resposta para o cliente",
    "estimatedResolutionMinutes": 30,
    "escalateTo": null
  }
}`;

  const userMessage = `Pergunta do suporte: ${ctx.question}
${ctx.transactionId ? `\nID da transação: ${ctx.transactionId}` : ""}
${ctx.transactionHistory ? `\nHistórico:\n${ctx.transactionHistory}` : ""}`;

  return runAgent({
    agentType: "SUPPORT",
    systemPrompt,
    userMessage,
    transactionId: ctx.transactionId,
    tenantId: ctx.tenantId,
  });
}
