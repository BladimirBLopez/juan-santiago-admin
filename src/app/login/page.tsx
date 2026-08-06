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
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-neutral-900 rounded-xl p-6 space-y-4 border border-neutral-800"
      >
        <h1 className="text-xl font-semibold text-white text-center">
          Panel Maestro Juan Santiago
        </h1>

        <div>
          <label className="text-sm text-neutral-400">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full mt-1 rounded-md bg-neutral-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-amber-600"
            required
          />
        </div>

        <div>
          <label className="text-sm text-neutral-400">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 rounded-md bg-neutral-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-amber-600"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-md py-2 font-medium transition disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
