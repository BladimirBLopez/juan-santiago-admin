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
  CONSULTA_TAROT: "Consulta de Tarot",
  CONSULTA_COCA: "Consulta de Hojas de Coca",
};

const SERVICIO_COLOR: Record<string, string> = {
  AMARRE: "#e11d48",
  UNION_PAREJA: "#6366f1",
  ENDULZAMIENTO: "#d97706",
  RETORNO: "#2563eb",
  ALEJAMIENTO: "#52525b",
  CONSULTA_TAROT: "#0d9488",
  CONSULTA_COCA: "#65a30d",
};

const ESTADO_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  NUEVO: { bg: "#fff7ed", text: "#c2410c", label: "Nuevo" },
  EN_PROCESO: { bg: "#eef2ff", text: "#4338ca", label: "En proceso" },
  COMPLETADO: { bg: "#f0fdf4", text: "#15803d", label: "Completado" },
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
    <main className="px-5 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#18181b] dark:text-[#e8eaed]">
          Consultas
        </h1>
        {nuevos > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#fff7ed] text-[#c2410c] font-medium">
            {nuevos} nueva{nuevos > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <FiltrosConsultas />

      <div className="space-y-2.5">
        {consultas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#a1a1aa] text-sm">No se encontraron consultas.</p>
          </div>
        )}

        {consultas.map((c) => {
          const badge = ESTADO_BADGE[c.estado];
          return (
            <div
              key={c.id}
              className="rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow"
              style={{ borderLeft: `3px solid ${SERVICIO_COLOR[c.servicio] ?? "#e4e4e7"}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-[#f4f4f5] dark:bg-[#1e232c] border border-[#e4e4e7] dark:border-[#2a2a3d] flex items-center justify-center text-[11px] font-medium text-[#52525b] dark:text-[#a1a1aa] shrink-0">
                    {iniciales(c.cliente.nombre)}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/panel/clientes/${c.cliente.id}`}
                      className="font-medium text-[15px] text-[#18181b] dark:text-[#e8eaed] truncate leading-tight hover:text-[#6366f1] transition block"
                    >
                      {c.cliente.nombre}
                    </Link>
                    <p className="text-[13px] mt-0.5" style={{ color: SERVICIO_COLOR[c.servicio] ?? "#71717a" }}>
                      {SERVICIO_LABELS[c.servicio] ?? c.servicio}
                    </p>
                  </div>
                </div>
                <Badge
                  className="shrink-0 border-0 font-medium text-[11px]"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {badge.label}
                </Badge>
              </div>

              <p className="text-[13px] text-[#3f3f46] dark:text-[#c4c9d4] mt-3 leading-relaxed">
                {c.situacion}
              </p>

              <div className="flex items-center gap-3 mt-3 text-xs text-[#a1a1aa]">
                {c.cliente.telefono && (
                  <a
                    href={`https://wa.me/591${c.cliente.telefono.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#16a34a] hover:text-[#15803d] transition"
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
