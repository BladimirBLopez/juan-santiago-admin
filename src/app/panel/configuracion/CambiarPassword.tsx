"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

function CampoPassword({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed] px-3 py-2 pr-10 outline-none focus:border-[#6366f1]/50"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9099a8] hover:text-[#6366f1] transition"
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-4 w-4" strokeWidth={2} /> : <Eye className="h-4 w-4" strokeWidth={2} />}
      </button>
    </div>
  );
}

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
        <CampoPassword value={passwordActual} onChange={setPasswordActual} placeholder="Contraseña actual" />
        <CampoPassword value={passwordNueva} onChange={setPasswordNueva} placeholder="Nueva contraseña" />
        <CampoPassword value={passwordConfirmar} onChange={setPasswordConfirmar} placeholder="Confirmar nueva contraseña" />
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
