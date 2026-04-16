export default async function handler(req, res) {
  const r = await fetch('https://evolution-api-production-a3c7.up.railway.app/instance/connect/vanessa', {
    headers: { 'apikey': 'agentecreator123' }
  });
  const data = await r.json();
  res.json(data);
}
