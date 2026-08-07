export default function ProgresoTrabajo({
  fechaInicio,
  diasTrabajo,
}: {
  fechaInicio: Date;
  diasTrabajo: number;
}) {
  const hoy = new Date();
  const diasTranscurridos = Math.floor(
    (hoy.getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24)
  );
  const diaActual = Math.min(diasTranscurridos + 1, diasTrabajo);
  const progreso = Math.min((diaActual / diasTrabajo) * 100, 100);
  const completo = diaActual >= diasTrabajo;

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[#c9a24b]">
          {completo ? "🌕 Trabajo completado" : `🕯️ Día ${diaActual} de ${diasTrabajo}`}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#1a0505] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#c9a24b] to-[#f0d78c] transition-all"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  );
}
