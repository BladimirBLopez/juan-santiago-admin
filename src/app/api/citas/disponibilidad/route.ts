import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_ORIGINS = [
  "https://juansantiagoamarres.online",
  "https://www.juansantiagoamarres.online",
];

function corsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

const DURACION_MIN = 30;
const OFFSET_BOLIVIA_HORAS = 4;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fechaParam = searchParams.get("fecha");

    if (!fechaParam || !/^\d{4}-\d{2}-\d{2}$/.test(fechaParam)) {
      return NextResponse.json(
        { error: "Parametro fecha invalido, use YYYY-MM-DD" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const inicioDia = new Date(`${fechaParam}T00:00:00.000Z`);
    inicioDia.setUTCHours(inicioDia.getUTCHours() + OFFSET_BOLIVIA_HORAS);
    const finDia = new Date(inicioDia);
    finDia.setUTCDate(finDia.getUTCDate() + 1);

    const ocupadas = await prisma.consulta.findMany({
      where: {
        fechaCita: { gte: inicioDia, lt: finDia },
        OR: [
          { citaExpiraEn: { gt: new Date() } },
          { pagos: { some: { estado: "APROBADO" } } },
        ],
      },
      select: { fechaCita: true },
    });

    const ocupadasSet = new Set(ocupadas.map((c) => c.fechaCita?.toISOString()));

    const ahora = new Date();
    const slots: string[] = [];
    let cursor = new Date(inicioDia);

    while (cursor < finDia) {
      if (cursor > ahora && !ocupadasSet.has(cursor.toISOString())) {
        slots.push(cursor.toISOString());
      }
      cursor = new Date(cursor.getTime() + DURACION_MIN * 60000);
    }

    return NextResponse.json(
      { fecha: fechaParam, duracionMinutos: DURACION_MIN, slots },
      { status: 200, headers: corsHeaders(req.headers.get("origin")) }
    );
  } catch (err) {
    console.error("Error obteniendo disponibilidad:", err);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500, headers: corsHeaders(req.headers.get("origin")) }
    );
  }
}
