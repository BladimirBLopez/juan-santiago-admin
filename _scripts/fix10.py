path = "src/app/panel/Notificaciones.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''          <div
            className="fixed inset-0 z-10 bg-black/20"
            onClick={() => setAbierto(false)}
          />
          <div className="fixed right-3 top-16 z-20 w-[min(85vw,300px)] max-h-80 overflow-y-auto rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] shadow-xl"'''
new = '''          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setAbierto(false)}
          />
          <div className="fixed right-3 top-16 z-50 w-[min(85vw,300px)] max-h-80 overflow-y-auto rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] shadow-xl"'''
assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK 10")
