"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type Notificacion = {
  tipo: "consulta" | "pago";
  texto: string;
  fecha: string;
  id: string;
};

export default function Notificaciones() {
  const [abierto, setAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    fetch("/api/notificaciones")
      .then((res) => res.json())
      .then((data) => setPendientes(data.pendientes ?? 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!abierto) return;
    setCargando(true);
    fetch("/api/notificaciones")
      .then((res) => res.json())
      .then((data) => {
        setNotificaciones(data.notificaciones ?? []);
        setPendientes(data.pendientes ?? 0);
      })
      .finally(() => setCargando(false));
  }, [abierto]);

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto(!abierto)}
        className="relative text-[#6b6b80] hover:text-[#9099a8] transition"
      >
        <Bell className="h-4 w-4" strokeWidth={2} />
        {pendientes > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-bold text-white">
            {pendientes > 9 ? "9+" : pendientes}
          </span>
        )}
      </button>

      {abierto && (
        <>
          <div
            className="fixed inset-0 z-10 bg-black/20"
            onClick={() => setAbierto(false)}
          />
          <div className="absolute right-0 top-8 z-20 w-72 max-h-80 overflow-y-auto rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] shadow-xl">
            <div className="p-3 border-b border-[#e5e5eb] dark:border-[#2a2a3d]">
              <p className="text-xs font-medium text-[#0f0f14] dark:text-[#e8eaed]">
                Últimos 7 días
              </p>
            </div>

            {cargando && (
              <p className="p-3 text-xs text-[#6b6b80]">Cargando...</p>
            )}

            {!cargando && notificaciones.length === 0 && (
              <p className="p-3 text-xs text-[#6b6b80]">Sin novedades.</p>
            )}

            {!cargando &&
              notificaciones.map((n, i) => (
                <Link
                  key={i}
                  href={`/panel/clientes/${n.id}`}
                  onClick={() => setAbierto(false)}
                  className="block p-3 border-b border-[#e5e5eb] dark:border-[#2a2a3d] last:border-0 hover:bg-[#fafafa] dark:hover:bg-[#17171f] transition"
                >
                  <p className="text-xs text-[#0f0f14] dark:text-[#e8eaed]">
                    {n.tipo === "pago" ? "💰 " : "📩 "}
                    {n.texto}
                  </p>
                  <p className="text-[10px] text-[#6b6b80] mt-0.5">
                    {formatDistanceToNow(new Date(n.fecha), { addSuffix: true, locale: es })}
                  </p>
                </Link>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
