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
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-[#262b35] bg-[#161a22] p-7 space-y-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="h-8 w-8 rounded bg-[#c9a24b] flex items-center justify-center text-[#0f1115] text-sm font-bold">
            JS
          </span>
          <div>
            <p className="text-sm font-semibold text-[#e8eaed]">Panel Maestro</p>
            <p className="text-xs text-[#5d6573]">Juan Santiago</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-[#9099a8]">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full mt-1 rounded-lg border border-[#262b35] bg-[#0f1115] text-[#e8eaed] px-3 py-2 outline-none focus:border-[#c9a24b]/50"
            required
          />
        </div>

        <div>
          <label className="text-xs text-[#9099a8]">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 rounded-lg border border-[#262b35] bg-[#0f1115] text-[#e8eaed] px-3 py-2 outline-none focus:border-[#c9a24b]/50"
            required
          />
        </div>

        {error && <p className="text-sm text-[#e8752c]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#c9a24b] text-[#0f1115] font-medium text-sm py-2.5 transition hover:bg-[#d9b25b] disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
