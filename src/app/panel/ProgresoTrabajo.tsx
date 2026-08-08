"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProgresoTrabajo({
  consultaId,
  fechaInicio,
  diasTrabajo,
  nombreCliente,
  telefonoCliente,
  ultimoAvanceEnviado,
  testimonioEnviado,
  estadoActual,
}: {
  consultaId: string;
  fechaInicio: Date;
  diasTrabajo: number;
  nombreCliente: string;
  telefonoCliente: string | null;
  ultimoAvanceEnviado: Date | null;
  testimonioEnviado: boolean;
  estadoActual: string;
}) {
  const router = useRouter();
  const [registrando, setRegistrando] = useState(false);

  const hoy = new Date();
  const diasTranscurridos = Math.floor(
    (hoy.getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24)
  );
  const diaActual = Math.min(diasTranscurridos + 1, diasTrabajo);
  const progreso = Math.min((diaActual / diasTrabajo) * 100, 100);
  const completo = diaActual >= diasTrabajo || estadoActual === "COMPLETADO";

  const telefonoLimpio = telefonoCliente?.replace(/\D/g, "");
  const numeroWa = telefonoLimpio ? `591${telefonoLimpio}` : null;

  const mensajeAvance = encodeURIComponent(
    `Hola ${nombreCliente}, soy el Maestro Juan Santiago. Te escribo para contarte que tu trabajo va en el día ${diaActual} de ${diasTrabajo}. Todo avanza según lo previsto. 🙏`
  );

  const mensajeTestimonio = encodeURIComponent(
    `Hola ${nombreCliente}, soy el Maestro Juan Santiago. Ya se cumplió el tiempo de tu trabajo espiritual. Me encantaría saber cómo te fue y si notaste resultados — tu testimonio ayuda a que más personas confíen en este camino. 🙏✨`
  );

  async function registrarEnvio(tipo: "RECORDATORIO_AVANCE" | "TESTIMONIO") {
    setRegistrando(true);
    await fetch(`/api/consultas/${consultaId}/seguimiento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo }),
    });
    setRegistrando(false);
    router.refresh();
  }

  return (
    <div className="mt-3 rounded-lg bg-[#fafafa] dark:bg-[#0a0a0f] border border-[#e5e5eb] dark:border-[#2a2a3d] p-2.5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-[#9099a8]">
          {completo ? "Trabajo completado" : `Día ${diaActual} de ${diasTrabajo}`}
        </span>
      </div>
      <div className="h-1 rounded-full bg-[#e5e5eb] dark:bg-[#2a2a3d] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#6366f1] transition-all"
          style={{ width: `${progreso}%` }}
        />
      </div>

      {numeroWa && (
        <div className="mt-2.5">
          {!completo && (
            <>
              <a
                href={`https://wa.me/${numeroWa}?text=${mensajeAvance}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEnvio("RECORDATORIO_AVANCE")}
                className="block text-center text-xs py-1.5 rounded-md border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/10 transition"
              >
                {registrando ? "..." : "Enviar avance"}
              </a>
              {ultimoAvanceEnviado && (
                <p className="text-[10px] text-[#6b6b80] mt-1 text-center">
                  Último avance enviado:{" "}
                  {new Date(ultimoAvanceEnviado).toLocaleDateString("es-BO", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              )}
            </>
          )}
          {completo && (
            <>
              <a
                href={`https://wa.me/${numeroWa}?text=${mensajeTestimonio}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEnvio("TESTIMONIO")}
                className="block text-center text-xs py-1.5 rounded-md border border-[#6366f1]/30 text-[#818cf8] hover:bg-[#6366f1]/10 transition"
              >
                {registrando ? "..." : "Pedir testimonio"}
              </a>
              {testimonioEnviado && (
                <p className="text-[10px] text-[#6b6b80] mt-1 text-center">
                  Ya se pidió el testimonio
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
