import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const config = await prisma.configuracion.findMany();
  const map: Record<string, string> = {};
  config.forEach((c) => {
    map[c.clave] = c.valor;
  });
  return NextResponse.json({ config: map }, { headers: corsHeaders() });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { clave, valor } = body;

  if (!clave || typeof valor !== "string") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  await prisma.configuracion.upsert({
    where: { clave },
    update: { valor },
    create: { clave, valor },
  });

  return NextResponse.json({ success: true });
}
