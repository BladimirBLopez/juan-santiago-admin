path = "src/app/api/citas/reservar/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''    return NextResponse.json(
      {
        success: true,
        consultaId: consulta.id,
        clienteId: cliente.id,
        citaExpiraEn: citaExpiraEn.toISOString(),
      },
      { status: 201, headers: corsHeaders(req.headers.get("origin")) }
    );'''

new = '''    return NextResponse.json(
      {
        success: true,
        consultaId: consulta.id,
        clienteId: cliente.id,
        citaExpiraEn: citaExpiraEn.toISOString(),
        debugGoogleEventId: googleEventId,
      },
      { status: 201, headers: corsHeaders(req.headers.get("origin")) }
    );'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
