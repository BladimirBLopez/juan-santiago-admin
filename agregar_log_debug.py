path = "src/app/api/citas/reservar/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''    const googleEventId = await crearEventoCalendario({
      titulo: `${servicio === "CONSULTA_TAROT" ? "Tarot" : "Hojas de Coca"} - ${cliente.nombre}`,
      descripcion: `Cliente: ${cliente.nombre}\\nTeléfono: ${cliente.telefono ?? "no proporcionado"}`,
      inicio: fechaCitaDate,
    });

    if (googleEventId) {
      await prisma.consulta.update({
        where: { id: consulta.id },
        data: { googleEventId },
      });
    }'''

new = '''    const googleEventId = await crearEventoCalendario({
      titulo: `${servicio === "CONSULTA_TAROT" ? "Tarot" : "Hojas de Coca"} - ${cliente.nombre}`,
      descripcion: `Cliente: ${cliente.nombre}\\nTeléfono: ${cliente.telefono ?? "no proporcionado"}`,
      inicio: fechaCitaDate,
    });

    console.log("DEBUG_GOOGLE_EVENT_ID:", googleEventId);

    if (googleEventId) {
      await prisma.consulta.update({
        where: { id: consulta.id },
        data: { googleEventId },
      });
      console.log("DEBUG_GUARDADO_OK");
    } else {
      console.log("DEBUG_NO_SE_GUARDO_PORQUE_ID_ES_NULL");
    }'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
