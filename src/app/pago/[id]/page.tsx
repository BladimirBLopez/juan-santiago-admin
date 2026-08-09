"use client";

import { useState, useEffect, use } from "react";
import Tesseract from "tesseract.js";

const CLOUDINARY_CLOUD = "dkq95jus0";
const CLOUDINARY_PRESET = "juan-santiago-comprobantes";

export default function PagoPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ monto?: string }> }) {
  const { id } = use(params);
  const { monto: montoParam } = use(searchParams);
  const [monto, setMonto] = useState(montoParam ?? "450");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [analizando, setAnalizando] = useState(false);
  const [montoDetectado, setMontoDetectado] = useState<string | null>(null);
  const [verificado, setVerificado] = useState<"si" | "no" | null>(null);

  useEffect(() => {
    if (!archivo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(archivo);
    setPreview(url);
    analizarComprobante(archivo);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  async function analizarComprobante(file: File) {
    setAnalizando(true);
    setMontoDetectado(null);
    setVerificado(null);

    try {
      const { data } = await Tesseract.recognize(file, "spa");
      const texto = data.text;

      const numeros = texto.match(/\d{1,4}[.,]?\d{0,2}/g) ?? [];
      const numerosLimpios = numeros
        .map((n) => n.replace(",", "."))
        .map(Number)
        .filter((n) => n >= 10 && n <= 100000);

      if (numerosLimpios.length > 0) {
        const montoActual = Number(monto);
        const coincide = numerosLimpios.some(
          (n) => Math.abs(n - montoActual) < 1
        );

        setMontoDetectado(numerosLimpios.join(", "));
        setVerificado(coincide ? "si" : "no");
      } else {
        setVerificado(null);
      }
    } catch {
      setVerificado(null);
    } finally {
      setAnalizando(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!archivo) {
      setError("Sube una foto del comprobante");
      return;
    }

    setEnviando(true);

    try {
      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) throw new Error("Error al subir la imagen");

      const uploadData = await uploadRes.json();

      const res = await fetch("/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultaId: id,
          monto,
          comprobanteUrl: uploadData.secure_url,
          verificadoOcr: verificado === "si",
        }),
      });

      if (!res.ok) throw new Error("Error al registrar el pago");

      setEnviado(true);
    } catch {
      setError("Hubo un problema al enviar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <main className="min-h-screen bg-[#0f1115] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-2xl mb-2">✓</p>
          <h1 className="text-lg font-semibold text-[#e8eaed]">
            Comprobante recibido
          </h1>
          <p className="text-sm text-[#9099a8] mt-2">
            El Maestro revisará tu pago y te confirmará por WhatsApp.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f1115] px-6 py-12">
      <div className="mx-auto max-w-sm">
        <h1 className="text-xl font-semibold text-[#e8eaed] text-center mb-1">
          Confirmar tu pago
        </h1>
        <p className="text-sm text-[#9099a8] text-center mb-6">
          Escanea el QR para pagar, luego sube tu comprobante
        </p>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#262b35] bg-[#161a22] p-3 text-center">
            <img
              src="https://res.cloudinary.com/dkq95jus0/image/upload/qr-union"
              alt="QR Union"
              className="mx-auto rounded-lg w-full"
            />
            <p className="text-xs text-[#9099a8] mt-2 font-medium">Unión / Transferencia</p>
          </div>
          <div className="rounded-xl border border-[#262b35] bg-[#161a22] p-3 text-center">
            <img
              src="https://res.cloudinary.com/dkq95jus0/image/upload/qr-tigomoney"
              alt="QR Tigo Money"
              className="mx-auto rounded-lg w-full"
            />
            <p className="text-xs text-[#9099a8] mt-2 font-medium">Tigo Money</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#9099a8]">Monto pagado (Bs)</label>
            <input
              type="number"
              required
              min="1"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full mt-1 rounded-lg border border-[#262b35] bg-[#161a22] text-[#e8eaed] px-3 py-2.5 outline-none focus:border-[#c9a24b]/50"
              placeholder="Ej: 150"
            />
          </div>

          <div>
            <label className="text-xs text-[#9099a8]">Foto del comprobante</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              className="w-full mt-1 text-xs text-[#9099a8] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#c9a24b] file:text-[#0f1115] file:text-xs file:font-medium"
            />
          </div>

          {preview && (
            <img src={preview} alt="Vista previa" className="rounded-lg max-h-48 mx-auto" />
          )}

          {analizando && (
            <p className="text-xs text-[#9099a8] text-center">Analizando comprobante...</p>
          )}

          {!analizando && verificado === "si" && (
            <p className="text-xs text-[#22c55e] text-center">
              ✓ Monto detectado coincide ({montoDetectado})
            </p>
          )}

          {!analizando && verificado === "no" && (
            <p className="text-xs text-[#f97316] text-center">
              ⚠️ No pudimos confirmar el monto en la imagen (detectamos: {montoDetectado}). El Maestro lo revisará igual.
            </p>
          )}

          <p className="text-[11px] text-[#5d6573] text-center leading-relaxed">
            Confirma que esta es una foto real de tu comprobante de pago.
            Subir una imagen falsa o incorrecta puede invalidar tu trabajo.
          </p>

          {error && <p className="text-sm text-[#e8752c]">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-[#c9a24b] text-[#0f1115] font-medium text-sm py-3 disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar comprobante"}
          </button>
        </form>
      </div>
    </main>
  );
}
