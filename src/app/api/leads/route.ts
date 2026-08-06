import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_ORIGIN = "https://juansantiagoamarres.online";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

const SERVICIOS_VALIDOS = [
  "AMARRE",
  "ENDULZAMIENTO",
  "RETORNO",
  "ALEJAMIENTO",
  "UNION_PAREJA",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, fechaNacimiento, telefono, servicio, situacion } = body;

    if (!nombre || typeof nombre !== "string" || nombre.trim().length < 2) {
      return NextResponse.json(
        { error: "Nombre inválido" },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!servicio || !SERVICIOS_VALIDOS.includes(servicio)) {
      return NextResponse.json(
        { error: "Servicio inválido" },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!situacion || typeof situacion !== "string" || situacion.trim().length < 5) {
      return NextResponse.json(
        { error: "Situación inválida" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const cliente = await prisma.cliente.create({
      data: {
        nombre: nombre.trim(),
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        telefono: telefono ? String(telefono).trim() : null,
        consultas: {
          create: {
            servicio,
            situacion: situacion.trim(),
          },
        },
      },
      include: { consultas: true },
    });

    return NextResponse.json(
      { success: true, clienteId: cliente.id },
      { status: 201, headers: corsHeaders() }
    );
  } catch (err) {
    console.error("Error creando lead:", err);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
