import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CalendarioConsultas from "./CalendarioConsultas";
import ConectarGoogle from "./ConectarGoogle";
import { completarCitasVencidas } from "@/lib/completarCitasVencidas";

export default async function CalendarioPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const conectado = !!(session as typeof session & { googleAccessToken?: string }).googleAccessToken;

  await completarCitasVencidas();

  const consultas = await prisma.consulta.findMany({
    include: { cliente: true },
    orderBy: { createdAt: "desc" },
  });

  const eventos = consultas.map((c) => ({
    id: c.id,
    clienteId: c.cliente.id,
    nombre: c.cliente.nombre,
    servicio: c.servicio,
    fecha: c.fechaCita ?? c.createdAt,
    fechaInicio: c.fechaInicio,
    esCita: Boolean(c.fechaCita),
    horaCita: c.fechaCita,
  }));

  return (
    <main className="px-4 py-5 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold tracking-tight mb-5 text-[#0f0f14] dark:text-[#e8eaed]">
        Calendario
      </h1>
      <ConectarGoogle conectado={conectado} />
      <CalendarioConsultas eventos={eventos} />
    </main>
  );
}
