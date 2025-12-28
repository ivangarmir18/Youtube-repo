import fetch from 'node-fetch';
import express from 'express';

const app = express();

app.get('/latest', async (req, res) => {
  const channelId = 'UCQ-jmzE0enmyz1ajeXte2lw';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const response = await fetch(rssUrl);
  const text = await response.text();

  // Buscar todos los <link> de los vídeos y descartar shorts
  const links = [...text.matchAll(/<link rel="alternate" href="([^"]+)"/g)]
                    .map(m => m[1])
                    .filter(link => !link.includes('/shorts/'));

  if (links.length > 0) {
    res.redirect(links[0]); // redirige al último vídeo largo
  } else {
    res.send('No se pudo encontrar un vídeo largo');
  }
});

app.listen(3000, () => console.log('Servidor listo'));
