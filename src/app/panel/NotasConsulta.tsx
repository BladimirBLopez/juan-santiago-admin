"use client";

import { useState } from "react";

export default function NotasConsulta({
  consultaId,
  notasIniciales,
}: {
  consultaId: string;
  notasIniciales: string | null;
}) {
  const [notas, setNotas] = useState(notasIniciales ?? "");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [abierto, setAbierto] = useState(!!notasIniciales);

  async function guardar() {
    setGuardando(true);
    setGuardado(false);

    const res = await fetch(`/api/consultas/${consultaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notas }),
    });

    setGuardando(false);
    if (res.ok) {
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="mt-3 text-xs text-[#f5e6d3]/40 underline underline-offset-4"
      >
        📝 Agregar nota privada
      </button>
    );
  }

  return (
    <div className="mt-3">
      <label className="text-xs text-[#f5e6d3]/50 mb-1 block">
        Nota privada (no la ve el cliente)
      </label>
      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        rows={2}
        className="w-full text-xs rounded-lg border border-[#c9a24b]/20 bg-[#1a0505] text-[#f5e6d3] px-2.5 py-2 outline-none focus:border-[#c9a24b]/50"
        placeholder="Ej: pidió que la contactemos solo después de las 6pm..."
      />
      <div className="flex items-center gap-2 mt-1.5">
        <button
          onClick={guardar}
          disabled={guardando}
          className="text-xs text-[#c9a24b] disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar nota"}
        </button>
        {guardado && <span className="text-xs text-[#4a7c59]">✓ Guardado</span>}
      </div>
    </div>
  );
}
