"use client";

import { useState, useEffect, use } from "react";
import Tesseract from "tesseract.js";
import { Cinzel, Inter } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"] });

const CLOUDINARY_CLOUD = "dkq95jus0";
const CLOUDINARY_PRESET = "juan-santiago-comprobantes";
const NUMERO_MAESTRO = "59175928656";
const MINUTOS_AVISO = 20;

async function descargarImagen(url: string, nombreArchivo: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank");
  }
}

export default function PagoClient({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ monto?: string }> }) {
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
  const [mostrarAvisoAyuda, setMostrarAvisoAyuda] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMostrarAvisoAyuda(true), MINUTOS_AVISO * 60000);
    return () => clearTimeout(timer);
  }, []);

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
      <main
        className={`${inter.className} min-h-screen flex items-center justify-center px-6`}
        style={{ background: "radial-gradient(circle at 50% 20%, #2a1a4a 0%, #1a0f30 35%, #1a0505 75%)" }}
      >
        <div className="text-center max-w-xs">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c9a24b]/15 border border-[#c9a24b]/40">
            <span className="text-2xl text-[#c9a24b]">✓</span>
          </div>
          <h1 className={`${cinzel.className} text-2xl text-[#f0d78c]`}>
            Comprobante recibido
          </h1>
          <p className="text-sm text-[#f5e6d3]/60 mt-3 leading-relaxed">
            El Maestro revisará tu pago y te confirmará por WhatsApp.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`${inter.className} min-h-screen px-5 py-14`}
      style={{ background: "radial-gradient(circle at 50% 10%, #2a1a4a 0%, #1a0f30 35%, #1a0505 75%)" }}
    >
      <div className="mx-auto max-w-sm">
        <p className="text-xs text-center uppercase tracking-[0.3em] text-[#c9a24b] mb-2">
          Maestro Juan Santiago
        </p>
        <h1 className={`${cinzel.className} text-2xl text-[#f0d78c] text-center mb-1`}>
          Confirmar tu pago
        </h1>
        <p className="text-sm text-[#f5e6d3]/55 text-center mb-7">
          Escanea el QR para pagar, luego sube tu comprobante
        </p>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#c9a24b]/25 border-t-4 border-t-[#c9a24b] bg-[#1a0a10]/70 backdrop-blur-md p-3 text-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
            <img
              src="https://res.cloudinary.com/dkq95jus0/image/upload/qr-union"
              alt="QR Union"
              className="mx-auto rounded-lg w-full"
            />
            <p className="text-xs text-[#f5e6d3]/70 mt-2 font-medium">Unión / Transferencia</p>
            <button
              type="button"
              onClick={() =>
                descargarImagen(
                  "https://res.cloudinary.com/dkq95jus0/image/upload/qr-union",
                  "QR-Union-MaestroJuanSantiago.png"
                )
              }
              className="mt-2 text-[11px] text-[#c9a24b] underline underline-offset-2"
            >
              ↓ Descargar QR
            </button>
          </div>
          <div className="rounded-2xl border border-[#c9a24b]/25 border-t-4 border-t-[#c9a24b] bg-[#1a0a10]/70 backdrop-blur-md p-3 text-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
            <img
              src="https://res.cloudinary.com/dkq95jus0/image/upload/qr-tigomoney"
              alt="QR Tigo Money"
              className="mx-auto rounded-lg w-full"
            />
            <p className="text-xs text-[#f5e6d3]/70 mt-2 font-medium">Tigo Money</p>
            <button
              type="button"
              onClick={() =>
                descargarImagen(
                  "https://res.cloudinary.com/dkq95jus0/image/upload/qr-tigomoney",
                  "QR-TigoMoney-MaestroJuanSantiago.png"
                )
              }
              className="mt-2 text-[11px] text-[#c9a24b] underline underline-offset-2"
            >
              ↓ Descargar QR
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-[#c9a24b]/20 bg-[#1a0a10]/70 backdrop-blur-md p-5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]"
        >
          <div>
            <label className="text-[13px] font-medium text-[#f5e6d3]/50">Monto pagado (Bs)</label>
            <input
              type="number"
              required
              min="1"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full mt-1 rounded-lg border border-[#f5e6d3]/15 bg-white/5 text-[#f5ede0] px-3.5 py-2.5 text-[15px] outline-none placeholder:text-[#f5e6d3]/25 focus:border-[#c9a24b]"
              placeholder="Ej: 150"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#f5e6d3]/50">Foto del comprobante</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              className="w-full mt-1 text-xs text-[#f5e6d3]/50 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:bg-gradient-to-br file:from-[#e6c476] file:to-[#c9a24b] file:text-[#1a0505] file:text-xs file:font-semibold"
            />
          </div>

          {preview && (
            <img src={preview} alt="Vista previa" className="rounded-lg max-h-48 mx-auto border border-[#c9a24b]/20" />
          )}

          {analizando && (
            <p className="text-xs text-[#f5e6d3]/50 text-center">Analizando comprobante...</p>
          )}

          {!analizando && verificado === "si" && (
            <p className="text-xs text-[#8ce0a0] text-center">
              ✓ Monto detectado coincide ({montoDetectado})
            </p>
          )}

          {!analizando && verificado === "no" && (
            <p className="text-xs text-[#f5c078] text-center">
              ⚠️ No pudimos confirmar el monto en la imagen (detectamos: {montoDetectado}). El Maestro lo revisará igual.
            </p>
          )}

          <p className="text-[11px] text-[#f5e6d3]/35 text-center leading-relaxed">
            Confirma que esta es una foto real de tu comprobante de pago.
            Subir una imagen falsa o incorrecta puede invalidar tu trabajo.
          </p>

          {error && <p className="text-sm text-[#ff8a70] text-center">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-gradient-to-br from-[#e6c476] to-[#c9a24b] text-[#1a0505] font-semibold text-[15px] py-3 transition disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar comprobante"}
          </button>
        </form>

        {mostrarAvisoAyuda && (
          <div className="mt-4 rounded-2xl border border-[#c9a24b]/25 bg-[#1a0a10]/70 backdrop-blur-md p-4 text-center">
            <p className="text-sm text-[#f5e6d3]/70 mb-3">
              ¿Tenés dudas o problemas para pagar? Escribile directo al Maestro.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${NUMERO_MAESTRO}&text=${encodeURIComponent(
                "Hola Maestro Juan Santiago, tengo dudas para completar el pago de mi consulta."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#22c55e] text-white text-sm font-semibold py-2.5 px-5"
            >
              💬 Escribir al Maestro
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
