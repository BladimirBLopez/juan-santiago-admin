path = "src/lib/googleCalendar.ts"
with open(path, "r") as f:
    content = f.read()

old = '''export async function crearEventoCalendario({
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
}'''

new = '''export async function crearEventoCalendario({
  titulo,
  descripcion,
  inicio,
  finMinutos = 30,
}: {
  titulo: string;
  descripcion: string;
  inicio: Date;
  finMinutos?: number;
}): Promise<string | null> {
  try {
    const accessToken = await obtenerAccessToken();
    if (!accessToken) return null;

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
      return null;
    }

    const data = await res.json();
    return data.id ?? null;
  } catch (err) {
    console.error("Error en crearEventoCalendario:", err);
    return null;
  }
}

export async function eliminarEventoCalendario(eventId: string) {
  try {
    const accessToken = await obtenerAccessToken();
    if (!accessToken) return;

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!res.ok && res.status !== 410) {
      console.error("Error eliminando evento de Google Calendar:", await res.text());
    }
  } catch (err) {
    console.error("Error en eliminarEventoCalendario:", err);
  }
}'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
