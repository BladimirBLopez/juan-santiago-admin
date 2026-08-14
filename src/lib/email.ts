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

function filaTabla(label: string, valor: string) {
  return `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid #f0eee8; color:#8a8a95; font-size:13px; width:110px; vertical-align:top;">${label}</td>
      <td style="padding:10px 0; border-bottom:1px solid #f0eee8; color:#1a0505; font-size:14px; font-weight:600;">${valor}</td>
    </tr>`;
}

function emailWrapper({
  badge,
  titulo,
  contenidoHtml,
  ctaTexto = "Ver en el panel",
  ctaUrl = "https://juan-santiago-admin.vercel.app/panel",
}: {
  badge: string;
  titulo: string;
  contenidoHtml: string;
  ctaTexto?: string;
  ctaUrl?: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; padding:0; background:#f0f0f0; font-family: -apple-system, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0; padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#4a0916,#2e0a1c); padding:28px 24px; text-align:center;">
              <div style="color:#c9a24b; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">✦ Norte de Potosí · Bolivia ✦</div>
              <div style="color:#f5e6d3; font-size:20px; font-weight:700; font-family: Georgia, serif;">Maestro Juan Santiago</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px 24px;">
              <div style="display:inline-block; background:#fff8e6; color:#8a651f; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:5px 12px; border-radius:20px; margin-bottom:14px;">
                ${badge}
              </div>
              <h2 style="margin:6px 0 18px 0; color:#1a0505; font-size:19px;">${titulo}</h2>
              ${contenidoHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 28px 24px;">
              <a href="${ctaUrl}" style="display:block; text-align:center; background:linear-gradient(135deg,#e6c476,#c9a24b); color:#1a0505; font-weight:700; font-size:14px; text-decoration:none; padding:13px; border-radius:10px;">
                ${ctaTexto} →
              </a>
            </td>
          </tr>
          <tr>
            <td style="background:#faf9f7; padding:16px 24px; text-align:center; border-top:1px solid #f0eee8;">
              <div style="color:#b0b0b8; font-size:11px;">Notificación automática · Panel Maestro Juan Santiago</div>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
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

  const contenidoHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${filaTabla("Cliente", nombreCliente)}
      ${filaTabla("Monto", `Bs ${monto}`)}
    </table>
    <p style="margin:16px 0 0 0;">
      <a href="${comprobanteUrl}" style="color:#8a651f; font-size:13px; font-weight:600; text-decoration:underline;">Ver comprobante →</a>
    </p>
  `;

  try {
    await resend.emails.send({
      from: "Maestro Juan Santiago <notificaciones@juansantiagoamarres.online>",
      to: destinos,
      subject: `Nuevo pago pendiente: ${nombreCliente} (Bs ${monto})`,
      html: emailWrapper({
        badge: "💰 Nuevo pago",
        titulo: "Nuevo pago recibido",
        contenidoHtml,
        ctaTexto: "Revisar y aprobar en el panel",
      }),
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
      return `
        <div style="padding:12px 0; border-bottom:1px solid #f0eee8;">
          <div style="color:#1a0505; font-size:14px; font-weight:700;">${c.hora} — ${c.nombre}</div>
          <div style="color:#8a8a95; font-size:12px; margin:2px 0 6px 0;">${c.servicio}</div>
          <a href="${linkWa}" style="color:#1f9d55; font-size:12px; font-weight:700; text-decoration:none;">Abrir WhatsApp →</a>
        </div>`;
    })
    .join("");

  try {
    await resend.emails.send({
      from: "Maestro Juan Santiago <notificaciones@juansantiagoamarres.online>",
      to: destinos,
      subject: `Recordatorio: ${citas.length} cita(s) hoy`,
      html: emailWrapper({
        badge: "📅 Recordatorio",
        titulo: `${citas.length} cita${citas.length > 1 ? "s" : ""} hoy`,
        contenidoHtml: filas,
      }),
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

  const contenidoHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${filaTabla("Nombre", nombre)}
      ${filaTabla("Servicio", servicio)}
      ${filaTabla("Teléfono", telefono ?? "no proporcionado")}
      ${filaTabla("Fecha y hora", fechaFormateada)}
    </table>
    <div style="margin-top:16px; padding:12px 14px; background:#fff8e6; border-left:3px solid #c9a24b; border-radius:6px; color:#7a5c00; font-size:13px;">
      <strong>Nota:</strong> la cita queda pendiente de confirmar hasta que se apruebe el pago.
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Maestro Juan Santiago <notificaciones@juansantiagoamarres.online>",
      to: destinos,
      subject: `Nueva cita reservada: ${nombre} - ${fechaFormateada}`,
      html: emailWrapper({
        badge: "🎥 Nueva cita",
        titulo: "Nueva cita por videollamada reservada",
        contenidoHtml,
      }),
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

  const contenidoHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${filaTabla("Nombre", nombre)}
      ${filaTabla("Servicio", servicio)}
      ${filaTabla("Teléfono", telefono ?? "no proporcionado")}
      ${filaTabla("Situación", situacion)}
    </table>
  `;

  try {
    await resend.emails.send({
      from: "Maestro Juan Santiago <notificaciones@juansantiagoamarres.online>",
      to: destinos,
      subject: `Nueva consulta: ${nombre} (${servicio})`,
      html: emailWrapper({
        badge: "🔮 Nueva consulta",
        titulo: "Nueva consulta recibida",
        contenidoHtml,
      }),
    });
  } catch (err) {
    console.error("Error enviando email de notificación:", err);
  }
}

export async function notificarSeguimientosPendientes({
  avances,
  testimonios,
}: {
  avances: { nombre: string; numeroWa: string; diaActual: number; diasTrabajo: number; consultaId: string }[];
  testimonios: { nombre: string; numeroWa: string; consultaId: string }[];
}) {
  const destinos = await obtenerDestinatarios();
  if (destinos.length === 0) return;
  if (avances.length === 0 && testimonios.length === 0) return;

  const filasAvances = avances
    .map((a) => {
      const mensaje = encodeURIComponent(
        `Hola ${a.nombre}, soy el Maestro Juan Santiago. Te escribo para contarte que tu trabajo va en el día ${a.diaActual} de ${a.diasTrabajo}. Todo avanza según lo previsto. 🙏`
      );
      return `
        <div style="padding:12px 0; border-bottom:1px solid #f0eee8;">
          <div style="color:#1a0505; font-size:14px; font-weight:700;">${a.nombre}</div>
          <div style="color:#8a8a95; font-size:12px; margin:2px 0 6px 0;">Día ${a.diaActual} de ${a.diasTrabajo}</div>
          <a href="https://wa.me/${a.numeroWa}?text=${mensaje}" style="color:#1f9d55; font-size:12px; font-weight:700; text-decoration:none;">Enviar avance por WhatsApp →</a>
        </div>`;
    })
    .join("");

  const filasTestimonios = testimonios
    .map((t) => {
      const mensaje = encodeURIComponent(
        `Hola ${t.nombre}, soy el Maestro Juan Santiago. Ya se cumplió el tiempo de tu trabajo espiritual. Me encantaría saber cómo te fue y si notaste resultados — tu testimonio ayuda a que más personas confíen en este camino. 🙏✨`
      );
      return `
        <div style="padding:12px 0; border-bottom:1px solid #f0eee8;">
          <div style="color:#1a0505; font-size:14px; font-weight:700;">${t.nombre}</div>
          <div style="color:#8a8a95; font-size:12px; margin:2px 0 6px 0;">Trabajo completado, sin testimonio pedido</div>
          <a href="https://wa.me/${t.numeroWa}?text=${mensaje}" style="color:#6366f1; font-size:12px; font-weight:700; text-decoration:none;">Pedir testimonio por WhatsApp →</a>
        </div>`;
    })
    .join("");

  const contenidoHtml = `
    ${avances.length > 0 ? `<p style="margin:0 0 6px 0; color:#8a651f; font-size:12px; font-weight:700; text-transform:uppercase;">Avances por enviar (${avances.length})</p>${filasAvances}` : ""}
    ${testimonios.length > 0 ? `<p style="margin:18px 0 6px 0; color:#8a651f; font-size:12px; font-weight:700; text-transform:uppercase;">Testimonios por pedir (${testimonios.length})</p>${filasTestimonios}` : ""}
  `;

  try {
    await resend.emails.send({
      from: "Maestro Juan Santiago <notificaciones@juansantiagoamarres.online>",
      to: destinos,
      subject: `Pendientes de seguimiento: ${avances.length + testimonios.length} cliente(s)`,
      html: emailWrapper({
        badge: "📋 Seguimiento pendiente",
        titulo: "Clientes esperando tu mensaje",
        contenidoHtml,
        ctaTexto: "Ver todos los clientes",
      }),
    });
  } catch (err) {
    console.error("Error enviando email de seguimientos pendientes:", err);
  }
}
