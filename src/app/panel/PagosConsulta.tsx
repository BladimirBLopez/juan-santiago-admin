"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";

type Pago = {
  id: string;
  monto: number;
  comprobanteUrl: string;
  estado: string;
  verificadoOcr?: boolean;
  createdAt: Date;
};

export default function PagosConsulta({ pagos }: { pagos: Pago[] }) {
  const router = useRouter();
  const [procesando, setProcesando] = useState<string | null>(null);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  const pendientes = pagos.filter((p) => p.estado === "PENDIENTE");

  async function actualizarPago(pagoId: string, estado: "APROBADO" | "RECHAZADO") {
    setProcesando(pagoId);
    const res = await fetch(`/api/pagos/${pagoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    setProcesando(null);
    if (res.ok) {
      toast.success(estado === "APROBADO" ? "Pago aprobado" : "Pago rechazado");
      router.refresh();
    } else {
      toast.error("No se pudo actualizar el pago");
    }
  }

  if (pendientes.length === 0) return null;

  return (
    <>
      <div className="mt-3 space-y-2">
        {pendientes.map((pago) => (
          <div
            key={pago.id}
            className="rounded-lg border border-[#6366f1]/30 bg-[#6366f1]/5 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#6366f1] flex items-center gap-1.5">
                Bs {pago.monto}
                {pago.verificadoOcr && (
                  <span className="text-[10px] font-medium text-[#22c55e] bg-[#22c55e1a] px-1.5 py-0.5 rounded">
                    ✓ Auto-verificado
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#6b6b80]">
                {new Date(pago.createdAt).toLocaleDateString("es-BO", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setImagenAmpliada(pago.comprobanteUrl)}
              className="block w-full"
            >
              <img
                src={pago.comprobanteUrl}
                alt="Comprobante"
                className="rounded-md max-h-40 w-full object-cover mb-2"
              />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => actualizarPago(pago.id, "APROBADO")}
                disabled={procesando === pago.id}
                className="flex-1 text-xs py-1.5 rounded-md bg-[#22c55e] text-[#0a0a0f] font-medium disabled:opacity-50"
              >
                Aprobar
              </button>
              <button
                onClick={() => actualizarPago(pago.id, "RECHAZADO")}
                disabled={procesando === pago.id}
                className="flex-1 text-xs py-1.5 rounded-md border border-[#f97316]/40 text-[#f97316] disabled:opacity-50"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>

      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setImagenAmpliada(null)}
        >
          <button
            onClick={() => setImagenAmpliada(null)}
            className="absolute top-4 right-4 text-white"
          >
            <X className="h-6 w-6" strokeWidth={2} />
          </button>
          <img
            src={imagenAmpliada}
            alt="Comprobante ampliado"
            className="max-w-full max-h-full rounded-lg object-contain"
          />
        </div>
      )}
    </>
  );
}
