path = "src/app/pago/[id]/PagoClient.tsx"
with open(path, "r") as f:
    content = f.read()

old1 = '''const CLOUDINARY_CLOUD = "dkq95jus0";
const CLOUDINARY_PRESET = "juan-santiago-comprobantes";'''
new1 = '''const CLOUDINARY_CLOUD = "dkq95jus0";
const CLOUDINARY_PRESET = "juan-santiago-comprobantes";
const NUMERO_MAESTRO = "59175928656";
const MINUTOS_AVISO = 20;'''
assert content.count(old1) == 1
content = content.replace(old1, new1)

old2 = '''  const [montoDetectado, setMontoDetectado] = useState<string | null>(null);
  const [verificado, setVerificado] = useState<"si" | "no" | null>(null);'''
new2 = '''  const [montoDetectado, setMontoDetectado] = useState<string | null>(null);
  const [verificado, setVerificado] = useState<"si" | "no" | null>(null);
  const [mostrarAvisoAyuda, setMostrarAvisoAyuda] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMostrarAvisoAyuda(true), MINUTOS_AVISO * 60000);
    return () => clearTimeout(timer);
  }, []);'''
assert content.count(old2) == 1
content = content.replace(old2, new2)

old3 = '''          {error && <p className="text-sm text-[#ff8a70] text-center">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-gradient-to-br from-[#e6c476] to-[#c9a24b] text-[#1a0505] font-semibold text-[15px] py-3 transition disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar comprobante"}
          </button>
        </form>
      </div>
    </main>
  );
}'''
new3 = '''          {error && <p className="text-sm text-[#ff8a70] text-center">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-gradient-to-br from-[#e6c476] to-[#c9a24b] text-[#1a0505] font-semibold text-[15px] py-3 transition disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar comprobante"}
          </button>
        </form>

        {mostrarAvisoAyuda && (
          <div className="mt-4 rounded-2xl border border-[#c9a24b]/25 bg-[#1a0a10]/70 backdrop-blur-md p-4 text-center">
            <p className="text-sm text-[#f5e6d3]/70 mb-3">
              ¿Tenés dudas o problemas para pagar? Escribile directo al Maestro.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${NUMERO_MAESTRO}&text=${encodeURIComponent(
                "Hola Maestro Juan Santiago, tengo dudas para completar el pago de mi consulta."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#22c55e] text-white text-sm font-semibold py-2.5 px-5"
            >
              💬 Escribir al Maestro
            </a>
          </div>
        )}
      </div>
    </main>
  );
}'''
assert content.count(old3) == 1
content = content.replace(old3, new3)

with open(path, "w") as f:
    f.write(content)

print("OK 16")
