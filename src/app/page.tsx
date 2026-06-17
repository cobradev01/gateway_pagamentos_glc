import Link from "next/link";

const agents = [
  {
    icon: "🔍",
    name: "DetectorAgent",
    tag: "DETECTOR",
    tagColor: "#3b82f6",
    desc: "Monitora falhas, timeouts e anomalias em tempo real. Sugere retry automático ou escalonamento.",
  },
  {
    icon: "🛡️",
    name: "FraudAgent",
    tag: "FRAUDE",
    tagColor: "#ef4444",
    desc: "Score de risco 0–100 por transação. Bloqueia automaticamente riscos CRITICAL antes da captura.",
  },
  {
    icon: "💬",
    name: "SupportAgent",
    tag: "SUPORTE",
    tagColor: "#8b5cf6",
    desc: "Diagnóstico técnico sob demanda. Rascunha resposta ao cliente com base no histórico da transação.",
  },
  {
    icon: "🤖",
    name: "OrchestratorAgent",
    tag: "ORQUESTRADOR",
    tagColor: "#f59e0b",
    desc: "Coordena os demais agentes e toma a decisão final: APPROVE, RETRY, BLOCK ou ESCALATE_HUMAN.",
  },
];

const endpoints = [
  { method: "POST", path: "/api/v1/transactions", desc: "Criar e processar pagamento" },
  { method: "GET",  path: "/api/v1/transactions", desc: "Listar transações do tenant" },
  { method: "GET",  path: "/api/v1/transactions/:id", desc: "Detalhe com logs dos agentes" },
  { method: "POST", path: "/api/agents/support", desc: "Consultar SupportAgent" },
  { method: "POST", path: "/api/v1/simulate", desc: "Simular transação para demo" },
];

const stack = [
  { name: "Next.js 14", sub: "App Router · TypeScript", accent: "rgba(255,255,255,0.08)" },
  { name: "PostgreSQL", sub: "Railway · Prisma ORM",    accent: "rgba(59,130,246,0.15)" },
  { name: "Claude API", sub: "Haiku 4.5 · Anthropic",  accent: "rgba(251,146,60,0.15)" },
  { name: "Vercel",     sub: "Deploy · Edge Network",   accent: "rgba(139,92,246,0.15)" },
];

export default function Home() {
  return (
    <div style={{ background: "var(--bg-app)", color: "var(--text-primary)", minHeight: "100vh", fontFamily: "'Roboto', sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(15,17,23,0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>G</div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>GLC Tecnologia</span>
          </div>
          <Link
            href="/dashboard"
            style={{ fontSize: 13, fontWeight: 500, color: "#3b82f6", textDecoration: "none", padding: "6px 16px", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, transition: "all 0.15s" }}
          >
            Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 999, padding: "5px 14px", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 12, color: "#60a5fa", fontWeight: 500, letterSpacing: "0.02em" }}>Desafio Técnico — Desenvolvedor Pleno</span>
        </div>

        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20 }}>
          Gateway de Pagamentos<br />
          <span style={{ color: "#3b82f6" }}>com Inteligência Artificial</span>
        </h1>

        <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 560, margin: "0 auto 8px", lineHeight: 1.7 }}>
          Sistema multi-tenant com 4 agentes de IA autônomos para detecção de falhas,
          antifraude em tempo real, suporte inteligente e orquestração de decisões.
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 36 }}>
          Construído por <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>GLC Tecnologia</span>
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/dashboard"
            style={{ padding: "12px 28px", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 14px rgba(59,130,246,0.4)" }}
          >
            Ver Dashboard ao Vivo
          </Link>
          <a
            href="https://github.com/cobradev01/gateway_pagamentos_glc"
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: "12px 28px", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: 10, fontWeight: 500, fontSize: 14, textDecoration: "none" }}
          >
            Ver no GitHub
          </a>
        </div>
      </section>

      {/* Agents */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Os 4 Agentes de IA</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Cada agente usa Claude (Anthropic) com prompts especializados e loga todas as decisões no banco.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {agents.map((a) => (
            <div key={a.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: a.tagColor, background: `${a.tagColor}18`, padding: "2px 8px", borderRadius: 4 }}>{a.tag}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{a.name}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>API REST</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Autenticação via <code style={{ background: "var(--bg-elevated)", padding: "1px 6px", borderRadius: 4, fontFamily: "'Roboto Mono', monospace", fontSize: 11 }}>x-api-key</code> header. Multi-tenant com idempotência nativa.
          </p>
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {endpoints.map((e, i) => (
            <div
              key={e.path}
              style={{
                display: "flex", alignItems: "center", gap: 16, padding: "13px 20px",
                borderBottom: i < endpoints.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, width: 40, flexShrink: 0, color: e.method === "POST" ? "#3b82f6" : "#10b981" }}>{e.method}</span>
              <code style={{ fontSize: 12, fontFamily: "'Roboto Mono', monospace", color: "var(--text-secondary)", flex: 1 }}>{e.path}</code>
              <span style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>{e.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Stack</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {stack.map((s) => (
            <div key={s.name} style={{ background: s.accent, border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.name}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          © 2025 GLC Tecnologia · Gateway de Pagamentos com IA · Desafio Técnico
        </p>
      </footer>
    </div>
  );
}
