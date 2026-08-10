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
  const { estado, iniciarTrabajo, notas, situacion, nombreCliente, telefonoCliente, fechaCita } = body;

  if (fechaCita !== undefined) {
    const consulta = await prisma.consulta.update({
      where: { id },
      data: { fechaCita: fechaCita ? new Date(fechaCita) : null },
    });
    return NextResponse.json({ success: true, consulta });
  }

  if (
    situacion !== undefined ||
    nombreCliente !== undefined ||
    telefonoCliente !== undefined
  ) {
    const consultaActual = await prisma.consulta.findUnique({ where: { id } });
    if (!consultaActual) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    if (nombreCliente !== undefined || telefonoCliente !== undefined) {
      await prisma.cliente.update({
        where: { id: consultaActual.clienteId },
        data: {
          ...(nombreCliente !== undefined ? { nombre: nombreCliente } : {}),
          ...(telefonoCliente !== undefined ? { telefono: telefonoCliente } : {}),
        },
      });
    }

    const consulta = await prisma.consulta.update({
      where: { id },
      data: {
        ...(situacion !== undefined ? { situacion } : {}),
      },
      include: { cliente: true },
    });

    return NextResponse.json({ success: true, consulta });
  }

  if (typeof notas === "string") {
    const consulta = await prisma.consulta.update({
      where: { id },
      data: { notas },
    });
    return NextResponse.json({ success: true, consulta });
  }

  if (iniciarTrabajo) {
    const consultaActual = await prisma.consulta.findUnique({ where: { id } });
    if (!consultaActual) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    if (!DIAS_POR_SERVICIO[consultaActual.servicio]) {
      return NextResponse.json(
        { error: "Este servicio no requiere seguimiento de días" },
        { status: 400 }
      );
    }

    const consulta = await prisma.consulta.update({
      where: { id },
      data: {
        fechaInicio: new Date(),
        diasTrabajo: DIAS_POR_SERVICIO[consultaActual.servicio],
        estado: "EN_PROCESO",
      },
    });

    return NextResponse.json({ success: true, consulta });
  }

  if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  if (estado === "NUEVO") {
    const consultaActual = await prisma.consulta.findUnique({ where: { id } });
    if (consultaActual?.fechaInicio) {
      return NextResponse.json(
        { error: "No se puede volver a Nuevo despues de iniciar el trabajo" },
        { status: 400 }
      );
    }
  }

  const consulta = await prisma.consulta.update({
    where: { id },
    data: { estado },
  });

  return NextResponse.json({ success: true, consulta });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.consulta.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
