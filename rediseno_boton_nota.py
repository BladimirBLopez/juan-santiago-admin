path = "src/app/panel/NotasConsulta.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''import { useState } from "react";
import { toast } from "sonner";'''

new = '''import { useState } from "react";
import { toast } from "sonner";
import { StickyNote } from "lucide-react";'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''    return (
      <button
        onClick={() => setAbierto(true)}
        className="mt-3 text-xs text-[#6b6b80] hover:text-[#9099a8] transition"
      >
        + Agregar nota privada
      </button>
    );'''

new2 = '''    return (
      <button
        onClick={() => setAbierto(true)}
        className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#17171f] py-3.5 hover:border-[#9099a8]/40 hover:bg-[#9099a80a] transition"
      >
        <StickyNote className="h-5 w-5 text-[#9099a8]" strokeWidth={2} />
        <span className="text-xs font-medium text-[#0f0f14] dark:text-[#e8eaed]">Nota privada</span>
      </button>
    );'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK")
