import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { AgentType } from "@prisma/client";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface AgentResult {
  decision: string;
  confidence: number;
  humanRequired: boolean;
  reasoning: string;
  actions: string[];
  data?: Record<string, unknown>;
}

export async function runAgent(params: {
  agentType: AgentType;
  systemPrompt: string;
  userMessage: string;
  transactionId?: string;
  tenantId?: string;
}): Promise<AgentResult> {
  const start = Date.now();

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: params.systemPrompt,
    messages: [{ role: "user", content: params.userMessage }],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "";
  const latencyMs = Date.now() - start;

  let result: AgentResult;
  try {
    const jsonMatch = raw.match(/```json\n?([\s\S]*?)\n?```/) || raw.match(/(\{[\s\S]*\})/);
    result = JSON.parse(jsonMatch ? jsonMatch[1] : raw);
  } catch {
    result = {
      decision: "INCONCLUSIVE",
      confidence: 0,
      humanRequired: true,
      reasoning: raw,
      actions: [],
    };
  }

  await prisma.agentLog.create({
    data: {
      agentType: params.agentType,
      transactionId: params.transactionId,
      tenantId: params.tenantId,
      input: { message: params.userMessage },
      output: result as Record<string, unknown>,
      decision: result.decision,
      confidence: result.confidence,
      humanRequired: result.humanRequired,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      latencyMs,
    },
  });

  return result;
}
