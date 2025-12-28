export default async function handler(req, res) {
  try {
    const channelId = "UCQ-jmzE0enmyz1ajeXte2lw";
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const response = await fetch(rssUrl);
    if (!response.ok) return res.status(502).send("Error al obtener el feed");

    const text = await response.text();

    const matches = [...text.matchAll(/<link rel="alternate" href="([^"]+)"/g)];
    const links = matches.map(m => m[1]);
    const longVideos = links.filter(l => l.includes("watch?v=") && !l.includes("/shorts/"));

    if (longVideos.length === 0) return res.status(404).send("No se encontró vídeo largo");

    res.writeHead(302, { Location: longVideos[0] });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}
