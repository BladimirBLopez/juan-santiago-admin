import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

async function obtenerDestinatarios(): Promise<string[]> {
  try {
    const correos = await prisma.correoAutorizado.findMany({ select: { email: true } });
    const lista = correos.map((c) => c.email);
    if (lista.length > 0) return lista;
  } catch (err) {
    console.error("Error obteniendo correos autorizados:", err);
  }
  const fallback = process.env.NOTIFICACION_EMAIL;
  return fallback ? [fallback] : [];
}

export async function notificarNuevoPago({
  nombreCliente,
  monto,
  comprobanteUrl,
}: {
  nombreCliente: string;
  monto: number;
  comprobanteUrl: string;
}) {
  const destinos = await obtenerDestinatarios();
  if (destinos.length === 0) return;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destinos,
      subject: `Nuevo pago pendiente: ${nombreCliente} (Bs ${monto})`,
      html: `
        <h2>Nuevo pago recibido</h2>
        <p><strong>Cliente:</strong> ${nombreCliente}</p>
        <p><strong>Monto:</strong> Bs ${monto}</p>
        <p><a href="${comprobanteUrl}">Ver comprobante</a></p>
        <p><a href="https://juan-santiago-admin.vercel.app/panel">Revisar y aprobar en el panel</a></p>
      `,
    });
  } catch (err) {
    console.error("Error enviando email de notificacion de pago:", err);
  }
}

export async function notificarRecordatorioCitas(citas: { nombre: string; telefono: string | null; hora: string; servicio: string }[]) {
  const destinos = await obtenerDestinatarios();
  if (destinos.length === 0 || citas.length === 0) return;

  const filas = citas
    .map((c) => {
      const tel = (c.telefono ?? "").replace(/\D/g, "");
      const telConPrefijo = tel.startsWith("591") ? tel : `591${tel}`;
      const linkWa = `https://wa.me/${telConPrefijo}`;
      return `<li><strong>${c.hora}</strong> - ${c.nombre} (${c.servicio}) - <a href="${linkWa}">Abrir WhatsApp</a></li>`;
    })
    .join("");

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destinos,
      subject: `Recordatorio: ${citas.length} cita(s) hoy`,
      html: `
        <h2>Citas de hoy</h2>
        <ul>${filas}</ul>
        <p><a href="https://juan-santiago-admin.vercel.app/panel">Ver en el panel</a></p>
      `,
    });
  } catch (err) {
    console.error("Error enviando recordatorio de citas:", err);
  }
}

export async function notificarNuevaCita({
  nombre,
  servicio,
  telefono,
  fechaCita,
}: {
  nombre: string;
  servicio: string;
  telefono: string | null;
  fechaCita: Date;
}) {
  const destinos = await obtenerDestinatarios();
  if (destinos.length === 0) return;

  const fechaFormateada = fechaCita.toLocaleString("es-BO", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/La_Paz",
  });

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destinos,
      subject: `Nueva cita reservada: ${nombre} - ${fechaFormateada}`,
      html: `
        <h2>Nueva cita por videollamada reservada</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Teléfono:</strong> ${telefono ?? "no proporcionado"}</p>
        <p><strong>Fecha y hora:</strong> ${fechaFormateada}</p>
        <p style="color:#b45309"><strong>Nota:</strong> la cita queda pendiente de confirmar hasta que se apruebe el pago.</p>
        <p><a href="https://juan-santiago-admin.vercel.app/panel">Ver en el panel</a></p>
      `,
    });
  } catch (err) {
    console.error("Error enviando email de notificacion de cita:", err);
  }
}

export async function notificarNuevaConsulta({
  nombre,
  servicio,
  situacion,
  telefono,
}: {
  nombre: string;
  servicio: string;
  situacion: string;
  telefono: string | null;
}) {
  const destinos = await obtenerDestinatarios();
  if (destinos.length === 0) return;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destinos,
      subject: `Nueva consulta: ${nombre} (${servicio})`,
      html: `
        <h2>Nueva consulta recibida</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Teléfono:</strong> ${telefono ?? "no proporcionado"}</p>
        <p><strong>Situación:</strong> ${situacion}</p>
        <p><a href="https://juan-santiago-admin.vercel.app/panel">Ver en el panel</a></p>
      `,
    });
  } catch (err) {
    console.error("Error enviando email de notificación:", err);
  }
}
