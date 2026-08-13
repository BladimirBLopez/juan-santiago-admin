path1 = "src/app/panel/NuevoClienteManual.tsx"
with open(path1, "r") as f:
    c1 = f.read()

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
assert c1.count(old1) == 1
c1 = c1.replace(old1, new1)

old2 = '''const [servicio, setServicio] = useState(SERVICIOS[0].value);'''
new2 = '''const [servicio, setServicio] = useState(CONSULTAS[0].value);'''
assert c1.count(old2) == 1
c1 = c1.replace(old2, new2)

old3 = '''          {SERVICIOS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>'''
new3 = '''          <optgroup label="Consultas (primero siempre)">
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
        </select>'''
assert c1.count(old3) == 1
c1 = c1.replace(old3, new3)

with open(path1, "w") as f:
    f.write(c1)

print("OK 1")
