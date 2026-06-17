import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateTenant, errorResponse } from "@/lib/auth";
import { orchestrate } from "@/agents/orchestrator";
import { PaymentMethod } from "@prisma/client";

export const dynamic = "force-dynamic";

// POST /api/v1/transactions — create and process a payment
export async function POST(req: NextRequest) {
  const tenant = await authenticateTenant(req);
  if (!tenant) return errorResponse("Unauthorized", 401);

  const body = await req.json();
  const { method, amount, externalId, payerName, payerDocument, payerEmail, description, pixKey, cardLast4, cardBrand } = body;

  if (!method || !amount) return errorResponse("method and amount are required");
  if (!Object.values(PaymentMethod).includes(method)) return errorResponse("Invalid payment method");
  if (amount <= 0) return errorResponse("Amount must be positive");

  // Idempotency check
  if (externalId) {
    const existing = await prisma.transaction.findUnique({
      where: { tenantId_externalId: { tenantId: tenant.id, externalId } },
    });
    if (existing) return Response.json(existing, { status: 200 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      tenantId: tenant.id,
      method,
      amount,
      externalId,
      payerName,
      payerDocument,
      payerEmail,
      description,
      pixKey,
      cardLast4,
      cardBrand,
      status: "PROCESSING",
    },
  });

  await prisma.transactionEvent.create({
    data: {
      transactionId: transaction.id,
      type: "CREATED",
      newStatus: "PROCESSING",
      message: `Transação criada via ${method}`,
    },
  });

  // Run AI orchestrator async — respond immediately, process in background
  void orchestrate(transaction.id)
    .then(async (result) => {
      const finalStatus = result.finalDecision === "APPROVE" || result.finalDecision === "MONITOR"
        ? "CAPTURED"
        : result.finalDecision === "RETRY"
        ? "PENDING"
        : "FAILED";

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: finalStatus,
          processedAt: finalStatus === "CAPTURED" ? new Date() : undefined,
          failedAt: finalStatus === "FAILED" ? new Date() : undefined,
        },
      });

      await prisma.transactionEvent.create({
        data: {
          transactionId: transaction.id,
          type: "AI_DECISION",
          previousStatus: "PROCESSING",
          newStatus: finalStatus,
          message: `OrchestratorAgent: ${result.finalDecision}`,
          metadata: { agentsInvoked: result.agentsInvoked, actions: result.actions },
        },
      });

      // Fire webhook if tenant has one
      if (tenant.webhookUrl) {
        await deliverWebhook(transaction.id, tenant.webhookUrl, "transaction.updated", {
          id: transaction.id,
          status: finalStatus,
          aiDecision: result.finalDecision,
        });
      }
    })
    .catch(console.error);

  return Response.json(
    { id: transaction.id, status: "PROCESSING", message: "Transação recebida e sendo processada pelos agentes de IA" },
    { status: 202 }
  );
}

// GET /api/v1/transactions — list transactions for tenant
export async function GET(req: NextRequest) {
  const tenant = await authenticateTenant(req);
  if (!tenant) return errorResponse("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const status = searchParams.get("status");
  const method = searchParams.get("method");

  const where = {
    tenantId: tenant.id,
    ...(status && { status: status as never }),
    ...(method && { method: method as never }),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return Response.json({ data: transactions, total, page, limit });
}

async function deliverWebhook(transactionId: string, url: string, event: string, payload: unknown) {
  try {
    const delivery = await prisma.webhookDelivery.create({
      data: { transactionId, url, event, payload: payload as never, status: "PENDING" },
    });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-GLC-Event": event },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    await prisma.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        status: res.ok ? "DELIVERED" : "FAILED",
        responseCode: res.status,
        responseBody: await res.text().catch(() => ""),
        deliveredAt: res.ok ? new Date() : undefined,
        attemptCount: 1,
      },
    });
  } catch (e) {
    console.error("Webhook delivery failed:", e);
  }
}
