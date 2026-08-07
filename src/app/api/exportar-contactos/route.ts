import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clientes = await prisma.cliente.findMany({
    where: { telefono: { not: null } },
    orderBy: { nombre: "asc" },
  });

  const vcards = clientes
    .map((c) => {
      const telefono = c.telefono!.replace(/\D/g, "");
      return `BEGIN:VCARD
VERSION:3.0
FN:${c.nombre}
TEL;TYPE=CELL:+591${telefono}
END:VCARD`;
    })
    .join("\n");

  return new NextResponse(vcards, {
    headers: {
      "Content-Type": "text/vcard",
      "Content-Disposition": 'attachment; filename="clientes-juan-santiago.vcf"',
    },
  });
}
