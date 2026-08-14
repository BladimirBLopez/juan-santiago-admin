path = "src/app/panel/page.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''              {c.estado === "ABANDONADA" && c.cliente.telefono && (
                <a
                  href={`https://wa.me/591${c.cliente.telefono.replace(/\\D/g, "")}?text=${encodeURIComponent(
                    `Hola ${c.cliente.nombre}, soy el Maestro Juan Santiago. Vi que no llegaste a confirmar tu consulta, ¿seguís interesado/a? Estoy para ayudarte. 🙏`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#f97316] hover:bg-[#ea580c] transition rounded-lg py-2 px-3 w-full"
                >
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                  Intentar recuperar por WhatsApp
                </a>
              )}'''
new = '''              {c.estado === "ABANDONADA" && c.cliente.telefono && (
                <a
                  href={`https://api.whatsapp.com/send?phone=591${c.cliente.telefono.replace(/\\D/g, "")}&text=${encodeURIComponent(
                    `Hola ${c.cliente.nombre}, soy el Maestro Juan Santiago. Vi que no llegaste a confirmar tu consulta, ¿seguís interesado/a? Estoy para ayudarte. 🙏`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#f97316] hover:bg-[#ea580c] transition rounded-lg py-2 px-3 w-full"
                >
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                  Intentar recuperar por WhatsApp
                </a>
              )}'''
assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK 15")
