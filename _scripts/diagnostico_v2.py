path = "src/app/api/diagnostico/route.ts"
content = '''import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function GET() {
  const resultado: Record<string, unknown> = {};

  const correos = await prisma.correoAutorizado.findMany({ select: { email: true } });
  const destinos = correos.map((c) => c.email);
  resultado.destinos = destinos;

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const respuesta = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destinos,
      subject: "Prueba de diagnostico",
      html: "<p>Esto es una prueba</p>",
    });
    resultado.respuestaResend = respuesta;
  } catch (err) {
    resultado.errorResend = String(err);
  }

  return NextResponse.json(resultado);
}
'''

with open(path, "w") as f:
    f.write(content)

print("OK")
