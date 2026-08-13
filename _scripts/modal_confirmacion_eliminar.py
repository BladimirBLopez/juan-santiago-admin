path = "src/app/panel/AccionesConsulta.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";'''

new = '''import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''  if (confirmando) {
    return (
      <div className="rounded-lg border border-[#e8752c]/40 bg-[#e8752c]/5 p-3">
        <p className="text-xs text-[#e8752c] mb-2">¿Eliminar esta consulta? No se puede deshacer.</p>
        <div className="flex gap-2">
          <button
            onClick={eliminar}
            disabled={eliminando}
            className="flex-1 rounded-md bg-[#e8752c] text-white text-xs font-medium py-2 disabled:opacity-50"
          >
            {eliminando ? "Eliminando..." : "Sí, eliminar"}
          </button>
          <button
            onClick={() => setConfirmando(false)}
            className="flex-1 rounded-md border border-[#2a2a3d] text-[#9099a8] text-xs font-medium py-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] py-3.5 hover:border-[#e8752c]/40 hover:bg-[#e8752c0a] transition"
    >
      <Trash2 className="h-5 w-5 text-[#e8752c]" strokeWidth={2} />
      <span className="text-xs font-medium text-[#0f0f14] dark:text-[#e8eaed]">Eliminar</span>
    </button>
  );
}'''

new2 = '''  return (
    <>
      <button
        onClick={() => setConfirmando(true)}
        className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] py-3.5 hover:border-[#e8752c]/40 hover:bg-[#e8752c0a] transition"
      >
        <Trash2 className="h-5 w-5 text-[#e8752c]" strokeWidth={2} />
        <span className="text-xs font-medium text-[#0f0f14] dark:text-[#e8eaed]">Eliminar</span>
      </button>

      {confirmando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-[#17171f] p-5 text-center shadow-xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8752c]/10">
              <AlertTriangle className="h-6 w-6 text-[#e8752c]" strokeWidth={2} />
            </div>
            <p className="text-sm font-medium text-[#0f0f14] dark:text-[#e8eaed] mb-1">
              ¿Eliminar esta consulta?
            </p>
            <p className="text-xs text-[#6b6b80] mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmando(false)}
                className="flex-1 rounded-lg border border-[#e5e5eb] dark:border-[#2a2a3d] text-[#9099a8] text-sm font-medium py-2.5"
              >
                Cancelar
              </button>
              <button
                onClick={eliminar}
                disabled={eliminando}
                className="flex-1 rounded-lg bg-[#e8752c] text-white text-sm font-medium py-2.5 disabled:opacity-50"
              >
                {eliminando ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK")
