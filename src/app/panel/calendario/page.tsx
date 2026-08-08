import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CalendarioConsultas from "./CalendarioConsultas";
import ConectarGoogle from "./ConectarGoogle";

export default async function CalendarioPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const conectado = !!(session as typeof session & { googleAccessToken?: string }).googleAccessToken;

  const consultas = await prisma.consulta.findMany({
    include: { cliente: true },
    orderBy: { createdAt: "desc" },
  });

  const eventos = consultas.map((c) => ({
    id: c.id,
    clienteId: c.cliente.id,
    nombre: c.cliente.nombre,
    servicio: c.servicio,
    fecha: c.createdAt,
    fechaInicio: c.fechaInicio,
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
