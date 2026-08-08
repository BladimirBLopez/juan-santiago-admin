"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CLOUDINARY_CLOUD = "dkq95jus0";
const CLOUDINARY_PRESET = "juan-santiago-comprobantes";

const SERVICIOS = [
  { value: "", label: "Sin especificar" },
  { value: "AMARRE", label: "Amarre de Amor" },
  { value: "UNION_PAREJA", label: "Unión de Parejas" },
  { value: "ENDULZAMIENTO", label: "Endulzamiento" },
  { value: "RETORNO", label: "Retorno del Ser Amado" },
  { value: "ALEJAMIENTO", label: "Alejamiento de Terceros" },
  { value: "CONSULTA_TAROT", label: "Consulta de Tarot" },
  { value: "CONSULTA_COCA", label: "Consulta de Hojas de Coca" },
];

export default function FormularioTestimonio() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [servicio, setServicio] = useState("");
  const [texto, setTexto] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  function detectarTipo(file: File): "IMAGEN" | "VIDEO" | "AUDIO" {
    if (file.type.startsWith("video/")) return "VIDEO";
    if (file.type.startsWith("audio/")) return "AUDIO";
    return "IMAGEN";
  }

  async function guardar() {
    if (!nombre || !texto) {
      toast.error("Nombre y testimonio son obligatorios");
      return;
    }

    setSubiendo(true);

    try {
      let mediaUrl = null;
      let mediaTipo = null;

      if (archivo) {
        const tipo = detectarTipo(archivo);
        const resourceType = tipo === "IMAGEN" ? "image" : tipo === "VIDEO" ? "video" : "video";

        const formData = new FormData();
        formData.append("file", archivo);
        formData.append("upload_preset", CLOUDINARY_PRESET);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${resourceType}/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadRes.ok) throw new Error("Error al subir archivo");
        const uploadData = await uploadRes.json();
        mediaUrl = uploadData.secure_url;
        mediaTipo = tipo;
      }

      const res = await fetch("/api/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, servicio: servicio || null, texto, mediaUrl, mediaTipo }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      toast.success("Testimonio agregado");
      setNombre("");
      setServicio("");
      setTexto("");
      setArchivo(null);
      router.refresh();
    } catch {
      toast.error("Hubo un problema al guardar el testimonio");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-4">
      <h2 className="text-sm font-medium text-[#18181b] dark:text-[#e8eaed] mb-3">
        Agregar testimonio
      </h2>

      <div className="space-y-2.5">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del cliente"
          className="w-full text-sm rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
        />

        <select
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
          className="w-full text-sm rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
        >
          {SERVICIOS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          placeholder="Escribe el testimonio del cliente..."
          className="w-full text-sm rounded-lg border border-[#e4e4e7] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
        />

        <div>
          <label className="text-xs text-[#71717a]">Foto, video o audio (opcional)</label>
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            className="w-full mt-1 text-xs text-[#71717a] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#6366f1] file:text-white file:text-xs file:font-medium"
          />
        </div>
      </div>

      <button
        onClick={guardar}
        disabled={subiendo}
        className="mt-3 text-xs bg-[#6366f1] text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {subiendo ? "Guardando..." : "Guardar testimonio"}
      </button>
    </div>
  );
}
