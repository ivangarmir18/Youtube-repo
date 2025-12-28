// api/latest.js
export default async function handler(req, res) {
  try {
    const channelId = "UCQ-jmzE0enmyz1ajeXte2lw"; // tu channel_id
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    // fetch nativo de Vercel
    const response = await fetch(rssUrl, { method: "GET" });
    if (!response.ok) {
      return res.status(502).send("Error al obtener el feed de YouTube");
    }
    const text = await response.text();

    // Extrae todos los links alternativos de vídeo
    const matches = [...text.matchAll(/<link\s+rel="alternate"\s+href="([^"]+)"/g)];
    const links = matches.map(m => m[1]);

    // Filtrar sólo URLs tipo watch (evitar /shorts/) y quitar duplicados
    const longVideos = links
      .filter(l => l.includes("watch?v=") && !l.includes("/shorts/"))
      .filter((v, i, arr) => arr.indexOf(v) === i);

    if (longVideos.length === 0) {
      return res.status(404).send("No se encontró un vídeo largo");
    }

    // redirige (el primer elemento es el más reciente)
    const latest = longVideos[0];
    res.writeHead(302, { Location: latest });
    res.end();
  } catch (err) {
    console.error("ERROR function /api/latest:", err);
    res.status(500).send("Internal Server Error");
  }
}
