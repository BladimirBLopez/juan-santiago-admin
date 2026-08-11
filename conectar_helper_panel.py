path = "src/app/panel/page.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''  const session = await auth();
  if (!session) redirect("/login");

  const { q, estado } = await searchParams;

  const consultas = await prisma.consulta.findMany({'''

new = '''  const session = await auth();
  if (!session) redirect("/login");

  const { q, estado } = await searchParams;

  await completarCitasVencidas();

  const consultas = await prisma.consulta.findMany({'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
