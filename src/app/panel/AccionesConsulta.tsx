"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      router.refresh();
    }
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#e8752c]">¿Eliminar esta consulta?</span>
        <button
          onClick={eliminar}
          disabled={eliminando}
          className="text-[#e8752c] font-medium underline disabled:opacity-50"
        >
          {eliminando ? "Eliminando..." : "Sí, eliminar"}
        </button>
        <button
          onClick={() => setConfirmando(false)}
          className="text-[#5d6573] underline"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="text-xs text-[#5d6573] hover:text-[#e8752c] transition"
    >
      Eliminar consulta
    </button>
  );
}
