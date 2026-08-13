path = "src/app/panel/page.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''              <p className="text-[13px] text-[#3f3f46] dark:text-[#c4c9d4] mt-3 leading-relaxed">
                {c.situacion}
              </p>'''

new = '''              <p className="text-[13px] text-[#3f3f46] dark:text-[#c4c9d4] mt-3 leading-relaxed">
                {c.situacion}
              </p>

              {(c.servicio === "CONSULTA_TAROT" || c.servicio === "CONSULTA_COCA") && !c.fechaCita && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#fef3c7] px-2.5 py-1 text-[11px] font-medium text-[#b45309]">
                  📅 Pendiente de agendar cita
                </div>
              )}'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
