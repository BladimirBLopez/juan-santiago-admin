"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Eye, EyeOff } from "lucide-react";

type Testimonio = {
  id: string;
  nombre: string;
  servicio: string | null;
  texto: string;
  mediaUrl: string | null;
  mediaTipo: string | null;
  visible: boolean;
  createdAt: Date;
};

export default function ListaTestimonios({ testimonios }: { testimonios: Testimonio[] }) {
  const router = useRouter();
  const [procesando, setProcesando] = useState<string | null>(null);

  async function eliminar(id: string) {
    setProcesando(id);
    const res = await fetch(`/api/testimonios/${id}`, { method: "DELETE" });
    setProcesando(null);
    if (res.ok) {
      toast.success("Testimonio eliminado");
      router.refresh();
    } else {
      toast.error("No se pudo eliminar");
    }
  }

  async function toggleVisible(id: string, visibleActual: boolean) {
    setProcesando(id);
    const res = await fetch(`/api/testimonios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !visibleActual }),
    });
    setProcesando(null);
    if (res.ok) {
      toast.success(!visibleActual ? "Ahora visible en la web" : "Ocultado de la web");
      router.refresh();
    } else {
      toast.error("No se pudo actualizar");
    }
  }

  if (testimonios.length === 0) {
    return (
      <p className="text-xs text-[#71717a] text-center py-8">
        Aún no hay testimonios agregados.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {testimonios.map((t) => (
        <div
          key={t.id}
          className="rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-3.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-[#18181b] dark:text-[#e8eaed]">
                {t.nombre}
              </p>
              {!t.visible && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f4f4f5] dark:bg-[#1e232c] text-[#71717a]">
                  Oculto
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleVisible(t.id, t.visible)}
                disabled={procesando === t.id}
                className="text-[#71717a] hover:text-[#6366f1] transition disabled:opacity-50"
                title={t.visible ? "Ocultar de la web" : "Mostrar en la web"}
              >
                {t.visible ? (
                  <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
                )}
              </button>
              <button
                onClick={() => eliminar(t.id)}
                disabled={procesando === t.id}
                className="text-[#a1a1aa] hover:text-[#e11d48] transition disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
          <p className="text-sm text-[#3f3f46] dark:text-[#c4c9d4] mt-1.5">{t.texto}</p>

          {t.mediaUrl && t.mediaTipo === "IMAGEN" && (
            <img src={t.mediaUrl} alt="" className="mt-2 rounded-lg max-h-48" />
          )}
          {t.mediaUrl && t.mediaTipo === "VIDEO" && (
            <video src={t.mediaUrl} controls className="mt-2 rounded-lg max-h-48 w-full" />
          )}
          {t.mediaUrl && t.mediaTipo === "AUDIO" && (
            <audio src={t.mediaUrl} controls className="mt-2 w-full" />
          )}
        </div>
      ))}
    </div>
  );
}
