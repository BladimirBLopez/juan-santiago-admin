"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function CambiarPassword() {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (passwordNueva !== passwordConfirmar) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    setGuardando(true);
    const res = await fetch("/api/cambiar-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passwordActual, passwordNueva }),
    });
    setGuardando(false);

    if (res.ok) {
      toast.success("Contraseña actualizada");
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirmar("");
    } else {
      const data = await res.json();
      toast.error(data.error ?? "No se pudo cambiar la contraseña");
    }
  }

  return (
    <div className="rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
      <h2 className="text-sm font-medium text-[#18181b] dark:text-[#e8eaed] mb-1">
        Cambiar contraseña
      </h2>
      <p className="text-xs text-[#71717a] mb-3">
        Acceso al panel del Maestro
      </p>

      <div className="space-y-2.5">
        <input
          type="password"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          placeholder="Contraseña actual"
          className="w-full text-sm rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
        />
        <input
          type="password"
          value={passwordNueva}
          onChange={(e) => setPasswordNueva(e.target.value)}
          placeholder="Nueva contraseña"
          className="w-full text-sm rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
        />
        <input
          type="password"
          value={passwordConfirmar}
          onChange={(e) => setPasswordConfirmar(e.target.value)}
          placeholder="Confirmar nueva contraseña"
          className="w-full text-sm rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
        />
      </div>

      <button
        onClick={guardar}
        disabled={guardando || !passwordActual || !passwordNueva}
        className="mt-3 text-xs text-[#6366f1] font-medium disabled:opacity-50"
      >
        {guardando ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </div>
  );
}
