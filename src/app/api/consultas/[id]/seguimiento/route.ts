import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { tipo } = body;

  if (!["RECORDATORIO_AVANCE", "TESTIMONIO"].includes(tipo)) {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }

  const seguimiento = await prisma.seguimiento.create({
    data: {
      consultaId: id,
      tipo,
      enviado: true,
      fechaEnvio: new Date(),
    },
  });

  return NextResponse.json({ success: true, seguimiento });
}
