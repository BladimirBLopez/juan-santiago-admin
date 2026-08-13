path2 = "src/app/api/consultas/manual/route.ts"
with open(path2, "r") as f:
    c2 = f.read()

old4 = '''    const clienteIdFinal = cliente.id;

    const precio = await prisma.precio.findUnique({ where: { servicio } });
    const monto = precio?.monto ?? PRECIO_DEFECTO[servicio];

    const consulta = await prisma.consulta.create({
      data: {
        clienteId: clienteIdFinal,
        servicio,
        situacion: situacion?.trim() || "Agregado manualmente por el Maestro",
        estado: yaPagado ? "EN_PROCESO" : "NUEVO",
        fechaInicio: yaPagado ? new Date() : null,
        diasTrabajo: yaPagado ? DIAS_POR_SERVICIO[servicio] ?? null : null,
      },'''
new4 = '''    const clienteIdFinal = cliente.id;

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
      },'''
assert c2.count(old4) == 1
c2 = c2.replace(old4, new4)

with open(path2, "w") as f:
    f.write(c2)

print("OK 2")
