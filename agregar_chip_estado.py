path = "src/app/panel/calendario/CalendarioConsultas.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''type Evento = {
  id: string;
  clienteId: string;
  nombre: string;
  servicio: string;
  fecha: Date;
  fechaInicio: Date | null;
  esCita?: boolean;
  horaCita?: Date | null;
};'''

new = '''type Evento = {
  id: string;
  clienteId: string;
  nombre: string;
  servicio: string;
  fecha: Date;
  fechaInicio: Date | null;
  esCita?: boolean;
  horaCita?: Date | null;
  estado?: string;
};'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed]">
                  {e.nombre}
                </p>
                {e.esCita && e.horaCita && (
                  <span className="text-[10px] font-semibold text-white bg-[#6366f1] px-2 py-0.5 rounded-full">
                    📹 {formatearHoraCita(e.horaCita)}
                  </span>
                )}
              </div>'''

new2 = '''              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed]">
                  {e.nombre}
                </p>
                <div className="flex items-center gap-1.5">
                  {e.estado === "COMPLETADO" && (
                    <span className="text-[10px] font-semibold text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-full">
                      ✓ Completado
                    </span>
                  )}
                  {e.esCita && e.horaCita && (
                    <span className="text-[10px] font-semibold text-white bg-[#6366f1] px-2 py-0.5 rounded-full">
                      📹 {formatearHoraCita(e.horaCita)}
                    </span>
                  )}
                </div>
              </div>'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK")
