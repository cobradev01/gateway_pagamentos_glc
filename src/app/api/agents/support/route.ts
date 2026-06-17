import { NextRequest } from "next/server";
import { answerSupport } from "@/agents/support";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.INTERNAL_API_KEY) return errorResponse("Unauthorized", 401);

  const { question, transactionId, tenantId } = await req.json();
  if (!question) return errorResponse("question is required");

  let transactionHistory: string | undefined;
  if (transactionId) {
    const tx = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { events: { orderBy: { createdAt: "asc" } } },
    });
    if (tx) {
      transactionHistory = `Status: ${tx.status} | Valor: R$${tx.amount} | Método: ${tx.method}
Tentativas: ${tx.retryCount} | Score de risco: ${tx.riskScore ?? "N/A"}
Eventos: ${tx.events.map((e) => `${e.type}: ${e.message}`).join(" → ")}`;
    }
  }

  const result = await answerSupport({ question, transactionId, transactionHistory, tenantId });
  return Response.json(result);
}
