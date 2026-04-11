require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const app = express();
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'agente123';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const historico = {};

async function getSystemPrompt(numero) {
  const { data } = await supabase
    .from('conexoes')
    .select('usuarios(system_prompt)')
    .eq('phone_id', numero)
    .single();
  return data?.usuarios?.system_prompt || 'Você é um assistente autônomo. Responda sempre em português brasileiro de forma direta e útil.';
}

async function salvarConversa(usuario_id, rede, contato, mensagem, resposta) {
  await supabase.from('conversas').insert({ usuario_id, rede, contato, mensagem, resposta });
}

async function chamarClaude(numero, mensagem) {
  if (!historico[numero]) historico[numero] = [];
  historico[numero].push({ role: 'user', content: mensagem });
  const systemPrompt = await getSystemPrompt(numero);

  const resposta = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
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
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const mensagem = value?.messages?.[0];

    if (mensagem && mensagem.type === 'text') {
      const numero = mensagem.from;
      const texto = mensagem.text.body;
      const phoneId = value?.metadata?.phone_number_id;
      console.log(`Mensagem de ${numero}: ${texto}`);

      const resposta = await chamarClaude(numero, texto);

      const { data: conexao } = await supabase
        .from('conexoes')
        .select('usuario_id, access_token')
        .eq('phone_id', phoneId)
        .single();

      if (conexao) {
        await axios.post(
          `https://graph.facebook.com/v18.0/${phoneId}/messages`,
          { messaging_product: 'whatsapp', to: numero, text: { body: resposta } },
          { headers: { Authorization: `Bearer ${conexao.access_token}`, 'Content-Type': 'application/json' } }
        );
        await salvarConversa(conexao.usuario_id, 'whatsapp', numero, texto, resposta);
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Erro:', err.message);
    res.sendStatus(500);
  }
});

app.post('/usuario', async (req, res) => {
  const { email, nome, negocio, nicho, publico, objetivo, tom, system_prompt } = req.body;
  const { data, error } = await supabase.from('usuarios').insert({
    email, nome, negocio, nicho, publico, objetivo, tom, system_prompt
  }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ usuario: data });
});

app.post('/conexao', async (req, res) => {
  const { usuario_id, rede, access_token, phone_id, page_id } = req.body;
  const { data, error } = await supabase.from('conexoes').insert({
    usuario_id, rede, access_token, phone_id, page_id
  }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ conexao: data });
});

app.get('/', (req, res) => {
  res.send('Agente Autônomo Multi-Usuário rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
