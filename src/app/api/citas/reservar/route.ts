import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificarNuevaCita } from "@/lib/email";
import { crearEventoCalendario } from "@/lib/googleCalendar";

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

const MINUTOS_RESERVA = 40;
const SERVICIOS_VALIDOS_CITA = ["CONSULTA_TAROT", "CONSULTA_COCA"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, telefono, servicio, situacion, fechaCita } = body;

    if (!nombre || typeof nombre !== "string" || nombre.trim().length < 2) {
      return NextResponse.json(
        { error: "Nombre invalido" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    if (!servicio || !SERVICIOS_VALIDOS_CITA.includes(servicio)) {
      return NextResponse.json(
        { error: "Servicio invalido para cita" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    if (telefono) {
      const hace10Min = new Date(Date.now() - 10 * 60 * 1000);
      const telefonoLimpio = String(telefono).replace(/\D/g, "");
      const intentosRecientes = await prisma.consulta.count({
        where: {
          fechaCita: { not: null },
          createdAt: { gte: hace10Min },
          cliente: { telefono: telefonoLimpio },
        },
      });
      if (intentosRecientes >= 3) {
        return NextResponse.json(
          { error: "Demasiados intentos de reserva. Espera unos minutos e intenta de nuevo." },
          { status: 429, headers: corsHeaders(req.headers.get("origin")) }
        );
      }
    }

    if (!fechaCita || isNaN(Date.parse(fechaCita))) {
      return NextResponse.json(
        { error: "Fecha de cita invalida" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const fechaCitaDate = new Date(fechaCita);

    if (fechaCitaDate < new Date()) {
      return NextResponse.json(
        { error: "No se puede reservar una hora pasada" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const citaExpiraEn = new Date(Date.now() + MINUTOS_RESERVA * 60000);

    let cliente;
    try {
      cliente = await prisma.$transaction(async (tx) => {
        const ocupada = await tx.consulta.findFirst({
          where: {
            fechaCita: fechaCitaDate,
            OR: [
              { citaExpiraEn: { gt: new Date() } },
              { pagos: { some: { estado: "APROBADO" } } },
            ],
          },
        });

        if (ocupada) {
          throw new Error("HORARIO_OCUPADO");
        }

        return tx.cliente.create({
          data: {
            nombre: nombre.trim(),
            telefono: telefono ? String(telefono).trim() : null,
            consultas: {
              create: {
                servicio,
                situacion: situacion ? String(situacion).trim() : "Cita por videollamada",
                fechaCita: fechaCitaDate,
                citaExpiraEn,
              },
            },
          },
          include: { consultas: true },
        });
      }, { isolationLevel: "Serializable" });
    } catch (err) {
      const esConflicto =
        (err instanceof Error && err.message === "HORARIO_OCUPADO") ||
        (typeof err === "object" && err !== null && "code" in err && err.code === "P2034");
      if (esConflicto) {
        return NextResponse.json(
          { error: "Ese horario ya no esta disponible" },
          { status: 409, headers: corsHeaders(req.headers.get("origin")) }
        );
      }
      throw err;
    }

    const consulta = cliente.consultas[0];

    await notificarNuevaCita({
      nombre: cliente.nombre,
      servicio,
      telefono: cliente.telefono,
      fechaCita: fechaCitaDate,
    });

    await crearEventoCalendario({
      titulo: `${servicio === "CONSULTA_TAROT" ? "Tarot" : "Hojas de Coca"} - ${cliente.nombre}`,
      descripcion: `Cliente: ${cliente.nombre}\nTeléfono: ${cliente.telefono ?? "no proporcionado"}`,
      inicio: fechaCitaDate,
    });

    return NextResponse.json(
      {
        success: true,
        consultaId: consulta.id,
        clienteId: cliente.id,
        citaExpiraEn: citaExpiraEn.toISOString(),
      },
      { status: 201, headers: corsHeaders(req.headers.get("origin")) }
    );
  } catch (err) {
    console.error("Error reservando cita:", err);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500, headers: corsHeaders(req.headers.get("origin")) }
    );
  }
}
