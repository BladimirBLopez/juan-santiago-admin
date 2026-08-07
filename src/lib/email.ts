import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notificarNuevoPago({
  nombreCliente,
  monto,
  comprobanteUrl,
}: {
  nombreCliente: string;
  monto: number;
  comprobanteUrl: string;
}) {
  const destino = process.env.NOTIFICACION_EMAIL;
  if (!destino) return;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destino,
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
  const destino = process.env.NOTIFICACION_EMAIL;
  if (!destino) return;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destino,
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
