path = "src/app/api/consultas/[id]/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";'''

new = '''import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { eliminarEventoCalendario } from "@/lib/googleCalendar";'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
