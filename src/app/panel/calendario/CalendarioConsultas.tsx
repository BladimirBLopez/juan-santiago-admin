"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";

type Evento = {
  id: string;
  nombre: string;
  servicio: string;
  fecha: Date;
  fechaInicio: Date | null;
};

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
            tieneEvento: "font-bold text-[#8b5cf6] underline decoration-2 underline-offset-4",
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
              href={`/panel/clientes/${e.id}`}
              className="block rounded-lg border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] p-3 hover:border-[#8b5cf6]/40 transition"
            >
              <p className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed]">
                {e.nombre}
              </p>
              <p className="text-xs text-[#8b5cf6] mt-0.5">
                {SERVICIO_LABELS[e.servicio] ?? e.servicio}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
