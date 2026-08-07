import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EstadoSelector from "./EstadoSelector";
import ProgresoTrabajo from "./ProgresoTrabajo";
import NotasConsulta from "./NotasConsulta";
import FiltrosConsultas from "./FiltrosConsultas";

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
};

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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Consultas</h1>
        {nuevos > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-[#e8752c]/15 text-[#e8752c] font-medium">
            {nuevos} nueva{nuevos > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <FiltrosConsultas />

      <div className="space-y-2.5">
        {consultas.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#9099a8] text-sm">Aún no llegaron consultas.</p>
          </div>
        )}

        {consultas.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-[#262b35] bg-[#161a22] p-4"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="font-medium text-[#e8eaed] truncate">
                  {c.cliente.nombre}
                </p>
                <p className="text-xs text-[#c9a24b] mt-0.5">
                  {SERVICIO_LABELS[c.servicio] ?? c.servicio}
                </p>
              </div>
              <span className="text-[10px] text-[#5d6573] shrink-0 pt-0.5">
                {new Date(c.createdAt).toLocaleDateString("es-BO", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>

            <p className="text-sm text-[#c4c9d4] mt-2.5 leading-relaxed">
              {c.situacion}
            </p>

            {c.cliente.telefono && (
              <a
                href={`https://wa.me/591${c.cliente.telefono.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2.5 text-xs text-[#4a9c6a]"
              >
                WhatsApp · {c.cliente.telefono}
              </a>
            )}

            {c.fechaInicio && c.diasTrabajo && (
              <ProgresoTrabajo
                fechaInicio={c.fechaInicio}
                diasTrabajo={c.diasTrabajo}
                nombreCliente={c.cliente.nombre}
                telefonoCliente={c.cliente.telefono}
              />
            )}

            <EstadoSelector
              consultaId={c.id}
              estadoActual={c.estado}
              fechaInicio={c.fechaInicio}
            />

            <NotasConsulta consultaId={c.id} notasIniciales={c.notas} />
          </div>
        ))}
      </div>
    </main>
  );
}
