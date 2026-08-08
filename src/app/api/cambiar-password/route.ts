import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { passwordActual, passwordNueva } = body;

  if (!passwordActual || !passwordNueva || passwordNueva.length < 6) {
    return NextResponse.json(
      { error: "La nueva contraseña debe tener al menos 6 caracteres" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { usuario: "juansantiago" },
  });

  if (!admin) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const valido = await bcrypt.compare(passwordActual, admin.password);
  if (!valido) {
    return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });
  }

  const nuevoHash = await bcrypt.hash(passwordNueva, 10);
  await prisma.admin.update({
    where: { usuario: "juansantiago" },
    data: { password: nuevoHash },
  });

  return NextResponse.json({ success: true });
}
