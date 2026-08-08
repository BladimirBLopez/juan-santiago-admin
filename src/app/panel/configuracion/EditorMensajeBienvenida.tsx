"use client";

import { useState } from "react";
import { toast } from "sonner";

const MENSAJE_DEFAULT = "Hola, soy el asistente del Maestro Juan Santiago 🙏 ¿Cuál es tu nombre completo?";

export default function EditorMensajeBienvenida({ mensajeInicial }: { mensajeInicial: string }) {
  const [mensaje, setMensaje] = useState(mensajeInicial || MENSAJE_DEFAULT);
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    setGuardando(true);
    const res = await fetch("/api/configuracion", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave: "mensaje_bienvenida", valor: mensaje }),
    });
    setGuardando(false);
    if (res.ok) {
      toast.success("Mensaje actualizado");
    } else {
      toast.error("No se pudo guardar");
    }
  }

  return (
    <div className="rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
      <h2 className="text-sm font-medium text-[#18181b] dark:text-[#e8eaed] mb-1">
        Mensaje de bienvenida del chat
      </h2>
      <p className="text-xs text-[#71717a] mb-3">
        Primer mensaje que ve el cliente al abrir el chat en la web
      </p>
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        rows={3}
        className="w-full text-sm rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
      />
      <button
        onClick={guardar}
        disabled={guardando}
        className="mt-2 text-xs text-[#6366f1] font-medium disabled:opacity-50"
      >
        {guardando ? "Guardando..." : "Guardar mensaje"}
      </button>
    </div>
  );
}
