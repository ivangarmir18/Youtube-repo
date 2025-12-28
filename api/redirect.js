export default function handler(req, res) {
  res.writeHead(302, { Location: 'https://youtube-repo-1qmsq82dg-ivangarmir18s-projects.vercel.app/api/lastest' });
  res.end();
}