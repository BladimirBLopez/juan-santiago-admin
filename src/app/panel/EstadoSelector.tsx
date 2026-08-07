"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Circle, Loader2, CheckCircle2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ESTADOS = [
  { value: "NUEVO", label: "Nuevo", color: "#e8752c", Icon: Circle },
  { value: "EN_PROCESO", label: "En proceso", color: "#c9a24b", Icon: Loader2 },
  { value: "COMPLETADO", label: "Completado", color: "#4a9c6a", Icon: CheckCircle2 },
];

export default function EstadoSelector({
  consultaId,
  estadoActual,
  fechaInicio,
}: {
  consultaId: string;
  estadoActual: string;
  fechaInicio: Date | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function cambiarEstado(nuevoEstado: string) {
    if (nuevoEstado === estadoActual) return;
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
      toast.success("Trabajo iniciado");
      router.refresh();
    } else {
      toast.error("No se pudo iniciar el trabajo");
    }
  }

  return (
    <div>
      {estadoActual === "NUEVO" && !fechaInicio && (
        <Button
          onClick={iniciarTrabajo}
          disabled={loading}
          size="sm"
          className="w-full mb-2 bg-[#c9a24b] text-[#0f1115] hover:bg-[#d9b25b]"
        >
          <Flame className="h-3.5 w-3.5" strokeWidth={2} />
          {loading ? "Iniciando..." : "Iniciar trabajo"}
        </Button>
      )}

      <div className="flex gap-1.5">
        {ESTADOS.map((estado) => {
          const activo = estado.value === estadoActual;
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
                borderColor: activo ? estado.color : "#262b35",
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
