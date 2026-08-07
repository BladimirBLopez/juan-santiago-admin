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
    <div className="min-h-screen flex items-center justify-center bg-[#1a0505] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-[#c9a24b]/30 bg-[#2a0a12] p-7 space-y-5"
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a24b]">
            Altar del Tata Bombori
          </p>
          <h1
            className="mt-1 text-2xl text-[#f0d78c]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Panel del Maestro
          </h1>
        </div>

        <div>
          <label className="text-xs text-[#f5e6d3]/60">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full mt-1 rounded-lg border border-[#c9a24b]/30 bg-[#1a0505] text-[#f5e6d3] px-3 py-2 outline-none focus:border-[#c9a24b]"
            required
          />
        </div>

        <div>
          <label className="text-xs text-[#f5e6d3]/60">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 rounded-lg border border-[#c9a24b]/30 bg-[#1a0505] text-[#f5e6d3] px-3 py-2 outline-none focus:border-[#c9a24b]"
            required
          />
        </div>

        {error && <p className="text-sm text-[#e8752c]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-b from-[#e6c476] to-[#c9a24b] text-[#1a0505] font-bold uppercase tracking-wider text-sm py-3 transition hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
