// api/lastest.js
export default async function handler(req, res) {
  try {
    const channelId = req.query?.channelId || "UCQ-jmzE0enmyz1ajeXte2lw";
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const response = await fetch(rssUrl);
    if (!response.ok) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.status(502).send("Error al obtener el feed de YouTube");
    }

    const text = await response.text();

    // Extrae solo los enlaces de vídeos (no shorts)
    const matches = [...text.matchAll(/<link\s+rel="alternate"\s+href="([^"]+)"/g)];
    const links = matches.map(m => m[1]);
    const longVideos = links.filter(l => l.includes("watch?v=") && !l.includes("/shorts/"));

    if (longVideos.length === 0) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.status(404).send("No se encontró vídeo largo");
    }

    const videoUrl = longVideos[0];

    // Convertir a ID limpia
    const videoId = videoUrl.match(/[?&]v=([^&]+)/)?.[1] || null;

    // Convertir a youtu.be con fallback seguro
    const shortUrl = videoId
      ? `https://youtu.be/${videoId}`
      : String(videoUrl);

    // Respuesta 100% texto plano compatible con Nightbot
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    return res.status(200).send(`${shortUrl}`);
  } catch (err) {
    console.error("ERROR /api/lastest:", err);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(500).send("Internal Server Error");
  }
}


