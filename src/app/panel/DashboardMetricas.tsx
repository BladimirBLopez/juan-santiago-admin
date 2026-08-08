import { prisma } from "@/lib/prisma";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

export default async function DashboardMetricas() {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [consultasDelMes, pendientesPago, enProceso, pagosDelMes] = await Promise.all([
    prisma.consulta.count({ where: { createdAt: { gte: inicioMes } } }),
    prisma.pago.count({ where: { estado: "PENDIENTE" } }),
    prisma.consulta.count({ where: { estado: "EN_PROCESO" } }),
    prisma.pago.aggregate({
      where: { estado: "APROBADO", aprobadoAt: { gte: inicioMes } },
      _sum: { monto: true },
    }),
  ]);

  const totalCobrado = pagosDelMes._sum.monto ?? 0;

  const metricas = [
    {
      label: "Consultas este mes",
      valor: consultasDelMes,
      Icon: Users,
      color: "#6366f1",
    },
    {
      label: "En proceso",
      valor: enProceso,
      Icon: Clock,
      color: "#d97706",
    },
    {
      label: "Pagos pendientes",
      valor: pendientesPago,
      Icon: TrendingUp,
      color: "#e11d48",
    },
    {
      label: "Cobrado este mes",
      valor: `Bs ${totalCobrado}`,
      Icon: DollarSign,
      color: "#16a34a",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 mb-5">
      {metricas.map((m) => (
        <div
          key={m.label}
          className="rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-3.5"
        >
          <div className="flex items-center justify-between mb-1.5">
            <m.Icon className="h-4 w-4" style={{ color: m.color }} strokeWidth={2} />
          </div>
          <p className="text-xl font-semibold text-[#18181b] dark:text-[#e8eaed]">
            {m.valor}
          </p>
          <p className="text-[11px] text-[#71717a] mt-0.5">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
