path = "src/lib/email.ts"
with open(path, "r") as f:
    content = f.read()

old = '''import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);'''

new = '''import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

async function obtenerDestinatarios(): Promise<string[]> {
  try {
    const correos = await prisma.correoAutorizado.findMany({ select: { email: true } });
    const lista = correos.map((c) => c.email);
    if (lista.length > 0) return lista;
  } catch (err) {
    console.error("Error obteniendo correos autorizados:", err);
  }
  const fallback = process.env.NOTIFICACION_EMAIL;
  return fallback ? [fallback] : [];
}'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
