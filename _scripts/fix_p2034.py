path = "src/app/api/citas/reservar/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''    } catch (err) {
      if (err instanceof Error && err.message === "HORARIO_OCUPADO") {
        return NextResponse.json(
          { error: "Ese horario ya no esta disponible" },
          { status: 409, headers: corsHeaders(req.headers.get("origin")) }
        );
      }
      throw err;
    }'''

new = '''    } catch (err) {
      const esConflicto =
        (err instanceof Error && err.message === "HORARIO_OCUPADO") ||
        (typeof err === "object" && err !== null && "code" in err && err.code === "P2034");
      if (esConflicto) {
        return NextResponse.json(
          { error: "Ese horario ya no esta disponible" },
          { status: 409, headers: corsHeaders(req.headers.get("origin")) }
        );
      }
      throw err;
    }'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
