path = "src/lib/completarCitasVencidas.ts"
content = '''import { prisma } from "@/lib/prisma";

export async function completarCitasVencidas() {
  const ahora = new Date();
  await prisma.consulta.updateMany({
    where: {
      fechaCita: { lt: ahora },
      estado: { not: "COMPLETADO" },
      pagos: { some: { estado: "APROBADO" } },
    },
    data: { estado: "COMPLETADO" },
  });
}
'''

with open(path, "w") as f:
    f.write(content)

print("OK")
