"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

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
        className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] py-3.5 hover:border-[#6366f1]/40 hover:bg-[#6366f10a] transition"
      >
        <Pencil className="h-5 w-5 text-[#6366f1]" strokeWidth={2} />
        <span className="text-xs font-medium text-[#0f0f14] dark:text-[#e8eaed]">Editar datos</span>
      </button>
    );
  }

  return (
    <div className="space-y-2 mt-2 p-3 rounded-lg bg-[#fafafa] dark:bg-[#0b0d12] border border-[#e4e4e7] dark:border-[#2a2a3d]">
      <div>
        <label className="text-xs text-[#6b6b80]">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full mt-1 text-sm rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] text-[#0f0f14] dark:text-[#e8eaed] px-2.5 py-1.5 outline-none focus:border-[#6366f1]/50"
        />
      </div>
      <div>
        <label className="text-xs text-[#6b6b80]">Teléfono</label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full mt-1 text-sm rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] text-[#0f0f14] dark:text-[#e8eaed] px-2.5 py-1.5 outline-none focus:border-[#6366f1]/50"
        />
      </div>
      <div>
        <label className="text-xs text-[#6b6b80]">Situación</label>
        <textarea
          value={situacion}
          onChange={(e) => setSituacion(e.target.value)}
          rows={3}
          className="w-full mt-1 text-sm rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] text-[#0f0f14] dark:text-[#e8eaed] px-2.5 py-1.5 outline-none focus:border-[#6366f1]/50"
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={guardar}
          disabled={guardando}
          className="text-xs text-[#6366f1] font-medium disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
        <button
          onClick={() => setEditando(false)}
          className="text-xs text-[#6b6b80]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
