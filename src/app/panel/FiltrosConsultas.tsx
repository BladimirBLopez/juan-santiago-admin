"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ESTADOS = [
  { value: "", label: "Todos" },
  { value: "NUEVO", label: "Nuevo" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "COMPLETADO", label: "Completado" },
];

export default function FiltrosConsultas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function aplicarFiltros(nuevoQ: string, nuevoEstado: string) {
    const params = new URLSearchParams();
    if (nuevoQ) params.set("q", nuevoQ);
    if (nuevoEstado) params.set("estado", nuevoEstado);
    router.push(`/panel?${params.toString()}`);
  }

  const estadoActual = searchParams.get("estado") ?? "";

  return (
    <div className="mb-4 space-y-2.5">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") aplicarFiltros(q, estadoActual);
        }}
        placeholder="Buscar por nombre..."
        className="w-full text-sm rounded-lg border border-[#262b35] bg-[#161a22] text-[#e8eaed] px-3 py-2 outline-none focus:border-[#c9a24b]/50"
      />
      <div className="flex gap-1.5 overflow-x-auto">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            onClick={() => aplicarFiltros(q, e.value)}
            className="text-xs px-3 py-1.5 rounded-md whitespace-nowrap transition"
            style={{
              backgroundColor: estadoActual === e.value ? "#c9a24b18" : "transparent",
              color: estadoActual === e.value ? "#c9a24b" : "#9099a8",
              border: `1px solid ${estadoActual === e.value ? "#c9a24b40" : "#262b35"}`,
            }}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}
