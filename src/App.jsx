import { useState, useRef, useEffect } from "react";

const BACKEND_URL = "https://agente-autonomo-production-cb49.up.railway.app";

const MODULES = [
  {
    id: "geral",
    label: "Assistente",
    icon: "◈",
    color: "#a78bfa",
    desc: "Assistente geral para qualquer tarefa",
    systemPrompt: "Você é um assistente autônomo inteligente e proativo. Ajude o usuário com qualquer tarefa de forma direta, clara e eficiente. Responda sempre em português brasileiro. Seja direto, não use introduções longas.",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: "◉",
    color: "#f472b6",
    desc: "Gestão e conteúdo para Instagram",
    systemPrompt: "Você é um especialista em gestão de Instagram e criação de conteúdo. Ajude com: legendas, hashtags, estratégia de conteúdo, calendário editorial, roteiros para Reels, carrosséis, Stories. Responda sempre em português brasileiro. Use emojis estratégicos, CTAs fortes, linguagem que converte.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "◎",
    color: "#34d399",
    desc: "Mensagens, listas e broadcasts",
    systemPrompt: "Você é um especialista em comunicação via WhatsApp para negócios. Ajude com: mensagens de follow-up, broadcasts, respostas rápidas, sequências de nutrição, scripts de atendimento. Responda sempre em português brasileiro.",
  },
  {
    id: "copies",
    label: "Copies",
    icon: "◇",
    color: "#fb923c",
    desc: "Roteiros e copies com tendências",
    systemPrompt: "Você é um especialista em copywriting e marketing digital. Crie copies persuasivos, roteiros de vídeo, scripts de vendas, e-mails de nutrição, anúncios e textos que convertem. Use gatilhos mentais, storytelling e linguagem direta. Responda sempre em português brasileiro.",
  },
  {
    id: "tarefas",
    label: "Tarefas",
    icon: "◻",
    color: "#60a5fa",
    desc: "Organização e produtividade",
    systemPrompt: "Você é um assistente de produtividade e organização. Ajude a priorizar tarefas, criar listas, planejar agenda, definir metas, gerenciar projetos e otimizar tempo. Seja prático e objetivo. Responda sempre em português brasileiro.",
  },
];

export default function App() {
  const [modulo, setModulo] = useState(MODULES[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aba, setAba] = useState("agente");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt: modulo.systemPrompt,
        }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Erro: " + (data.error || "Tente novamente.") }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Erro de conexão. Verifique o servidor." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a18", color: "#e2e8f0", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: modulo.color + "22", border: `1px solid ${modulo.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: modulo.color }}>{modulo.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Olá, Vanessa!</div>
              <div style={{ fontSize: 12, color: "#6a6a8a" }}>Agente ativo · {modulo.label}</div>
            </div>
          </div>
          <button onClick={() => setMessages([])} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #2a2a3e", background: "#12122a", color: "#6a6a8a", fontSize: 12, cursor: "pointer" }}>Limpar</button>
        </div>

        {/* Abas */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#0d0d1a", borderRadius: 12, padding: 4 }}>
          {["agente", "modulos"].map(a => (
            <button key={a} onClick={() => setAba(a)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: "none", background: aba === a ? "#1a1a2e" : "transparent", color: aba === a ? "#e2e8f0" : "#6a6a8a", fontSize: 13, cursor: "pointer", fontWeight: aba === a ? 600 : 400 }}>
              {a === "agente" ? "💬 Agente" : "⚡ Módulos"}
            </button>
          ))}
        </div>

        {/* Chat */}
        {aba === "agente" && (
          <div>
            <div style={{ minHeight: 400, maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, padding: "4px 0" }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#4a4a6a", marginTop: 80 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{modulo.icon}</div>
                  <div style={{ fontSize: 14 }}>{modulo.desc}</div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>Digite uma mensagem para começar</div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? modulo.color + "22" : "#1a1a2e", border: `1px solid ${m.role === "user" ? modulo.color + "44" : "#2a2a3e"}`, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex" }}>
                  <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "#1a1a2e", border: "1px solid #2a2a3e", fontSize: 13, color: "#6a6a8a" }}>digitando...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && enviar()} placeholder={`Mensagem para ${modulo.label}...`} style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: "1px solid #2a2a3e", background: "#0d0d1a", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
              <button onClick={enviar} disabled={!input.trim() || loading} style={{ padding: "12px 18px", borderRadius: 12, border: "none", background: input.trim() && !loading ? modulo.color : "#2a2a3e", color: "#0a0a18", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>↑</button>
            </div>
          </div>
        )}

        {/* Módulos */}
        {aba === "modulos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, color: "#6a6a8a", marginBottom: 4 }}>Selecione o módulo ativo</div>
            {MODULES.map(m => (
              <div key={m.id} onClick={() => { setModulo(m); setAba("agente"); setMessages([]); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, border: `1px solid ${modulo.id === m.id ? m.color + "66" : "#1e1e3a"}`, background: modulo.id === m.id ? m.color + "11" : "#0d0d1a", cursor: "pointer" }}>
                <div style={{ fontSize: 22, color: m.color }}>{m.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: modulo.id === m.id ? "#e2e8f0" : "#8a8ab0" }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: "#6a6a8a" }}>{m.desc}</div>
                </div>
                {modulo.id === m.id && <div style={{ marginLeft: "auto", fontSize: 11, color: m.color, fontWeight: 600 }}>ATIVO</div>}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
