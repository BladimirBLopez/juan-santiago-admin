path = "src/app/panel/EditarConsulta.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";'''

new = '''import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''    return (
      <button
        onClick={() => setEditando(true)}
        className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#6366f1]/40 text-[#6366f1] text-xs font-medium py-2.5 hover:bg-[#6366f10f] transition"
      >
        ✏️ Editar nombre, teléfono o situación
      </button>
    );'''

new2 = '''    return (
      <button
        onClick={() => setEditando(true)}
        className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] py-3.5 hover:border-[#6366f1]/40 hover:bg-[#6366f10a] transition"
      >
        <Pencil className="h-5 w-5 text-[#6366f1]" strokeWidth={2} />
        <span className="text-xs font-medium text-[#0f0f14] dark:text-[#e8eaed]">Editar datos</span>
      </button>
    );'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK")
