import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificarNuevoPago } from "@/lib/email";

const ALLOWED_ORIGINS = [
  "https://juansantiagoamarres.online",
  "https://www.juansantiagoamarres.online",
];

function corsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { consultaId, monto, comprobanteUrl, verificadoOcr } = body;

    if (!consultaId || typeof consultaId !== "string") {
      return NextResponse.json({ error: "Consulta inválida" }, { status: 400, headers: corsHeaders(req.headers.get("origin")) });
    }

    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400, headers: corsHeaders(req.headers.get("origin")) });
    }

    if (!comprobanteUrl || typeof comprobanteUrl !== "string") {
      return NextResponse.json({ error: "Comprobante requerido" }, { status: 400, headers: corsHeaders(req.headers.get("origin")) });
    }

    const consulta = await prisma.consulta.findUnique({
      where: { id: consultaId },
      include: { cliente: true },
    });
    if (!consulta) {
      return NextResponse.json({ error: "Consulta no encontrada" }, { status: 404, headers: corsHeaders(req.headers.get("origin")) });
    }

    const pago = await prisma.pago.create({
      data: {
        consultaId,
        monto: montoNum,
        comprobanteUrl,
        verificadoOcr: Boolean(verificadoOcr),
      },
    });

    await notificarNuevoPago({
      nombreCliente: consulta.cliente.nombre,
      monto: montoNum,
      comprobanteUrl,
    });

    return NextResponse.json({ success: true, pagoId: pago.id }, { status: 201, headers: corsHeaders(req.headers.get("origin")) });
  } catch (err) {
    console.error("Error creando pago:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500, headers: corsHeaders(req.headers.get("origin")) });
  }
}
