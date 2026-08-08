import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FormularioTestimonio from "./FormularioTestimonio";
import ListaTestimonios from "./ListaTestimonios";

export default async function TestimoniosPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const testimonios = await prisma.testimonio.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="px-5 py-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-[22px] font-semibold tracking-tight text-[#18181b] dark:text-[#e8eaed] mb-1">
        Testimonios
      </h1>

      <FormularioTestimonio />
      <ListaTestimonios testimonios={testimonios} />
    </main>
  );
}
