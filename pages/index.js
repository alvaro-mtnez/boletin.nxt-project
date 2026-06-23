import React, { useState, useRef } from "react";

const LOGO_CABECERA = "https://www.autonomosyemprendedor.es/media/autonomosyemprendedor/images/2025/06/28/2025062812113336013.png";
const LOGO_APP = "https://www.autonomosyemprendedor.es/media/autonomosyemprendedor/images/2025/09/03/2025090320300074548.png";

const BANNER_ATA = `<tr><td align="center" style="padding:0 10px 10px 10px;"><a target="_blank" href="https://ata.es/convenios/" style="text-decoration:none; border:0;"><img alt="ATA convenios" src="https://autonomosyemprendedor.opennemas.com/media/autonomosyemprendedor/images/2023/03/23/2023032311395220745.jpg" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0;" /></a></td></tr>`;

const PIXEL_IMPRESIONES = `<tr><td align="center" style="padding:10px;"><a href="https://pubads.g.doubleclick.net/gampad/jump?iu=/21634166200/newsletter_impressions&sz=1x1&c=1607023636" target="_blank" style="text-decoration:none; border:0;"><img alt="" src="https://pubads.g.doubleclick.net/gampad/ad?iu=/21634166200/newsletter_impressions&sz=1x1&c=1607023636" style="display:block; width:1px; height:1px; border:0;" /></a></td></tr>`;

const SEPARADOR = `<tr><td style="padding:10px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:4px dotted #C22D2D; font-size:0; line-height:0;">&nbsp;</td></tr></table></td></tr>`;

const SPACER = `<tr><td style="font-size:0; line-height:0; height:18px;">&nbsp;</td></tr>`;

function renderBanner(b) {
  if (!b) return "";
  return `<tr><td align="center" style="padding:0 10px 10px 10px;"><a target="_blank" href="${b.url_click}" style="text-decoration:none; border:0;"><img alt="${b.alt || ""}" src="${b.url_img}" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0;" /></a></td></tr>`;
}

function renderHero(hero) {
  return `<tr><td style="padding:0 10px 18px 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:0;"><a href="${hero.url}" target="_blank" style="text-decoration:none; border:0;"><img src="${hero.img}" alt="${hero.titulo.replace(/"/g, '&quot;')}" width="620" style="display:block; width:100%; max-width:620px; height:auto; border:0; border-radius:8px;" /></a></td></tr><tr><td style="background-color:#AE191A; padding:14px 14px 12px 14px;"><a href="${hero.url}" target="_blank" style="color:#FFFFFF; text-decoration:none; display:block; font-size:18px; font-weight:bold; line-height:1.25;">${hero.titulo}</a><div style="margin-top:6px; font-size:12px; color:#FFFFFF; text-transform:uppercase;">${hero.autor}</div></td></tr></table></td></tr>`;
}

function renderArticulo2col(art, padding) {
  return `<td width="50%" valign="top" style="padding:${padding};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td><a target="_blank" href="${art.url}" style="text-decoration:none; border:0;"><img alt="${art.titulo.replace(/"/g, '&quot;')}" src="${art.img}" width="300" style="display:block; width:100%; height:auto; border:0; border-radius:8px;" /></a></td></tr><tr><td style="padding:10px 0 0 0;"><a target="_blank" href="${art.url}" style="color:#3D3D3D; text-decoration:none; font-size:15px; font-weight:bold; line-height:1.2; display:block;">${art.titulo}</a><div style="margin-top:5px; text-transform:uppercase; color:#777777; font-size:12px;">${art.autor || ""}</div></td></tr></table></td>`;
}

function renderArticulo3col(art, padding) {
  return `<td width="33.33%" valign="top" style="padding:${padding};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td><a target="_blank" href="${art.url}" style="text-decoration:none; border:0;"><img alt="${art.titulo.replace(/"/g, '&quot;')}" src="${art.img}" width="200" style="display:block; width:100%; height:auto; border:0; border-radius:8px;" /></a></td></tr><tr><td style="padding:10px 0 0 0;"><a target="_blank" href="${art.url}" style="color:#3D3D3D; text-decoration:none; font-size:15px; font-weight:bold; line-height:1.2; display:block;">${art.titulo}</a><div style="margin-top:5px; text-transform:uppercase; color:#777777; font-size:12px;">${art.autor || ""}</div></td></tr></table></td>`;
}

