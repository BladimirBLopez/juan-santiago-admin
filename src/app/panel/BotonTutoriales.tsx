import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function BotonTutoriales() {
  return (
    <Link
      href="/panel/tutoriales"
      className="fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-[0_8px_24px_-4px_rgba(99,102,241,0.5)] transition hover:scale-105 hover:bg-[#4f46e5]"
      aria-label="Tutoriales"
    >
      <GraduationCap className="h-6 w-6" strokeWidth={2} />
    </Link>
  );
}
