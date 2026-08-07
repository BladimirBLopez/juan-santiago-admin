import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
  CONSULTA_TAROT: "Consulta de Tarot",
  CONSULTA_COCA: "Consulta de Hojas de Coca",
};

const ESTADO_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  NUEVO: { bg: "#f973161f", text: "#f97316", label: "Nuevo" },
  EN_PROCESO: { bg: "#8b5cf61f", text: "#8b5cf6", label: "En proceso" },
  COMPLETADO: { bg: "#22c55e1f", text: "#22c55e", label: "Completado" },
};

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: {
      consultas: {
        include: { pagos: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cliente) {
    return (
      <main className="px-4 py-5 max-w-2xl mx-auto">
        <p className="text-[#6b6b80] text-sm">Cliente no encontrado.</p>
      </main>
    );
  }

  const totalPagado = cliente.consultas
    .flatMap((c) => c.pagos)
    .filter((p) => p.estado === "APROBADO")
    .reduce((sum, p) => sum + p.monto, 0);

  return (
    <main className="px-4 py-5 max-w-2xl mx-auto">
      <Link
        href="/panel"
        className="inline-flex items-center gap-1 text-xs text-[#6b6b80] hover:text-[#9099a8] transition mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Volver a consultas
      </Link>

      <div className="rounded-xl border border-[#2a2a3d] bg-[#131319] p-4 mb-4">
        <h1 className="text-lg font-semibold text-[#e8eaed]">{cliente.nombre}</h1>
        {cliente.telefono && (
          <a
            href={`https://wa.me/591${cliente.telefono.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#22c55e] mt-1"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
            {cliente.telefono}
          </a>
        )}

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className="rounded-lg bg-[#0a0a0f] p-3">
            <p className="text-xl font-semibold text-[#e8eaed]">
              {cliente.consultas.length}
            </p>
            <p className="text-xs text-[#6b6b80] mt-0.5">Consultas totales</p>
          </div>
          <div className="rounded-lg bg-[#0a0a0f] p-3">
            <p className="text-xl font-semibold text-[#22c55e]">
              Bs {totalPagado}
            </p>
            <p className="text-xs text-[#6b6b80] mt-0.5">Total pagado</p>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-medium text-[#e8eaed] mb-2.5">
        Historial de consultas
      </h2>

      <div className="space-y-2.5">
        {cliente.consultas.map((c) => {
          const badge = ESTADO_BADGE[c.estado];
          return (
            <div
              key={c.id}
              className="rounded-lg border border-[#2a2a3d] bg-[#17171f] p-3"
            >
              <div className="flex justify-between items-start">
                <p className="text-xs text-[#8b5cf6] font-medium">
                  {SERVICIO_LABELS[c.servicio] ?? c.servicio}
                </p>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-[#9099a8] mt-1.5">{c.situacion}</p>
              <p className="text-[10px] text-[#6b6b80] mt-1.5">
                {new Date(c.createdAt).toLocaleDateString("es-BO", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              {c.pagos.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#2a2a3d] flex gap-2 flex-wrap">
                  {c.pagos.map((p) => (
                    <span
                      key={p.id}
                      className="text-[10px] px-2 py-0.5 rounded"
                      style={{
                        backgroundColor:
                          p.estado === "APROBADO" ? "#22c55e1f" : "#f973161f",
                        color: p.estado === "APROBADO" ? "#22c55e" : "#f97316",
                      }}
                    >
                      Bs {p.monto} · {p.estado}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
