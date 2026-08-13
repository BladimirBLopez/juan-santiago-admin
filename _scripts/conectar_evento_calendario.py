path = "src/app/api/citas/reservar/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificarNuevaCita } from "@/lib/email";'''

new = '''import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificarNuevaCita } from "@/lib/email";
import { crearEventoCalendario } from "@/lib/googleCalendar";'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''    await notificarNuevaCita({
      nombre: cliente.nombre,
      servicio,
      telefono: cliente.telefono,
      fechaCita: fechaCitaDate,
    });'''

new2 = '''    await notificarNuevaCita({
      nombre: cliente.nombre,
      servicio,
      telefono: cliente.telefono,
      fechaCita: fechaCitaDate,
    });

    await crearEventoCalendario({
      titulo: `${servicio === "CONSULTA_TAROT" ? "Tarot" : "Hojas de Coca"} - ${cliente.nombre}`,
      descripcion: `Cliente: ${cliente.nombre}\\nTeléfono: ${cliente.telefono ?? "no proporcionado"}`,
      inicio: fechaCitaDate,
    });'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK")
