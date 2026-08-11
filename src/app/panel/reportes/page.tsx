import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RenovacionCard from "./RenovacionCard";
import GraficoServicios from "./GraficoServicios";
import GraficoIngresos from "./GraficoIngresos";

const SERVICIO_COLOR: Record<string, string> = {
  AMARRE: "#e11d48",
  UNION_PAREJA: "#6366f1",
  ENDULZAMIENTO: "#d97706",
  RETORNO: "#2563eb",
  ALEJAMIENTO: "#52525b",
  CONSULTA_TAROT: "#0d9488",
  CONSULTA_COCA: "#65a30d",
};

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
  CONSULTA_TAROT: "Consulta de Tarot",
  CONSULTA_COCA: "Consulta de Hojas de Coca",
};

export default async function ReportesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [consultasDelMes, totalConsultas, porServicio, clientes, iniciados, completados] = await Promise.all([
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
    prisma.consulta.count({ where: { fechaInicio: { not: null } } }),
    prisma.consulta.count({ where: { estado: "COMPLETADO" } }),
  ]);

  const hace6Meses = new Date();
  hace6Meses.setMonth(hace6Meses.getMonth() - 5);
  hace6Meses.setDate(1);
  hace6Meses.setHours(0, 0, 0, 0);

  const pagosUltimos6Meses = await prisma.pago.findMany({
    where: { estado: "APROBADO", createdAt: { gte: hace6Meses } },
    select: { monto: true, createdAt: true },
  });

  const mesesArray = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    return d;
  });

  const datosIngresos = mesesArray.map((d) => {
    const total = pagosUltimos6Meses
      .filter(
        (p) =>
          p.createdAt.getMonth() === d.getMonth() &&
          p.createdAt.getFullYear() === d.getFullYear()
      )
      .reduce((sum, p) => sum + p.monto, 0);
    return {
      mes: d.toLocaleDateString("es-BO", { month: "short" }),
      monto: total,
    };
  });

  const tasaInicio = totalConsultas > 0 ? Math.round((iniciados / totalConsultas) * 100) : 0;
  const tasaCompletado = totalConsultas > 0 ? Math.round((completados / totalConsultas) * 100) : 0;

  const recurrentes = clientes
    .filter((c) => c._count.consultas > 1)
    .sort((a, b) => b._count.consultas - a._count.consultas);

  const clientesConUltimaConsulta = await prisma.cliente.findMany({
    include: {
      consultas: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const hoy = new Date();
  const paraRecontactar = clientesConUltimaConsulta
    .map((c) => {
      const ultima = c.consultas[0];
      if (!ultima) return null;
      const dias = Math.floor(
        (hoy.getTime() - new Date(ultima.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return { nombre: c.nombre, telefono: c.telefono, diasSinConsulta: dias };
    })
    .filter((c): c is { nombre: string; telefono: string | null; diasSinConsulta: number } => c !== null && c.diasSinConsulta >= 60)
    .sort((a, b) => b.diasSinConsulta - a.diasSinConsulta);

  return (
    <main className="px-4 py-5 max-w-2xl mx-auto space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-semibold text-[#0f0f14] dark:text-[#e8eaed]">Reportes</h1>
        <div className="flex items-center gap-3">
          <a
            href="/api/exportar-reporte"
            className="text-xs text-[#6366f1] hover:text-[#4f46e5] transition underline underline-offset-4"
          >
            Descargar PDF
          </a>
          <a
            href="/api/exportar-contactos"
            className="text-xs text-[#6366f1] hover:text-[#4f46e5] transition underline underline-offset-4"
          >
            Descargar contactos
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
          <p className="text-2xl font-semibold text-[#0f0f14] dark:text-[#e8eaed]">{consultasDelMes}</p>
          <p className="text-xs text-[#6b6b80] dark:text-[#9099a8] mt-1">Consultas este mes</p>
        </div>
        <div className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
          <p className="text-2xl font-semibold text-[#0f0f14] dark:text-[#e8eaed]">{totalConsultas}</p>
          <p className="text-xs text-[#6b6b80] dark:text-[#9099a8] mt-1">Consultas totales</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
        <h2 className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed] mb-3">Conversión</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#c4c9d4]">Consultas que iniciaron trabajo</span>
              <span className="text-[#6b6b80]">{iniciados} de {totalConsultas} ({tasaInicio}%)</span>
            </div>
            <div className="h-1 rounded-full bg-[#2a2a3d] overflow-hidden">
              <div className="h-full rounded-full bg-[#6366f1]" style={{ width: `${tasaInicio}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#c4c9d4]">Trabajos completados</span>
              <span className="text-[#6b6b80]">{completados} de {totalConsultas} ({tasaCompletado}%)</span>
            </div>
            <div className="h-1 rounded-full bg-[#2a2a3d] overflow-hidden">
              <div className="h-full rounded-full bg-[#22c55e]" style={{ width: `${tasaCompletado}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
        <h2 className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed] mb-3">
          Ingresos últimos 6 meses
        </h2>
        <GraficoIngresos datos={datosIngresos} />
      </div>

      <div className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
        <h2 className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed] mb-3">
          Servicios más pedidos
        </h2>
        <GraficoServicios
          datos={porServicio.map((s) => ({
            nombre: SERVICIO_LABELS[s.servicio] ?? s.servicio,
            cantidad: s._count.servicio,
            color: SERVICIO_COLOR[s.servicio] ?? "#6366f1",
          }))}
          total={totalConsultas}
        />
        {false && (
          <p className="text-xs text-[#6b6b80] dark:text-[#6b6b80]">Sin datos aún.</p>
        )}
      </div>

      <RenovacionCard clientes={paraRecontactar} />

      <div className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
        <h2 className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed] mb-3">
          Clientes recurrentes
        </h2>
        {recurrentes.length > 0 ? (
          <div className="space-y-2">
            {recurrentes.map((c) => (
              <div key={c.id} className="flex justify-between text-xs">
                <span className="text-[#c4c9d4]">{c.nombre}</span>
                <span className="text-[#22c55e]">{c._count.consultas} consultas</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#6b6b80] dark:text-[#6b6b80]">
            Aún no hay clientes que hayan vuelto más de una vez.
          </p>
        )}
      </div>
    </main>
  );
}
