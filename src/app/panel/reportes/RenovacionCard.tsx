export default function RenovacionCard({
  clientes,
}: {
  clientes: { nombre: string; telefono: string | null; diasSinConsulta: number }[];
}) {
  if (clientes.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#262b35] bg-[#161a22] p-4">
      <h2 className="text-sm font-medium text-[#e8eaed] mb-1">
        Clientes para recontactar
      </h2>
      <p className="text-xs text-[#5d6573] mb-3">
        No consultan hace más de 60 días
      </p>
      <div className="space-y-2">
        {clientes.map((c, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[#c4c9d4]">{c.nombre}</span>
              <span className="text-[#5d6573] ml-2">
                {c.diasSinConsulta} días sin consultar
              </span>
            </div>
            {c.telefono && (
              <a
                href={`https://wa.me/591${c.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hola ${c.nombre}, soy el Maestro Juan Santiago. Hace tiempo no sabemos de ti, ¿cómo te encuentras? Estoy aquí si necesitas orientación espiritual. 🙏`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4a9c6a]"
              >
                Contactar
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
