path = "src/app/api/consultas/manual/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''  try {
    const body = await req.json();
    const { clienteId, servicio, situacion, yaPagado } = body;

    if (!clienteId || typeof clienteId !== "string") {
      return NextResponse.json({ error: "Cliente invalido" }, { status: 400 });
    }
    if (!servicio || !(servicio in PRECIO_DEFECTO)) {
      return NextResponse.json({ error: "Servicio invalido" }, { status: 400 });
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }'''

new = '''  try {
    const body = await req.json();
    const { clienteId, nombre, telefono, servicio, situacion, yaPagado } = body;

    if (!servicio || !(servicio in PRECIO_DEFECTO)) {
      return NextResponse.json({ error: "Servicio invalido" }, { status: 400 });
    }

    let cliente;

    if (clienteId && typeof clienteId === "string") {
      // Se especifico un cliente existente puntual (ej. desde su perfil)
      cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) {
        return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
      }
    } else {
      // Alta manual: nombre + telefono
      if (!nombre || typeof nombre !== "string" || nombre.trim().length < 2) {
        return NextResponse.json({ error: "Nombre invalido" }, { status: 400 });
      }

      const telefonoLimpio = telefono ? String(telefono).replace(/\\D/g, "") : null;

      // Solo reutilizamos un cliente existente si coincide el TELEFONO (nunca por nombre)
      if (telefonoLimpio) {
        cliente = await prisma.cliente.findFirst({ where: { telefono: telefonoLimpio } });
      }

      if (!cliente) {
        cliente = await prisma.cliente.create({
          data: { nombre: nombre.trim(), telefono: telefonoLimpio },
        });
      }
    }

    const clienteIdFinal = cliente.id;'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''    const consulta = await prisma.consulta.create({
      data: {
        clienteId,'''

new2 = '''    const consulta = await prisma.consulta.create({
      data: {
        clienteId: clienteIdFinal,'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK")
