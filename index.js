// v2 — agente creator
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const EVOLUTION_URL = process.env.EVOLUTION_URL || 'https://evolution-api-production-a3c7.up.railway.app';
const EVOLUTION_KEY = process.env.EVOLUTION_KEY || 'agentecreator123';
const SERVER_URL = process.env.SERVER_URL || 'https://agente-autonomo-production-cb49.up.railway.app';

// Armazena QR codes e histórico em memória
const qrCodes = {};
const historico = {};

// ─── WEBHOOK — recebe eventos da Evolution API ───────────────────────────────
app.post('/webhook/evolution', (req, res) => {
  const { event, instance, data } = req.body;
  console.log(`[Webhook] ${event} — ${instance}`);

  if (event === 'qrcode.updated' && data?.qrcode?.base64) {
    qrCodes[instance] = data.qrcode.base64;
    console.log(`[QR] QR Code armazenado para ${instance}`);
  }

  if (event === 'messages.upsert') {
    const msg = data?.messages?.[0];
    if (!msg || msg.key?.fromMe) return res.sendStatus(200);
    const numero = msg.key?.remoteJid;
    const texto = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
    if (!texto || !numero) return res.sendStatus(200);
    responderMensagem(instance, numero, texto);
  }

  res.sendStatus(200);
});

// ─── CHAT — assistente IA ────────────────────────────────────────────────────
app.post('/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system || 'Você é um assistente autônomo inteligente. Responda em português brasileiro de forma direta e útil.',
        messages,
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );
    res.json({ reply: response.data.content[0].text });
  } catch (err) {
    console.error('[Chat]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── QR CODE — frontend busca aqui ──────────────────────────────────────────
app.get('/qr/:instancia', (req, res) => {
  const { instancia } = req.params;
  const qr = qrCodes[instancia];
  if (qr) {
    res.json({ base64: qr, status: 'ready' });
  } else {
    res.json({ base64: null, status: 'waiting' });
  }
});

// ─── CRIAR INSTÂNCIA + CONFIGURAR WEBHOOK ────────────────────────────────────
app.post('/instancia/criar', async (req, res) => {
  const { nome } = req.body;
  try {
    // Cria instância
    const criar = await axios.post(`${EVOLUTION_URL}/instance/create`, {
      instanceName: nome,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    }, { headers: { apikey: EVOLUTION_KEY } });

    const token = criar.data.hash;

    // Configura webhook para receber QR e mensagens
    await axios.post(`${EVOLUTION_URL}/webhook/set/${nome}`, {
      webhook: {
        enabled: true,
        url: `${SERVER_URL}/webhook/evolution`,
        webhookByEvents: false,
        webhookBase64: true,
        events: ['QRCODE_UPDATED', 'MESSAGES_UPSERT', 'CONNECTION_UPDATE'],
      }
    }, { headers: { apikey: token } });

    res.json({ ok: true, token, instanceName: nome });
  } catch (err) {
    console.error('[Criar instância]', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// ─── RESPONDER MENSAGEM VIA WHATSAPP ─────────────────────────────────────────
async function responderMensagem(instancia, numero, texto) {
  try {
    if (!historico[numero]) historico[numero] = [];
    historico[numero].push({ role: 'user', content: texto });

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'Você é um assistente autônomo inteligente. Responda em português brasileiro de forma direta e útil.',
        messages: historico[numero].slice(-10),
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );

    const resposta = response.data.content[0].text;
    historico[numero].push({ role: 'assistant', content: resposta });

    await axios.post(`${EVOLUTION_URL}/message/sendText/${instancia}`, {
      number: numero,
      text: resposta,
    }, { headers: { apikey: EVOLUTION_KEY } });

    console.log(`[WhatsApp] Respondido para ${numero}`);
  } catch (err) {
    console.error('[Responder]', err.message);
  }
}

app.get('/', (req, res) => res.send('Agente Creator online!'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
