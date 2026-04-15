import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const BACKEND_URL = "https://agente-autonomo-production-cb49.up.railway.app";
const SUPABASE_URL = "https://ecbuwynkpspzmcqrikdy.supabase.co";
const SUPABASE_KEY = "sb_publishable_DrDXBf5wnJYNpoAHVqAf_A_SQfnY0Zs";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MODULES = [
  { id: "geral", label: "Assistente", icon: "◈", color: "#a78bfa", systemPrompt: "Você é um assistente autônomo inteligente. Responda sempre em português brasileiro." },
  { id: "instagram", label: "Instagram", icon: "◉", color: "#f472b6", systemPrompt: "Você é especialista em Instagram. Ajude com legendas, hashtags, Reels. Responda em português brasileiro." },
  { id: "whatsapp", label: "WhatsApp", icon: "◎", color: "#34d399", systemPrompt: "Você é especialista em WhatsApp para negócios. Ajude com mensagens, broadcasts. Responda em português brasileiro." },
  { id: "copies", label: "Copies", icon: "◇", color: "#fb923c", systemPrompt: "Você é especialista em copywriting. Crie copies persuasivos, scripts de vendas. Responda em português brasileiro." },
  { id: "tarefas", label: "Tarefas", icon: "◻", color: "#60a5fa", systemPrompt: "Você é assistente de produtividade. Ajude com tarefas, agenda, metas. Responda em português brasileiro." },
];

