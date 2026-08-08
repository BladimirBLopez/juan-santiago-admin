"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function EditorHorario({ horarioInicial }: { horarioInicial: string }) {
  const [horario, setHorario] = useState(horarioInicial);
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    setGuardando(true);
    const res = await fetch("/api/configuracion", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave: "horario_atencion", valor: horario }),
    });
    setGuardando(false);
    if (res.ok) {
      toast.success("Horario actualizado");
    } else {
      toast.error("No se pudo guardar");
    }
  }

  return (
    <div className="rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
      <h2 className="text-sm font-medium text-[#18181b] dark:text-[#e8eaed] mb-1">
        Horario de atención
      </h2>
      <p className="text-xs text-[#71717a] mb-3">
        Visible en el landing y el chat
      </p>
      <input
        type="text"
        value={horario}
        onChange={(e) => setHorario(e.target.value)}
        placeholder="Ej: Lunes a sábado, 9am - 8pm"
        className="w-full text-sm rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
      />
      <button
        onClick={guardar}
        disabled={guardando}
        className="mt-2 text-xs text-[#6366f1] font-medium disabled:opacity-50"
      >
        {guardando ? "Guardando..." : "Guardar horario"}
      </button>
    </div>
  );
}
