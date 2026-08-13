path = "src/app/panel/page.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''import { prisma } from "@/lib/prisma";
import { completarCitasVencidas } from "@/lib/completarCitasVencidas";
import ProgresoTrabajo from "./ProgresoTrabajo";'''

new = '''import { prisma } from "@/lib/prisma";
import { completarCitasVencidas } from "@/lib/completarCitasVencidas";
import NuevoClienteManual from "./NuevoClienteManual";
import ProgresoTrabajo from "./ProgresoTrabajo";'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#18181b] dark:text-[#e8eaed]">
          Consultas
        </h1>
        {nuevos > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#fff7ed] text-[#c2410c] font-medium">
            {nuevos} nueva{nuevos > 1 ? "s" : ""}
          </span>
        )}
      </div>'''

new2 = '''      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#18181b] dark:text-[#e8eaed]">
          Consultas
        </h1>
        <div className="flex items-center gap-2">
          {nuevos > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#fff7ed] text-[#c2410c] font-medium">
              {nuevos} nueva{nuevos > 1 ? "s" : ""}
            </span>
          )}
          <NuevoClienteManual />
        </div>
      </div>'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK")
