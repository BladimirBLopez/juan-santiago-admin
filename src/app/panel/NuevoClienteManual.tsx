"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, X } from "lucide-react";

const CONSULTAS = [
  { value: "CONSULTA_TAROT", label: "Consulta de Tarot" },
  { value: "CONSULTA_COCA", label: "Consulta de Hojas de Coca" },
];

const TRABAJOS = [
  { value: "AMARRE", label: "Amarre de Amor" },
  { value: "ENDULZAMIENTO", label: "Endulzamiento" },
  { value: "RETORNO", label: "Retorno del Ser Amado" },
  { value: "ALEJAMIENTO", label: "Alejamiento de Terceros" },
  { value: "UNION_PAREJA", label: "Unión de Parejas" },
];

export default function NuevoClienteManual() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [servicio, setServicio] = useState(CONSULTAS[0].value);
  const [situacion, setSituacion] = useState("");
  const [yaPagado, setYaPagado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function crear() {
    if (nombre.trim().length < 2) {
      toast.error("Escribe el nombre del cliente");
      return;
    }
    setEnviando(true);
    const res = await fetch("/api/consultas/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, telefono, servicio, situacion, yaPagado }),
    });
    setEnviando(false);

    if (res.ok) {
      toast.success("Cliente y consulta registrados");
      setAbierto(false);
      setNombre("");
      setTelefono("");
      setSituacion("");
      setYaPagado(false);
      router.refresh();
    } else {
      toast.error("No se pudo registrar");
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-1.5 rounded-lg border border-[#6366f1]/40 text-[#6366f1] text-xs font-medium px-3 py-2"
      >
        <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
        Nuevo cliente
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#17171f] p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-[#0f0f14] dark:text-[#e8eaed]">
            Registrar cliente nuevo
          </h3>
          <button onClick={() => setAbierto(false)}>
            <X className="h-4 w-4 text-[#9099a8]" strokeWidth={2} />
          </button>
        </div>

        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre completo"
          className="w-full rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-sm px-3 py-2 outline-none"
        />

        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono (ej: 70000000)"
          type="tel"
          className="w-full rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-sm px-3 py-2 outline-none"
        />

        <select
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
          className="w-full rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-sm px-3 py-2"
        >
          <optgroup label="Consultas (primero siempre)">
            {CONSULTAS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Trabajos">
            {TRABAJOS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </optgroup>
        </select>

        <textarea
          value={situacion}
          onChange={(e) => setSituacion(e.target.value)}
          placeholder="Situación o notas (opcional)"
          rows={2}
          className="w-full rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-sm px-3 py-2 outline-none"
        />

        <label className="flex items-center gap-2 text-xs text-[#6b6b80]">
          <input
            type="checkbox"
            checked={yaPagado}
            onChange={(e) => setYaPagado(e.target.checked)}
          />
          Ya recibí el pago (fuera del sistema)
        </label>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setAbierto(false)}
            className="flex-1 rounded-lg border border-[#e5e5eb] dark:border-[#2a2a3d] text-[#9099a8] text-sm font-medium py-2.5"
          >
            Cancelar
          </button>
          <button
            onClick={crear}
            disabled={enviando}
            className="flex-1 rounded-lg bg-[#6366f1] text-white text-sm font-medium py-2.5 disabled:opacity-50"
          >
            {enviando ? "Guardando..." : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
