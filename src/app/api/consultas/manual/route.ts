import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DIAS_POR_SERVICIO: Record<string, number> = {
  AMARRE: 21,
  UNION_PAREJA: 21,
  RETORNO: 21,
  ENDULZAMIENTO: 14,
  ALEJAMIENTO: 14,
};

const PRECIO_DEFECTO: Record<string, number> = {
  AMARRE: 450,
  UNION_PAREJA: 450,
  RETORNO: 450,
  ENDULZAMIENTO: 450,
  ALEJAMIENTO: 450,
  CONSULTA_TAROT: 50,
  CONSULTA_COCA: 50,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clienteId, servicio, situacion, yaPagado } = body;

    if (!clienteId || typeof clienteId !== "string") {
      return NextResponse.json({ error: "Cliente invalido" }, { status: 400 });
    }
    if (!servicio || !(servicio in PRECIO_DEFECTO)) {
      return NextResponse.json({ error: "Servicio invalido" }, { status: 400 });
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const precio = await prisma.precio.findUnique({ where: { servicio } });
    const monto = precio?.monto ?? PRECIO_DEFECTO[servicio];

    const consulta = await prisma.consulta.create({
      data: {
        clienteId,
        servicio,
        situacion: situacion?.trim() || "Agregado manualmente por el Maestro",
        estado: yaPagado ? "EN_PROCESO" : "NUEVO",
        fechaInicio: yaPagado ? new Date() : null,
        diasTrabajo: yaPagado ? DIAS_POR_SERVICIO[servicio] ?? null : null,
      },
    });

    if (yaPagado) {
      await prisma.pago.create({
        data: {
          consultaId: consulta.id,
          monto,
          comprobanteUrl: "PAGO_MANUAL_SIN_COMPROBANTE",
          estado: "APROBADO",
          aprobadoAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, consultaId: consulta.id }, { status: 201 });
  } catch (err) {
    console.error("Error creando consulta manual:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
