import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ESTADOS_VALIDOS = ["NUEVO", "EN_PROCESO", "COMPLETADO"];

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

  if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const consulta = await prisma.consulta.update({
    where: { id },
    data: { estado },
  });

  return NextResponse.json({ success: true, consulta });
}
