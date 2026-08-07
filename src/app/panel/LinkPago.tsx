"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export default function LinkPago({ consultaId }: { consultaId: string }) {
  const [copiado, setCopiado] = useState(false);

  function copiar() {
    const url = `https://juan-santiago-admin.vercel.app/pago/${consultaId}`;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      onClick={copiar}
      className="flex items-center gap-1.5 text-xs text-[#9099a8] hover:text-[#c9a24b] transition"
    >
      {copiado ? (
        <>
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
          Copiado
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
          Link de pago
        </>
      )}
    </button>
  );
}
