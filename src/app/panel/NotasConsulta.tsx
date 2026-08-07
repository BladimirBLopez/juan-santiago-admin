"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NotasConsulta({
  consultaId,
  notasIniciales,
}: {
  consultaId: string;
  notasIniciales: string | null;
}) {
  const [notas, setNotas] = useState(notasIniciales ?? "");
  const [guardando, setGuardando] = useState(false);
  const [abierto, setAbierto] = useState(!!notasIniciales);

  async function guardar() {
    setGuardando(true);
    const res = await fetch(`/api/consultas/${consultaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notas }),
    });
    setGuardando(false);
    if (res.ok) {
      toast.success("Nota guardada");
    } else {
      toast.error("No se pudo guardar la nota");
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="mt-3 text-xs text-[#5d6573] hover:text-[#9099a8] transition"
      >
        + Agregar nota privada
      </button>
    );
  }

  return (
    <div className="mt-3">
      <label className="text-xs text-[#5d6573] mb-1 block">
        Nota privada
      </label>
      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        rows={2}
        className="w-full text-xs rounded-lg border border-[#262b35] bg-[#0f1115] text-[#e8eaed] px-2.5 py-2 outline-none focus:border-[#c9a24b]/50"
        placeholder="Ej: pidió que la contactemos solo después de las 6pm..."
      />
      <div className="flex items-center gap-2 mt-1.5">
        <button
          onClick={guardar}
          disabled={guardando}
          className="text-xs text-[#c9a24b] disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}
