import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScanSearch, ShieldAlert, MessageSquareDot, Network } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Agent {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  name: string;
  tag: string;
  tagColor: string;
  desc: string;
}

const agents: Agent[] = [
  { Icon: ScanSearch,       iconBg: "rgba(59,130,246,0.12)",  iconColor: "#3b82f6", name: "Agente Detector",     tag: "DETECTOR",     tagColor: "#3b82f6", desc: "Monitora falhas, timeouts e anomalias em tempo real. Sugere retry automático ou escalonamento." },
  { Icon: ShieldAlert,      iconBg: "rgba(239,68,68,0.12)",   iconColor: "#ef4444", name: "Agente Antifraude",   tag: "FRAUDE",       tagColor: "#ef4444", desc: "Score de risco 0–100 por transação. Bloqueia automaticamente riscos CRITICAL antes da captura." },
  { Icon: MessageSquareDot, iconBg: "rgba(139,92,246,0.12)",  iconColor: "#8b5cf6", name: "Agente de Suporte",   tag: "SUPORTE",      tagColor: "#8b5cf6", desc: "Diagnóstico técnico sob demanda. Rascunha resposta ao cliente com base no histórico da transação." },
  { Icon: Network,          iconBg: "rgba(245,158,11,0.12)",  iconColor: "#f59e0b", name: "Agente Orquestrador", tag: "ORQUESTRADOR", tagColor: "#f59e0b", desc: "Coordena os demais agentes e toma a decisão final: APROVAR, RETRY, BLOQUEAR ou ESCALAR HUMANO." },
];

