path = "src/app/panel/calendario/page.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''  const eventos = consultas.map((c) => ({
    id: c.id,
    clienteId: c.cliente.id,
    nombre: c.cliente.nombre,
    servicio: c.servicio,
    fecha: c.fechaCita ?? c.createdAt,
    fechaInicio: c.fechaInicio,
    esCita: Boolean(c.fechaCita),
    horaCita: c.fechaCita,
  }));'''

new = '''  const eventos = consultas.map((c) => ({
    id: c.id,
    clienteId: c.cliente.id,
    nombre: c.cliente.nombre,
    servicio: c.servicio,
    fecha: c.fechaCita ?? c.createdAt,
    fechaInicio: c.fechaInicio,
    esCita: Boolean(c.fechaCita),
    horaCita: c.fechaCita,
    estado: c.estado,
  }));'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
