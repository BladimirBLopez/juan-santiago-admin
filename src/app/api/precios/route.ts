import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const precios = await prisma.precio.findMany();
  return NextResponse.json({ precios });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { servicio, monto } = body;

  const montoNum = Number(monto);
  if (!servicio || !montoNum || montoNum <= 0) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const precio = await prisma.precio.upsert({
    where: { servicio },
    update: { monto: montoNum },
    create: { servicio, monto: montoNum },
  });

  return NextResponse.json({ success: true, precio });
}
