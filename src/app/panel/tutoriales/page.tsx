import Link from "next/link";
import { ArrowLeft, Video, ListChecks, Calendar, TrendingUp, DollarSign, Star, Bell, Globe } from "lucide-react";

type Seccion = {
  id: string;
  icono: React.ElementType;
  titulo: string;
  pasos: string[];
  videoUrl?: string;
};

const secciones: Seccion[] = [
  {
    id: "consultas",
    icono: ListChecks,
    titulo: "Consultas — su lista de clientes",
    pasos: [
      "Aquí aparecen todas las personas que se contactaron desde su página web.",
      "Cada consulta tiene 3 pasos: Nuevo → En proceso → Completado. Toque el paso a medida que avanza.",
      "En \"Más opciones\" puede editar el nombre y teléfono real del cliente, dejar una nota privada, o eliminar una consulta que no era real.",
      "El botón verde \"Copiar link de pago\" genera un enlace para mandarle al cliente por WhatsApp.",
    ],
  },
  {
    id: "calendario",
    icono: Calendar,
    titulo: "Calendario — sus citas por videollamada",
    pasos: [
      "Aquí ve únicamente las citas de Tarot y Hojas de Coca, con fecha y hora exacta.",
      "Toque un día para ver las citas de esa fecha.",
      "✓ Completado (verde) significa que la cita ya pasó y el cliente pagó.",
      "⏱ Vencida sin pago (ámbar) significa que la cita ya pasó pero el cliente nunca pagó — conviene contactarlo.",
    ],
  },
  {
    id: "reportes",
    icono: TrendingUp,
    titulo: "Reportes — cómo va su negocio",
    pasos: [
      "Vea sus consultas de este mes y consultas totales.",
      "Resultados: cuántas personas empezaron un trabajo y cuántos terminó.",
      "Gráfico de ingresos de los últimos 6 meses.",
      "Puede descargar un PDF del reporte completo o exportar sus contactos.",
    ],
  },
  {
    id: "precios",
    icono: DollarSign,
    titulo: "Precios",
    pasos: [
      "Configure cuánto cobra por cada servicio.",
      "Cualquier cambio se refleja automáticamente en los links de pago que genera para sus clientes.",
    ],
  },
  {
    id: "testimonios",
    icono: Star,
    titulo: "Testimonios",
    pasos: [
      "Agregue testimonios de clientes satisfechos, con foto o video.",
      "Se muestran en su página web para generar más confianza en nuevos visitantes.",
    ],
  },
  {
    id: "notificaciones",
    icono: Bell,
    titulo: "La campanita de notificaciones",
    pasos: [
      "Le avisa cuando alguien agenda una cita nueva.",
      "Le avisa cuando un cliente sube un comprobante de pago.",
      "Le avisa de las citas que tiene programadas para hoy.",
      "El número rojo indica cuántas notificaciones tiene pendientes de revisar.",
    ],
  },
  {
    id: "pagina-web",
    icono: Globe,
    titulo: "Su página web — lo que ven sus clientes",
    pasos: [
      "Horóscopo gratis y tirada de Tarot gratis, para atraer visitantes.",
      "Sofía, su asistente virtual, conversa y agenda citas por su cuenta.",
      "Sección para agendar cita de Tarot o Coca eligiendo día y hora.",
      "Botones de WhatsApp para cada trabajo (Amarre, Unión, Endulzamiento, etc.).",
      "Todo lo que pasa en su página queda registrado automáticamente en este panel.",
    ],
  },
];

export default function TutorialesPage() {
  return (
    <main className="px-4 py-5 max-w-2xl mx-auto pb-24">
      <Link
        href="/panel"
        className="inline-flex items-center gap-1.5 text-sm text-[#6366f1] font-medium mb-4"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Volver al panel
      </Link>

      <h1 className="text-xl font-semibold tracking-tight mb-1 text-[#0f0f14] dark:text-[#e8eaed]">
        Tutoriales
      </h1>
      <p className="text-sm text-[#6b6b80] mb-6">
        Cómo usar su sistema, paso a paso
      </p>

      <div className="space-y-4">
        {secciones.map((s) => {
          const Icon = s.icono;
          return (
            <div
              key={s.id}
              className="rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] p-4"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6366f10f]">
                  <Icon className="h-4.5 w-4.5 text-[#6366f1]" strokeWidth={2} />
                </span>
                <h2 className="text-sm font-semibold text-[#0f0f14] dark:text-[#e8eaed]">
                  {s.titulo}
                </h2>
              </div>

              <ul className="space-y-1.5 mb-3">
                {s.pasos.map((paso, i) => (
                  <li key={i} className="text-[13px] text-[#4a4a58] dark:text-[#c4c9d4] leading-relaxed flex gap-2">
                    <span className="text-[#6366f1] shrink-0">•</span>
                    <span>{paso}</span>
                  </li>
                ))}
              </ul>

              {s.videoUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={s.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#e5e5eb] dark:border-[#2a2a3d] py-6 text-center">
                  <Video className="h-5 w-5 text-[#9099a8]" strokeWidth={2} />
                  <p className="text-xs text-[#9099a8]">Video próximamente</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
