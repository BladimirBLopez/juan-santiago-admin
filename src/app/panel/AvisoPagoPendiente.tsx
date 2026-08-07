import { AlertTriangle } from "lucide-react";

export default function AvisoPagoPendiente({
  fechaInicio,
  tienePagoAprobado,
}: {
  fechaInicio: Date | null;
  tienePagoAprobado: boolean;
}) {
  if (!fechaInicio || tienePagoAprobado) return null;

  const dias = Math.floor(
    (new Date().getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (dias < 3) return null;

  return (
    <div className="mt-3 flex items-center gap-2 text-xs text-[#f97316] bg-[#f973160f] border border-[#f97316]/25 rounded-lg px-3 py-2">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      Trabajo iniciado hace {dias} días sin pago aprobado
    </div>
  );
}
