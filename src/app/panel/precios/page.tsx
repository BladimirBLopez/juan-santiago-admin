import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditorPrecios from "./EditorPrecios";

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
};

export default async function PreciosPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const precios = await prisma.precio.findMany();

  return (
    <main className="px-4 py-5 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold tracking-tight mb-5 text-[#0f0f14] dark:text-[#e8eaed]">Precios</h1>
      <div className="space-y-2.5">
        {precios.map((p) => (
          <EditorPrecios
            key={p.servicio}
            servicio={p.servicio}
            label={SERVICIO_LABELS[p.servicio] ?? p.servicio}
            montoInicial={p.monto}
          />
        ))}
      </div>
    </main>
  );
}
