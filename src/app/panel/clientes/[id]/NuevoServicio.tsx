"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const SERVICIOS = [
  { value: "AMARRE", label: "Amarre de Amor" },
  { value: "ENDULZAMIENTO", label: "Endulzamiento" },
  { value: "RETORNO", label: "Retorno del Ser Amado" },
  { value: "ALEJAMIENTO", label: "Alejamiento de Terceros" },
  { value: "UNION_PAREJA", label: "Unión de Parejas" },
];

export default function NuevoServicio({ clienteId }: { clienteId: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [servicio, setServicio] = useState(SERVICIOS[0].value);
  const [situacion, setSituacion] = useState("");
  const [yaPagado, setYaPagado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function crear() {
    setEnviando(true);
    const res = await fetch("/api/consultas/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId, servicio, situacion, yaPagado }),
    });
    setEnviando(false);

    if (res.ok) {
      toast.success("Servicio agregado");
      setAbierto(false);
      setSituacion("");
      setYaPagado(false);
      router.refresh();
    } else {
      toast.error("No se pudo agregar el servicio");
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#6366f1]/40 text-[#6366f1] text-xs font-medium py-2.5"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        Nuevo servicio
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-[#6366f1]/30 bg-[#6366f1]/5 p-3 space-y-2.5">
      <select
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
        className="w-full rounded-md border border-[#2a2a3d] bg-[#0a0a0f] text-[#e8eaed] text-xs px-2.5 py-2"
      >
        {SERVICIOS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <textarea
        value={situacion}
        onChange={(e) => setSituacion(e.target.value)}
        placeholder="Notas o situación (opcional)"
        rows={2}
        className="w-full rounded-md border border-[#2a2a3d] bg-[#0a0a0f] text-[#e8eaed] text-xs px-2.5 py-2 outline-none"
      />

      <label className="flex items-center gap-2 text-xs text-[#9099a8]">
        <input
          type="checkbox"
          checked={yaPagado}
          onChange={(e) => setYaPagado(e.target.checked)}
        />
        Ya recibí el pago (fuera del sistema)
      </label>

      <div className="flex gap-2">
        <button
          onClick={crear}
          disabled={enviando}
          className="flex-1 rounded-md bg-[#6366f1] text-white text-xs font-medium py-2 disabled:opacity-50"
        >
          {enviando ? "Guardando..." : "Guardar"}
        </button>
        <button
          onClick={() => setAbierto(false)}
          className="flex-1 rounded-md border border-[#2a2a3d] text-[#9099a8] text-xs font-medium py-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
