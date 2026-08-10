"use client";

import { Link2 } from "lucide-react";
import { toast } from "sonner";

const SERVICIOS_CONSULTA = ["CONSULTA_TAROT", "CONSULTA_COCA"];

export default function LinkPago({ consultaId, servicio }: { consultaId: string; servicio?: string }) {
  function copiar() {
    const monto = servicio && SERVICIOS_CONSULTA.includes(servicio) ? 50 : 450;
    const url = `https://juan-santiago-admin.vercel.app/pago/${consultaId}?monto=${monto}`;
    navigator.clipboard.writeText(url);
    toast.success(`Link de pago copiado (Bs ${monto})`);
  }

  return (
    <button
      onClick={copiar}
      className="flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#22c55e] hover:bg-[#16a34a] transition rounded-lg py-2 px-3 w-full"
    >
      <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
      Copiar link de pago
    </button>
  );
}
