path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

old = '''  fechaCita    DateTime?
  citaExpiraEn DateTime?'''

new = '''  fechaCita    DateTime?
  citaExpiraEn DateTime?
  googleEventId String?'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
