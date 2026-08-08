"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Circle, Loader2, CheckCircle2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ESTADOS = [
  { value: "NUEVO", label: "Nuevo", color: "#f97316", Icon: Circle },
  { value: "EN_PROCESO", label: "En proceso", color: "#6366f1", Icon: Loader2 },
  { value: "COMPLETADO", label: "Completado", color: "#22c55e", Icon: CheckCircle2 },
];

const SERVICIOS_CON_SEGUIMIENTO = ["AMARRE", "UNION_PAREJA", "RETORNO", "ENDULZAMIENTO", "ALEJAMIENTO"];

export default function EstadoSelector({
  consultaId,
  estadoActual,
  fechaInicio,
  servicio,
}: {
  consultaId: string;
  estadoActual: string;
  fechaInicio: Date | null;
  servicio: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [estadoLocal, setEstadoLocal] = useState(estadoActual);

  async function cambiarEstado(nuevoEstado: string) {
    if (nuevoEstado === estadoLocal) return;

    const anterior = estadoLocal;
    setEstadoLocal(nuevoEstado);
    setLoading(true);

    const res = await fetch(`/api/consultas/${consultaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Estado actualizado");
      router.refresh();
    } else {
      setEstadoLocal(anterior);
      toast.error("No se pudo actualizar el estado");
    }
  }

  async function iniciarTrabajo() {
    setLoading(true);
    const res = await fetch(`/api/consultas/${consultaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iniciarTrabajo: true }),
    });
    setLoading(false);
    if (res.ok) {
      setEstadoLocal("EN_PROCESO");
      toast.success("Trabajo iniciado");
      router.refresh();
    } else {
      toast.error("No se pudo iniciar el trabajo");
    }
  }

  return (
    <div>
      {estadoLocal === "NUEVO" && !fechaInicio && SERVICIOS_CON_SEGUIMIENTO.includes(servicio) && (
        <Button
          onClick={iniciarTrabajo}
          disabled={loading}
          size="sm"
          className="w-full mb-2 bg-[#6366f1] text-white hover:bg-[#4f46e5]"
        >
          <Flame className="h-3.5 w-3.5" strokeWidth={2} />
          {loading ? "Iniciando..." : "Iniciar trabajo"}
        </Button>
      )}

      <div className="flex gap-1.5">
        {ESTADOS.map((estado) => {
          const activo = estado.value === estadoLocal;
          const Icon = estado.Icon;
          return (
            <Button
              key={estado.value}
              onClick={() => cambiarEstado(estado.value)}
              disabled={loading}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1.5 px-2.5"
              style={{
                borderColor: activo ? estado.color : "#2a2a3d",
                backgroundColor: activo ? `${estado.color}18` : "transparent",
                color: activo ? estado.color : "#9099a8",
              }}
            >
              <Icon className="h-3 w-3" strokeWidth={2.5} />
              {estado.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
