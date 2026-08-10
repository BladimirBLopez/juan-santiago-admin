import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PagoClient from "./PagoClient";

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Unión de Parejas",
  CONSULTA_TAROT: "Consulta de Tarot",
  CONSULTA_COCA: "Consulta de Hojas de Coca",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const consulta = await prisma.consulta.findUnique({
    where: { id },
    include: { cliente: true },
  });

  const nombre = consulta?.cliente.nombre ?? "";
  const servicioLabel = consulta ? SERVICIO_LABELS[consulta.servicio] ?? consulta.servicio : "";

  const titulo = consulta
    ? `Pago de ${nombre} — ${servicioLabel}`
    : "Confirmar pago — Maestro Juan Santiago";

  return {
    title: titulo,
    description: "Escanea el QR y sube tu comprobante para confirmar tu consulta con el Maestro Juan Santiago.",
    openGraph: {
      title: titulo,
      description: "Escanea el QR y sube tu comprobante para confirmar tu consulta.",
      images: ["https://res.cloudinary.com/dkq95jus0/image/upload/icon-512"],
    },
  };
}

export default function PagoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ monto?: string }>;
}) {
  return <PagoClient params={params} searchParams={searchParams} />;
}
