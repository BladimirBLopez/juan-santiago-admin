import type { Metadata } from "next";
import PagoClient from "./PagoClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Confirmar pago — Maestro Juan Santiago",
    description: "Escanea el QR y sube tu comprobante para confirmar tu consulta con el Maestro Juan Santiago.",
    openGraph: {
      title: "Confirmar pago — Maestro Juan Santiago",
      description: "Escanea el QR y sube tu comprobante para confirmar tu consulta.",
      images: ["https://res.cloudinary.com/dkq95jus0/image/upload/altar-principal-3"],
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
