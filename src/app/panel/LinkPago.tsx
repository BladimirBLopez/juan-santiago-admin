"use client";

import { Link2 } from "lucide-react";
import { toast } from "sonner";

export default function LinkPago({ consultaId }: { consultaId: string }) {
  function copiar() {
    const url = `https://juan-santiago-admin.vercel.app/pago/${consultaId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link de pago copiado");
  }

  return (
    <button
      onClick={copiar}
      className="flex items-center gap-1.5 text-xs text-[#9099a8] hover:text-[#8b5cf6] transition"
    >
      <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
      Link de pago
    </button>
  );
}
