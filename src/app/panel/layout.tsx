import { signOut } from "@/auth";
import NavPanel from "./NavPanel";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-[#e8eaed]">
      <header className="sticky top-0 z-10 border-b border-[#1e232c] bg-[#0b0d12]/95 backdrop-blur">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#d9b25b] to-[#a5792f] flex items-center justify-center text-[#0b0d12] text-xs font-bold shadow-sm">
              JS
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">Panel Maestro</p>
              <p className="text-[10px] text-[#5d6573] leading-tight">Juan Santiago</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="text-xs text-[#5d6573] hover:text-[#9099a8] transition">
              Salir
            </button>
          </form>
        </div>
        <NavPanel />
      </header>
      {children}
    </div>
  );
}
