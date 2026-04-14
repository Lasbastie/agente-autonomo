const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.get("/", (req, res) => {
  res.json({ status: "Agente autônomo online ✅" });
});

app.post("/chat", async (req, res) => {
  const { messages, systemPrompt } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages é obrigatório e deve ser um array" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: systemPrompt || "Você é um assistente autônomo inteligente. Responda sempre em português brasileiro de forma direta e eficiente.",
          },
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: data.error?.message || "Erro na API OpenAI" });
    }

    const text = data.choices?.[0]?.message?.content || "";
    res.json({ response: text });
  } catch (err) {
    console.error("Erro no servidor:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
