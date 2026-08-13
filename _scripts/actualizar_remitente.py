path = "src/lib/email.ts"
with open(path, "r") as f:
    content = f.read()

old = 'from: "onboarding@resend.dev",'
new = 'from: "Maestro Juan Santiago <notificaciones@juansantiagoamarres.online>",'

count = content.count(old)
assert count == 4
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print(f"OK, {count} reemplazos hechos")
