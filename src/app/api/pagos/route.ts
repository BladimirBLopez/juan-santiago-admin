import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { consultaId, monto, comprobanteUrl } = body;

    if (!consultaId || typeof consultaId !== "string") {
      return NextResponse.json({ error: "Consulta inválida" }, { status: 400 });
    }

    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
    }

    if (!comprobanteUrl || typeof comprobanteUrl !== "string") {
      return NextResponse.json({ error: "Comprobante requerido" }, { status: 400 });
    }

    const consulta = await prisma.consulta.findUnique({ where: { id: consultaId } });
    if (!consulta) {
      return NextResponse.json({ error: "Consulta no encontrada" }, { status: 404 });
    }

    const pago = await prisma.pago.create({
      data: {
        consultaId,
        monto: montoNum,
        comprobanteUrl,
      },
    });

    return NextResponse.json({ success: true, pagoId: pago.id }, { status: 201 });
  } catch (err) {
    console.error("Error creando pago:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
