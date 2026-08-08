"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavPanel() {
  const pathname = usePathname();

  const links = [
    { href: "/panel", label: "Consultas" },
    { href: "/panel/calendario", label: "Calendario" },
    { href: "/panel/reportes", label: "Reportes" },
    { href: "/panel/precios", label: "Precios" },
    { href: "/panel/testimonios", label: "Testimonios" },
    { href: "/panel/configuracion", label: "Config" },
  ];

  return (
    <nav className="px-5 max-w-3xl mx-auto flex gap-5 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
      {links.map((link) => {
        const activo = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="text-[13px] py-2.5 border-b-2 transition font-medium shrink-0"
            style={{
              borderColor: activo ? "#6366f1" : "transparent",
              color: activo ? "#18181b" : "#a1a1aa",
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
