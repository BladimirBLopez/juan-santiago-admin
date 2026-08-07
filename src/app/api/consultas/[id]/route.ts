import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ESTADOS_VALIDOS = ["NUEVO", "EN_PROCESO", "COMPLETADO"];

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
  const { estado, iniciarTrabajo } = body;

  if (iniciarTrabajo) {
    const consultaActual = await prisma.consulta.findUnique({ where: { id } });
    if (!consultaActual) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    const consulta = await prisma.consulta.update({
      where: { id },
      data: {
        fechaInicio: new Date(),
        diasTrabajo: DIAS_POR_SERVICIO[consultaActual.servicio] ?? 21,
        estado: "EN_PROCESO",
      },
    });

    return NextResponse.json({ success: true, consulta });
  }

  if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const consulta = await prisma.consulta.update({
    where: { id },
    data: { estado },
  });

  return NextResponse.json({ success: true, consulta });
}
