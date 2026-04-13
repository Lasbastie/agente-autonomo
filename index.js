require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const app = express();
app.use(express.json());

const GROQ_API_KEY = process.env.ANTHROPIC_API_KEY;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'agente123';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const historico = {};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

async function chamarGroq(msgs, systemPrompt) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...msgs.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
  ];

  const res = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 1000,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.choices[0].message.content;
}

app.post('/chat', async (req, res) => {
  try {
    const { mensagem, historico: hist, systemPrompt } = req.body;
    const msgs = [...(hist || []), { role: 'user', content: mensagem }];
    const resposta = await chamarGroq(msgs, systemPrompt || 'Voce e um assistente autonomo. Responda em portugues brasileiro.');
    res.json({ resposta, historico: [...msgs, { role: 'assistant', content: resposta }] });
  } catch (err) {
    console.error('Erro:', err.response?.data || err.message);
    res.status(500).json({ erro: err.response?.data?.error?.message || err.message });
  }
});

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

app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const mensagem = entry?.changes?.[0]?.value?.messages?.[0];
    if (mensagem?.type === 'text') {
      const numero = mensagem.from;
      const texto = mensagem.text.body;
      const phoneId = entry?.changes?.[0]?.value?.metadata?.phone_number_id;
      if (!historico[numero]) historico[numero] = [];
      historico[numero].push({ role: 'user', content: texto });
      const resposta = await chamarGroq(historico[numero], 'Voce e um assistente autonomo. Responda em portugues brasileiro.');
      historico[numero].push({ role: 'assistant', content: resposta });
      const { data: conexao } = await supabase.from('conexoes').select('access_token').eq('phone_id', phoneId).single();
      if (conexao) {
        await axios.post(`https://graph.facebook.com/v18.0/${phoneId}/messages`,
          { messaging_product: 'whatsapp', to: numero, text: { body: resposta } },
          { headers: { Authorization: `Bearer ${conexao.access_token}` } }
        );
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

app.get('/', (req, res) => res.send('Agente Autonomo com Groq rodando!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
