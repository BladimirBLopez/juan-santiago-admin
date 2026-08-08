"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  servicio,
}: {
  consultaId: string;
  estadoActual: string;
  fechaInicio: Date | null;
  notas: string | null;
  nombreCliente: string;
  telefonoCliente: string | null;
  situacion: string;
  servicio: string;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="mt-3 pt-3 border-t border-[#e5e5eb] dark:border-[#2a2a3d]">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[#818cf8] bg-[#6366f10f] border border-[#6366f1]/25 rounded-lg py-2 hover:bg-[#6366f11a] transition"
      >
        Gestionar consulta
        {abierto ? (
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>

      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              <EstadoSelector
                consultaId={consultaId}
                estadoActual={estadoActual}
                fechaInicio={fechaInicio}
                servicio={servicio}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
