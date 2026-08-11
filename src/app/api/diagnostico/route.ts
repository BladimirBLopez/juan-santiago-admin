import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const resultado: Record<string, unknown> = {};

  try {
    const correos = await prisma.correoAutorizado.findMany({ select: { email: true } });
    resultado.correosEncontrados = correos.map((c) => c.email);
  } catch (err) {
    resultado.errorConsultaCorreos = String(err);
  }

  resultado.notificacionEmailEnv = process.env.NOTIFICACION_EMAIL ? "definida" : "no definida";
  resultado.resendApiKeyEnv = process.env.RESEND_API_KEY ? "definida" : "no definida";

  return NextResponse.json(resultado);
}
