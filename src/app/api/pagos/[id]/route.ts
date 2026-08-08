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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { estado } = body;

  if (!["APROBADO", "RECHAZADO"].includes(estado)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const pago = await prisma.pago.update({
    where: { id },
    data: {
      estado,
      aprobadoAt: estado === "APROBADO" ? new Date() : null,
    },
    include: { consulta: true },
  });

  if (estado === "APROBADO" && !pago.consulta.fechaInicio) {
    const dias = DIAS_POR_SERVICIO[pago.consulta.servicio];
    if (dias) {
      await prisma.consulta.update({
        where: { id: pago.consultaId },
        data: {
          fechaInicio: new Date(),
          diasTrabajo: dias,
          estado: "EN_PROCESO",
        },
      });
    }
  }

  return NextResponse.json({ success: true, pago });
}
