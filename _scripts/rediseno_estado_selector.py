path = "src/app/panel/EstadoSelector.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''      <div className="flex gap-1.5">
        {ESTADOS.filter((estado) => !(estado.value === "NUEVO" && fechaInicio)).map((estado) => {
          const activo = estado.value === estadoLocal;
          const Icon = estado.Icon;
          return (
            <Button
              key={estado.value}
              onClick={() => cambiarEstado(estado.value)}
              disabled={loading}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1.5 px-2.5"
              style={{
                borderColor: activo ? estado.color : "#2a2a3d",
                backgroundColor: activo ? `${estado.color}18` : "transparent",
                color: activo ? estado.color : "#9099a8",
              }}
            >
              <Icon className="h-3 w-3" strokeWidth={2.5} />
              {estado.label}
            </Button>
          );
        })}
      </div>'''

new = '''      <div className="flex items-center">
        {ESTADOS.filter((estado) => !(estado.value === "NUEVO" && fechaInicio)).map((estado, i, arr) => {
          const activo = estado.value === estadoLocal;
          const indiceActivo = arr.findIndex((e) => e.value === estadoLocal);
          const completado = i < indiceActivo;
          const Icon = estado.Icon;
          return (
            <div key={estado.value} className="flex items-center flex-1">
              <button
                onClick={() => cambiarEstado(estado.value)}
                disabled={loading}
                className="flex flex-col items-center gap-1 flex-1 group"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors"
                  style={{
                    borderColor: activo || completado ? estado.color : "#2a2a3d",
                    backgroundColor: activo ? `${estado.color}18` : completado ? estado.color : "transparent",
                    color: activo ? estado.color : completado ? "#fff" : "#9099a8",
                  }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: activo ? estado.color : "#9099a8" }}
                >
                  {estado.label}
                </span>
              </button>
              {i < arr.length - 1 && (
                <div
                  className="h-0.5 flex-1 -mt-4 rounded-full transition-colors"
                  style={{ backgroundColor: completado ? estado.color : "#2a2a3d" }}
                />
              )}
            </div>
          );
        })}
      </div>'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
