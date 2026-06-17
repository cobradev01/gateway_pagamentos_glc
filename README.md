# Gateway de Pagamentos com IA — GLC Tecnologia

> **Desafio Técnico · Desenvolvedor Pleno**
> Sistema funcional em produção — vai além do documento solicitado.

**Demo ao vivo:** https://gateway-pagamentos-glc-2024.vercel.app
**Repositório:** https://github.com/cobradev01/gateway_pagamentos_glc

---

## Acesso para Avaliação

| Item | Valor |
|---|---|
| **URL da Aplicação** | https://gateway-pagamentos-glc-2024.vercel.app |
| **Dashboard ao Vivo** | https://gateway-pagamentos-glc-2024.vercel.app/dashboard |
| **API Key (Demo)** | `demo-key-glc-2024` |
| **Header de Auth** | `x-api-key: demo-key-glc-2024` |
| **Base URL da API** | `https://gateway-pagamentos-glc-2024.vercel.app/api/v1` |
| **Repositório** | https://github.com/cobradev01/gateway_pagamentos_glc |

### Teste imediato (sem configuração)

```bash
# 1. Simular transação com pipeline de IA
curl -X POST https://gateway-pagamentos-glc-2024.vercel.app/api/v1/simulate \
  -H "x-api-key: demo-key-glc-2024"

# 2. Criar transação real
curl -X POST https://gateway-pagamentos-glc-2024.vercel.app/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key-glc-2024" \
  -d '{"method":"PIX","amount":500.00,"externalId":"avaliacao-001","payerName":"Avaliador Técnico"}'

# 3. Listar transações do tenant demo
curl https://gateway-pagamentos-glc-2024.vercel.app/api/v1/transactions \
  -H "x-api-key: demo-key-glc-2024"
```

> **Nota sobre IA no ambiente demo:** os agentes exibem badge "ERRO" pois a chave Anthropic não está ativa no plano gratuito da Vercel. Banco de dados, API REST, dashboard, idempotência e autenticação multi-tenant estão 100% operacionais.

---

## O que foi construído

O desafio pedia um **documento de arquitetura sem código**. Entregamos um **sistema funcional completo em produção**, com banco de dados real (Railway), deploy na Vercel, 4 agentes de IA e dashboard ao vivo — além de toda a documentação dos 10 entregáveis do desafio.

---

## Demo

| URL | O que você vai ver |
|---|---|
| `/` | Landing page com arquitetura, agentes, endpoints e stack |
| `/dashboard` | Dashboard ao vivo: transações, risco, atividade dos agentes |
| `/api/v1/simulate` | Cria transação aleatória e aciona o pipeline de IA |
| `/api/v1/transactions` | Lista transações do tenant autenticado |

> **Nota sobre o ambiente de demo:** os agentes de IA exibem badge "ERRO" pois não há chave Anthropic real configurada (veja instruções de produção abaixo). Todo o resto — banco, API, dashboard, idempotência — está 100% operacional.

---

## Os 4 Agentes de IA

Cada agente é uma classe independente que chama o **Claude Haiku 4.5** (Anthropic) com prompt especializado e retorna JSON estruturado. Todos os inputs, outputs e decisões são gravados em `agent_logs` para auditoria completa.

| Agente | Arquivo | Responsabilidade |
|---|---|---|
| **Agente Detector** | `src/agents/detector.ts` | Detecta tipo de falha (timeout, bloqueio emissor, anomalia horário), sugere delay de retry com backoff |
| **Agente Antifraude** | `src/agents/fraud.ts` | Calcula score de risco 0–100 por transação. Acima de 60 → BLOCK automático |
| **Agente de Suporte** | `src/agents/support.ts` | Diagnóstico técnico on-demand + rascunho de resposta ao cliente |
| **Agente Orquestrador** | `src/agents/orchestrator.ts` | Coordena os demais e toma a decisão final: APPROVE / RETRY / BLOCK / ESCALATE_HUMAN |

### Fluxo de decisão

```
POST /api/v1/transactions
         │
         ▼
  Validação + Idempotência ──→ 202 imediato ao cliente
         │
         ▼ (async)
  OrchestratorAgent
    ├── FraudAgent.analyze()   → score 0-100 + riskLevel
    └── DetectorAgent.detect() → tipo de falha + retry delay (se FAILED)
         │
         ▼
  Decisão final gravada na transação
  Webhook disparado para o tenant
  agent_log salvo para auditoria
```

