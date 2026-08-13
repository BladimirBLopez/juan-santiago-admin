path = "src/app/api/citas/reservar/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''    await crearEventoCalendario({
      titulo: `${servicio === "CONSULTA_TAROT" ? "Tarot" : "Hojas de Coca"} - ${cliente.nombre}`,
      descripcion: `Cliente: ${cliente.nombre}\\nTeléfono: ${cliente.telefono ?? "no proporcionado"}`,
      inicio: fechaCitaDate,
    });'''

new = '''    const googleEventId = await crearEventoCalendario({
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

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
