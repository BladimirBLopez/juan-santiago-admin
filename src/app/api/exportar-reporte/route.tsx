import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const SERVICIO_LABELS: Record<string, string> = {
  AMARRE: "Amarre de Amor",
  ENDULZAMIENTO: "Endulzamiento",
  RETORNO: "Retorno del Ser Amado",
  ALEJAMIENTO: "Alejamiento de Terceros",
  UNION_PAREJA: "Union de Parejas",
  CONSULTA_TAROT: "Consulta de Tarot",
  CONSULTA_COCA: "Consulta de Hojas de Coca",
};

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },
  titulo: { fontSize: 20, marginBottom: 4, color: "#3d0f1a" },
  subtitulo: { fontSize: 10, color: "#6b6b80", marginBottom: 20 },
  seccion: { marginBottom: 18 },
  seccionTitulo: { fontSize: 13, marginBottom: 8, color: "#0f0f14", fontWeight: 700 },
  filaMetricas: { flexDirection: "row", gap: 12, marginBottom: 4 },
  cajaMetrica: { flex: 1, borderWidth: 1, borderColor: "#e5e5eb", borderRadius: 6, padding: 10 },
  numeroMetrica: { fontSize: 22, color: "#0f0f14" },
  labelMetrica: { fontSize: 9, color: "#6b6b80", marginTop: 2 },
  filaServicio: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: "#f0f0f3" },
  filaCliente: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  footer: { position: "absolute", bottom: 24, left: 32, right: 32, fontSize: 8, color: "#9099a8", textAlign: "center" },
});

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [consultasDelMes, totalConsultas, porServicio, iniciados, completados, clientes] = await Promise.all([
    prisma.consulta.count({ where: { createdAt: { gte: inicioMes } } }),
    prisma.consulta.count(),
    prisma.consulta.groupBy({
      by: ["servicio"],
      _count: { servicio: true },
      orderBy: { _count: { servicio: "desc" } },
    }),
    prisma.consulta.count({ where: { fechaInicio: { not: null } } }),
    prisma.consulta.count({ where: { estado: "COMPLETADO" } }),
    prisma.cliente.findMany({ include: { _count: { select: { consultas: true } } } }),
  ]);

  const cobradoEsteMes = await prisma.pago.aggregate({
    where: { estado: "APROBADO", createdAt: { gte: inicioMes } },
    _sum: { monto: true },
  });

  const tasaInicio = totalConsultas > 0 ? Math.round((iniciados / totalConsultas) * 100) : 0;
  const tasaCompletado = totalConsultas > 0 ? Math.round((completados / totalConsultas) * 100) : 0;
  const recurrentes = clientes
    .filter((c) => c._count.consultas > 1)
    .sort((a, b) => b._count.consultas - a._count.consultas)
    .slice(0, 10);

  const fechaGeneracion = new Date().toLocaleDateString("es-BO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.titulo}>Reporte - Altar del Tata Bombori</Text>
        <Text style={styles.subtitulo}>Generado el {fechaGeneracion}</Text>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Resumen general</Text>
          <View style={styles.filaMetricas}>
            <View style={styles.cajaMetrica}>
              <Text style={styles.numeroMetrica}>{consultasDelMes}</Text>
              <Text style={styles.labelMetrica}>Consultas este mes</Text>
            </View>
            <View style={styles.cajaMetrica}>
              <Text style={styles.numeroMetrica}>{totalConsultas}</Text>
              <Text style={styles.labelMetrica}>Consultas totales</Text>
            </View>
            <View style={styles.cajaMetrica}>
              <Text style={styles.numeroMetrica}>Bs {cobradoEsteMes._sum.monto ?? 0}</Text>
              <Text style={styles.labelMetrica}>Cobrado este mes</Text>
            </View>
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Conversion</Text>
          <Text>Consultas que iniciaron trabajo: {iniciados} de {totalConsultas} ({tasaInicio}%)</Text>
          <Text>Trabajos completados: {completados} de {totalConsultas} ({tasaCompletado}%)</Text>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Servicios mas pedidos</Text>
          {porServicio.map((s) => (
            <View key={s.servicio} style={styles.filaServicio}>
              <Text>{SERVICIO_LABELS[s.servicio] ?? s.servicio}</Text>
              <Text>{s._count.servicio}</Text>
            </View>
          ))}
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Clientes recurrentes (top 10)</Text>
          {recurrentes.length === 0 ? (
            <Text>Aun no hay clientes que hayan vuelto mas de una vez.</Text>
          ) : (
            recurrentes.map((c) => (
              <View key={c.id} style={styles.filaCliente}>
                <Text>{c.nombre}</Text>
                <Text>{c._count.consultas} consultas</Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footer}>Altar del Tata Bombori - Maestro Juan Santiago</Text>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="reporte-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
