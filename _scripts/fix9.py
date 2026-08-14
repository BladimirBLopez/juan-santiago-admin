path = "src/app/panel/Notificaciones.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''            {!cargando &&
              notificaciones.map((n, i) => (
                <Link
                  key={i}
                  href={`/panel/clientes/${n.id}`}
                  onClick={() => setAbierto(false)}
                  className="block p-3 border-b border-[#e5e5eb] dark:border-[#2a2a3d] last:border-0 hover:bg-[#fafafa] dark:hover:bg-[#17171f] transition"
                >
                  <p className="text-xs text-[#0f0f14] dark:text-[#e8eaed]">
                    {n.tipo === "pago" ? "💰 " : "📩 "}
                    {n.texto}
                  </p>
                  <p className="text-[10px] text-[#6b6b80] mt-0.5">
                    {formatDistanceToNow(new Date(n.fecha), { addSuffix: true, locale: es })}
                  </p>
                </Link>
              ))}
          </div>
        </>
      )}
    </div>
  );
}'''
new = '''            {!cargando &&
              notificaciones.map((n, i) => (
                <Link
                  key={i}
                  href={`/panel/clientes/${n.id}`}
                  onClick={() => setAbierto(false)}
                  className="block p-3 border-b border-[#e5e5eb] dark:border-[#2a2a3d] last:border-0 hover:bg-[#fafafa] dark:hover:bg-[#17171f] transition"
                >
                  <p className="text-xs text-[#0f0f14] dark:text-[#e8eaed]">
                    {n.tipo === "pago" ? "💰 " : "📩 "}
                    {n.texto}
                  </p>
                  <p className="text-[10px] text-[#6b6b80] mt-0.5">
                    {formatDistanceToNow(new Date(n.fecha), { addSuffix: true, locale: es })}
                  </p>
                </Link>
              ))}

            {!cargando && (
              <p className="p-3 text-[10px] text-[#9099a8] bg-[#fafafa] dark:bg-[#0d0d12]">
                El número baja cuando cambia el estado de la consulta o aprueba/rechaza el pago, no solo con mirar aquí.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}'''
assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK 9")
