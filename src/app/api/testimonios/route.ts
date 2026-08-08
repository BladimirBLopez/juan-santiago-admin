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
  const testimonios = await prisma.testimonio.findMany({
    where: { visible: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ testimonios }, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { nombre, servicio, texto, mediaUrl, mediaTipo } = body;

  if (!nombre || !texto) {
    return NextResponse.json({ error: "Nombre y texto requeridos" }, { status: 400 });
  }

  const testimonio = await prisma.testimonio.create({
    data: {
      nombre,
      servicio: servicio || null,
      texto,
      mediaUrl: mediaUrl || null,
      mediaTipo: mediaTipo || null,
    },
  });

  return NextResponse.json({ success: true, testimonio }, { status: 201 });
}
