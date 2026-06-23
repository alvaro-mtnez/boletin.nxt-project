const SYSTEM_PROMPT = `Eres el Asistente de extracción de contenido de Boletines de Diario AyE.

Tu trabajo es analizar el HTML fuente del boletín y extraer su contenido estructurado en JSON.
NO generas HTML. Solo extraes datos.

== ESTRUCTURA DE BLOQUES ==

BLOQUE 1: siempre tiene hero + 3 artículos en grid de 3 columnas.
BLOQUES 2 en adelante: hero + 2 artículos en grid de 2 columnas.
ÚLTIMO BLOQUE: puede ser una de estas tres variantes:
  - "hero+2": hero + 2 artículos (normal)
  - "solo_hero": solo hero, sin artículos debajo
  - "solo_2": solo 2 artículos en grid de 2 columnas, sin hero

== BANNERS ==

Los banners DFP son imágenes de pubads.g.doubleclick.net con sz=600x90.
Cada banner se coloca ANTES del hero del bloque al que precede.
Si hay más banners que bloques disponibles, el primer banner va antes del hero del bloque 1.
NUNCA dos banners seguidos sin contenido editorial entre medias.
El pixel de impresiones (sz=1x1) NO es un banner.

== QUÉ EXTRAER ==

1. tracking_pixels: los img de píxeles de seguimiento, copiados literalmente.
2. fecha: "DD de mes de YYYY"
3. bloques: array donde cada elemento tiene:
   - banner_antes: { url_click, url_img, alt } o null
   - tipo: "hero+3", "hero+2", "solo_hero" o "solo_2"
   - hero: { url, img, titulo, autor } o null si tipo es "solo_2"
   - articulos: array de { url, img, titulo, autor }
4. asunto1: máx 49 caracteres
5. asunto1_articulo: título exacto
6. asunto2: máx 49 caracteres
7. asunto2_articulo: título exacto
8. vista_previa: máx 150 caracteres

REGLAS:
- NO inventes datos. Extrae EXACTAMENTE lo que está en el HTML.
- Mantén UTMs exactamente como vengan.
- Prioriza para asuntos: IVA, cuotas, IRPF, Seguridad Social, Hacienda, sanciones, inspecciones, cambios normativos, Verifactu.
- Evita: podcasts, entrevistas de branding, lifestyle.

RESPONDE ÚNICAMENTE con JSON válido, sin backticks, sin texto extra.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { tipo, htmlFuente } = req.body;
  if (!tipo || !htmlFuente) return res.status(400).json({ error: "Faltan parámetros" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key no configurada en el servidor" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Tipo: ${tipo}\n\nHTML fuente del boletín:\n${htmlFuente}` }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data?.error?.message || "Error de Anthropic" });

    const raw = (data.content || []).map(b => b.text || "").join("");
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch (e) {
      return res.status(500).json({ error: "JSON inválido de la IA. Inténtalo de nuevo." });
    }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Error interno" });
  }
}
