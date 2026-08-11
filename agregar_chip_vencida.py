path = "src/app/panel/calendario/CalendarioConsultas.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''                <div className="flex items-center gap-1.5">
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
                </div>'''

new = '''                <div className="flex items-center gap-1.5">
                  {e.estado === "COMPLETADO" && (
                    <span className="text-[10px] font-semibold text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-full">
                      ✓ Completado
                    </span>
                  )}
                  {e.estado !== "COMPLETADO" && e.esCita && e.horaCita && new Date(e.horaCita) < new Date() && (
                    <span className="text-[10px] font-semibold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                      ⏱ Vencida sin pago
                    </span>
                  )}
                  {e.esCita && e.horaCita && (
                    <span className="text-[10px] font-semibold text-white bg-[#6366f1] px-2 py-0.5 rounded-full">
                      📹 {formatearHoraCita(e.horaCita)}
                    </span>
                  )}
                </div>'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
