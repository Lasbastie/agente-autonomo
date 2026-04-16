export default async function handler(req, res) {
  try {
    // Tenta buscar o QR via connect
    const r = await fetch('https://evolution-api-production-a3c7.up.railway.app/instance/connect/vanessa', {
      headers: { 'apikey': 'agentecreator123' }
    });
    const data = await r.json();
    
    // Se não tem QR, busca via fetchInstances
    if (!data.base64 && !data.qrcode?.base64) {
      const r2 = await fetch('https://evolution-api-production-a3c7.up.railway.app/instance/fetchInstances?instanceName=vanessa', {
        headers: { 'apikey': 'agentecreator123' }
      });
      const data2 = await r2.json();
      const instance = Array.isArray(data2) ? data2[0] : data2;
      return res.json({ 
        base64: instance?.qrcode?.base64 || null,
        status: instance?.connectionStatus || 'unknown',
        raw: instance
      });
    }
    
    res.json({
      base64: data.base64 || data.qrcode?.base64 || null,
      status: data.instance?.status || 'unknown'
    });
  } catch(e) {
    res.json({ error: e.message });
  }
}
