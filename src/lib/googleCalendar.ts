import { prisma } from "@/lib/prisma";

async function obtenerAccessToken(): Promise<string | null> {
  const config = await prisma.configuracion.findUnique({
    where: { clave: "google_refresh_token" },
  });
  if (!config) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: config.valor,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    console.error("Error renovando token de Google:", await res.text());
    return null;
  }

  const data = await res.json();
  return data.access_token ?? null;
}

export async function crearEventoCalendario({
  titulo,
  descripcion,
  inicio,
  finMinutos = 30,
}: {
  titulo: string;
  descripcion: string;
  inicio: Date;
  finMinutos?: number;
}) {
  try {
    const accessToken = await obtenerAccessToken();
    if (!accessToken) return;

    const fin = new Date(inicio.getTime() + finMinutos * 60000);

    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: titulo,
          description: descripcion,
          start: { dateTime: inicio.toISOString(), timeZone: "America/La_Paz" },
          end: { dateTime: fin.toISOString(), timeZone: "America/La_Paz" },
        }),
      }
    );

    if (!res.ok) {
      console.error("Error creando evento en Google Calendar:", await res.text());
    }
  } catch (err) {
    console.error("Error en crearEventoCalendario:", err);
  }
}
