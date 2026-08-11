path = "src/app/panel/calendario/page.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''  const consultas = await prisma.consulta.findMany({
    include: { cliente: true },
    orderBy: { createdAt: "desc" },
  });'''

new = '''  const consultas = await prisma.consulta.findMany({
    where: { fechaCita: { not: null } },
    include: { cliente: true },
    orderBy: { createdAt: "desc" },
  });'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