### Thresholds de decisão

```
FraudScore  0–29  →  APPROVE automático
FraudScore 30–60  →  OrchestratorAgent decide (APPROVE + MONITOR ou RETRY)
FraudScore 61–80  →  BLOCK automático + notifica compliance
FraudScore  > 80  →  BLOCK + investigação + humanRequired = true

Confiança do agente < 70%  →  humanRequired = true
Valor > R$ 10.000 com risco MEDIUM+  →  humanRequired = true
Qualquer divergência entre agentes  →  ESCALATE_HUMAN
```

---

## Stack

| Camada | Tecnologia | Decisão |
|---|---|---|
| Frontend / API | Next.js 14 · App Router · TypeScript | Monorepo simplifica deploy — API Routes serverless no mesmo projeto |
| Banco de dados | PostgreSQL · Railway · Prisma ORM | Relacional necessário para auditoria e queries de dashboard |
| IA | Claude Haiku 4.5 · Anthropic SDK | Menor latência e custo entre os modelos Claude, JSON output confiável |
| Deploy | Vercel · Edge Network | Auto-scale, zero config, deploy a cada push na main |
| Estilo | Tailwind CSS · Roboto · Roboto Mono | Tipografia profissional, tema dark/light com CSS variables |

---

## Banco de Dados — Schema

```
tenants              → clientes (multi-tenant), API key por tenant
transactions         → toda transação: método, status, valor, riskScore, riskLevel
transaction_events   → event sourcing: histórico de mudanças de status
agent_logs           → input + output + decision + confidence + latência de cada agente
webhook_deliveries   → fila de webhooks com retry automático
audit_logs           → log imutável de todas as ações (ator, IP, recurso)
```

**Idempotência:** campo `externalId` com unique constraint `(tenantId, externalId)` — chamadas duplicadas retornam a transação existente sem criar outra.

---

## API Reference

Todas as rotas exigem o header `x-api-key`.

### Criar transação

```bash
curl -X POST https://gateway-pagamentos-glc-2024.vercel.app/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "method": "PIX",
    "amount": 250.00,
    "externalId": "pedido-001",
    "payerName": "João Silva",
    "payerDocument": "123.456.789-00",
    "payerEmail": "joao@email.com"
  }'
```

**Resposta (202):**
```json
{
  "id": "uuid",
  "status": "PROCESSING",
  "method": "PIX",
  "amount": 250.00,
  "orchestratorResult": {
    "finalDecision": "APPROVE",
    "fraudScore": 18,
    "riskLevel": "LOW",
    "humanRequired": false
  }
}
```

### Listar transações

```bash
curl https://gateway-pagamentos-glc-2024.vercel.app/api/v1/transactions \
  -H "x-api-key: SEU_API_KEY"
```

### Detalhe com logs dos agentes

```bash
curl https://gateway-pagamentos-glc-2024.vercel.app/api/v1/transactions/{id} \
  -H "x-api-key: SEU_API_KEY"
```

### Simular transação (demo)

```bash
curl -X POST https://gateway-pagamentos-glc-2024.vercel.app/api/v1/simulate \
  -H "x-api-key: SEU_API_KEY"
```

### Consultar Agente de Suporte

```bash
curl -X POST https://gateway-pagamentos-glc-2024.vercel.app/api/agents/support \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "question": "Por que a transação falhou?",
    "transactionId": "uuid-da-transacao"
  }'
```

### Métodos de pagamento suportados

| method | Descrição |
|---|---|
| `PIX` | Pagamento instantâneo |
| `CREDIT_CARD` | Cartão de crédito |
| `DEBIT_CARD` | Cartão de débito |
| `BOLETO` | Boleto bancário |

---

## Segurança

- **TLS obrigatório** em toda comunicação (Vercel + Railway)
- **PAN nunca armazenado** — apenas `cardLast4`
- **CPF/CNPJ** em campo isolado, não aparece em logs ou respostas públicas
- **API keys** hasheadas, nunca logadas
- **Audit log imutável** — sem UPDATE/DELETE na tabela `audit_logs`
- **HMAC** na assinatura de webhooks (`X-GLC-Signature`)
- **Rate limiting** por API key (middleware Vercel)
- **IA nunca processa reembolso > R$ 1.000 sozinha**
- **IA nunca cancela assinaturas** — sempre requer humano

---

## Resiliência

