import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://juansantiagoamarres.online",
  "https://www.juansantiagoamarres.online",
];

function corsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

const SERVICIOS_VALIDOS = [
  "AMARRE",
  "ENDULZAMIENTO",
  "RETORNO",
  "ALEJAMIENTO",
  "UNION_PAREJA",
  "CONSULTA_TAROT",
  "CONSULTA_COCA",
];

type MensajeHistorial = { rol: "usuario" | "asistente"; texto: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const historial: MensajeHistorial[] = Array.isArray(body?.historial) ? body.historial : [];
    const mensaje: string = typeof body?.mensaje === "string" ? body.mensaje.slice(0, 500) : "";

    if (!mensaje.trim()) {
      return NextResponse.json(
        { error: "Mensaje vacio" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const historialTexto = historial
      .slice(-12)
      .map((m) => `${m.rol === "usuario" ? "Cliente" : "Asistente"}: ${m.texto}`)
      .join("\n");

    const prompt = `Eres el asistente virtual del Maestro Juan Santiago, un curandero esoterico de Bolivia especializado en amarres de amor, endulzamiento, retorno del ser amado, alejamiento de terceros, union de parejas, y consultas de Tarot y Hojas de Coca.

Tu tono es calido, cercano, respetuoso y ligeramente mistico. Hablas de "usted" o "tu" de forma natural, boliviana, sin sonar robotico.

Tu objetivo en esta conversacion es recopilar de forma NATURAL (nunca como un formulario ni interrogatorio agresivo) estos 4 datos del cliente:
1. Nombre completo
2. Numero de WhatsApp (al menos 8 digitos)
3. Que servicio le interesa. Debe mapear a UNO de estos valores exactos: AMARRE (amarre de amor), ENDULZAMIENTO, RETORNO (retorno del ser amado), ALEJAMIENTO (alejamiento de terceros), UNION_PAREJA (union de parejas), CONSULTA_TAROT (consulta con cartas de tarot), CONSULTA_COCA (consulta con hojas de coca)
4. Una breve descripcion de su situacion (minimo una frase con contexto real, no solo "tengo problemas de amor")

Reglas importantes:
- Nunca inventes precios especificos de los Trabajos (Amarre, Endulzamiento, etc) - esos los define el Maestro directamente despues.
- Si preguntan por precio de la Consulta (Tarot o Coca), puedes decir que la consulta inicial tiene un costo simbolico de 50 Bs.
- Si preguntan como pagar, di que en un momento le compartes el codigo QR para pagar, una vez tengas sus datos.
- No prometas resultados garantizados ni plazos exactos.
- Se breve, 2-4 frases por respuesta como maximo.
- Si el cliente ya menciono un dato en un mensaje anterior, no se lo vuelvas a preguntar.
- Si el cliente pregunta algo fuera de tema, respondelo brevemente con calidez y luego retoma amablemente la recopilacion de datos que falte.

Historial de la conversacion hasta ahora:
${historialTexto || "(inicio de la conversacion)"}

Nuevo mensaje del cliente: "${mensaje}"

Responde UNICAMENTE con un JSON valido, sin texto adicional, sin markdown, con esta forma exacta:
{"respuesta": "tu respuesta conversacional en espanol para el cliente", "nombre": "nombre completo si ya lo dijo, o null", "telefono": "numero si ya lo dijo, o null", "servicio": "uno de los valores exactos de la lista, o null si no esta claro aun", "situacion": "resumen breve de su situacion si ya la conoces, o null"}`;

    const keyPresente = Boolean(process.env.GEMINI_API_KEY);
    const keyLargo = (process.env.GEMINI_API_KEY ?? "").length;

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const geminiTextoCrudo = await geminiRes.text();
    let geminiData;
    try {
      geminiData = JSON.parse(geminiTextoCrudo);
    } catch {
      return NextResponse.json(
        { respuesta: "Error tecnico", datos: { nombre: null, telefono: null, servicio: null, situacion: null }, completo: false, debugError: "Gemini no devolvio JSON", debugStatus: geminiRes.status, debugRaw: geminiTextoCrudo.slice(0, 800) },
        { status: 200, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const textoRaw: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!textoRaw) {
      return NextResponse.json(
        { respuesta: "Error tecnico", datos: { nombre: null, telefono: null, servicio: null, situacion: null }, completo: false, debugError: "Gemini sin texto", debugGeminiData: geminiData, debugKeyPresente: keyPresente, debugKeyLargo: keyLargo },
        { status: 200, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const limpio = textoRaw.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(limpio);
    } catch {
      return NextResponse.json(
        { respuesta: "Error tecnico", datos: { nombre: null, telefono: null, servicio: null, situacion: null }, completo: false, debugError: "No se pudo parsear respuesta de Gemini", debugRaw: limpio.slice(0, 800) },
        { status: 200, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const nombre = typeof parsed.nombre === "string" ? parsed.nombre.trim() : null;
    const telefono = typeof parsed.telefono === "string" ? parsed.telefono.trim() : null;
    const servicio = SERVICIOS_VALIDOS.includes(parsed.servicio) ? parsed.servicio : null;
    const situacion = typeof parsed.situacion === "string" ? parsed.situacion.trim() : null;

    const completo = Boolean(
      nombre && nombre.length >= 3 &&
      telefono && telefono.replace(/\D/g, "").length >= 8 &&
      servicio &&
      situacion && situacion.length >= 5
    );

    return NextResponse.json(
      {
        respuesta: parsed.respuesta ?? "Disculpa, no te entendi bien. ¿Puedes repetirlo?",
        datos: { nombre, telefono, servicio, situacion },
        completo,
      },
      { status: 200, headers: corsHeaders(req.headers.get("origin")) }
    );
  } catch (err) {
    console.error("Error en chat-ia:", err);
    return NextResponse.json(
      {
        respuesta: "Hubo un problema tecnico. ¿Puedes escribirme de nuevo?",
        datos: { nombre: null, telefono: null, servicio: null, situacion: null },
        completo: false,
        debugError: String(err),
      },
      { status: 200, headers: corsHeaders(req.headers.get("origin")) }
    );
  }
}
