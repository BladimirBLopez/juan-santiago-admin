"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AccionesConsulta({ consultaId }: { consultaId: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  async function eliminar() {
    setEliminando(true);
    const res = await fetch(`/api/consultas/${consultaId}`, {
      method: "DELETE",
    });
    setEliminando(false);
    if (res.ok) {
      toast.success("Consulta eliminada");
      router.refresh();
    } else {
      toast.error("No se pudo eliminar");
    }
  }

  if (confirmando) {
    return (
      <div className="rounded-lg border border-[#e8752c]/40 bg-[#e8752c]/5 p-3">
        <p className="text-xs text-[#e8752c] mb-2">¿Eliminar esta consulta? No se puede deshacer.</p>
        <div className="flex gap-2">
          <button
            onClick={eliminar}
            disabled={eliminando}
            className="flex-1 rounded-md bg-[#e8752c] text-white text-xs font-medium py-2 disabled:opacity-50"
          >
            {eliminando ? "Eliminando..." : "Sí, eliminar"}
          </button>
          <button
            onClick={() => setConfirmando(false)}
            className="flex-1 rounded-md border border-[#2a2a3d] text-[#9099a8] text-xs font-medium py-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#e8752c]/40 text-[#e8752c] text-xs font-medium py-2.5 hover:bg-[#e8752c0f] transition"
    >
      🗑️ Eliminar consulta
    </button>
  );
}
