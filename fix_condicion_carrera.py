path = "src/app/api/citas/reservar/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''    const ocupada = await prisma.consulta.findFirst({
      where: {
        fechaCita: fechaCitaDate,
        OR: [
          { citaExpiraEn: { gt: new Date() } },
          { pagos: { some: { estado: "APROBADO" } } },
        ],
      },
    });

    if (ocupada) {
      return NextResponse.json(
        { error: "Ese horario ya no esta disponible" },
        { status: 409, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const citaExpiraEn = new Date(Date.now() + MINUTOS_RESERVA * 60000);

    const cliente = await prisma.cliente.create({
      data: {
        nombre: nombre.trim(),
        telefono: telefono ? String(telefono).trim() : null,
        consultas: {
          create: {
            servicio,
            situacion: situacion ? String(situacion).trim() : "Cita por videollamada",
            fechaCita: fechaCitaDate,
            citaExpiraEn,
          },
        },
      },
      include: { consultas: true },
    });

    const consulta = cliente.consultas[0];'''

new = '''    const citaExpiraEn = new Date(Date.now() + MINUTOS_RESERVA * 60000);

    let cliente;
    try {
      cliente = await prisma.$transaction(async (tx) => {
        const ocupada = await tx.consulta.findFirst({
          where: {
            fechaCita: fechaCitaDate,
            OR: [
              { citaExpiraEn: { gt: new Date() } },
              { pagos: { some: { estado: "APROBADO" } } },
            ],
          },
        });

        if (ocupada) {
          throw new Error("HORARIO_OCUPADO");
        }

        return tx.cliente.create({
          data: {
            nombre: nombre.trim(),
            telefono: telefono ? String(telefono).trim() : null,
            consultas: {
              create: {
                servicio,
                situacion: situacion ? String(situacion).trim() : "Cita por videollamada",
                fechaCita: fechaCitaDate,
                citaExpiraEn,
              },
            },
          },
          include: { consultas: true },
        });
      }, { isolationLevel: "Serializable" });
    } catch (err) {
      if (err instanceof Error && err.message === "HORARIO_OCUPADO") {
        return NextResponse.json(
          { error: "Ese horario ya no esta disponible" },
          { status: 409, headers: corsHeaders(req.headers.get("origin")) }
        );
      }
      throw err;
    }

    const consulta = cliente.consultas[0];'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