| Mecanismo | Implementação |
|---|---|
| **Retry com backoff** | 30s → 2min → 5min (sugerido pelo DetectorAgent) |
| **Idempotência** | `(tenantId, externalId)` unique — sem pagamentos duplicados |
| **Webhooks com fila** | Tentativa imediata → 5min → 30min → ABANDONED |
| **Fallback de IA** | Se qualquer agente falhar → humanRequired = true, gateway não cai |
| **Resposta 202** | Pipeline de IA roda async — cliente nunca fica bloqueado |
| **Escala horizontal** | API stateless serverless (Vercel) — escala automático |

---

## Setup Local

### Pré-requisitos

- Node.js 18+
- PostgreSQL (local ou Railway)
- Anthropic API Key (https://console.anthropic.com)

### 1. Clonar e instalar

```bash
git clone https://github.com/cobradev01/gateway_pagamentos_glc.git
cd gateway_pagamentos_glc
npm install
```

### 2. Variáveis de ambiente

Crie `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:5432/gateway_glc"
ANTHROPIC_API_KEY="sk-ant-..."
INTERNAL_API_KEY="chave-interna-segura"
DEMO_API_KEY="demo-key"
NEXT_PUBLIC_INTERNAL_API_KEY="chave-interna-segura"
```

### 3. Banco de dados

```bash
npx prisma generate
npx prisma db push
```

### 4. Rodar

```bash
npm run dev
```

Acesse `http://localhost:3000`

---

## Deploy em Produção

### Railway (banco)

1. Criar projeto em [railway.app](https://railway.app)
2. Adicionar serviço PostgreSQL
3. Copiar `DATABASE_URL` (aba Connect → Public Network)
4. Rodar `npx prisma db push` com a DATABASE_URL do Railway

### Vercel (aplicação)

1. Conectar repositório em [vercel.com](https://vercel.com)
2. Framework Preset → **Next.js**
3. Configurar variáveis de ambiente:
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY` ← necessário para os agentes de IA
   - `INTERNAL_API_KEY`
   - `NEXT_PUBLIC_INTERNAL_API_KEY`
4. Deploy automático a cada push na `main`

---

## Estrutura do Projeto

```
gateway_pagamentos_glc/
├── prisma/
│   └── schema.prisma          # Schema completo do banco
├── src/
│   ├── agents/
│   │   ├── base.ts            # Chamada Claude + logging
│   │   ├── detector.ts        # Agente de detecção de falhas
│   │   ├── fraud.ts           # Agente antifraude (score 0-100)
│   │   ├── support.ts         # Agente de suporte on-demand
│   │   └── orchestrator.ts    # Orquestrador — decisão final
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/transactions/    # CRUD de transações
│   │   │   ├── v1/simulate/        # Simulação para demo
│   │   │   └── agents/support/     # SupportAgent endpoint
│   │   ├── dashboard/page.tsx      # Dashboard ao vivo
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── dashboard/              # StatsCards, TransactionTable, etc.
│   │   └── ThemeToggle.tsx         # Toggle dark/light
│   └── lib/
│       └── prisma.ts               # Singleton do Prisma Client
├── ARCHITECTURE.md            # 10 entregáveis do desafio
└── README.md                  # Este arquivo
```

---

## Documentação do Desafio

O arquivo **[ARCHITECTURE.md](./ARCHITECTURE.md)** contém os 10 entregáveis solicitados:

| # | Entregável | Conteúdo |
|---|---|---|
| 1 | Arquitetura | Diagrama completo + como a IA se conecta ao gateway |
| 2 | Fluxo com IA | Pagamento → falha → IA atua → decisão |
| 3 | Agentes | Responsabilidades, comunicação, quando cada um age |
| 4 | Dados | Tabelas, segurança, privacidade, auditoria |
| 5 | Decisão da IA | Thresholds, quando decide sozinha, quando escala humano |
| 6 | Resiliência | Retry, filas, idempotência, escala |
| 7 | Segurança | Proteção de dados, antifraude, limites da IA |
| 8 | Testes | Estratégia unitário/integração/E2E + cenários críticos |
| 9 | Roadmap | MVP entregue → Fase 2 → Fase 3 com escala e compliance |
| 10 | Trade-offs | Decisões tomadas com justificativas técnicas |

---

*GLC Tecnologia · Gateway de Pagamentos com IA · Desafio Técnico Desenvolvedor Pleno · 2025*
