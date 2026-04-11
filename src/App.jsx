import { useState } from "react";

const REDES = [
  { id: "instagram", label: "Instagram", icon: "📸", color: "#E1306C" },
  { id: "whatsapp", label: "WhatsApp Business", icon: "💬", color: "#25D366" },
  { id: "facebook", label: "Facebook", icon: "📘", color: "#1877F2" },
  { id: "youtube", label: "YouTube", icon: "▶️", color: "#FF0000" },
  { id: "tiktok", label: "TikTok", icon: "🎵", color: "#010101" },
  { id: "linkedin", label: "LinkedIn", icon: "💼", color: "#0A66C2" },
  { id: "twitter", label: "X / Twitter", icon: "𝕏", color: "#000000" },
  { id: "telegram", label: "Telegram", icon: "✈️", color: "#229ED9" },
];

const TONS = ["Profissional", "Descontraído", "Inspirador", "Técnico", "Empático", "Direto"];
const MODULOS = ["Instagram", "WhatsApp", "Copies & Roteiros", "Tarefas", "E-mail", "Vendas"];

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ fontSize: 12, color: "#6a6a8a", display: "block", marginBottom: 6 }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #2a2a3e", background: "#0d0d1a", color: "#e2e8f0", fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
    </div>
  );
}

function Btn({ children, onClick, disabled, variant = "primary", style: s = {} }) {
  const base = { padding: "11px 20px", borderRadius: 10, border: "none", fontWeight: 600, fontSize: 14, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.15s", fontFamily: "inherit", width: "100%" };
  const variants = { primary: { background: "#a78bfa", color: "#0a0a18" }, secondary: { background: "transparent", color: "#6a6a8a", border: "1px solid #2a2a3e" } };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...s }}>{children}</button>;
}

function Tag({ label, selected, onClick }) {
  return <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", border: `1px solid ${selected ? "#a78bfa" : "#2a2a3e"}`, background: selected ? "#a78bfa22" : "transparent", color: selected ? "#a78bfa" : "#6a6a8a", fontFamily: "inherit", transition: "all 0.15s" }}>{label}</button>;
}

function TelaLogin({ onLogin, onCadastro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  function handle() {
    if (!email || !senha) return setErro("Preencha todos os campos");
    if (senha.length < 6) return setErro("Senha mínimo 6 caracteres");
    setLoading(true);
    setTimeout(() => { onLogin({ id: "u-" + Date.now(), email, nome: email.split("@")[0] }); setLoading(false); }, 700);
  }
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 36, color: "#a78bfa", marginBottom: 10 }}>◈</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#f0f0ff", margin: "0 0 6px" }}>Agente Autônomo</h1>
        <p style={{ fontSize: 13, color: "#6a6a8a", margin: 0 }}>Entre na sua conta</p>
      </div>
      <Input label="E-mail" value={email} onChange={setEmail} type="email" placeholder="seu@email.com" />
      <Input label="Senha" value={senha} onChange={setSenha} type="password" placeholder="••••••••" />
      {erro && <p style={{ fontSize: 12, color: "#ef4444", margin: "-8px 0 12px" }}>{erro}</p>}
      <Btn onClick={handle} disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Btn>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#6a6a8a" }}>
        Não tem conta? <button onClick={onCadastro} style={{ color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Criar grátis</button>
      </p>
    </div>
  );
}

function TelaCadastro({ onCadastro, onLogin }) {
  const [f, setF] = useState({ nome: "", email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));
  function handle() {
    if (!f.nome || !f.email || !f.senha) return setErro("Preencha todos os campos");
    if (f.senha.length < 6) return setErro("Senha mínimo 6 caracteres");
    setLoading(true);
    setTimeout(() => { onCadastro({ id: "u-" + Date.now(), email: f.email, nome: f.nome }); setLoading(false); }, 700);
  }
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 36, color: "#a78bfa", marginBottom: 10 }}>◈</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#f0f0ff", margin: "0 0 6px" }}>Criar conta</h1>
        <p style={{ fontSize: 13, color: "#6a6a8a", margin: 0 }}>Comece a usar seu agente agora</p>
      </div>
      <Input label="Nome completo" value={f.nome} onChange={v => u("nome", v)} placeholder="Seu nome" />
      <Input label="E-mail" value={f.email} onChange={v => u("email", v)} type="email" placeholder="seu@email.com" />
      <Input label="Senha" value={f.senha} onChange={v => u("senha", v)} type="password" placeholder="Mínimo 6 caracteres" />
      {erro && <p style={{ fontSize: 12, color: "#ef4444", margin: "-8px 0 12px" }}>{erro}</p>}
      <Btn onClick={handle} disabled={loading}>{loading ? "Criando..." : "Criar conta grátis"}</Btn>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#6a6a8a" }}>
        Já tem conta? <button onClick={onLogin} style={{ color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Entrar</button>
      </p>
    </div>
  );
}