function renderGrid3(articulos) {
  if (!articulos || articulos.length < 3) return "";
  const cols = renderArticulo3col(articulos[0], "0 5px 0 0")
    + renderArticulo3col(articulos[1], "0 5px")
    + renderArticulo3col(articulos[2], "0 0 0 5px");
  return `<tr><td style="padding:0 10px 10px 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cols}</tr></table></td></tr>`;
}

function renderGrid2(articulos) {
  if (!articulos || articulos.length === 0) return "";
  const cols = renderArticulo2col(articulos[0], "0 5px 0 0")
    + (articulos[1] ? renderArticulo2col(articulos[1], "0 0 0 5px") : "");
  return `<tr><td style="padding:0 10px 10px 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cols}</tr></table></td></tr>`;
}

function buildHtml(data, tipo) {
  const bloques = data.bloques || [];
  let contenido = "";

  bloques.forEach((bloque, i) => {
    const hasBanner = !!bloque.banner_antes;

    // Separador entre bloques: solo si no hay banner entre ellos y no es el primero
    if (i > 0 && !hasBanner) contenido += SEPARADOR;

    contenido += SPACER;

    // Banner antes del bloque
    if (hasBanner) contenido += renderBanner(bloque.banner_antes);

    const t = bloque.tipo;

    if (t === "solo_2") {
      // Solo grid de 2 artículos, sin hero
      contenido += renderGrid2(bloque.articulos);
    } else {
      // Tiene hero
      if (bloque.hero) contenido += renderHero(bloque.hero);
      // Grid según tipo
      if (t === "hero+3") contenido += renderGrid3(bloque.articulos);
      else if (t === "hero+2") contenido += renderGrid2(bloque.articulos);
      // "solo_hero": no hay grid
    }
  });

  // Banner ATA
  if (tipo === "ATA") contenido += BANNER_ATA;

  // Pixel impresiones
  contenido += PIXEL_IMPRESIONES;

  return `<!doctype html>
<html lang="es">
<head><meta charset="UTF-8"/></head>
<body style="margin:0; padding:0; background-color:#F4ECE2;">
${data.tracking_pixels || ""}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4ECE2; margin:0; padding:0;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; margin:0 auto;">
<tr><td style="background-color:#C22D2D; padding:8px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>
<td width="25%" style="padding-left:15px; vertical-align:middle;">
<a href="https://www.autonomosyemprendedor.es/" target="_blank" style="display:block; text-decoration:none; border:0;">
<img src="${LOGO_CABECERA}" alt="AyE Economía Real" style="display:block; width:100%; max-width:160px; height:auto; border:0;" /></a></td>
<td width="50%" style="text-align:center; vertical-align:middle; font-family:Arial,sans-serif; color:#FFFFFF; font-size:14px; font-weight:bold; line-height:1.2; padding:0 5px 0 30px;">El medio de los que mueven la econom\u00eda</td>
<td width="25%" style="text-align:right; vertical-align:middle; padding-right:12px; font-family:Arial,sans-serif; color:#FFFFFF; font-size:13px; line-height:1.2;">${data.fecha || ""}</td>
</tr></table></td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; margin:0 auto; padding:20px 0 0;">
<tr><td style="font-family:Arial,sans-serif; text-align:center; padding-bottom:10px;">
<span style="font-size:72px; font-weight:bold; color:#C22D2D; line-height:1; margin-right:16px;">Esta</span>
<span style="font-size:72px; font-weight:bold; color:#31312F; line-height:1;">semana\u2026</span>
</td></tr>
<tr><td style="border-bottom:4px dotted #C22D2D; font-size:0; line-height:0;">&nbsp;</td></tr>
</table>
<table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:620px; max-width:620px; margin:0 auto; background-color:#F4ECE2; font-family:Arial,Helvetica,sans-serif; border:0;">
${contenido}
<tr><td align="center" style="padding:18px 10px 8px 10px;">
<div style="font-weight:bold; font-size:18px; color:#AE191A; font-family:Arial,Helvetica,sans-serif;">Diario AyE | Donde se informan los que mueven la econom\u00eda</div>
<div style="margin-top:4px; font-size:12px; color:#777777; font-family:Arial,Helvetica,sans-serif;">Actualidad econ\u00f3mica, consejos pr\u00e1cticos, entrevistas\u2026 para pymes y aut\u00f3nomos.</div>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export default function App() {
  const [tipo, setTipo] = useState(null);
  const [htmlFuente, setHtmlFuente] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);
  const [copied, setCopied] = useState({});
  const [preview, setPreview] = useState(false);

  // Campos editables
  const [asunto1, setAsunto1] = useState("");
  const [asunto2, setAsunto2] = useState("");
  const [vp, setVp] = useState("");
  const [art1, setArt1] = useState("");
  const [art2, setArt2] = useState("");

  const outputRef = useRef(null);
  const accent = tipo === "ATA" ? "#234536" : "#C22D2D";

  const handleTipo = t => { setTipo(t); setResultado(null); setError(""); setPreview(false); };

  const handleGenerar = async () => {
    if (!htmlFuente.trim()) { setError("Pega el HTML del boletín fuente antes de continuar."); return; }
    setLoading(true); setError(""); setResultado(null); setPreview(false);
    try {
      const res = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, htmlFuente }),
      });
      const text = await res.text();
      if (!text) throw new Error("El servidor no devolvió respuesta.");
      let resData;
      try { resData = JSON.parse(text); }
      catch { throw new Error("Respuesta inválida del servidor: " + text.substring(0, 100)); }
      if (!res.ok) throw new Error(resData?.error || "Error en el servidor.");

      const html = buildHtml(resData, tipo);
      setResultado({ html, rawData: resData });
      setAsunto1(resData.asunto1 || "");
      setAsunto2(resData.asunto2 || "");
      setVp(resData.vista_previa || "");
      setArt1(resData.asunto1_articulo || "");
      setArt2(resData.asunto2_articulo || "");
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e.message || "Error inesperado.");
    } finally { setLoading(false); }
  };

  const copy = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 1800);
  };

  const reset = () => {
    setTipo(null); setHtmlFuente(""); setResultado(null); setError("");
    setCopied({}); setPreview(false);
    setAsunto1(""); setAsunto2(""); setVp(""); setArt1(""); setArt2("");
  };

  const CopyBtn = ({ text, id, label = "Copiar" }) => (
    <button onClick={() => copy(text, id)}
      style={{ padding: "0 14px", background: copied[id] ? "#4caf50" : accent, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold", whiteSpace: "nowrap", fontFamily: "Arial,sans-serif", height: 40 }}>
      {copied[id] ? "✓ Copiado" : label}
    </button>
  );

  const inputStyle = {
    width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 6,
    border: "1.5px solid #ddd", boxSizing: "border-box", outline: "none",
    background: "#FAFAFA", fontFamily: "Arial,sans-serif", color: "#1D1D1B"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4ECE2", fontFamily: "Arial,sans-serif", padding: "24px 16px" }}>

      {/* Header */}
      <div style={{ maxWidth: 680, margin: "0 auto 28px auto", textAlign: "center" }}>
        <img src={LOGO_APP} alt="AyE" style={{ height: 52, display: "block", margin: "0 auto" }} />
        <div style={{ marginTop: 10, fontSize: 21, fontWeight: "bold", color: "#1D1D1B" }}>Maquetador de Boletines</div>
        <div style={{ marginTop: 3, fontSize: 12, color: "#999" }}>Herramienta interna · Diario AyE</div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Paso 1 */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Paso 1 · Tipo de boletín</div>
          <div style={{ display: "flex", gap: 12 }}>
            {["AyE", "ATA"].map(t => {
              const c = t === "ATA" ? "#234536" : "#C22D2D";
              const sel = tipo === t;
              return <button key={t} onClick={() => handleTipo(t)}
                style={{ flex: 1, padding: "14px 0", fontSize: 18, fontWeight: "bold", borderRadius: 8, border: `2px solid ${sel ? c : "#ddd"}`, background: sel ? c : "#fff", color: sel ? "#fff" : "#333", cursor: "pointer", fontFamily: "Arial,sans-serif" }}>{t}</button>;
            })}
          </div>
        </div>

        {/* Paso 2 */}
        {tipo && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Paso 2 · HTML del boletín fuente</div>
            <textarea value={htmlFuente} onChange={e => setHtmlFuente(e.target.value)} rows={9}
              placeholder="Pega aquí el código HTML completo del boletín fuente..."
              style={{ width: "100%", padding: "10px 12px", fontSize: 12, fontFamily: "monospace", borderRadius: 6, border: "1.5px solid #ddd", resize: "vertical", boxSizing: "border-box", outline: "none", background: "#FAFAFA", color: "#333" }} />
            {htmlFuente && <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>{htmlFuente.length.toLocaleString("es")} caracteres</div>}
            {error && <div style={{ marginTop: 10, padding: "10px 14px", background: "#fff0f0", borderRadius: 6, color: "#C22D2D", fontSize: 13 }}>⚠️ {error}</div>}
            <button onClick={handleGenerar} disabled={loading || !htmlFuente.trim()}
              style={{ marginTop: 14, width: "100%", padding: "14px 0", fontSize: 16, fontWeight: "bold", borderRadius: 8, border: "none", cursor: loading || !htmlFuente.trim() ? "not-allowed" : "pointer", background: loading || !htmlFuente.trim() ? "#ccc" : accent, color: "#fff", fontFamily: "Arial,sans-serif" }}>
              {loading ? "⏳ Generando boletín…" : `🚀 Generar boletín ${tipo}`}
            </button>
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div ref={outputRef}>

            {/* Asuntos y vista previa — editables */}
            <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>✅ Resultado · Edita si necesitas</div>

              {/* Asunto 1 */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginBottom: 4 }}>
                  <span>Asunto 1</span>
                  <span style={{ color: asunto1.length > 49 ? "#C22D2D" : "#4caf50", fontWeight: "bold" }}>{asunto1.length}/49</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={asunto1} onChange={e => setAsunto1(e.target.value)} style={inputStyle} />
                  <CopyBtn text={asunto1} id="a1" />
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>Artículo: {art1}</div>
              </div>

              {/* Asunto 2 */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginBottom: 4 }}>
                  <span>Asunto 2</span>
                  <span style={{ color: asunto2.length > 49 ? "#C22D2D" : "#4caf50", fontWeight: "bold" }}>{asunto2.length}/49</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={asunto2} onChange={e => setAsunto2(e.target.value)} style={inputStyle} />
                  <CopyBtn text={asunto2} id="a2" />
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>Artículo: {art2}</div>
              </div>

              {/* Vista previa */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginBottom: 4 }}>
                  <span>Vista previa (snippet)</span>
                  <span style={{ color: vp.length > 150 ? "#C22D2D" : "#4caf50", fontWeight: "bold" }}>{vp.length}/150</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={vp} onChange={e => setVp(e.target.value)} style={inputStyle} />
                  <CopyBtn text={vp} id="vp" />
                </div>
              </div>
            </div>

            {/* HTML final */}
            <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1 }}>HTML Final</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setPreview(!preview)}
                    style={{ padding: "0 14px", height: 40, background: "#444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold", fontFamily: "Arial,sans-serif" }}>
                    {preview ? "🙈 Ocultar" : "👁️ Vista previa"}
                  </button>
                  <CopyBtn text={resultado.html} id="html" label="📋 Copiar HTML" />
                </div>
              </div>

              {preview && (
                <div style={{ marginBottom: 16, border: "1.5px solid #eee", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ background: "#f0f0f0", padding: "6px 12px", fontSize: 11, color: "#888", borderBottom: "1px solid #eee" }}>Vista previa</div>
                  <iframe srcDoc={resultado.html} style={{ width: "100%", height: 600, border: "none" }} title="Vista previa" sandbox="allow-same-origin" />
                </div>
              )}

              <textarea readOnly value={resultado.html} rows={10}
                style={{ width: "100%", padding: "10px 12px", fontSize: 11, fontFamily: "monospace", borderRadius: 6, border: "1.5px solid #ddd", resize: "vertical", boxSizing: "border-box", background: "#FAFAFA", color: "#555" }} />
              <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>{resultado.html.length.toLocaleString("es")} caracteres</div>
            </div>

            <button onClick={reset}
              style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: "bold", borderRadius: 8, border: `2px solid ${accent}`, background: "#fff", color: accent, cursor: "pointer", fontFamily: "Arial,sans-serif", marginBottom: 24 }}>
              ↩ Nuevo boletín
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
