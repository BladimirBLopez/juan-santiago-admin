"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Circle, Loader2, CheckCircle2, Flame } from "lucide-react";

const ESTADOS = [
  { value: "NUEVO", label: "Nuevo", color: "#e8752c", Icon: Circle },
  { value: "EN_PROCESO", label: "En proceso", color: "#c9a24b", Icon: Loader2 },
  { value: "COMPLETADO", label: "Completado", color: "#4a9c6a", Icon: CheckCircle2 },
];

export default function EstadoSelector({
  consultaId,
  estadoActual,
  fechaInicio,
}: {
  consultaId: string;
  estadoActual: string;
  fechaInicio: Date | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function cambiarEstado(nuevoEstado: string) {
    if (nuevoEstado === estadoActual) return;
    setLoading(true);
    const res = await fetch(`/api/consultas/${consultaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  async function iniciarTrabajo() {
    setLoading(true);
    const res = await fetch(`/api/consultas/${consultaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iniciarTrabajo: true }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-3">
      {estadoActual === "NUEVO" && !fechaInicio && (
        <button
          onClick={iniciarTrabajo}
          disabled={loading}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-[#c9a24b] text-[#0f1115] disabled:opacity-50 mb-2 hover:bg-[#d9b25b] transition"
        >
          <Flame className="h-3.5 w-3.5" strokeWidth={2} />
          {loading ? "Iniciando..." : "Iniciar trabajo"}
        </button>
      )}

      <div className="flex gap-1.5">
        {ESTADOS.map((estado) => {
          const activo = estado.value === estadoActual;
          const Icon = estado.Icon;
          return (
            <button
              key={estado.value}
              onClick={() => cambiarEstado(estado.value)}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition disabled:opacity-50"
              style={{
                borderColor: activo ? estado.color : "#262b35",
                backgroundColor: activo ? `${estado.color}18` : "transparent",
                color: activo ? estado.color : "#9099a8",
              }}
            >
              <Icon className="h-3 w-3" strokeWidth={2.5} />
              {estado.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
