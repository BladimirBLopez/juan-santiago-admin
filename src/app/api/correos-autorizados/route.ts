import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const correos = await prisma.correoAutorizado.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ correos });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { email, nombre } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Correo invalido" }, { status: 400 });
  }

  try {
    const correo = await prisma.correoAutorizado.create({
      data: { email: email.toLowerCase().trim(), nombre: nombre?.trim() || null },
    });
    return NextResponse.json({ success: true, correo }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ese correo ya esta autorizado" }, { status: 400 });
  }
}
