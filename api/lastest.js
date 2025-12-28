export default async function handler(req, res) {
  try {
    const channelId = "UCQ-jmzE0enmyz1ajeXte2lw";
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const response = await fetch(rssUrl);
    if (!response.ok) return res.status(502).send("Error al obtener el feed");

    const text = await response.text();

    // Sacamos todos los enlaces de vídeos
    const matches = [...text.matchAll(/<link rel="alternate" href="([^"]+)"/g)];
    const links = matches.map(m => m[1]);

    // Filtramos solo vídeos largos, no shorts
    const longVideos = links.filter(l => l.includes("watch?v=") && !l.includes("/shorts/"));

    if (longVideos.length === 0) return res.status(404).send("No se encontró vídeo largo");

    // Convertimos a youtu.be
    const videoUrl = longVideos[0];
    const shortUrl = videoUrl.replace("https://www.youtube.com/watch?v=", "https://youtu.be/");

    // Enviamos mensaje de texto plano
    res.status(200).send(`Último vídeo aquí: ${shortUrl}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

