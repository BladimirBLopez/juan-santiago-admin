"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      usuario,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Usuario o contraseña incorrectos");
      return;
    }

    router.push("/panel");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0f] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#131319] p-7 space-y-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#818cf8] to-[#4f46e5] flex items-center justify-center text-white text-sm font-bold">
            JS
          </span>
          <div>
            <p className="text-sm font-semibold text-[#e8eaed]">Panel Maestro</p>
            <p className="text-xs text-[#6b6b80]">Juan Santiago</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-[#9099a8]">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full mt-1 rounded-lg border border-[#e5e5eb] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
            required
          />
        </div>

        <div>
          <label className="text-xs text-[#9099a8]">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 rounded-lg border border-[#e5e5eb] dark:border-[#2a2a3d] bg-[#fafafa] dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] px-3 py-2 outline-none focus:border-[#6366f1]/50"
            required
          />
        </div>

        {error && <p className="text-sm text-[#f97316]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#6366f1] text-white font-medium text-sm py-2.5 transition hover:bg-[#4f46e5] disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
