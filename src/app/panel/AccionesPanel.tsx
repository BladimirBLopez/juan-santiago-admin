"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import EstadoSelector from "./EstadoSelector";
import NotasConsulta from "./NotasConsulta";
import EditarConsulta from "./EditarConsulta";
import LinkPago from "./LinkPago";
import AccionesConsulta from "./AccionesConsulta";

export default function AccionesPanel({
  consultaId,
  estadoActual,
  fechaInicio,
  notas,
  nombreCliente,
  telefonoCliente,
  situacion,
}: {
  consultaId: string;
  estadoActual: string;
  fechaInicio: Date | null;
  notas: string | null;
  nombreCliente: string;
  telefonoCliente: string | null;
  situacion: string;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="mt-3 pt-3 border-t border-[#1e232c]">
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-1 text-xs text-[#9099a8] hover:text-[#e8eaed] transition"
      >
        Gestionar
        {abierto ? (
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>

      {abierto && (
        <div className="mt-3 space-y-3">
          <EstadoSelector
            consultaId={consultaId}
            estadoActual={estadoActual}
            fechaInicio={fechaInicio}
          />

          <div className="flex items-center justify-between gap-3">
            <LinkPago consultaId={consultaId} />
            <EditarConsulta
              consultaId={consultaId}
              nombreInicial={nombreCliente}
              telefonoInicial={telefonoCliente}
              situacionInicial={situacion}
            />
          </div>

          <NotasConsulta consultaId={consultaId} notasIniciales={notas} />

          <div className="flex justify-end pt-1">
            <AccionesConsulta consultaId={consultaId} />
          </div>
        </div>
      )}
    </div>
  );
}
