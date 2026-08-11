path = "src/app/panel/calendario/page.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''import ConectarGoogle from "./ConectarGoogle";

export default async function CalendarioPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const conectado = !!(session as typeof session & { googleAccessToken?: string }).googleAccessToken;

  const consultas = await prisma.consulta.findMany({'''

new = '''import ConectarGoogle from "./ConectarGoogle";
import { completarCitasVencidas } from "@/lib/completarCitasVencidas";

export default async function CalendarioPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const conectado = !!(session as typeof session & { googleAccessToken?: string }).googleAccessToken;

  await completarCitasVencidas();

  const consultas = await prisma.consulta.findMany({'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
