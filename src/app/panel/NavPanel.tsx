"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavPanel() {
  const pathname = usePathname();

  const links = [
    { href: "/panel", label: "Consultas" },
    { href: "/panel/reportes", label: "Reportes" },
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
              borderColor: activo ? "#c9a24b" : "transparent",
              color: activo ? "#e8eaed" : "#5d6573",
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