function TelaOnboarding({ usuario, onConcluir }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ negocio: "", nicho: "", publico: "", objetivo: "", tom: [], modulos: [] });
  const [loading, setLoading] = useState(false);
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));
  const tog = (k, v) => setF(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));
  function concluir() {
    setLoading(true);
    const system_prompt = `Você é o agente autônomo de ${usuario.nome}. Negócio: ${f.negocio}. Nicho: ${f.nicho}. Público: ${f.publico}. Objetivo: ${f.objetivo}. Tom: ${f.tom.join(", ")}. Módulos: ${f.modulos.join(", ")}. Responda sempre em português brasileiro de forma personalizada, direta e útil.`;
    setTimeout(() => { onConcluir({ ...f, system_prompt }); setLoading(false); }, 800);
  }
  const steps = [
    { title: "Seu negócio", valid: f.negocio && f.nicho, content: <><Input label="Nome do negócio" value={f.negocio} onChange={v => u("negocio", v)} placeholder="Ex: Studio Fitness da Ana" /><Input label="Nicho / área" value={f.nicho} onChange={v => u("nicho", v)} placeholder="Ex: Saúde feminina" /><Input label="Público-alvo" value={f.publico} onChange={v => u("publico", v)} placeholder="Ex: Mulheres 30-45 anos" /><Input label="Objetivo principal" value={f.objetivo} onChange={v => u("objetivo", v)} placeholder="Ex: Lançar meu curso" /></> },
    { title: "Tom e módulos", valid: f.tom.length > 0 && f.modulos.length > 0, content: <><div style={{ marginBottom: 20 }}><label style={{ fontSize: 12, color: "#6a6a8a", display: "block", marginBottom: 10 }}>Tom de voz</label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{TONS.map(t => <Tag key={t} label={t} selected={f.tom.includes(t)} onClick={() => tog("tom", t)} />)}</div></div><div><label style={{ fontSize: 12, color: "#6a6a8a", display: "block", marginBottom: 10 }}>Módulos</label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{MODULOS.map(m => <Tag key={m} label={m} selected={f.modulos.includes(m)} onClick={() => tog("modulos", m)} />)}</div></div></> },
  ];
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>{steps.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? "#a78bfa" : "#1e1e3a" }} />)}</div>
      <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" }}>Passo {step + 1} de {steps.length}</div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#f0f0ff", margin: "0 0 24px" }}>{steps[step].title}</h2>
      {steps[step].content}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        {step > 0 && <Btn variant="secondary" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>← Voltar</Btn>}
        {step < steps.length - 1 ? <Btn onClick={() => setStep(s => s + 1)} disabled={!steps[step].valid} style={{ flex: 1 }}>Continuar →</Btn> : <Btn onClick={concluir} disabled={loading || !steps[step].valid} style={{ flex: 1 }}>{loading ? "Configurando..." : "✦ Ativar Agente"}</Btn>}
      </div>
    </div>
  );
}

