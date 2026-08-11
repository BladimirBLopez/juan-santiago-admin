"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";

type Evento = {
  id: string;
  clienteId: string;
  nombre: string;
  servicio: string;
  fecha: Date;
  fechaInicio: Date | null;
  esCita?: boolean;
  horaCita?: Date | null;
  estado?: string;
};

function formatearHoraCita(fecha: Date) {
  return new Date(fecha).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
  CONSULTA_TAROT: "Consulta de Tarot",
  CONSULTA_COCA: "Consulta de Hojas de Coca",
};

function mismoDia(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarioConsultas({ eventos }: { eventos: Evento[] }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(new Date());

  const diasConEventos = eventos.map((e) => new Date(e.fecha));

  const eventosDelDia = fechaSeleccionada
    ? eventos.filter((e) => mismoDia(new Date(e.fecha), fechaSeleccionada))
    : [];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-3">
        <Calendar
          mode="single"
          selected={fechaSeleccionada}
          onSelect={setFechaSeleccionada}
          modifiers={{ tieneEvento: diasConEventos }}
          modifiersClassNames={{
            tieneEvento: "font-bold text-[#6366f1] underline decoration-2 underline-offset-4",
          }}
          className="mx-auto"
        />
      </div>

      <div>
        <h2 className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed] mb-2.5">
          {fechaSeleccionada
            ? fechaSeleccionada.toLocaleDateString("es-BO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Selecciona una fecha"}
        </h2>

        {eventosDelDia.length === 0 && (
          <p className="text-xs text-[#6b6b80]">No hay consultas este día.</p>
        )}

        <div className="space-y-2">
          {eventosDelDia.map((e) => (
            <Link
              key={e.id}
              href={`/panel/clientes/${e.clienteId}`}
              className="block rounded-lg border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] p-3 hover:border-[#6366f1]/40 transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed]">
                  {e.nombre}
                </p>
                <div className="flex items-center gap-1.5">
                  {e.estado === "COMPLETADO" && (
                    <span className="text-[10px] font-semibold text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-full">
                      ✓ Completado
                    </span>
                  )}
                  {e.estado !== "COMPLETADO" && e.esCita && e.horaCita && new Date(e.horaCita) < new Date() && (
                    <span className="text-[10px] font-semibold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                      ⏱ Vencida sin pago
                    </span>
                  )}
                  {e.esCita && e.horaCita && (
                    <span className="text-[10px] font-semibold text-white bg-[#6366f1] px-2 py-0.5 rounded-full">
                      📹 {formatearHoraCita(e.horaCita)}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-[#6366f1] mt-0.5">
                {SERVICIO_LABELS[e.servicio] ?? e.servicio}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
