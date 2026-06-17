import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateTenant, errorResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const tenant = await authenticateTenant(req);
  if (!tenant) return errorResponse("Unauthorized", 401);

  const { id } = await params;

  const transaction = await prisma.transaction.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      events: { orderBy: { createdAt: "asc" } },
      agentLogs: { orderBy: { createdAt: "asc" } },
      webhooks: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!transaction) return errorResponse("Transaction not found", 404);
  return Response.json(transaction);
}
