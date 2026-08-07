import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EstadoSelector from "./EstadoSelector";
import ProgresoTrabajo from "./ProgresoTrabajo";
import Link from "next/link";

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
};

export default async function PanelPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const consultas = await prisma.consulta.findMany({
    include: { cliente: true },
    orderBy: { createdAt: "desc" },
  });

  const nuevos = consultas.filter((c) => c.estado === "NUEVO").length;

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
              Consultas
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/panel/reportes" className="text-xs text-[#c9a24b] underline underline-offset-4">
              Reportes
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="text-xs text-[#f5e6d3]/50 underline underline-offset-4">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
        {nuevos > 0 && (
          <p className="mt-2 text-xs text-[#e8752c]">
            {nuevos} consulta{nuevos > 1 ? "s" : ""} nueva{nuevos > 1 ? "s" : ""} sin atender
          </p>
        )}
      </header>

      <main className="px-4 py-5 space-y-3">
        {consultas.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#f5e6d3]/40 text-sm">
              Aún no llegaron consultas.
            </p>
          </div>
        )}

        {consultas.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-[#c9a24b]/20 bg-[#2a0a12] p-4"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-[#f5e6d3] truncate">
                  {c.cliente.nombre}
                </p>
                <p className="text-xs text-[#c9a24b] mt-0.5">
                  {SERVICIO_LABELS[c.servicio] ?? c.servicio}
                </p>
              </div>
              <span className="text-[10px] text-[#f5e6d3]/40 shrink-0 pt-0.5">
                {new Date(c.createdAt).toLocaleDateString("es-BO", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>

            <p className="text-sm text-[#f5e6d3]/80 mt-3 leading-relaxed">
              {c.situacion}
            </p>

            {c.cliente.telefono && (
              <a
                href={`https://wa.me/591${c.cliente.telefono.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs text-[#4a7c59]"
              >
                💬 {c.cliente.telefono}
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
          </div>
        ))}
      </main>
    </div>
  );
}
