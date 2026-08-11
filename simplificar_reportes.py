path = "src/app/panel/reportes/page.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''        <h2 className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed] mb-3">Conversión</h2>'''
new = '''        <h2 className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed] mb-3">Resultados</h2>'''
assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''              <span className="text-[#c4c9d4]">Consultas que iniciaron trabajo</span>'''
new2 = '''              <span className="text-[#c4c9d4]">Personas que empezaron un trabajo</span>'''
assert content.count(old2) == 1
content = content.replace(old2, new2)

old3 = '''              <span className="text-[#c4c9d4]">Trabajos completados</span>'''
new3 = '''              <span className="text-[#c4c9d4]">Trabajos terminados</span>'''
assert content.count(old3) == 1
content = content.replace(old3, new3)

with open(path, "w") as f:
    f.write(content)

print("OK")
