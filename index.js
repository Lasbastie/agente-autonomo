require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'agente123';

// Histórico de conversas
const historico = {};

// Função que chama o Claude
async function chamarClaude(numero, mensagem) {
  if (!historico[numero]) historico[numero] = [];
  historico[numero].push({ role: 'user', content: mensagem });

  const resposta = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: process.env.SYSTEM_PROMPT || 'Você é um assistente autônomo. Responda sempre em português brasileiro de forma direta e útil.',
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

  const texto = resposta.data.content[0].text;
  historico[numero].push({ role: 'assistant', content: texto });
  return texto;
}

// Verificação do webhook Meta
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recebe mensagens do WhatsApp
app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const mensagem = value?.messages?.[0];

    if (mensagem && mensagem.type === 'text') {
      const numero = mensagem.from;
      const texto = mensagem.text.body;
      console.log(`Mensagem de ${numero}: ${texto}`);

      const resposta = await chamarClaude(numero, texto);

      await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: numero,
          text: { body: resposta },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Erro:', err.message);
    res.sendStatus(500);
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('Agente Autônomo rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
