import { signOut } from "@/auth";
import NavPanel from "./NavPanel";
import ThemeToggle from "./ThemeToggle";
import Notificaciones from "./Notificaciones";
import BotonTutoriales from "./BotonTutoriales";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef0f3] dark:bg-[#0a0a0f] text-[#18181b] dark:text-[#e8eaed]">
      <header className="sticky top-0 z-10 border-b border-[#e4e4e7] dark:border-[#1f1f2e] bg-white/80 dark:bg-[#0a0a0f]/95 backdrop-blur-md">
        <div className="px-5 py-3.5 flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-md bg-[#6366f1] flex items-center justify-center text-white text-xs font-semibold">
              JS
            </span>
            <div>
              <p className="text-sm font-medium leading-tight tracking-tight">Panel Maestro</p>
              <p className="text-[11px] text-[#71717a] leading-tight">Juan Santiago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Notificaciones />
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="text-xs text-[#71717a] hover:text-[#18181b] dark:hover:text-[#e8eaed] transition">
                Salir
              </button>
            </form>
          </div>
        </div>
        <NavPanel />
      </header>
      {children}
      <BotonTutoriales />
    </div>
  );
}
