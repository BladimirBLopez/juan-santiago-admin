"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

const SERVICIOS_CON_CITA = ["CONSULTA_TAROT", "CONSULTA_COCA"];

export default function AgregarCita({
  consultaId,
  servicio,
  fechaCitaActual,
}: {
  consultaId: string;
  servicio: string;
  fechaCitaActual: Date | null;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!SERVICIOS_CON_CITA.includes(servicio) || fechaCitaActual) return null;

  async function guardar() {
    if (!fecha || !hora) {
      toast.error("Elige fecha y hora");
      return;
    }
    setEnviando(true);
    const fechaCita = new Date(`${fecha}T${hora}:00-04:00`).toISOString();
    const res = await fetch(`/api/consultas/${consultaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fechaCita }),
    });
    setEnviando(false);
    if (res.ok) {
      toast.success("Cita agregada");
      setAbierto(false);
      router.refresh();
    } else {
      toast.error("No se pudo guardar la cita");
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#22c55e]/40 text-[#22c55e] text-xs font-medium py-2.5"
      >
        <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
        Agregar fecha de cita
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/5 p-3 space-y-2.5">
      <div className="flex gap-2">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="flex-1 rounded-md border border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-xs px-2.5 py-2"
          style={{ colorScheme: "light dark" }}
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="flex-1 rounded-md border border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-xs px-2.5 py-2"
          style={{ colorScheme: "light dark" }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={guardar}
          disabled={enviando}
          className="flex-1 rounded-md bg-[#22c55e] text-white text-xs font-medium py-2 disabled:opacity-50"
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