function Painel({ usuario, perfil, onLogout }) {
  const [aba, setAba] = useState("agente");
  const [conexoes, setConexoes] = useState({});
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  async function enviar() {
    if (!input.trim() || loading) return;
    const texto = input.trim();
    setInput("");
    const novas = [...msgs, { role: "user", content: texto }];
    setMsgs(novas);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: perfil?.system_prompt || "Você é um assistente autônomo. Responda em português brasileiro.", messages: novas.map(m => ({ role: m.role, content: m.content })) }) });
      const data = await res.json();
      const reply = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "Erro.";
      setMsgs(p => [...p, { role: "assistant", content: reply }]);
    } catch { setMsgs(p => [...p, { role: "assistant", content: "Erro de conexão." }]); }
    finally { setLoading(false); }
  }
  const redesConectadas = Object.keys(conexoes).filter(k => conexoes[k]).length;
  return (
    <div style={{ maxWidth: 580, margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#a78bfa22", border: "1px solid #a78bfa44", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>◈</div>
          <div><div style={{ fontSize: 14, fontWeight: 600, color: "#f0f0ff" }}>Olá, {usuario.nome}!</div><div style={{ fontSize: 11, color: "#6a6a8a" }}>{perfil?.negocio} · {redesConectadas} rede{redesConectadas !== 1 ? "s" : ""} conectada{redesConectadas !== 1 ? "s" : ""}</div></div>
        </div>
        <button onClick={onLogout} style={{ fontSize: 12, color: "#6a6a8a", background: "none", border: "1px solid #2a2a3e", borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>Sair</button>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#0d0d1a", borderRadius: 12, padding: 4 }}>
        {[["agente", "💬 Agente"], ["redes", "🔗 Redes"], ["perfil", "⚙️ Perfil"]].map(([id, label]) => (
          <button key={id} onClick={() => setAba(id)} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "none", background: aba === id ? "#1e1e3a" : "transparent", color: aba === id ? "#e2e8f0" : "#6a6a8a", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
        ))}
      </div>
      {aba === "agente" && (
        <div>
          <div style={{ height: 360, overflowY: "auto", marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.length === 0 && <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#4a4a6a", gap: 6 }}><div style={{ fontSize: 28, color: "#a78bfa" }}>◈</div><div style={{ fontSize: 14 }}>Agente pronto!</div><div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16, width: "100%" }}>{["Crie uma legenda para Instagram", "Escreva um follow-up de WhatsApp", "Monte meu plano da semana"].map(s => <button key={s} onClick={() => setInput(s)} style={{ padding: "9px 14px", borderRadius: 10, border: "1px solid #2a2a3e", background: "#0d0d1a", color: "#8a8ab0", fontSize: 12, cursor: "pointer", textAlign: "left" }}><span style={{ color: "#a78bfa", marginRight: 8 }}>›</span>{s}</button>)}</div></div>}
            {msgs.map((m, i) => <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}><div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? "#a78bfa22" : "#1a1a2e", border: `1px solid ${m.role === "user" ? "#a78bfa44" : "#2a2a3e"}`, fontSize: 13, color: "#e2e8f0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.content}</div></div>)}
            {loading && <div style={{ display: "flex" }}><div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "#1a1a2e", border: "1px solid #2a2a3e", fontSize: 13, color: "#6a6a8a" }}>digitando...</div></div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && enviar()} placeholder="Digite sua mensagem..." style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: "1px solid #2a2a3e", background: "#0d0d1a", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
            <button onClick={enviar} disabled={!input.trim() || loading} style={{ padding: "11px 16px", borderRadius: 10, border: "none", background: input.trim() && !loading ? "#a78bfa" : "#2a2a3e", color: input.trim() && !loading ? "#0a0a18" : "#4a4a6a", cursor: input.trim() && !loading ? "pointer" : "default", fontWeight: 700 }}>↑</button>
          </div>
        </div>
      )}
      {aba === "redes" && (
        <div>
          <p style={{ fontSize: 13, color: "#6a6a8a", marginBottom: 16 }}>Conecte as redes que seu agente vai gerenciar.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {REDES.map(r => <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, border: `1px solid ${conexoes[r.id] ? r.color + "44" : "#1e1e3a"}`, background: conexoes[r.id] ? r.color + "11" : "#0d0d1a" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>{r.icon}</span><div><div style={{ fontSize: 13, fontWeight: 500, color: conexoes[r.id] ? "#e2e8f0" : "#8a8ab0" }}>{r.label}</div>{conexoes[r.id] && <div style={{ fontSize: 11, color: r.color }}>● conectado</div>}</div></div><button onClick={() => setConexoes(p => ({ ...p, [r.id]: !p[r.id] }))} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", border: `1px solid ${conexoes[r.id] ? r.color + "66" : "#2a2a3e"}`, background: conexoes[r.id] ? r.color + "22" : "#12122a", color: conexoes[r.id] ? r.color : "#6a6a8a", fontFamily: "inherit" }}>{conexoes[r.id] ? "✓ Conectado" : "Conectar"}</button></div>)}
          </div>
          <p style={{ fontSize: 11, color: "#3a3a5a", textAlign: "center", marginTop: 14 }}>⚠ Conexão real requer aprovação do Meta Developers</p>
        </div>
      )}
      {aba === "perfil" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#0d0d1a", borderRadius: 12, border: "1px solid #1e1e3a", padding: 16 }}>
            <div style={{ fontSize: 11, color: "#6a6a8a", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Dados da conta</div>
            {[["Nome", usuario.nome], ["E-mail", usuario.email], ["Negócio", perfil?.negocio], ["Nicho", perfil?.nicho], ["Público", perfil?.publico], ["Objetivo", perfil?.objetivo], ["Tom", perfil?.tom?.join(", ")], ["Módulos", perfil?.modulos?.join(", ")]].filter(([, v]) => v).map(([l, v]) => <div key={l} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #1a1a2e" }}><span style={{ fontSize: 12, color: "#4a4a6a", minWidth: 80 }}>{l}</span><span style={{ fontSize: 13, color: "#c2c2e2" }}>{v}</span></div>)}
          </div>
          <div style={{ background: "#0d0d1a", borderRadius: 12, border: "1px solid #1e1e3a", padding: 16 }}>
            <div style={{ fontSize: 11, color: "#6a6a8a", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>System Prompt ativo</div>
            <pre style={{ fontSize: 11, color: "#8a8ab0", whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.7, fontFamily: "monospace" }}>{perfil?.system_prompt}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tela, setTela] = useState("login");
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: "#080812", color: "#e2e8f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap'); input::placeholder{color:#3a3a5a} input:focus{border-color:#a78bfa!important} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#2a2a4a;border-radius:4px} *{box-sizing:border-box}`}</style>
      {tela === "login" && <TelaLogin onLogin={u => { setUsuario(u); setTela("onboarding"); }} onCadastro={() => setTela("cadastro")} />}
      {tela === "cadastro" && <TelaCadastro onCadastro={u => { setUsuario(u); setTela("onboarding"); }} onLogin={() => setTela("login")} />}
      {tela === "onboarding" && <TelaOnboarding usuario={usuario} onConcluir={p => { setPerfil(p); setTela("painel"); }} />}
      {tela === "painel" && <Painel usuario={usuario} perfil={perfil} onLogout={() => { setUsuario(null); setPerfil(null); setTela("login"); }} />}
    </div>
  );
}
