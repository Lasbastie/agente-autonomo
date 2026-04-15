import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const BACKEND_URL = "https://agente-autonomo-production-cb49.up.railway.app";
const SUPABASE_URL = "https://ecbuwynkpspzmcqrikdy.supabase.co";
const SUPABASE_KEY = "sb_publishable_DrDXBf5wnJYNpoAHVqAf_A_SQfnY0Zs";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MODULES = [
  { id: "geral", label: "Assistente", icon: "◈", color: "#a78bfa", desc: "Assistente geral para qualquer tarefa", systemPrompt: "Você é um assistente autônomo inteligente e proativo. Responda sempre em português brasileiro." },
  { id: "instagram", label: "Instagram", icon: "◉", color: "#f472b6", desc: "Gestão e conteúdo para Instagram", systemPrompt: "Você é especialista em Instagram. Ajude com legendas, hashtags, Reels, Stories. Responda em português brasileiro." },
  { id: "whatsapp", label: "WhatsApp", icon: "◎", color: "#34d399", desc: "Mensagens, listas e broadcasts", systemPrompt: "Você é especialista em WhatsApp para negócios. Ajude com mensagens, broadcasts, follow-ups. Responda em português brasileiro." },
  { id: "copies", label: "Copies", icon: "◇", color: "#fb923c", desc: "Roteiros e copies com tendências", systemPrompt: "Você é especialista em copywriting. Crie copies persuasivos, roteiros, scripts de vendas. Responda em português brasileiro." },
  { id: "tarefas", label: "Tarefas", icon: "◻", color: "#60a5fa", desc: "Organização e produtividade", systemPrompt: "Você é assistente de produtividade. Ajude com tarefas, agenda, metas. Responda em português brasileiro." },
];

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [modo, setModo] = useState("login");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleSubmit = async () => {
    setErro(""); setSucesso(""); setLoading(true);
    if (modo === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErro("Email ou senha incorretos.");
      else onLogin(data.user);
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { nome } } });
      if (error) setErro("Erro ao criar conta: " + error.message);
      else setSucesso("Conta criada! Verifique seu email.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a18", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>◈</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0" }}>Agente Creator</div>
          <div style={{ fontSize: 13, color: "#6a6a8a", marginTop: 6 }}>Seu assistente inteligente</div>
        </div>
        <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#06060f", borderRadius: 10, padding: 4 }}>
            {["login", "cadastro"].map(m => (
              <button key={m} onClick={() => setModo(m)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: modo === m ? "#1a1a2e" : "transparent", color: modo === m ? "#e2e8f0" : "#6a6a8a", fontSize: 13, cursor: "pointer", fontWeight: modo === m ? 600 : 400 }}>
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>
          {modo === "cadastro" && <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #2a2a3e", background: "#06060f", color: "#e2e8f0", fontSize: 13, marginBottom: 10, boxSizing: "border-box", outline: "none" }} />}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #2a2a3e", background: "#06060f", color: "#e2e8f0", fontSize: 13, marginBottom: 10, boxSizing: "border-box", outline: "none" }} />
          <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="Senha" type="password" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #2a2a3e", background: "#06060f", color: "#e2e8f0", fontSize: 13, marginBottom: 16, boxSizing: "border-box", outline: "none" }} />
          {erro && <div style={{ fontSize: 12, color: "#f87171", marginBottom: 12, padding: "8px 12px", background: "#f8717122", borderRadius: 8 }}>{erro}</div>}
          {sucesso && <div style={{ fontSize: 12, color: "#34d399", marginBottom: 12, padding: "8px 12px", background: "#34d39922", borderRadius: 8 }}>{sucesso}</div>}
          <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: "#a78bfa", color: "#0a0a18", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Aguarde..." : modo === "login" ? "Entrar" : "Criar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WhatsAppTab({ userId }) {
  const [status, setStatus] = useState("disconnected");
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);

  const verificarStatus = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/whatsapp/status/${userId}`);
      const data = await res.json();
      setStatus(data.status);
      setQr(data.qr);
    } catch {}
  };

  useEffect(() => {
    verificarStatus();
    const interval = setInterval(verificarStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const conectar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/whatsapp/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setStatus(data.status);
      setQr(data.qr);
    } catch {}
    setLoading(false);
  };

  const desconectar = async () => {
    await fetch(`${BACKEND_URL}/whatsapp/disconnect/${userId}`, { method: "POST" });
    setStatus("disconnected");
    setQr(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>WhatsApp</div>
          <div style={{ fontSize: 12, color: status === "connected" ? "#34d399" : status === "qr" ? "#fb923c" : "#6a6a8a" }}>
            {status === "connected" ? "● Conectado" : status === "qr" ? "● Escaneie o QR Code" : status === "connecting" ? "● Conectando..." : "● Desconectado"}
          </div>
        </div>
        {status === "connected" ? (
          <button onClick={desconectar} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #f8717144", background: "#f8717122", color: "#f87171", fontSize: 13, cursor: "pointer" }}>Desconectar</button>
        ) : (
          <button onClick={conectar} disabled={loading || status === "connecting"} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#34d399", color: "#0a0a18", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Aguarde..." : "Conectar"}
          </button>
        )}
      </div>

      {qr && (
        <div style={{ textAlign: "center", padding: 20, background: "#0d0d1a", borderRadius: 16, border: "1px solid #2a2a3e" }}>
          <div style={{ fontSize: 13, color: "#6a6a8a", marginBottom: 16 }}>Abra o WhatsApp → Aparelhos conectados → Conectar aparelho</div>
          <img src={qr} alt="QR Code" style={{ width: 220, height: 220, borderRadius: 12 }} />
        </div>
      )}

      {status === "connected" && (
        <div style={{ padding: 16, background: "#34d39911", border: "1px solid #34d39944", borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: "#34d399", fontWeight: 600, marginBottom: 4 }}>✓ WhatsApp conectado!</div>
          <div style={{ fontSize: 12, color: "#6a6a8a" }}>O agente está respondendo automaticamente as mensagens recebidas no seu WhatsApp.</div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [modulo, setModulo] = useState(MODULES[0]);
  const [messages, setMessages] = useState([]);
  const [conversaId, setConversaId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aba, setAba] = useState("agente");
  const [historico, setHistorico] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoadingAuth(false);
    });
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));
    const params = new URLSearchParams(window.location.search);
    if (params.get("plano") === "pro") setIsPro(true);
  }, []);

  useEffect(() => {
    if (user) { verificarAssinatura(); carregarHistorico(); }
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const verificarAssinatura = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/verificar-assinatura`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email }) });
      const data = await res.json();
      setIsPro(data.ativo);
    } catch {}
  };

  const assinarPro = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/criar-assinatura`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email, userId: user.id }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
  };

  const carregarHistorico = async () => {
    const { data } = await supabase.from("conversas").select("*").eq("user_id", user.id).order("atualizado_em", { ascending: false }).limit(20);
    if (data) setHistorico(data);
  };

  const salvarConversa = async (msgs, idModulo) => {
    if (conversaId) {
      await supabase.from("conversas").update({ mensagens: msgs, atualizado_em: new Date().toISOString() }).eq("id", conversaId);
    } else {
      const { data } = await supabase.from("conversas").insert({ user_id: user.id, modulo: idModulo, mensagens: msgs }).select().single();
      if (data) setConversaId(data.id);
    }
    carregarHistorico();
  };

  const abrirConversa = (conversa) => {
    const mod = MODULES.find(m => m.id === conversa.modulo) || MODULES[0];
    setModulo(mod); setMessages(conversa.mensagens); setConversaId(conversa.id); setAba("agente");
  };

  const sair = async () => {
    await supabase.auth.signOut();
    setUser(null); setMessages([]); setIsPro(false); setHistorico([]);
  };

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setInput(""); setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages, systemPrompt: modulo.systemPrompt }) });
      const data = await res.json();
      const finalMessages = [...newMessages, { role: "assistant", content: data.response || "Erro: " + (data.error || "Tente novamente.") }];
      setMessages(finalMessages);
      salvarConversa(finalMessages, modulo.id);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Erro de conexão." }]);
    }
    setLoading(false);
  };

  if (loadingAuth) return <div style={{ minHeight: "100vh", background: "#0a0a18", display: "flex", alignItems: "center", justifyContent: "center", color: "#6a6a8a" }}>Carregando...</div>;
  if (!user) return <Login onLogin={setUser} />;

  const nomeUsuario = user.user_metadata?.nome || user.email?.split("@")[0] || "Usuário";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a18", color: "#e2e8f0", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: modulo.color + "22", border: `1px solid ${modulo.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: modulo.color }}>{modulo.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Olá, {nomeUsuario}! {isPro && <span style={{ fontSize: 11, background: "#a78bfa22", color: "#a78bfa", padding: "2px 8px", borderRadius: 6, marginLeft: 4 }}>PRO</span>}</div>
              <div style={{ fontSize: 12, color: "#6a6a8a" }}>Agente ativo · {modulo.label}</div>
            </div>
          </div>
          <button onClick={sair} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #2a2a3e", background: "#12122a", color: "#6a6a8a", fontSize: 12, cursor: "pointer" }}>Sair</button>
        </div>

        {!isPro && (
          <div onClick={assinarPro} style={{ background: "linear-gradient(135deg, #a78bfa22, #f472b622)", border: "1px solid #a78bfa44", borderRadius: 12, padding: "10px 16px", marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, color: "#e2e8f0" }}>⚡ <strong>Agente Creator Pro</strong> — Sem anúncios por R$9,90/mês</div>
            <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>Assinar →</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#0d0d1a", borderRadius: 12, padding: 4 }}>
          {["agente", "whatsapp", "historico", "modulos"].map(a => (
            <button key={a} onClick={() => setAba(a)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: "none", background: aba === a ? "#1a1a2e" : "transparent", color: aba === a ? "#e2e8f0" : "#6a6a8a", fontSize: 11, cursor: "pointer", fontWeight: aba === a ? 600 : 400 }}>
              {a === "agente" ? "💬" : a === "whatsapp" ? "📱 Zap" : a === "historico" ? "🕘" : "⚡"}
            </button>
          ))}
        </div>

        {aba === "agente" && (
          <div>
            <div style={{ minHeight: 400, maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
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
              {loading && <div style={{ display: "flex" }}><div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "#1a1a2e", border: "1px solid #2a2a3e", fontSize: 13, color: "#6a6a8a" }}>digitando...</div></div>}
              <div ref={bottomRef} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && enviar()} placeholder={`Mensagem para ${modulo.label}...`} style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: "1px solid #2a2a3e", background: "#0d0d1a", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
              <button onClick={enviar} disabled={!input.trim() || loading} style={{ padding: "12px 18px", borderRadius: 12, border: "none", background: input.trim() && !loading ? modulo.color : "#2a2a3e", color: "#0a0a18", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>↑</button>
            </div>
          </div>
        )}

        {aba === "whatsapp" && <WhatsAppTab userId={user.id} />}

        {aba === "historico" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 12, color: "#6a6a8a" }}>Conversas salvas</div>
              <button onClick={() => { setMessages([]); setConversaId(null); setAba("agente"); }} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #a78bfa44", background: "#a78bfa22", color: "#a78bfa", fontSize: 12, cursor: "pointer" }}>+ Nova</button>
            </div>
            {historico.length === 0 && <div style={{ textAlign: "center", color: "#4a4a6a", marginTop: 40, fontSize: 13 }}>Nenhuma conversa salva ainda.</div>}
            {historico.map(c => {
              const mod = MODULES.find(m => m.id === c.modulo) || MODULES[0];
              const ultimaMsg = c.mensagens?.[c.mensagens.length - 1]?.content || "Conversa vazia";
              return (
                <div key={c.id} onClick={() => abrirConversa(c)} style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${conversaId === c.id ? mod.color + "66" : "#1e1e3a"}`, background: conversaId === c.id ? mod.color + "11" : "#0d0d1a", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ color: mod.color, fontSize: 14 }}>{mod.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{mod.label}</span>
                    <span style={{ fontSize: 11, color: "#4a4a6a", marginLeft: "auto" }}>{new Date(c.atualizado_em).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#6a6a8a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ultimaMsg.slice(0, 80)}</div>
                </div>
              );
            })}
          </div>
        )}

        {aba === "modulos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, color: "#6a6a8a", marginBottom: 4 }}>Selecione o módulo ativo</div>
            {MODULES.map(m => (
              <div key={m.id} onClick={() => { setModulo(m); setAba("agente"); setMessages([]); setConversaId(null); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, border: `1px solid ${modulo.id === m.id ? m.color + "66" : "#1e1e3a"}`, background: modulo.id === m.id ? m.color + "11" : "#0d0d1a", cursor: "pointer" }}>
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
