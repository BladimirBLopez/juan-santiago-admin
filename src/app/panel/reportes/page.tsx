import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
};

export default async function ReportesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [consultasDelMes, totalConsultas, porServicio, clientes] = await Promise.all([
    prisma.consulta.count({ where: { createdAt: { gte: inicioMes } } }),
    prisma.consulta.count(),
    prisma.consulta.groupBy({
      by: ["servicio"],
      _count: { servicio: true },
      orderBy: { _count: { servicio: "desc" } },
    }),
    prisma.cliente.findMany({
      include: { _count: { select: { consultas: true } } },
    }),
  ]);

  const recurrentes = clientes
    .filter((c) => c._count.consultas > 1)
    .sort((a, b) => b._count.consultas - a._count.consultas);

  return (
    <main className="px-4 py-5 max-w-2xl mx-auto space-y-3">
      <h1 className="text-lg font-semibold mb-1">Reportes</h1>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-[#262b35] bg-[#161a22] p-4">
          <p className="text-2xl font-semibold text-[#e8eaed]">{consultasDelMes}</p>
          <p className="text-xs text-[#9099a8] mt-1">Consultas este mes</p>
        </div>
        <div className="rounded-xl border border-[#262b35] bg-[#161a22] p-4">
          <p className="text-2xl font-semibold text-[#e8eaed]">{totalConsultas}</p>
          <p className="text-xs text-[#9099a8] mt-1">Consultas totales</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#262b35] bg-[#161a22] p-4">
        <h2 className="text-sm font-medium text-[#e8eaed] mb-3">
          Servicios más pedidos
        </h2>
        {porServicio.length > 0 ? (
          <div className="space-y-2.5">
            {porServicio.map((s) => {
              const pct = totalConsultas > 0 ? (s._count.servicio / totalConsultas) * 100 : 0;
              return (
                <div key={s.servicio}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#c4c9d4]">
                      {SERVICIO_LABELS[s.servicio] ?? s.servicio}
                    </span>
                    <span className="text-[#5d6573]">{s._count.servicio}</span>
                  </div>
                  <div className="h-1 rounded-full bg-[#262b35] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#c9a24b]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#5d6573]">Sin datos aún.</p>
        )}
      </div>

      <div className="rounded-xl border border-[#262b35] bg-[#161a22] p-4">
        <h2 className="text-sm font-medium text-[#e8eaed] mb-3">
          Clientes recurrentes
        </h2>
        {recurrentes.length > 0 ? (
          <div className="space-y-2">
            {recurrentes.map((c) => (
              <div key={c.id} className="flex justify-between text-xs">
                <span className="text-[#c4c9d4]">{c.nombre}</span>
                <span className="text-[#4a9c6a]">{c._count.consultas} consultas</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#5d6573]">
            Aún no hay clientes que hayan vuelto más de una vez.
          </p>
        )}
      </div>
    </main>
  );
}
