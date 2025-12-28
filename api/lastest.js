import fetch from "node-fetch";

export default async function handler(req, res) {
  const channelId = "UCQ-jmzE0enmyz1ajeXte2lw";
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const response = await fetch(rssUrl);
  const text = await response.text();

  // Buscar todos los links y descartar shorts
  const links = [...text.matchAll(/<link rel="alternate" href="([^"]+)"/g)]
                    .map(m => m[1])
                    .filter(link => !link.includes("/shorts/"));

  if (links.length > 0) {
    res.writeHead(302, { Location: links[0] });
    res.end();
  } else {
    res.status(404).send("No se encontró un vídeo largo");
  }
}
