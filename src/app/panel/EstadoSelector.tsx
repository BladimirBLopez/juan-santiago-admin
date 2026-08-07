"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ESTADOS = ["NUEVO", "EN_PROCESO", "COMPLETADO"];

const ESTADO_LABELS: Record<string, string> = {
  NUEVO: "Nuevo",
  EN_PROCESO: "En proceso",
  COMPLETADO: "Completado",
};

export default function EstadoSelector({
  consultaId,
  estadoActual,
}: {
  consultaId: string;
  estadoActual: string;
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

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div className="flex gap-1 mt-2">
      {ESTADOS.map((estado) => (
        <button
          key={estado}
          onClick={() => cambiarEstado(estado)}
          disabled={loading}
          className={`text-xs px-2 py-1 rounded transition disabled:opacity-50 ${
            estado === estadoActual
              ? "bg-amber-600 text-white"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
          }`}
        >
          {ESTADO_LABELS[estado]}
        </button>
      ))}
    </div>
  );
}