const endpoints = [
  { method: "POST", path: "/api/v1/transactions",     desc: "Criar e processar pagamento" },
  { method: "GET",  path: "/api/v1/transactions",     desc: "Listar transações do tenant" },
  { method: "GET",  path: "/api/v1/transactions/:id", desc: "Detalhe com logs dos agentes" },
  { method: "POST", path: "/api/agents/support",      desc: "Consultar SupportAgent" },
  { method: "POST", path: "/api/v1/simulate",         desc: "Simular transação para demo" },
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
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .hero-content { animation: fadeUp 0.6s ease both; }
        .access-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; }
        .code-block { background: var(--bg-elevated); border-radius: 8px; padding: 14px 16px; font-family: 'Roboto Mono', monospace; font-size: 11.5px; color: var(--text-secondary); overflow-x: auto; line-height: 1.75; white-space: pre; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-app)", color: "var(--text-primary)" }}>

        {/* ── Nav ── */}
        <nav style={{ borderBottom: "1px solid var(--border)", background: "var(--nav-bg)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0 }}>G</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.1, whiteSpace: "nowrap" }}>GLC Tecnologia</p>
                <p className="hide-mobile" style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.1, marginTop: 1 }}>Gateway de Pagamentos com IA</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <ThemeToggle />
              <a
                href="https://github.com/cobradev01/gateway_pagamentos_glc"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link hide-mobile"
                style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", padding: "7px 14px", border: "1px solid var(--border)", borderRadius: 8, transition: "all 0.15s" }}
              >
                GitHub
              </a>
              <Link
                href="/dashboard"
                style={{ fontSize: 13, fontWeight: 600, color: "#fff", padding: "8px 20px", background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", borderRadius: 8, boxShadow: "0 2px 10px rgba(59,130,246,0.35)", transition: "all 0.15s", whiteSpace: "nowrap" }}
              >
                Dashboard →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "72px 20px 64px" }}>
          <div className="hero-content" style={{ maxWidth: 680, width: "100%" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 999, padding: "6px 16px", marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", flexShrink: 0, boxShadow: "0 0 0 3px rgba(59,130,246,0.25)" }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: "#60a5fa", letterSpacing: "0.04em" }}>Desafio Técnico — Desenvolvedor Pleno</span>
            </div>

            <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.025em", color: "var(--text-primary)", marginBottom: 20 }}>
              Gateway de Pagamentos<br />
              <span style={{ background: "linear-gradient(90deg,#3b82f6,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>com Inteligência Artificial</span>
            </h1>

            <p style={{ fontSize: "clamp(14px, 2.5vw, 16px)", lineHeight: 1.75, color: "var(--text-muted)", marginBottom: 10 }}>
              Sistema multi-tenant com <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>4 agentes de IA autônomos</strong> para detecção de
              falhas, antifraude em tempo real, suporte inteligente e orquestração de decisões.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 40 }}>Construído por <span style={{ fontWeight: 500 }}>GLC Tecnologia</span></p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/dashboard"
                className="cta-primary"
                style={{ padding: "13px 28px", background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", color: "#fff", borderRadius: 10, fontWeight: 600, fontSize: 14, boxShadow: "0 4px 14px rgba(59,130,246,0.4)", transition: "all 0.2s" }}
              >
                Ver Dashboard ao Vivo
              </Link>
              <a
                href="https://github.com/cobradev01/gateway_pagamentos_glc"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
                style={{ padding: "13px 28px", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 10, fontWeight: 500, fontSize: 14, transition: "all 0.2s" }}
              >
                Ver no GitHub
              </a>
            </div>
          </div>
        </section>

        {/* ── Acesso para Avaliadores ── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px 72px", width: "100%" }}>
          <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 16, padding: "clamp(20px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0, boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
              <p style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", letterSpacing: "0.08em", textTransform: "uppercase" }}>Sistema em Produção — Acesso Imediato</p>
            </div>
            <h2 style={{ fontSize: "clamp(17px, 3vw, 22px)", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Credenciais de Acesso para Avaliação</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 }}>
              Use as informações abaixo para explorar a API REST, o dashboard ao vivo e os agentes de IA em produção.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 20 }}>
              <div className="access-card">
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>URL da Aplicação</p>
                <a
                  href="https://gateway-pagamentos-glc-2024.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: "#60a5fa", wordBreak: "break-all", lineHeight: 1.5 }}
                >
                  gateway-pagamentos-glc-2024.vercel.app
                </a>
              </div>

              <div className="access-card">
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>API Key (Demo)</p>
                <code style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: "var(--code-color)", background: "var(--code-bg)", padding: "4px 10px", borderRadius: 6, display: "inline-block" }}>
                  demo-key-glc-2024
                </code>
              </div>

              <div className="access-card">
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Header de Autenticação</p>
                <code style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: "var(--code-color)", background: "var(--code-bg)", padding: "4px 10px", borderRadius: 6, display: "inline-block" }}>
                  x-api-key: demo-key-glc-2024
                </code>
              </div>

              <div className="access-card">
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Repositório GitHub</p>
                <a
                  href="https://github.com/cobradev01/gateway_pagamentos_glc"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: "#60a5fa", wordBreak: "break-all", lineHeight: 1.5 }}
                >
                  github.com/cobradev01/gateway_pagamentos_glc
                </a>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Teste Rápido — Simular Transação via cURL</p>
              <div className="code-block">{`curl -X POST https://gateway-pagamentos-glc-2024.vercel.app/api/v1/simulate \\
  -H "x-api-key: demo-key-glc-2024"`}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Criar Transação Real</p>
              <div className="code-block">{`curl -X POST https://gateway-pagamentos-glc-2024.vercel.app/api/v1/transactions \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: demo-key-glc-2024" \\
  -d '{"method":"PIX","amount":250.00,"externalId":"teste-001","payerName":"Avaliador"}'`}
              </div>
            </div>
          </div>
        </section>

        {/* ── Agentes ── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px 72px", width: "100%" }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 8 }}>Arquitetura de Agentes</p>
            <h2 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 700, color: "var(--text-primary)" }}>Os 4 Agentes de IA</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Cada agente usa Claude (Anthropic) com prompts especializados e loga todas as decisões no banco.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {agents.map((a) => (
              <div
                key={a.name}
                className="agent-card"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 20px", transition: "all 0.2s", cursor: "default", boxShadow: "var(--shadow-card, none)" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: a.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <a.Icon size={20} color={a.iconColor} strokeWidth={1.75} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: a.tagColor, background: `${a.tagColor}15`, padding: "3px 9px", borderRadius: 5 }}>{a.tag}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{a.name}</p>
                <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.7 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── API ── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px 72px", width: "100%" }}>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 8 }}>Integração</p>
            <h2 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 700, color: "var(--text-primary)" }}>API REST</h2>
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
                style={{ borderBottom: i < endpoints.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, width: 44, flexShrink: 0, color: e.method === "POST" ? "#3b82f6" : "#10b981", fontFamily: "'Roboto Mono', monospace" }}>{e.method}</span>
                <code style={{ fontSize: 12, fontFamily: "'Roboto Mono', monospace", color: "var(--text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.path}</code>
                <span className="endpoint-desc">{e.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stack ── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px 72px", width: "100%" }}>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 8 }}>Tecnologias</p>
            <h2 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 700, color: "var(--text-primary)" }}>Stack</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {stack.map((s) => (
              <div key={s.name} style={{ background: "var(--bg-card)", border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 18px", boxShadow: "var(--shadow-card, none)" }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>{s.name}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 16px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            © 2025 GLC Tecnologia · Gateway de Pagamentos com IA · Desafio Técnico Desenvolvedor Pleno
          </p>
        </footer>

      </div>
    </>
  );
}
