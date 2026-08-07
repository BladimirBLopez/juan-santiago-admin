"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Pago = {
  id: string;
  monto: number;
  comprobanteUrl: string;
  estado: string;
  createdAt: Date;
};

export default function PagosConsulta({ pagos }: { pagos: Pago[] }) {
  const router = useRouter();
  const [procesando, setProcesando] = useState<string | null>(null);

  const pendientes = pagos.filter((p) => p.estado === "PENDIENTE");

  async function actualizarPago(pagoId: string, estado: "APROBADO" | "RECHAZADO") {
    setProcesando(pagoId);
    const res = await fetch(`/api/pagos/${pagoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    setProcesando(null);
    if (res.ok) router.refresh();
  }

  if (pendientes.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {pendientes.map((pago) => (
        <div
          key={pago.id}
          className="rounded-lg border border-[#c9a24b]/30 bg-[#c9a24b]/5 p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#c9a24b]">
              Bs {pago.monto}
            </span>
            <span className="text-[10px] text-[#5d6573]">
              {new Date(pago.createdAt).toLocaleDateString("es-BO", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>

          <a href={pago.comprobanteUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={pago.comprobanteUrl}
              alt="Comprobante"
              className="rounded-md max-h-40 w-full object-cover mb-2"
            />
          </a>

          <div className="flex gap-2">
            <button
              onClick={() => actualizarPago(pago.id, "APROBADO")}
              disabled={procesando === pago.id}
              className="flex-1 text-xs py-1.5 rounded-md bg-[#4a9c6a] text-[#0f1115] font-medium disabled:opacity-50"
            >
              Aprobar
            </button>
            <button
              onClick={() => actualizarPago(pago.id, "RECHAZADO")}
              disabled={procesando === pago.id}
              className="flex-1 text-xs py-1.5 rounded-md border border-[#e8752c]/40 text-[#e8752c] disabled:opacity-50"
            >
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
