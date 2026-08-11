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

      <div className="flex items-center">
        {ESTADOS.filter((estado) => !(estado.value === "NUEVO" && fechaInicio)).map((estado, i, arr) => {
          const activo = estado.value === estadoLocal;
          const indiceActivo = arr.findIndex((e) => e.value === estadoLocal);
          const completado = i < indiceActivo;
          const Icon = estado.Icon;
          return (
            <div key={estado.value} className="flex items-center flex-1">
              <button
                onClick={() => cambiarEstado(estado.value)}
                disabled={loading}
                className="flex flex-col items-center gap-1 flex-1 group"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors"
                  style={{
                    borderColor: activo || completado ? estado.color : "#2a2a3d",
                    backgroundColor: activo ? `${estado.color}18` : completado ? estado.color : "transparent",
                    color: activo ? estado.color : completado ? "#fff" : "#9099a8",
                  }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: activo ? estado.color : "#9099a8" }}
                >
                  {estado.label}
                </span>
              </button>
              {i < arr.length - 1 && (
                <div
                  className="h-0.5 flex-1 -mt-4 rounded-full transition-colors"
                  style={{ backgroundColor: completado ? estado.color : "#2a2a3d" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
