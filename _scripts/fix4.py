path = "src/app/api/consultas/manual/route.ts"
with open(path, "r") as f:
    content = f.read()

old1 = '''import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";'''
new1 = '''import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notificarNuevaConsulta } from "@/lib/email";'''
assert content.count(old1) == 1
content = content.replace(old1, new1)

old2 = '''    if (yaPagado) {
      await prisma.pago.create({
        data: {
          consultaId: consulta.id,
          monto,
          comprobanteUrl: "PAGO_MANUAL_SIN_COMPROBANTE",
          estado: "APROBADO",
          aprobadoAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, consultaId: consulta.id }, { status: 201 });'''
new2 = '''    if (yaPagado) {
      await prisma.pago.create({
        data: {
          consultaId: consulta.id,
          monto,
          comprobanteUrl: "PAGO_MANUAL_SIN_COMPROBANTE",
          estado: "APROBADO",
          aprobadoAt: new Date(),
        },
      });
    }

    await notificarNuevaConsulta({
      nombre: cliente.nombre,
      servicio,
      situacion: consulta.situacion,
      telefono: cliente.telefono,
    });

    return NextResponse.json({ success: true, consultaId: consulta.id }, { status: 201 });'''
assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK 4")
