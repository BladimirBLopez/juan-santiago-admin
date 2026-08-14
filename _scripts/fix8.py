path = "src/app/panel/tutoriales/page.tsx"
with open(path, "r") as f:
    content = f.read()

old1 = '''type Seccion = {
  id: string;
  icono: React.ElementType;
  titulo: string;
  pasos: string[];
  videoUrl?: string;
};'''
new1 = '''type Seccion = {
  id: string;
  icono: React.ElementType;
  titulo: string;
  pasos: string[];
  videoUrl?: string;
  imagenUrl?: string;
};'''
assert content.count(old1) == 1
content = content.replace(old1, new1)

old2 = '''              {s.videoUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={s.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#e5e5eb] dark:border-[#2a2a3d] py-6 text-center">
                  <Video className="h-5 w-5 text-[#9099a8]" strokeWidth={2} />
                  <p className="text-xs text-[#9099a8]">Video próximamente</p>
                </div>
              )}'''
new2 = '''              {s.videoUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={s.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : s.imagenUrl ? (
                <img
                  src={s.imagenUrl}
                  alt={s.titulo}
                  className="w-full rounded-lg border border-[#e5e5eb] dark:border-[#2a2a3d]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#e5e5eb] dark:border-[#2a2a3d] py-6 text-center">
                  <Video className="h-5 w-5 text-[#9099a8]" strokeWidth={2} />
                  <p className="text-xs text-[#9099a8]">Video próximamente</p>
                </div>
              )}'''
assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK 8")
