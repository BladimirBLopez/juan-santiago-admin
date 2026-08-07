import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
    prisma.consulta.count({
      where: { createdAt: { gte: inicioMes } },
    }),
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

  const servicioTop = porServicio[0];

  return (
    <div className="min-h-screen bg-[#1a0505] text-[#f5e6d3]">
      <header className="border-b border-[#c9a24b]/20 px-5 py-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9a24b]">
              Altar del Tata Bombori
            </p>
            <h1
              className="text-xl text-[#f0d78c] mt-0.5"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Reportes
            </h1>
          </div>
          <Link href="/panel" className="text-xs text-[#f5e6d3]/50 underline underline-offset-4">
            Ver consultas
          </Link>
        </div>
      </header>

      <main className="px-4 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#c9a24b]/20 bg-[#2a0a12] p-4">
            <p className="text-2xl font-bold text-[#f0d78c]">{consultasDelMes}</p>
            <p className="text-xs text-[#f5e6d3]/60 mt-1">Consultas este mes</p>
          </div>
          <div className="rounded-2xl border border-[#c9a24b]/20 bg-[#2a0a12] p-4">
            <p className="text-2xl font-bold text-[#f0d78c]">{totalConsultas}</p>
            <p className="text-xs text-[#f5e6d3]/60 mt-1">Consultas totales</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#c9a24b]/20 bg-[#2a0a12] p-4">
          <h2 className="text-sm font-semibold text-[#c9a24b] mb-3">
            Servicios más pedidos
          </h2>
          {servicioTop ? (
            <div className="space-y-2">
              {porServicio.map((s) => {
                const pct = totalConsultas > 0 ? (s._count.servicio / totalConsultas) * 100 : 0;
                return (
                  <div key={s.servicio}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{SERVICIO_LABELS[s.servicio] ?? s.servicio}</span>
                      <span className="text-[#f5e6d3]/50">{s._count.servicio}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1a0505] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#c9a24b] to-[#f0d78c]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#f5e6d3]/40">Sin datos aún.</p>
          )}
        </div>

        <div className="rounded-2xl border border-[#c9a24b]/20 bg-[#2a0a12] p-4">
          <h2 className="text-sm font-semibold text-[#c9a24b] mb-3">
            Clientes recurrentes
          </h2>
          {recurrentes.length > 0 ? (
            <div className="space-y-2">
              {recurrentes.map((c) => (
                <div key={c.id} className="flex justify-between text-xs">
                  <span>{c.nombre}</span>
                  <span className="text-[#4a7c59]">{c._count.consultas} consultas</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#f5e6d3]/40">
              Aún no hay clientes que hayan vuelto más de una vez.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
