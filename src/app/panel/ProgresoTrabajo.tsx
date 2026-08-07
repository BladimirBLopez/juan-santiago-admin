const NUMERO = "59175928656";

export default function ProgresoTrabajo({
  fechaInicio,
  diasTrabajo,
  nombreCliente,
  telefonoCliente,
}: {
  fechaInicio: Date;
  diasTrabajo: number;
  nombreCliente: string;
  telefonoCliente: string | null;
}) {
  const hoy = new Date();
  const diasTranscurridos = Math.floor(
    (hoy.getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24)
  );
  const diaActual = Math.min(diasTranscurridos + 1, diasTrabajo);
  const progreso = Math.min((diaActual / diasTrabajo) * 100, 100);
  const completo = diaActual >= diasTrabajo;

  const telefonoLimpio = telefonoCliente?.replace(/\D/g, "");
  const numeroWa = telefonoLimpio ? `591${telefonoLimpio}` : null;

  const mensajeAvance = encodeURIComponent(
    `Hola ${nombreCliente}, soy el Maestro Juan Santiago. Te escribo para contarte que tu trabajo va en el día ${diaActual} de ${diasTrabajo}. Todo avanza según lo previsto. 🙏`
  );

  const mensajeTestimonio = encodeURIComponent(
    `Hola ${nombreCliente}, soy el Maestro Juan Santiago. Ya se cumplió el tiempo de tu trabajo espiritual. Me encantaría saber cómo te fue y si notaste resultados — tu testimonio ayuda a que más personas confíen en este camino. 🙏✨`
  );

  return (
    <div className="mt-3 rounded-lg bg-[#0f1115] border border-[#262b35] p-2.5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-[#9099a8]">
          {completo ? "Trabajo completado" : `Día ${diaActual} de ${diasTrabajo}`}
        </span>
      </div>
      <div className="h-1 rounded-full bg-[#262b35] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#c9a24b] transition-all"
          style={{ width: `${progreso}%` }}
        />
      </div>

      {numeroWa && (
        <div className="flex gap-2 mt-2.5">
          {!completo && (
            <a
              href={`https://wa.me/${numeroWa}?text=${mensajeAvance}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs py-1.5 rounded-md border border-[#4a9c6a]/30 text-[#4a9c6a] hover:bg-[#4a9c6a]/10 transition"
            >
              Enviar avance
            </a>
          )}
          {completo && (
            <a
              href={`https://wa.me/${numeroWa}?text=${mensajeTestimonio}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs py-1.5 rounded-md border border-[#c9a24b]/30 text-[#c9a24b] hover:bg-[#c9a24b]/10 transition"
            >
              Pedir testimonio
            </a>
          )}
        </div>
      )}
    </div>
  );
}
