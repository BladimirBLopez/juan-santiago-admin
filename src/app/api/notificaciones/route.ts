import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const desde = new Date();
  desde.setDate(desde.getDate() - 7);

  const [consultas, pagos] = await Promise.all([
    prisma.consulta.findMany({
      where: { createdAt: { gte: desde } },
      include: { cliente: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.pago.findMany({
      where: { createdAt: { gte: desde } },
      include: { consulta: { include: { cliente: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const notificaciones = [
    ...consultas.map((c) => ({
      tipo: "consulta" as const,
      texto: `Nueva consulta de ${c.cliente.nombre}`,
      fecha: c.createdAt,
      id: c.cliente.id,
    })),
    ...pagos.map((p) => ({
      tipo: "pago" as const,
      texto: `Pago de Bs ${p.monto} de ${p.consulta.cliente.nombre}`,
      fecha: p.createdAt,
      id: p.consulta.cliente.id,
    })),
  ].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

  return NextResponse.json({ notificaciones });
}
