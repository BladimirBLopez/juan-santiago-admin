import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DIAS_POR_SERVICIO: Record<string, number> = {
  AMARRE: 21,
  UNION_PAREJA: 21,
  RETORNO: 21,
  ENDULZAMIENTO: 14,
  ALEJAMIENTO: 14,
};

const PRECIO_DEFECTO: Record<string, number> = {
  AMARRE: 450,
  UNION_PAREJA: 450,
  RETORNO: 450,
  ENDULZAMIENTO: 450,
  ALEJAMIENTO: 450,
  CONSULTA_TAROT: 50,
  CONSULTA_COCA: 50,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clienteId, nombre, telefono, servicio, situacion, yaPagado } = body;

    if (!servicio || !(servicio in PRECIO_DEFECTO)) {
      return NextResponse.json({ error: "Servicio invalido" }, { status: 400 });
    }

    let cliente;

    if (clienteId && typeof clienteId === "string") {
      // Se especifico un cliente existente puntual (ej. desde su perfil)
      cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) {
        return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
      }
    } else {
      // Alta manual: nombre + telefono
      if (!nombre || typeof nombre !== "string" || nombre.trim().length < 2) {
        return NextResponse.json({ error: "Nombre invalido" }, { status: 400 });
      }

      const telefonoLimpio = telefono ? String(telefono).replace(/\D/g, "") : null;

      // Solo reutilizamos un cliente existente si coincide el TELEFONO (nunca por nombre)
      if (telefonoLimpio) {
        cliente = await prisma.cliente.findFirst({ where: { telefono: telefonoLimpio } });
      }

      if (!cliente) {
        cliente = await prisma.cliente.create({
          data: { nombre: nombre.trim(), telefono: telefonoLimpio },
        });
      }
    }

    const clienteIdFinal = cliente.id;

    const precio = await prisma.precio.findUnique({ where: { servicio } });
    const monto = precio?.monto ?? PRECIO_DEFECTO[servicio];

    const esConsulta = servicio === "CONSULTA_TAROT" || servicio === "CONSULTA_COCA";

    const consulta = await prisma.consulta.create({
      data: {
        clienteId: clienteIdFinal,
        servicio,
        situacion: situacion?.trim() || "Agregado manualmente por el Maestro",
        estado: yaPagado ? (esConsulta ? "COMPLETADO" : "EN_PROCESO") : "NUEVO",
        fechaInicio: yaPagado && !esConsulta ? new Date() : null,
        diasTrabajo: yaPagado && !esConsulta ? DIAS_POR_SERVICIO[servicio] ?? null : null,
      },
    });

    if (yaPagado) {
      await prisma.pago.create({
        data: {
          consultaId: consulta.id,
          monto,
          comprobanteUrl: "PAGO_MANUAL_SIN_COMPROBANTE",
          estado: "APROBADO",
          aprobadoAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, consultaId: consulta.id }, { status: 201 });
  } catch (err) {
    console.error("Error creando consulta manual:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
