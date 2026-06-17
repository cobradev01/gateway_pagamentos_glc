import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/auth";
import { orchestrate } from "@/agents/orchestrator";

export const dynamic = "force-dynamic";

// Internal endpoint to simulate transactions for demo purposes
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.INTERNAL_API_KEY) return errorResponse("Unauthorized", 401);

  const METHODS = ["PIX", "CREDIT_CARD", "DEBIT_CARD", "BOLETO"] as const;
  const NAMES = ["João Silva", "Maria Souza", "Pedro Alves", "Ana Costa", "Carlos Lima"];
  const DOCS = ["123.456.789-00", "987.654.321-00", "111.222.333-44", "555.666.777-88"];

  const method = METHODS[Math.floor(Math.random() * METHODS.length)];
  const amount = parseFloat((Math.random() * 9900 + 100).toFixed(2));
  const payerName = NAMES[Math.floor(Math.random() * NAMES.length)];
  const payerDocument = DOCS[Math.floor(Math.random() * DOCS.length)];

  // Get or create demo tenant
  let tenant = await prisma.tenant.findFirst({ where: { name: "Demo GLC" } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: { name: "Demo GLC", apiKey: process.env.DEMO_API_KEY ?? "demo-key-glc-2024" },
    });
  }

  const transaction = await prisma.transaction.create({
    data: {
      tenantId: tenant.id,
      method,
      amount,
      payerName,
      payerDocument,
      payerEmail: `${payerName.toLowerCase().replace(" ", ".")}@email.com`,
      status: "PROCESSING",
      externalId: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    },
  });

  await prisma.transactionEvent.create({
    data: {
      transactionId: transaction.id,
      type: "SIMULATED",
      newStatus: "PROCESSING",
      message: "Transação simulada para demonstração",
    },
  });

  const result = await orchestrate(transaction.id);

  return Response.json({ transactionId: transaction.id, orchestratorResult: result });
}
