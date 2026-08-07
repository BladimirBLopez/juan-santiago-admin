import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EstadoSelector from "./EstadoSelector";
import ProgresoTrabajo from "./ProgresoTrabajo";
import NotasConsulta from "./NotasConsulta";
import FiltrosConsultas from "./FiltrosConsultas";
import { MessageCircle, Calendar } from "lucide-react";
import AccionesConsulta from "./AccionesConsulta";
import EditarConsulta from "./EditarConsulta";
import LinkPago from "./LinkPago";
import PagosConsulta from "./PagosConsulta";

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
};

const ESTADO_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  NUEVO: { bg: "#e8752c1f", text: "#e8752c", label: "Nuevo" },
  EN_PROCESO: { bg: "#c9a24b1f", text: "#c9a24b", label: "En proceso" },
  COMPLETADO: { bg: "#4a9c6a1f", text: "#4a9c6a", label: "Completado" },
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
        <h1 className="text-xl font-semibold tracking-tight">Consultas</h1>
        {nuevos > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#e8752c1f] text-[#e8752c] font-medium">
            {nuevos} nueva{nuevos > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <FiltrosConsultas />

      <div className="space-y-3">
        {consultas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#5d6573] text-sm">No se encontraron consultas.</p>
          </div>
        )}

        {consultas.map((c) => {
          const badge = ESTADO_BADGE[c.estado];
          return (
            <div
              key={c.id}
              className="rounded-xl border border-[#1e232c] bg-[#12151b] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-[#1e232c] border border-[#262b35] flex items-center justify-center text-xs font-semibold text-[#c9a24b] shrink-0">
                    {iniciales(c.cliente.nombre)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#e8eaed] truncate leading-tight">
                      {c.cliente.nombre}
                    </p>
                    <p className="text-xs text-[#c9a24b] mt-0.5">
                      {SERVICIO_LABELS[c.servicio] ?? c.servicio}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[10px] px-2 py-1 rounded-full font-medium shrink-0"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {badge.label}
                </span>
              </div>

              <p className="text-sm text-[#c4c9d4] mt-3 leading-relaxed">
                {c.situacion}
              </p>

              <div className="flex items-center gap-3 mt-3 text-xs text-[#5d6573]">
                {c.cliente.telefono && (
                  <a
                    href={`https://wa.me/591${c.cliente.telefono.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#4a9c6a] hover:text-[#5bb87d] transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                    {c.cliente.telefono}
                  </a>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                  {new Date(c.createdAt).toLocaleDateString("es-BO", {
                    day: "2-digit",
                    month: "short",
                  })}
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
                  />
                );
              })()}

              <div className="mt-3 pt-3 border-t border-[#1e232c]">
                <EstadoSelector
                  consultaId={c.id}
                  estadoActual={c.estado}
                  fechaInicio={c.fechaInicio}
                />
                <div className="flex items-center justify-between gap-3 mt-1">
                  <LinkPago consultaId={c.id} />
                  <EditarConsulta
                    consultaId={c.id}
                    nombreInicial={c.cliente.nombre}
                    telefonoInicial={c.cliente.telefono}
                    situacionInicial={c.situacion}
                  />
                </div>
                <div className="mt-1">
                  <NotasConsulta consultaId={c.id} notasIniciales={c.notas} />
                </div>

                <PagosConsulta pagos={c.pagos} />
                <div className="mt-3 flex justify-end">
                  <AccionesConsulta consultaId={c.id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
