import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificarRecordatorioCitas } from "@/lib/email";

const SERVICIO_LABELS: Record<string, string> = {
  CONSULTA_TAROT: "Consulta de Tarot",
  CONSULTA_COCA: "Consulta de Hojas de Coca",
};

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const ahora = new Date();

  const inicioHoyBolivia = new Date();
  inicioHoyBolivia.setUTCHours(4, 0, 0, 0);
  if (inicioHoyBolivia < ahora) {
    // ya paso el inicio del dia en Bolivia (UTC-4), usar hoy
  } else {
    inicioHoyBolivia.setUTCDate(inicioHoyBolivia.getUTCDate() - 1);
  }
  const finHoyBolivia = new Date(inicioHoyBolivia);
  finHoyBolivia.setUTCDate(finHoyBolivia.getUTCDate() + 1);

  const citasHoy = await prisma.consulta.findMany({
    where: {
      fechaCita: { gte: inicioHoyBolivia, lt: finHoyBolivia },
      estado: { not: "COMPLETADO" },
      pagos: { some: { estado: "APROBADO" } },
    },
    include: { cliente: true },
  });

  if (citasHoy.length > 0) {
    await notificarRecordatorioCitas(
      citasHoy.map((c) => ({
        nombre: c.cliente.nombre,
        telefono: c.cliente.telefono,
        hora: c.fechaCita
          ? new Date(c.fechaCita).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit", timeZone: "America/La_Paz" })
          : "",
        servicio: SERVICIO_LABELS[c.servicio] ?? c.servicio,
      }))
    );
  }

  const resultado = await prisma.consulta.updateMany({
    where: {
      fechaCita: { lt: ahora },
      estado: { not: "COMPLETADO" },
      pagos: { some: { estado: "APROBADO" } },
    },
    data: { estado: "COMPLETADO" },
  });

  const hace3Dias = new Date();
  hace3Dias.setDate(hace3Dias.getDate() - 3);

  const resultadoAbandonadas = await prisma.consulta.updateMany({
    where: {
      estado: "NUEVO",
      createdAt: { lt: hace3Dias },
      pagos: { none: {} },
    },
    data: { estado: "ABANDONADA" },
  });

  return NextResponse.json({
    recordatoriosEnviados: citasHoy.length,
    citasCompletadasAutomaticamente: resultado.count,
    consultasAbandonadas: resultadoAbandonadas.count,
  });
}