const NAV_ITEMS = [
  { id: "agente", icon: "◈", label: "Agente" },
  { id: "whatsapp", icon: "💬", label: "WhatsApp" },
  { id: "instagram", icon: "📸", label: "Instagram" },
  { id: "historico", icon: "🕘", label: "Histórico" },
  { id: "configuracoes", icon: "⚙️", label: "Config" },
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
      if (error) setErro("Erro: " + error.message);
      else setSucesso("Conta criada! Verifique seu email.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a18", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>◈</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#e2e8f0" }}>Agente Creator</div>
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

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [aba, setAba] = useState("agente");
  const [modulo, setModulo] = useState(MODULES[0]);
  const [messages, setMessages] = useState([]);
  const [conversaId, setConversaId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [waStatus, setWaStatus] = useState("disconnected");
  const [waQr, setWaQr] = useState(null);
  const [waLoading, setWaLoading] = useState(false);
  const [waChats, setWaChats] = useState([]);
  const [waSelected, setWaSelected] = useState(null);
  const [waMessages, setWaMessages] = useState([]);
  const [waInput, setWaInput] = useState("");
  const [busca, setBusca] = useState("");
  const bottomRef = useRef(null);
  const waBottomRef = useRef(null);

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

  useEffect(() => {
    waBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [waMessages]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => verificarWaStatus(), 3000);
    return () => clearInterval(interval);
  }, [user]);

  const verificarWaStatus = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${BACKEND_URL}/whatsapp/status/${user.id}`);
      const data = await res.json();
      setWaStatus(data.status);
      if (data.qr) setWaQr(data.qr);
      if (data.status === "connected") setWaQr(null);
    } catch {}
  };

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

  const conectarWa = async () => {
    setWaLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/whatsapp/connect`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id }) });
      const data = await res.json();
      setWaStatus(data.status);
      if (data.qr) setWaQr(data.qr);
    } catch {}
    setWaLoading(false);
  };

  const desconectarWa = async () => {
    await fetch(`${BACKEND_URL}/whatsapp/disconnect/${user.id}`, { method: "POST" });
    setWaStatus("disconnected");
    setWaQr(null);
    setWaChats([]);
  };

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setInput(""); setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages, systemPrompt: modulo.systemPrompt }) });
      const data = await res.json();
      const finalMessages = [...newMessages, { role: "assistant", content: data.response || "Erro." }];
      setMessages(finalMessages);
      salvarConversa(finalMessages, modulo.id);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Erro de conexão." }]);
    }
    setLoading(false);
  };

  const sair = async () => {
    await supabase.auth.signOut();
    setUser(null); setMessages([]); setIsPro(false); setHistorico([]);
  };

  if (loadingAuth) return <div style={{ minHeight: "100vh", background: "#0a0a18", display: "flex", alignItems: "center", justifyContent: "center", color: "#6a6a8a", fontSize: 14 }}>Carregando...</div>;
  if (!user) return <Login onLogin={setUser} />;

  const nomeUsuario = user.user_metadata?.nome || user.email?.split("@")[0] || "Usuário";

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a18", color: "#e2e8f0", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>

      {/* Sidebar esquerda — navegação */}
      <div style={{ width: 64, background: "#06060f", borderRight: "1px solid #1e1e3a", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 8, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#a78bfa22", border: "1px solid #a78bfa44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#a78bfa", marginBottom: 8 }}>◈</div>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setAba(item.id)} title={item.label} style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: aba === item.id ? "#1a1a2e" : "transparent", color: aba === item.id ? "#e2e8f0" : "#4a4a6a", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
            {item.icon}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#a78bfa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#0a0a18", cursor: "pointer" }} title={nomeUsuario} onClick={sair}>
          {nomeUsuario[0].toUpperCase()}
        </div>
      </div>

      {/* Área principal */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* AGENTE */}
        {aba === "agente" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e3a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, color: modulo.color }}>{modulo.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{modulo.label}</div>
                  <div style={{ fontSize: 11, color: "#6a6a8a" }}>Agente Creator {isPro ? "Pro" : "Free"}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {MODULES.map(m => (
                  <button key={m.id} onClick={() => { setModulo(m); setMessages([]); setConversaId(null); }} title={m.label} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${modulo.id === m.id ? m.color + "66" : "#1e1e3a"}`, background: modulo.id === m.id ? m.color + "22" : "transparent", color: m.color, fontSize: 14, cursor: "pointer" }}>{m.icon}</button>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {!isPro && (
                <div onClick={assinarPro} style={{ background: "linear-gradient(135deg, #a78bfa22, #f472b622)", border: "1px solid #a78bfa44", borderRadius: 12, padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 13 }}>⚡ <strong>Pro</strong> — Sem anúncios R$9,90/mês</div>
                  <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>Assinar →</div>
                </div>
              )}
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#4a4a6a", marginTop: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{modulo.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#6a6a8a" }}>Como posso ajudar?</div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? modulo.color : "#1a1a2e", color: m.role === "user" ? "#0a0a18" : "#e2e8f0", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.content}</div>
                </div>
              ))}
              {loading && <div style={{ display: "flex" }}><div style={{ padding: "10px 14px", borderRadius: "18px 18px 18px 4px", background: "#1a1a2e", fontSize: 13, color: "#6a6a8a" }}>digitando...</div></div>}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #1e1e3a" }}>
              <div style={{ display: "flex", gap: 8, background: "#0d0d1a", border: "1px solid #2a2a3e", borderRadius: 14, padding: "8px 8px 8px 16px", alignItems: "center" }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && enviar()} placeholder={`Mensagem para ${modulo.label}...`} style={{ flex: 1, background: "none", border: "none", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
                <button onClick={enviar} disabled={!input.trim() || loading} style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: input.trim() && !loading ? modulo.color : "#2a2a3e", color: "#0a0a18", cursor: "pointer", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
              </div>
            </div>
          </div>
        )}

        {/* WHATSAPP */}
        {aba === "whatsapp" && (
          <div style={{ flex: 1, display: "flex" }}>
            {/* Lista de chats */}
            <div style={{ width: 320, borderRight: "1px solid #1e1e3a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              <div style={{ padding: "16px 16px 8px", borderBottom: "1px solid #1e1e3a" }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>WhatsApp</div>
                {waStatus !== "connected" ? (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    {waQr ? (
                      <>
                        <div style={{ fontSize: 12, color: "#6a6a8a", marginBottom: 12 }}>Escaneie com seu WhatsApp</div>
                        <img src={waQr} alt="QR" style={{ width: 200, height: 200, borderRadius: 12, margin: "0 auto" }} />
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 13, color: "#6a6a8a", marginBottom: 16 }}>Conecte seu WhatsApp para gerenciar mensagens com IA</div>
                        <button onClick={conectarWa} disabled={waLoading || waStatus === "connecting"} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#34d399", color: "#0a0a18", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          {waLoading || waStatus === "connecting" ? "Conectando..." : "Conectar WhatsApp"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: "#34d399" }}>● Conectado</span>
                      <button onClick={desconectarWa} style={{ fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>Desconectar</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d0d1a", borderRadius: 10, padding: "8px 12px" }}>
                      <span style={{ fontSize: 14, color: "#6a6a8a" }}>🔍</span>
                      <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquisar conversa" style={{ flex: 1, background: "none", border: "none", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
                    </div>
                  </>
                )}
              </div>

              {waStatus === "connected" && (
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {waChats.length === 0 ? (
                    <div style={{ padding: 20, textAlign: "center", color: "#4a4a6a", fontSize: 13 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                      Aguardando mensagens...
                      <div style={{ fontSize: 11, marginTop: 8, color: "#3a3a5a" }}>As conversas aparecerão aqui quando você receber mensagens</div>
                    </div>
                  ) : (
                    waChats.filter(c => c.name?.toLowerCase().includes(busca.toLowerCase())).map(chat => (
                      <div key={chat.id} onClick={() => { setWaSelected(chat); setWaMessages(chat.messages || []); }} style={{ padding: "12px 16px", borderBottom: "1px solid #0d0d1a", cursor: "pointer", background: waSelected?.id === chat.id ? "#1a1a2e" : "transparent", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#a78bfa22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{chat.name?.[0] || "?"}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{chat.name || chat.id}</div>
                            <div style={{ fontSize: 11, color: "#4a4a6a" }}>{chat.time}</div>
                          </div>
                          <div style={{ fontSize: 12, color: "#6a6a8a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.lastMessage}</div>
                        </div>
                        {chat.unread > 0 && <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#34d399", color: "#0a0a18", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{chat.unread}</div>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Área de chat WhatsApp */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {!waSelected ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#4a4a6a" }}>
                  <div style={{ fontSize: 48 }}>💬</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{waStatus === "connected" ? "Selecione uma conversa" : "Conecte seu WhatsApp"}</div>
                  <div style={{ fontSize: 13 }}>O agente responderá automaticamente suas mensagens</div>
                </div>
              ) : (
                <>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #1e1e3a", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#a78bfa22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{waSelected.name?.[0] || "?"}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{waSelected.name}</div>
                      <div style={{ fontSize: 11, color: "#34d399" }}>● IA ativa</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                    {waMessages.map((m, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: m.fromMe ? "flex-end" : "flex-start" }}>
                        <div style={{ maxWidth: "65%", padding: "8px 12px", borderRadius: m.fromMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.fromMe ? "#34d399" : "#1a1a2e", color: m.fromMe ? "#0a0a18" : "#e2e8f0", fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
                      </div>
                    ))}
                    <div ref={waBottomRef} />
                  </div>
                  <div style={{ padding: "12px 20px", borderTop: "1px solid #1e1e3a" }}>
                    <div style={{ display: "flex", gap: 8, background: "#0d0d1a", border: "1px solid #2a2a3e", borderRadius: 14, padding: "8px 8px 8px 16px" }}>
                      <input value={waInput} onChange={e => setWaInput(e.target.value)} placeholder="Mensagem..." style={{ flex: 1, background: "none", border: "none", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
                      <button style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#34d399", color: "#0a0a18", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>↑</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* INSTAGRAM */}
        {aba === "instagram" && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "#4a4a6a" }}>
            <div style={{ fontSize: 48 }}>📸</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#e2e8f0" }}>Instagram</div>
            <div style={{ fontSize: 13, textAlign: "center", maxWidth: 300 }}>Integração com Instagram em breve. Gerencie DMs e comentários com IA.</div>
            <button style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid #f472b644", background: "#f472b622", color: "#f472b6", fontSize: 13, cursor: "pointer" }}>Em breve</button>
          </div>
        )}

        {/* HISTÓRICO */}
        {aba === "historico" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e3a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Histórico de conversas</div>
              <button onClick={() => { setMessages([]); setConversaId(null); setAba("agente"); }} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #a78bfa44", background: "#a78bfa22", color: "#a78bfa", fontSize: 12, cursor: "pointer" }}>+ Nova conversa</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {historico.length === 0 && <div style={{ textAlign: "center", color: "#4a4a6a", marginTop: 60, fontSize: 13 }}>Nenhuma conversa salva ainda.</div>}
              {historico.map(c => {
                const mod = MODULES.find(m => m.id === c.modulo) || MODULES[0];
                const ultimaMsg = c.mensagens?.[c.mensagens.length - 1]?.content || "Conversa vazia";
                return (
                  <div key={c.id} onClick={() => { const mod = MODULES.find(m => m.id === c.modulo) || MODULES[0]; setModulo(mod); setMessages(c.mensagens); setConversaId(c.id); setAba("agente"); }} style={{ padding: "14px 16px", borderRadius: 12, border: `1px solid ${conversaId === c.id ? mod.color + "66" : "#1e1e3a"}`, background: conversaId === c.id ? mod.color + "11" : "#0d0d1a", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ color: mod.color }}>{mod.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{mod.label}</span>
                      <span style={{ fontSize: 11, color: "#4a4a6a", marginLeft: "auto" }}>{new Date(c.atualizado_em).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6a6a8a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ultimaMsg.slice(0, 100)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONFIGURAÇÕES */}
        {aba === "configuracoes" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e3a" }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Configurações</div>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Conta</div>
                <div style={{ fontSize: 13, color: "#6a6a8a", marginBottom: 12 }}>{user.email}</div>
                <div style={{ fontSize: 12, color: isPro ? "#a78bfa" : "#6a6a8a", background: isPro ? "#a78bfa22" : "#1e1e3a", padding: "4px 12px", borderRadius: 6, display: "inline-block" }}>{isPro ? "✓ Plano Pro" : "Plano Free"}</div>
              </div>
              {!isPro && (
                <div onClick={assinarPro} style={{ background: "linear-gradient(135deg, #a78bfa22, #f472b622)", border: "1px solid #a78bfa44", borderRadius: 14, padding: 20, cursor: "pointer" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>⚡ Agente Creator Pro</div>
                  <div style={{ fontSize: 13, color: "#6a6a8a", marginBottom: 12 }}>Sem anúncios + recursos premium</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa" }}>R$9,90/mês</div>
                </div>
              )}
              <button onClick={sair} style={{ padding: "12px", borderRadius: 12, border: "1px solid #f8717144", background: "#f8717111", color: "#f87171", fontSize: 14, cursor: "pointer" }}>Sair da conta</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
