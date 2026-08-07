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
  ];

  return (
    <nav className="px-4 flex gap-1 pb-0">
      {links.map((link) => {
        const activo = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs px-3 py-2 border-b-2 transition"
            style={{
              borderColor: activo ? "#8b5cf6" : "transparent",
              color: activo ? "#e8eaed" : "#6b6b80",
              fontWeight: activo ? 500 : 400,
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
