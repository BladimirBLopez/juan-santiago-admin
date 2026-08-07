import { signOut } from "@/auth";
import NavPanel from "./NavPanel";
import ThemeToggle from "./ThemeToggle";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed]">
      <header className="sticky top-0 z-10 border-b border-[#e5e5eb] dark:border-[#1f1f2e] bg-white/95 dark:bg-[#0a0a0f]/95 backdrop-blur">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              JS
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">Panel Maestro</p>
              <p className="text-[10px] text-[#6b6b80] leading-tight">Juan Santiago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="text-xs text-[#6b6b80] hover:text-[#9099a8] transition">
                Salir
              </button>
            </form>
          </div>
        </div>
        <NavPanel />
      </header>
      {children}
    </div>
  );
}
