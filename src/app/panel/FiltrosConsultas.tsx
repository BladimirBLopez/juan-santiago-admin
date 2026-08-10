"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

const ESTADOS = [
  { value: "", label: "Todos" },
  { value: "NUEVO", label: "Nuevo" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "COMPLETADO", label: "Completado" },
  { value: "ABANDONADA", label: "Abandonadas" },
];

export default function FiltrosConsultas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const estadoActual = searchParams.get("estado") ?? "";

  function aplicarFiltros(nuevoQ: string, nuevoEstado: string) {
    const params = new URLSearchParams();
    if (nuevoQ) params.set("q", nuevoQ);
    if (nuevoEstado) params.set("estado", nuevoEstado);
    router.push(`/panel?${params.toString()}`);
  }

  return (
    <div className="mb-5 space-y-2.5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b80]" strokeWidth={2} />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") aplicarFiltros(q, estadoActual);
          }}
          placeholder="Buscar por nombre"
          className="w-full text-sm rounded-lg border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] text-[#0f0f14] dark:text-[#e8eaed] pl-9 pr-9 py-2.5 outline-none focus:border-[#6366f1]/50 transition placeholder:text-[#6b6b80]"
        />
        {q && (
          <button
            onClick={() => {
              setQ("");
              aplicarFiltros("", estadoActual);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b80] hover:text-[#9099a8]"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="flex p-0.5 rounded-lg bg-white dark:bg-[#131319] border border-[#e5e5eb] dark:border-[#2a2a3d] gap-0.5 overflow-x-auto max-w-full">
        {ESTADOS.map((e) => {
          const activo = estadoActual === e.value;
          return (
            <button
              key={e.value}
              onClick={() => aplicarFiltros(q, e.value)}
              className="text-xs px-3 py-1.5 rounded-md whitespace-nowrap transition font-medium"
              style={{
                backgroundColor: activo ? "#6366f1" : "transparent",
                color: activo ? "#0a0a0f" : "#9099a8",
              }}
            >
              {e.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
