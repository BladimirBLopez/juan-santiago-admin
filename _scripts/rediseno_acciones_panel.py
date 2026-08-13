path = "src/app/panel/AccionesPanel.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''import { ChevronDown, ChevronUp } from "lucide-react";'''

new = '''import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''        className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[#818cf8] bg-[#6366f10f] border border-[#6366f1]/25 rounded-lg py-2 hover:bg-[#6366f11a] transition"
      >
        Gestionar consulta
        {abierto ? (
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>'''

new2 = '''        className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[#818cf8] bg-[#6366f10f] border border-[#6366f1]/25 rounded-lg py-2 hover:bg-[#6366f11a] transition"
      >
        <Settings2 className="h-3.5 w-3.5" strokeWidth={2} />
        Más opciones
        {abierto ? (
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

old3 = '''              <EditarConsulta
                consultaId={consultaId}
                nombreInicial={nombreCliente}
                telefonoInicial={telefonoCliente}
                situacionInicial={situacion}
              />

              <NotasConsulta consultaId={consultaId} notasIniciales={notas} />

              <AgregarCita consultaId={consultaId} servicio={servicio} fechaCitaActual={fechaCita ?? null} />

              <div className="pt-2 border-t border-[#e5e5eb] dark:border-[#2a2a3d]">
                <AccionesConsulta consultaId={consultaId} />
              </div>'''

new3 = '''              <div className="grid grid-cols-3 gap-2">
                <EditarConsulta
                  consultaId={consultaId}
                  nombreInicial={nombreCliente}
                  telefonoInicial={telefonoCliente}
                  situacionInicial={situacion}
                />

                <NotasConsulta consultaId={consultaId} notasIniciales={notas} />

                <AccionesConsulta consultaId={consultaId} />
              </div>

              <AgregarCita consultaId={consultaId} servicio={servicio} fechaCitaActual={fechaCita ?? null} />'''

assert content.count(old3) == 1
content = content.replace(old3, new3)

with open(path, "w") as f:
    f.write(content)

print("OK")
