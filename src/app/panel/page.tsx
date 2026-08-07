import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProgresoTrabajo from "./ProgresoTrabajo";
import FiltrosConsultas from "./FiltrosConsultas";
import { MessageCircle, Calendar } from "lucide-react";
import PagosConsulta from "./PagosConsulta";
import AccionesPanel from "./AccionesPanel";
import Link from "next/link";
import AvisoPagoPendiente from "./AvisoPagoPendiente";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
};

const SERVICIO_COLOR: Record<string, string> = {
  AMARRE: "#ec4899",
  UNION_PAREJA: "#8b5cf6",
  ENDULZAMIENTO: "#f59e0b",
  RETORNO: "#3b82f6",
  ALEJAMIENTO: "#64748b",
};

const ESTADO_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  NUEVO: { bg: "#f97316" + "1f", text: "#f97316", label: "Nuevo" },
  EN_PROCESO: { bg: "#8b5cf6" + "1f", text: "#8b5cf6", label: "En proceso" },
  COMPLETADO: { bg: "#22c55e" + "1f", text: "#22c55e", label: "Completado" },
};

function iniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { q, estado } = await searchParams;

  const consultas = await prisma.consulta.findMany({
    where: {
      ...(estado ? { estado: estado as "NUEVO" | "EN_PROCESO" | "COMPLETADO" } : {}),
      ...(q
        ? { cliente: { nombre: { contains: q, mode: "insensitive" } } }
        : {}),
    },
    include: { cliente: true, seguimientos: true, pagos: true },
    orderBy: { createdAt: "desc" },
  });

  const nuevos = consultas.filter((c) => c.estado === "NUEVO").length;

  return (
    <main className="px-4 py-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold tracking-tight text-[#0f0f14] dark:text-[#e8eaed]">Consultas</h1>
        {nuevos > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#f973161f] text-[#f97316] font-medium">
            {nuevos} nueva{nuevos > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <FiltrosConsultas />

      <div className="space-y-3">
        {consultas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6b6b80] dark:text-[#6b6b80] text-sm">No se encontraron consultas.</p>
          </div>
        )}

        {consultas.map((c) => {
          const badge = ESTADO_BADGE[c.estado];
          return (
            <div
              key={c.id}
              className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-gradient-to-b from-white to-[#fafafa] dark:from-[#17171f] dark:to-[#131319] p-4 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              style={{
                borderLeft: `3px solid ${SERVICIO_COLOR[c.servicio] ?? "#2a2a3d"}`,
                backgroundImage: `linear-gradient(135deg, ${SERVICIO_COLOR[c.servicio] ?? "#2a2a3d"}0d, transparent 60%)`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-[#8b5cf61a] border border-[#8b5cf640] flex items-center justify-center text-xs font-semibold text-[#a78bfa] shrink-0">
                    {iniciales(c.cliente.nombre)}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/panel/clientes/${c.cliente.id}`}
                      className="font-semibold text-[#0f0f14] dark:text-[#e8eaed] truncate leading-tight hover:text-[#8b5cf6] dark:hover:text-[#a78bfa] transition block"
                    >
                      {c.cliente.nombre}
                    </Link>
                    <p className="text-xs mt-0.5" style={{ color: SERVICIO_COLOR[c.servicio] ?? "#a78bfa" }}>
                      {SERVICIO_LABELS[c.servicio] ?? c.servicio}
                    </p>
                  </div>
                </div>
                <Badge
                  className="shrink-0 border-0"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {badge.label}
                </Badge>
              </div>

              <p className="text-sm text-[#4a4a5a] dark:text-[#c4c9d4] mt-3 leading-relaxed">
                {c.situacion}
              </p>

              <div className="flex items-center gap-3 mt-3 text-xs text-[#6b6b80] dark:text-[#6b6b80]">
                {c.cliente.telefono && (
                  <a
                    href={`https://wa.me/591${c.cliente.telefono.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#22c55e] hover:text-[#4ade80] transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                    {c.cliente.telefono}
                  </a>
                )}
                <span className="inline-flex items-center gap-1" title={new Date(c.createdAt).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })}>
                  <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>

              {c.fechaInicio && c.diasTrabajo && (() => {
                const avances = c.seguimientos
                  .filter((s) => s.tipo === "RECORDATORIO_AVANCE" && s.fechaEnvio)
                  .sort((a, b) => (b.fechaEnvio!.getTime() - a.fechaEnvio!.getTime()));
                const testimonioEnviado = c.seguimientos.some((s) => s.tipo === "TESTIMONIO");
                return (
                  <ProgresoTrabajo
                    consultaId={c.id}
                    fechaInicio={c.fechaInicio}
                    diasTrabajo={c.diasTrabajo}
                    nombreCliente={c.cliente.nombre}
                    telefonoCliente={c.cliente.telefono}
                    ultimoAvanceEnviado={avances[0]?.fechaEnvio ?? null}
                    testimonioEnviado={testimonioEnviado}
                    estadoActual={c.estado}
                  />
                );
              })()}

              <AvisoPagoPendiente
                fechaInicio={c.fechaInicio}
                tienePagoAprobado={c.pagos.some((p) => p.estado === "APROBADO")}
              />

              <PagosConsulta pagos={c.pagos} />

              <AccionesPanel
                consultaId={c.id}
                estadoActual={c.estado}
                fechaInicio={c.fechaInicio}
                notas={c.notas}
                nombreCliente={c.cliente.nombre}
                telefonoCliente={c.cliente.telefono}
                situacion={c.situacion}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}
