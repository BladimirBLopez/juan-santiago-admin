path = "src/app/panel/page.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''import { prisma } from "@/lib/prisma";
import ProgresoTrabajo from "./ProgresoTrabajo";'''

new = '''import { prisma } from "@/lib/prisma";
import { completarCitasVencidas } from "@/lib/completarCitasVencidas";
import ProgresoTrabajo from "./ProgresoTrabajo";'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
