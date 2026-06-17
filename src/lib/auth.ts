import { prisma } from "./prisma";
import { NextRequest } from "next/server";

export async function authenticateTenant(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return null;

  const tenant = await prisma.tenant.findUnique({
    where: { apiKey, active: true },
  });

  return tenant;
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
