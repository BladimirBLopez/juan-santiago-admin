import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CambiarPassword from "./CambiarPassword";
import EditorCorreosAutorizados from "./EditorCorreosAutorizados";
import EditorHorario from "./EditorHorario";
import EditorMensajeBienvenida from "./EditorMensajeBienvenida";

export default async function ConfiguracionPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const config = await prisma.configuracion.findMany();
  const map: Record<string, string> = {};
  config.forEach((c) => {
    map[c.clave] = c.valor;
  });

  return (
    <main className="px-5 py-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-[22px] font-semibold tracking-tight text-[#18181b] dark:text-[#e8eaed] mb-1">
        Configuración
      </h1>

      <EditorHorario horarioInicial={map.horario_atencion ?? ""} />
      <EditorMensajeBienvenida mensajeInicial={map.mensaje_bienvenida ?? ""} />
      <EditorCorreosAutorizados />
      <CambiarPassword />
    </main>
  );
}
