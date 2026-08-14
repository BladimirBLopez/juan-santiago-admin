path = "src/app/pago/[id]/PagoClient.tsx"
with open(path, "r") as f:
    content = f.read()

old1 = '''const CLOUDINARY_CLOUD = "dkq95jus0";
const CLOUDINARY_PRESET = "juan-santiago-comprobantes";'''
new1 = '''const CLOUDINARY_CLOUD = "dkq95jus0";
const CLOUDINARY_PRESET = "juan-santiago-comprobantes";

async function descargarImagen(url: string, nombreArchivo: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank");
  }
}'''
assert content.count(old1) == 1
content = content.replace(old1, new1)

old2 = '''          <div className="rounded-2xl border border-[#c9a24b]/25 border-t-4 border-t-[#c9a24b] bg-[#1a0a10]/70 backdrop-blur-md p-3 text-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
            <img
              src="https://res.cloudinary.com/dkq95jus0/image/upload/qr-union"
              alt="QR Union"
              className="mx-auto rounded-lg w-full"
            />
            <p className="text-xs text-[#f5e6d3]/70 mt-2 font-medium">Unión / Transferencia</p>
          </div>
          <div className="rounded-2xl border border-[#c9a24b]/25 border-t-4 border-t-[#c9a24b] bg-[#1a0a10]/70 backdrop-blur-md p-3 text-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
            <img
              src="https://res.cloudinary.com/dkq95jus0/image/upload/qr-tigomoney"
              alt="QR Tigo Money"
              className="mx-auto rounded-lg w-full"
            />
            <p className="text-xs text-[#f5e6d3]/70 mt-2 font-medium">Tigo Money</p>
          </div>'''
new2 = '''          <div className="rounded-2xl border border-[#c9a24b]/25 border-t-4 border-t-[#c9a24b] bg-[#1a0a10]/70 backdrop-blur-md p-3 text-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
            <img
              src="https://res.cloudinary.com/dkq95jus0/image/upload/qr-union"
              alt="QR Union"
              className="mx-auto rounded-lg w-full"
            />
            <p className="text-xs text-[#f5e6d3]/70 mt-2 font-medium">Unión / Transferencia</p>
            <button
              type="button"
              onClick={() =>
                descargarImagen(
                  "https://res.cloudinary.com/dkq95jus0/image/upload/qr-union",
                  "QR-Union-MaestroJuanSantiago.png"
                )
              }
              className="mt-2 text-[11px] text-[#c9a24b] underline underline-offset-2"
            >
              ↓ Descargar QR
            </button>
          </div>
          <div className="rounded-2xl border border-[#c9a24b]/25 border-t-4 border-t-[#c9a24b] bg-[#1a0a10]/70 backdrop-blur-md p-3 text-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
            <img
              src="https://res.cloudinary.com/dkq95jus0/image/upload/qr-tigomoney"
              alt="QR Tigo Money"
              className="mx-auto rounded-lg w-full"
            />
            <p className="text-xs text-[#f5e6d3]/70 mt-2 font-medium">Tigo Money</p>
            <button
              type="button"
              onClick={() =>
                descargarImagen(
                  "https://res.cloudinary.com/dkq95jus0/image/upload/qr-tigomoney",
                  "QR-TigoMoney-MaestroJuanSantiago.png"
                )
              }
              className="mt-2 text-[11px] text-[#c9a24b] underline underline-offset-2"
            >
              ↓ Descargar QR
            </button>
          </div>'''
assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK 13")
