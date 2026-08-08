"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function EditorPrecios({
  servicio,
  label,
  montoInicial,
}: {
  servicio: string;
  label: string;
  montoInicial: number;
}) {
  const [monto, setMonto] = useState(String(montoInicial));
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    setGuardando(true);
    const res = await fetch("/api/precios", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servicio, monto }),
    });
    setGuardando(false);
    if (res.ok) {
      toast.success(`Precio de ${label} actualizado`);
    } else {
      toast.error("No se pudo actualizar");
    }
  }

  return (
    <div className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4 flex items-center justify-between gap-3">
      <span className="text-sm text-[#0f0f14] dark:text-[#e8eaed]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#6b6b80] dark:text-[#6b6b80]">Bs</span>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-20 text-sm rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] px-2 py-1.5 outline-none focus:border-[#6366f1]/50"
        />
        <button
          onClick={guardar}
          disabled={guardando}
          className="text-xs text-[#6366f1] font-medium disabled:opacity-50"
        >
          {guardando ? "..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}
