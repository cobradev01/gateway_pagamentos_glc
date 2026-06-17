import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const agents = [
  { icon: "🔍", name: "Agente Detector",     tag: "DETECTOR",     tagColor: "#3b82f6", desc: "Monitora falhas, timeouts e anomalias em tempo real. Sugere retry automático ou escalonamento." },
  { icon: "🛡️", name: "Agente Antifraude",  tag: "FRAUDE",       tagColor: "#ef4444", desc: "Score de risco 0–100 por transação. Bloqueia automaticamente riscos CRITICAL antes da captura." },
  { icon: "💬", name: "Agente de Suporte",  tag: "SUPORTE",      tagColor: "#8b5cf6", desc: "Diagnóstico técnico sob demanda. Rascunha resposta ao cliente com base no histórico da transação." },
  { icon: "🤖", name: "Agente Orquestrador", tag: "ORQUESTRADOR", tagColor: "#f59e0b", desc: "Coordena os demais agentes e toma a decisão final: APROVAR, RETRY, BLOQUEAR ou ESCALAR HUMANO." },
];

const endpoints = [
  { method: "POST", path: "/api/v1/transactions",    desc: "Criar e processar pagamento" },
  { method: "GET",  path: "/api/v1/transactions",    desc: "Listar transações do tenant" },
  { method: "GET",  path: "/api/v1/transactions/:id", desc: "Detalhe com logs dos agentes" },
  { method: "POST", path: "/api/agents/support",     desc: "Consultar SupportAgent" },
  { method: "POST", path: "/api/v1/simulate",        desc: "Simular transação para demo" },
];

const stack = [
  { name: "Next.js 14",  sub: "App Router · TypeScript", border: "rgba(255,255,255,0.08)" },
  { name: "PostgreSQL",  sub: "Railway · Prisma ORM",    border: "rgba(59,130,246,0.25)" },
  { name: "Claude API",  sub: "Haiku 4.5 · Anthropic",  border: "rgba(251,146,60,0.25)" },
  { name: "Vercel",      sub: "Deploy · Edge Network",   border: "rgba(139,92,246,0.25)" },
];

export default function Home() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0f1117; color: #f3f4f6; font-family: 'Roboto', system-ui, sans-serif; }
        a { text-decoration: none; }
        .nav-link:hover { border-color: rgba(59,130,246,0.6) !important; color: #60a5fa !important; }
        .cta-primary:hover { box-shadow: 0 6px 20px rgba(59,130,246,0.55) !important; transform: translateY(-1px); }
        .cta-secondary:hover { border-color: rgba(255,255,255,0.2) !important; color: #f3f4f6 !important; }
        .agent-card:hover { border-color: rgba(255,255,255,0.12) !important; background: #1c1f2e !important; }
        .endpoint-row:hover { background: rgba(255,255,255,0.02); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .hero-content { animation: fadeUp 0.6s ease both; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-app)", color: "var(--text-primary)" }}>

        {/* ── Nav ── */}
        <nav style={{ borderBottom: "1px solid var(--border)", background: "var(--nav-bg)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0 }}>G</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.1 }}>GLC Tecnologia</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.1, marginTop: 1 }}>Gateway de Pagamentos com IA</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ThemeToggle />
              <a
                href="https://github.com/cobradev01/gateway_pagamentos_glc"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
                style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", padding: "7px 14px", border: "1px solid var(--border)", borderRadius: 8, transition: "all 0.15s" }}
              >
                GitHub
              </a>
              <Link
                href="/dashboard"
                style={{ fontSize: 13, fontWeight: 600, color: "#fff", padding: "8px 20px", background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", borderRadius: 8, boxShadow: "0 2px 10px rgba(59,130,246,0.35)", transition: "all 0.15s" }}
              >
                Dashboard →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "96px 28px 80px" }}>
          <div className="hero-content" style={{ maxWidth: 680 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 999, padding: "6px 16px", marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", flexShrink: 0, boxShadow: "0 0 0 3px rgba(59,130,246,0.25)" }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: "#60a5fa", letterSpacing: "0.04em" }}>Desafio Técnico — Desenvolvedor Pleno</span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.025em", color: "var(--text-primary)", marginBottom: 22 }}>
              Gateway de Pagamentos<br />
              <span style={{ background: "linear-gradient(90deg,#3b82f6,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>com Inteligência Artificial</span>
            </h1>

            <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--text-muted)", marginBottom: 10 }}>
              Sistema multi-tenant com <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>4 agentes de IA autônomos</strong> para detecção de
              falhas, antifraude em tempo real, suporte inteligente e orquestração de decisões.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 44 }}>Construído por <span style={{ fontWeight: 500 }}>GLC Tecnologia</span></p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/dashboard"
                className="cta-primary"
                style={{ padding: "13px 32px", background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", color: "#fff", borderRadius: 10, fontWeight: 600, fontSize: 14, boxShadow: "0 4px 14px rgba(59,130,246,0.4)", transition: "all 0.2s" }}
              >
                Ver Dashboard ao Vivo
              </Link>
              <a
                href="https://github.com/cobradev01/gateway_pagamentos_glc"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
                style={{ padding: "13px 32px", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 10, fontWeight: 500, fontSize: 14, transition: "all 0.2s" }}
              >
                Ver no GitHub
              </a>
            </div>
          </div>
        </section>

        {/* ── Agentes ── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px 80px", width: "100%" }}>
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 8 }}>Arquitetura de Agentes</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Os 4 Agentes de IA</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Cada agente usa Claude (Anthropic) com prompts especializados e loga todas as decisões no banco.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
            {agents.map((a) => (
              <div
                key={a.name}
                className="agent-card"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 20px", transition: "all 0.2s", cursor: "default", boxShadow: "var(--shadow-card, none)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: a.tagColor, background: `${a.tagColor}15`, padding: "3px 8px", borderRadius: 4 }}>{a.tag}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{a.name}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── API ── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px 80px", width: "100%" }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 8 }}>Integração</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>API REST</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
              Autenticação via{" "}
              <code style={{ background: "var(--code-bg)", padding: "2px 7px", borderRadius: 5, fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: "var(--code-color)" }}>x-api-key</code>
              {" "}header. Multi-tenant com idempotência nativa.
            </p>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-card, none)" }}>
            {endpoints.map((e, i) => (
              <div
                key={e.path}
                className="endpoint-row"
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 22px", borderBottom: i < endpoints.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.12s" }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, width: 44, flexShrink: 0, color: e.method === "POST" ? "#3b82f6" : "#10b981", fontFamily: "'Roboto Mono', monospace" }}>{e.method}</span>
                <code style={{ fontSize: 12, fontFamily: "'Roboto Mono', monospace", color: "var(--text-secondary)", flex: 1 }}>{e.path}</code>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{e.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stack ── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px 80px", width: "100%" }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 8 }}>Tecnologias</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Stack</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {stack.map((s) => (
              <div key={s.name} style={{ background: "var(--bg-card)", border: `1px solid ${s.border}`, borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-card, none)" }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>{s.name}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: "1px solid var(--border)", padding: "24px 28px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            © 2025 GLC Tecnologia · Gateway de Pagamentos com IA · Desafio Técnico Desenvolvedor Pleno
          </p>
        </footer>

      </div>
    </>
  );
}
