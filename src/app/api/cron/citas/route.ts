import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificarRecordatorioCitas, notificarSeguimientosPendientes, notificarResumenSemanal } from "@/lib/email";

const SERVICIO_LABELS: Record<string, string> = {
  CONSULTA_TAROT: "Consulta de Tarot",
  CONSULTA_COCA: "Consulta de Hojas de Coca",
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
};

const OFFSET_BOLIVIA_HORAS_MS = 4 * 60 * 60000;

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

  const trabajosActivos = await prisma.consulta.findMany({
    where: {
      estado: "EN_PROCESO",
      fechaInicio: { not: null },
      diasTrabajo: { not: null },
    },
    include: { cliente: true, seguimientos: true },
  });

  const avancesPendientes: { nombre: string; numeroWa: string; diaActual: number; diasTrabajo: number; consultaId: string }[] = [];
  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);

  for (const c of trabajosActivos) {
    if (!c.cliente.telefono || !c.fechaInicio || !c.diasTrabajo) continue;
    const diasTranscurridos = Math.floor((ahora.getTime() - new Date(c.fechaInicio).getTime()) / (1000 * 60 * 60 * 24));
    const diaActual = Math.min(diasTranscurridos + 1, c.diasTrabajo);
    const mitad = Math.floor(c.diasTrabajo / 2);
    if (diaActual < mitad) continue;

    const avancesEnviados = c.seguimientos.filter((s) => s.tipo === "RECORDATORIO_AVANCE");
    const ultimoAvance = avancesEnviados.sort((a, b) => (b.fechaEnvio?.getTime() ?? 0) - (a.fechaEnvio?.getTime() ?? 0))[0];
    if (ultimoAvance && ultimoAvance.fechaEnvio && ultimoAvance.fechaEnvio > hace7Dias) continue;

    const telefonoLimpio = c.cliente.telefono.replace(/\D/g, "");
    avancesPendientes.push({
      nombre: c.cliente.nombre,
      numeroWa: `591${telefonoLimpio}`,
      diaActual,
      diasTrabajo: c.diasTrabajo,
      consultaId: c.id,
    });
  }

  const trabajosCompletadosSinTestimonio = await prisma.consulta.findMany({
    where: {
      estado: "COMPLETADO",
      diasTrabajo: { not: null },
    },
    include: { cliente: true, seguimientos: true },
  });

  const testimoniosPendientes: { nombre: string; numeroWa: string; consultaId: string }[] = [];
  for (const c of trabajosCompletadosSinTestimonio) {
    if (!c.cliente.telefono) continue;
    const yaPidio = c.seguimientos.some((s) => s.tipo === "TESTIMONIO");
    if (yaPidio) continue;

    const telefonoLimpio = c.cliente.telefono.replace(/\D/g, "");
    testimoniosPendientes.push({
      nombre: c.cliente.nombre,
      numeroWa: `591${telefonoLimpio}`,
      consultaId: c.id,
    });
  }

  if (avancesPendientes.length > 0 || testimoniosPendientes.length > 0) {
    await notificarSeguimientosPendientes({
      avances: avancesPendientes,
      testimonios: testimoniosPendientes,
    });
  }

  const diaSemanaBolivia = new Date(ahora.getTime() - OFFSET_BOLIVIA_HORAS_MS).getUTCDay();
  let resumenEnviado = false;

  if (diaSemanaBolivia === 1) {
    const hace7Dias2 = new Date();
    hace7Dias2.setDate(hace7Dias2.getDate() - 7);

    const [pagosSemana, consultasSemana, trabajosCompletadosTotal, serviciosSemana] = await Promise.all([
      prisma.pago.findMany({
        where: { estado: "APROBADO", createdAt: { gte: hace7Dias2 } },
        select: { monto: true },
      }),
      prisma.consulta.count({ where: { createdAt: { gte: hace7Dias2 } } }),
      prisma.consulta.count({ where: { estado: "COMPLETADO" } }),
      prisma.consulta.groupBy({
        by: ["servicio"],
        where: { createdAt: { gte: hace7Dias2 } },
        _count: { servicio: true },
        orderBy: { _count: { servicio: "desc" } },
        take: 1,
      }),
    ]);

    const ingresosSemana = pagosSemana.reduce((sum, p) => sum + p.monto, 0);
    const servicioTop = serviciosSemana[0]?.servicio ?? null;

    await notificarResumenSemanal({
      ingresosSemana,
      consultasNuevas: consultasSemana,
      trabajosCompletadosTotal,
      servicioMasPedido: servicioTop ? SERVICIO_LABELS[servicioTop] ?? servicioTop : null,
    });
    resumenEnviado = true;
  }

  return NextResponse.json({
    recordatoriosEnviados: citasHoy.length,
    citasCompletadasAutomaticamente: resultado.count,
    consultasAbandonadas: resultadoAbandonadas.count,
    avancesPendientes: avancesPendientes.length,
    testimoniosPendientes: testimoniosPendientes.length,
    resumenSemanalEnviado: resumenEnviado,
  });
}
