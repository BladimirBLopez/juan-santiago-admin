"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

type Correo = { id: string; email: string; nombre: string | null };

export default function EditorCorreosAutorizados() {
  const [correos, setCorreos] = useState<Correo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [agregando, setAgregando] = useState(false);

  function cargar() {
    setCargando(true);
    fetch("/api/correos-autorizados")
      .then((res) => res.json())
      .then((data) => setCorreos(data.correos ?? []))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function agregar() {
    if (!nuevoEmail.includes("@")) {
      toast.error("Escribe un correo válido");
      return;
    }
    setAgregando(true);
    const res = await fetch("/api/correos-autorizados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: nuevoEmail, nombre: nuevoNombre }),
    });
    setAgregando(false);
    if (res.ok) {
      toast.success("Correo agregado");
      setNuevoEmail("");
      setNuevoNombre("");
      cargar();
    } else {
      const data = await res.json();
      toast.error(data.error ?? "No se pudo agregar");
    }
  }

  async function eliminar(id: string) {
    const res = await fetch(`/api/correos-autorizados/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Correo eliminado");
      cargar();
    } else {
      toast.error("No se pudo eliminar");
    }
  }

  return (
    <div className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
      <h2 className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed] mb-1">
        Correos autorizados
      </h2>
      <p className="text-xs text-[#6b6b80] mb-3">
        Solo estos correos pueden entrar al panel con Google
      </p>

      {cargando && <p className="text-xs text-[#6b6b80]">Cargando...</p>}

      <div className="space-y-2 mb-3">
        {!cargando &&
          correos.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-[#e5e5eb] dark:border-[#2a2a3d] px-3 py-2"
            >
              <div>
                <p className="text-sm text-[#0f0f14] dark:text-[#e8eaed]">{c.email}</p>
                {c.nombre && <p className="text-[11px] text-[#6b6b80]">{c.nombre}</p>}
              </div>
              <button
                onClick={() => eliminar(c.id)}
                className="text-[#f97316] hover:text-[#ea580c] transition"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="email"
          value={nuevoEmail}
          onChange={(e) => setNuevoEmail(e.target.value)}
          placeholder="correo@gmail.com"
          className="rounded-md border border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-sm px-3 py-2"
        />
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre (opcional)"
          className="rounded-md border border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-sm px-3 py-2"
        />
        <button
          onClick={agregar}
          disabled={agregando}
          className="flex items-center justify-center gap-1.5 rounded-md bg-[#6366f1] text-white text-sm font-medium py-2 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          {agregando ? "Agregando..." : "Agregar correo"}
        </button>
      </div>
    </div>
  );
}
