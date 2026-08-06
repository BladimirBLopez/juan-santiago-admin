import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function PanelPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const consultas = await prisma.consulta.findMany({
    include: { cliente: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Consultas</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="text-sm text-neutral-400 underline">
            Cerrar sesión
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {consultas.length === 0 && (
          <p className="text-neutral-500 text-sm">No hay consultas aún.</p>
        )}

        {consultas.map((c) => (
          <div
            key={c.id}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{c.cliente.nombre}</p>
                <p className="text-sm text-neutral-400">{c.servicio}</p>
              </div>
              <span className="text-xs bg-neutral-800 px-2 py-1 rounded">
                {c.estado}
              </span>
            </div>
            <p className="text-sm text-neutral-300 mt-2">{c.situacion}</p>
            <p className="text-xs text-neutral-500 mt-2">
              {c.cliente.telefono ?? "sin teléfono"} ·{" "}
              {new Date(c.createdAt).toLocaleDateString("es-BO")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
