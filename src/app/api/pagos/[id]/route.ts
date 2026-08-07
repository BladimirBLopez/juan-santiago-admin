import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
  });

  return NextResponse.json({ success: true, pago });
}
