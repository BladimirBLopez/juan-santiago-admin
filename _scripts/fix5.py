path = "src/app/panel/clientes/[id]/NuevoServicio.tsx"
with open(path, "r") as f:
    content = f.read()

old1 = '''const SERVICIOS = [
  { value: "AMARRE", label: "Amarre de Amor" },
  { value: "ENDULZAMIENTO", label: "Endulzamiento" },
  { value: "RETORNO", label: "Retorno del Ser Amado" },
  { value: "ALEJAMIENTO", label: "Alejamiento de Terceros" },
  { value: "UNION_PAREJA", label: "Unión de Parejas" },
];'''
new1 = '''const CONSULTAS = [
  { value: "CONSULTA_TAROT", label: "Consulta de Tarot" },
  { value: "CONSULTA_COCA", label: "Consulta de Hojas de Coca" },
];

const TRABAJOS = [
  { value: "AMARRE", label: "Amarre de Amor" },
  { value: "ENDULZAMIENTO", label: "Endulzamiento" },
  { value: "RETORNO", label: "Retorno del Ser Amado" },
  { value: "ALEJAMIENTO", label: "Alejamiento de Terceros" },
  { value: "UNION_PAREJA", label: "Unión de Parejas" },
];'''
assert content.count(old1) == 1
content = content.replace(old1, new1)

old2 = '''  const [servicio, setServicio] = useState(SERVICIOS[0].value);'''
new2 = '''  const [servicio, setServicio] = useState(CONSULTAS[0].value);'''
assert content.count(old2) == 1
content = content.replace(old2, new2)

old3 = '''      <select
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
        className="w-full rounded-md border border-[#2a2a3d] bg-[#0a0a0f] text-[#e8eaed] text-xs px-2.5 py-2"
      >
        {SERVICIOS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <textarea
        value={situacion}
        onChange={(e) => setSituacion(e.target.value)}
        placeholder="Notas o situación (opcional)"
        rows={2}
        className="w-full rounded-md border border-[#2a2a3d] bg-[#0a0a0f] text-[#e8eaed] text-xs px-2.5 py-2 outline-none"
      />'''
new3 = '''      <select
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
        className="w-full rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-xs px-2.5 py-2"
      >
        <optgroup label="Consultas (primero siempre)">
          {CONSULTAS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Trabajos">
          {TRABAJOS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </optgroup>
      </select>

      <textarea
        value={situacion}
        onChange={(e) => setSituacion(e.target.value)}
        placeholder="Notas o situación (opcional)"
        rows={2}
        className="w-full rounded-md border border-[#e5e5eb] dark:border-[#2a2a3d] bg-white dark:bg-[#0a0a0f] text-[#0f0f14] dark:text-[#e8eaed] text-xs px-2.5 py-2 outline-none"
      />'''
assert content.count(old3) == 1
content = content.replace(old3, new3)

with open(path, "w") as f:
    f.write(content)

print("OK 5")
