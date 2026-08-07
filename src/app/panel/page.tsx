import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EstadoSelector from "./EstadoSelector";
import ProgresoTrabajo from "./ProgresoTrabajo";
import NotasConsulta from "./NotasConsulta";
import FiltrosConsultas from "./FiltrosConsultas";
import AccionesConsulta from "./AccionesConsulta";
import EditarConsulta from "./EditarConsulta";

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
    include: { cliente: true },
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
                    <svg className="h-3.5 w-3.5" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M16.04 3C9.37 3 3.98 8.39 3.98 15.06c0 2.24.6 4.34 1.65 6.15L3 29l7.98-2.6a12.03 12.03 0 0 0 5.06 1.11h.01c6.67 0 12.06-5.39 12.06-12.06C28.11 8.79 22.71 3 16.04 3z"/>
                    </svg>
                    {c.cliente.telefono}
                  </a>
                )}
                <span className="inline-flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(c.createdAt).toLocaleDateString("es-BO", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>

              {c.fechaInicio && c.diasTrabajo && (
                <ProgresoTrabajo
                  fechaInicio={c.fechaInicio}
                  diasTrabajo={c.diasTrabajo}
                  nombreCliente={c.cliente.nombre}
                  telefonoCliente={c.cliente.telefono}
                />
              )}

              <div className="mt-3 pt-3 border-t border-[#1e232c]">
                <EstadoSelector
                  consultaId={c.id}
                  estadoActual={c.estado}
                  fechaInicio={c.fechaInicio}
                />
                <NotasConsulta consultaId={c.id} notasIniciales={c.notas} />
                <EditarConsulta
                  consultaId={c.id}
                  nombreInicial={c.cliente.nombre}
                  telefonoInicial={c.cliente.telefono}
                  situacionInicial={c.situacion}
                />
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
