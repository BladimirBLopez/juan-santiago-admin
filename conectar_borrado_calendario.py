path = "src/app/api/consultas/[id]/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''  const { id } = await params;

  await prisma.consulta.delete({ where: { id } });

  return NextResponse.json({ success: true });
}'''

new = '''  const { id } = await params;

  const consultaAEliminar = await prisma.consulta.findUnique({
    where: { id },
    select: { googleEventId: true },
  });

  if (consultaAEliminar?.googleEventId) {
    await eliminarEventoCalendario(consultaAEliminar.googleEventId);
  }

  await prisma.consulta.delete({ where: { id } });

  return NextResponse.json({ success: true });
}'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
