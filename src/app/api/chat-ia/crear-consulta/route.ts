import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificarNuevaConsulta } from "@/lib/email";

const ALLOWED_ORIGINS = [
  "https://juansantiagoamarres.online",
  "https://www.juansantiagoamarres.online",
];

function corsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

const SERVICIOS_VALIDOS = [
  "AMARRE",
  "ENDULZAMIENTO",
  "RETORNO",
  "ALEJAMIENTO",
  "UNION_PAREJA",
  "CONSULTA_TAROT",
  "CONSULTA_COCA",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, telefono, servicio, situacion } = body;

    if (!nombre || typeof nombre !== "string" || nombre.trim().length < 2) {
      return NextResponse.json(
        { error: "Nombre invalido" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }
    if (!servicio || !SERVICIOS_VALIDOS.includes(servicio)) {
      return NextResponse.json(
        { error: "Servicio invalido" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }
    if (!situacion || typeof situacion !== "string" || situacion.trim().length < 5) {
      return NextResponse.json(
        { error: "Situacion invalida" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const cliente = await prisma.cliente.create({
      data: {
        nombre: nombre.trim(),
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

    const consulta = cliente.consultas[0];

    await notificarNuevaConsulta({
      nombre: cliente.nombre,
      servicio,
      situacion: situacion.trim(),
      telefono: cliente.telefono,
    });

    return NextResponse.json(
      { success: true, consultaId: consulta.id, clienteId: cliente.id },
      { status: 201, headers: corsHeaders(req.headers.get("origin")) }
    );
  } catch (err) {
    console.error("Error creando consulta desde chat-ia:", err);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500, headers: corsHeaders(req.headers.get("origin")) }
    );
  }
}
