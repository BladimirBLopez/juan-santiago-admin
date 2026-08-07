import { signOut } from "@/auth";
import Link from "next/link";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#e8eaed]">
      <header className="sticky top-0 z-10 border-b border-[#262b35] bg-[#0f1115]/95 backdrop-blur">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-[#c9a24b] flex items-center justify-center text-[#0f1115] text-xs font-bold">
              JS
            </span>
            <span className="text-sm font-semibold">Panel Maestro</span>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="text-xs text-[#9099a8] hover:text-[#e8eaed] transition">
              Cerrar sesión
            </button>
          </form>
        </div>
        <nav className="px-4 flex gap-1 pb-2">
          <Link
            href="/panel"
            className="text-xs px-3 py-1.5 rounded-md text-[#9099a8] hover:text-[#e8eaed] hover:bg-[#1c2029] transition"
          >
            Consultas
          </Link>
          <Link
            href="/panel/reportes"
            className="text-xs px-3 py-1.5 rounded-md text-[#9099a8] hover:text-[#e8eaed] hover:bg-[#1c2029] transition"
          >
            Reportes
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
