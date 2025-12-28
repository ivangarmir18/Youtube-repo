// api/lastest.js
export default async function handler(req, res) {
  try {
    // Puedes pasar ?channelId=ID en la URL para probar otro canal sin redeployar
    const channelId = req.query?.channelId || "UCQ-jmzE0enmyz1ajeXte2lw";
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    // Petición al feed (fetch nativo de Vercel)
    const response = await fetch(rssUrl);
    if (!response.ok) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.status(502).send("Error al obtener el feed de YouTube");
    }
    const text = await response.text();

    // Extrae todos los enlaces <link rel="alternate" href="...">
    const matches = [...text.matchAll(/<link\s+rel="alternate"\s+href="([^"]+)"/g)];
    const links = matches.map(m => m[1]);

    // Filtra solo vídeos normales (contienen watch?v=) y descarta shorts
    const longVideos = links.filter(l => l.includes("watch?v=") && !l.includes("/shorts/"));

    if (longVideos.length === 0) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.status(404).send("No se encontró vídeo largo");
    }

    // Tomamos el más reciente y convertimos a youtu.be (si es posible)
    const videoUrl = longVideos[0];
    const idMatch = videoUrl.match(/[?&]v=([^&]+)/);
    const videoId = idMatch ? idMatch[1] : null;
    const shortUrl = videoId ? `https://youtu.be/${videoId}` : videoUrl;

    // Evitar cache agresivo (opcional)
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    // Devuelve texto plano que Nightbot leerá tal cual
    return res.status(200).send(`Último vídeo aquí: ${shortUrl}`);
  } catch (err) {
    console.error("ERROR /api/lastest:", err);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(500).send("Internal Server Error");
  }
}

