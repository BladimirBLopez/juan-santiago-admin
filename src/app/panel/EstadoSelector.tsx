"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ESTADOS = [
  { value: "NUEVO", label: "Nuevo", color: "#e8752c" },
  { value: "EN_PROCESO", label: "En proceso", color: "#c9a24b" },
  { value: "COMPLETADO", label: "Completado", color: "#4a7c59" },
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
          className="w-full text-xs font-semibold py-2 rounded-full bg-gradient-to-b from-[#e6c476] to-[#c9a24b] text-[#1a0505] disabled:opacity-50 mb-2"
        >
          {loading ? "Iniciando..." : "🕯️ Iniciar trabajo espiritual"}
        </button>
      )}

      <div className="flex gap-2">
        {ESTADOS.map((estado) => {
          const activo = estado.value === estadoActual;
          return (
            <button
              key={estado.value}
              onClick={() => cambiarEstado(estado.value)}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition disabled:opacity-50"
              style={{
                borderColor: activo ? estado.color : "rgba(201,162,75,0.2)",
                backgroundColor: activo ? `${estado.color}22` : "transparent",
                color: activo ? estado.color : "#f5e6d3aa",
              }}
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{
                  backgroundColor: estado.color,
                  opacity: activo ? 1 : 0.35,
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
