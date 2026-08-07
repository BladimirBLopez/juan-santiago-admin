"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5d6573]" strokeWidth={2} />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") aplicarFiltros(q, estadoActual);
          }}
          placeholder="Buscar por nombre"
          className="w-full text-sm rounded-lg border border-[#262b35] bg-[#161a22] text-[#e8eaed] pl-9 pr-9 py-2.5 outline-none focus:border-[#c9a24b]/50 transition placeholder:text-[#5d6573]"
        />
        {q && (
          <button
            onClick={() => {
              setQ("");
              aplicarFiltros("", estadoActual);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5d6573] hover:text-[#9099a8]"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="inline-flex p-0.5 rounded-lg bg-[#161a22] border border-[#262b35] gap-0.5">
        {ESTADOS.map((e) => {
          const activo = estadoActual === e.value;
          return (
            <button
              key={e.value}
              onClick={() => aplicarFiltros(q, e.value)}
              className="text-xs px-3 py-1.5 rounded-md whitespace-nowrap transition font-medium"
              style={{
                backgroundColor: activo ? "#c9a24b" : "transparent",
                color: activo ? "#0f1115" : "#9099a8",
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
