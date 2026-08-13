path = "src/app/api/citas/reservar/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''    console.log("DEBUG_GOOGLE_EVENT_ID:", googleEventId);

    if (googleEventId) {
      await prisma.consulta.update({
        where: { id: consulta.id },
        data: { googleEventId },
      });
      console.log("DEBUG_GUARDADO_OK");
    } else {
      console.log("DEBUG_NO_SE_GUARDO_PORQUE_ID_ES_NULL");
    }'''

new = '''    if (googleEventId) {
      await prisma.consulta.update({
        where: { id: consulta.id },
        data: { googleEventId },
      });
    }'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''        citaExpiraEn: citaExpiraEn.toISOString(),
        debugGoogleEventId: googleEventId,
      },'''

new2 = '''        citaExpiraEn: citaExpiraEn.toISOString(),
      },'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK")
