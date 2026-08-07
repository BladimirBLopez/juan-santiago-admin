"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ESTADOS = [
  { value: "NUEVO", label: "Nuevo", color: "#e8752c" },
  { value: "EN_PROCESO", label: "En proceso", color: "#c9a24b" },
  { value: "COMPLETADO", label: "Completado", color: "#4a9c6a" },
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
          className="w-full text-xs font-medium py-2 rounded-lg bg-[#c9a24b] text-[#0f1115] disabled:opacity-50 mb-2 hover:bg-[#d9b25b] transition"
        >
          {loading ? "Iniciando..." : "Iniciar trabajo"}
        </button>
      )}

      <div className="flex gap-1.5">
        {ESTADOS.map((estado) => {
          const activo = estado.value === estadoActual;
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
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{
                  backgroundColor: estado.color,
                  opacity: activo ? 1 : 0.4,
                }}
              />
              {estado.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
