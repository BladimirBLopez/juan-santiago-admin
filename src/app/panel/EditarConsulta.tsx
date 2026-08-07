"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditarConsulta({
  consultaId,
  nombreInicial,
  telefonoInicial,
  situacionInicial,
}: {
  consultaId: string;
  nombreInicial: string;
  telefonoInicial: string | null;
  situacionInicial: string;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(nombreInicial);
  const [telefono, setTelefono] = useState(telefonoInicial ?? "");
  const [situacion, setSituacion] = useState(situacionInicial);
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    setGuardando(true);
    const res = await fetch(`/api/consultas/${consultaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreCliente: nombre,
        telefonoCliente: telefono,
        situacion,
      }),
    });
    setGuardando(false);
    if (res.ok) {
      toast.success("Consulta actualizada");
      setEditando(false);
      router.refresh();
    } else {
      toast.error("No se pudo guardar los cambios");
    }
  }

  if (!editando) {
    return (
      <button
        onClick={() => setEditando(true)}
        className="text-xs text-[#5d6573] hover:text-[#c9a24b] transition"
      >
        Editar
      </button>
    );
  }

  return (
    <div className="space-y-2 mt-2 p-3 rounded-lg bg-[#0b0d12] border border-[#1e232c]">
      <div>
        <label className="text-xs text-[#5d6573]">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full mt-1 text-sm rounded-md border border-[#262b35] bg-[#12151b] text-[#e8eaed] px-2.5 py-1.5 outline-none focus:border-[#c9a24b]/50"
        />
      </div>
      <div>
        <label className="text-xs text-[#5d6573]">Teléfono</label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full mt-1 text-sm rounded-md border border-[#262b35] bg-[#12151b] text-[#e8eaed] px-2.5 py-1.5 outline-none focus:border-[#c9a24b]/50"
        />
      </div>
      <div>
        <label className="text-xs text-[#5d6573]">Situación</label>
        <textarea
          value={situacion}
          onChange={(e) => setSituacion(e.target.value)}
          rows={3}
          className="w-full mt-1 text-sm rounded-md border border-[#262b35] bg-[#12151b] text-[#e8eaed] px-2.5 py-1.5 outline-none focus:border-[#c9a24b]/50"
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={guardar}
          disabled={guardando}
          className="text-xs text-[#c9a24b] font-medium disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
        <button
          onClick={() => setEditando(false)}
          className="text-xs text-[#5d6573]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
