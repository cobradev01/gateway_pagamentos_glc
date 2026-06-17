import Link from "next/link";

export default function Home() {
  const agents = [
    { icon: "🔍", name: "DetectorAgent", desc: "Detecta falhas, timeouts e anomalias em tempo real. Sugere retry ou escalonamento automático." },
    { icon: "🛡️", name: "FraudAgent", desc: "Calcula score de risco 0-100 por transação. Bloqueia automaticamente riscos CRITICAL." },
    { icon: "💬", name: "SupportAgent", desc: "Responde o suporte com diagnóstico técnico e rascunha resposta ao cliente final." },
    { icon: "🤖", name: "OrchestratorAgent", desc: "Coordena os demais agentes e toma a decisão final: aprovar, bloquear ou escalonar humano." },
  ];

  const endpoints = [
    { method: "POST", path: "/api/v1/transactions", desc: "Criar e processar pagamento" },
    { method: "GET", path: "/api/v1/transactions", desc: "Listar transações do tenant" },
    { method: "GET", path: "/api/v1/transactions/:id", desc: "Detalhe com logs dos agentes" },
    { method: "POST", path: "/api/agents/support", desc: "Consultar SupportAgent" },
    { method: "POST", path: "/api/v1/simulate", desc: "Simular transação para demo" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-400 mb-6">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Desafio Técnico — Desenvolvedor Pleno
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Gateway de Pagamentos
            <span className="text-blue-400"> com IA</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-2">
            Sistema multi-tenant com 4 agentes de IA autônomos para detecção de falhas,
            antifraude em tempo real, suporte inteligente e orquestração de decisões.
          </p>
          <p className="text-gray-600 text-sm mb-8">Construído por <span className="text-gray-400 font-medium">GLC Tecnologia</span></p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
            >
              Ver Dashboard ao Vivo
            </Link>
            <a
              href="https://github.com/cobradev01/gateway_pagamentos_glc"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-xl font-medium transition-colors text-gray-300"
            >
              Ver no GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {/* Agents */}
        <section>
          <h2 className="text-xl font-bold mb-2">Os 4 Agentes de IA</h2>
          <p className="text-gray-500 text-sm mb-6">Cada agente usa Claude (Anthropic) com prompts especializados e loga todas as decisões no banco.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {agents.map((a) => (
              <div key={a.name} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-2xl mb-2">{a.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{a.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API */}
        <section>
          <h2 className="text-xl font-bold mb-2">API REST</h2>
          <p className="text-gray-500 text-sm mb-6">Autenticação via <code className="bg-gray-800 px-1 rounded text-xs">x-api-key</code> header. Multi-tenant com idempotência nativa.</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {endpoints.map((e, i) => (
              <div key={e.path} className={`flex items-center gap-4 px-5 py-3 text-sm ${i < endpoints.length - 1 ? "border-b border-gray-800" : ""}`}>
                <span className={`text-xs font-bold w-12 shrink-0 ${e.method === "POST" ? "text-blue-400" : "text-green-400"}`}>{e.method}</span>
                <code className="text-gray-300 text-xs font-mono">{e.path}</code>
                <span className="text-gray-600 text-xs ml-auto">{e.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stack */}
        <section>
          <h2 className="text-xl font-bold mb-6">Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Next.js 14", sub: "App Router + TypeScript", color: "border-white/10" },
              { name: "PostgreSQL", sub: "Railway + Prisma ORM", color: "border-blue-500/20" },
              { name: "Claude API", sub: "Haiku 4.5 · Anthropic", color: "border-orange-500/20" },
              { name: "Vercel", sub: "Deploy + Edge Network", color: "border-purple-500/20" },
            ].map((s) => (
              <div key={s.name} className={`bg-gray-900 border ${s.color} rounded-xl p-4`}>
                <p className="font-semibold text-sm">{s.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
