# GLC Tecnologia — Gateway de Pagamentos com IA

> Desafio Técnico · Desenvolvedor Pleno · 2024

Sistema multi-tenant de gateway de pagamentos com **4 agentes de IA autônomos** para detecção de falhas, antifraude em tempo real, suporte inteligente e orquestração de decisões.

---

## Demo

| Página | Descrição |
|---|---|
| `/` | Landing page com arquitetura e endpoints |
| `/dashboard` | Dashboard ao vivo com transações e atividade dos agentes |

---

## Stack

- **Next.js 14** · App Router · TypeScript · Tailwind CSS
- **PostgreSQL** no Railway via **Prisma ORM**
- **Claude Haiku 4.5** (Anthropic) — os 4 agentes de IA
- **Vercel** — deploy e Edge Network

---

## Os 4 Agentes

| Agente | Função |
|---|---|
| 🔍 **DetectorAgent** | Detecta falhas, timeouts, anomalias. Sugere retry ou escalonamento |
| 🛡️ **FraudAgent** | Score de risco 0-100. Bloqueia automaticamente acima de 60 |
| 🤖 **OrchestratorAgent** | Consolida decisões e determina ação final (approve/block/escalate) |
| 💬 **SupportAgent** | Diagnóstico técnico para suporte + resposta ao cliente |

---

## Setup local

### Pré-requisitos
- Node.js 18+
- PostgreSQL (local ou Railway)
- Anthropic API Key

### 1. Clonar e instalar

```bash
git clone https://github.com/cobradev01/gateway_pagamentos_glc.git
cd gateway_pagamentos_glc
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha:

```env
DATABASE_URL="postgresql://user:password@host:5432/gateway_glc"
ANTHROPIC_API_KEY="sk-ant-..."
INTERNAL_API_KEY="sua-chave-interna-secreta"
DEMO_API_KEY="demo-key-glc-2024"
NEXT_PUBLIC_INTERNAL_API_KEY="sua-chave-interna-secreta"
```

### 3. Banco de dados

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Rodar

```bash
npm run dev
```

Acesse `http://localhost:3000`

---

## API Reference

Todas as rotas de tenant exigem header `x-api-key`.

### Criar transação

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "method": "PIX",
    "amount": 150.00,
    "externalId": "pedido-123",
    "payerName": "João Silva",
    "payerDocument": "123.456.789-00",
    "payerEmail": "joao@email.com"
  }'
```

### Simular transação (demo)

```bash
curl -X POST http://localhost:3000/api/v1/simulate \
  -H "x-api-key: $INTERNAL_API_KEY"
```

### Consultar SupportAgent

```bash
curl -X POST http://localhost:3000/api/agents/support \
  -H "Content-Type: application/json" \
  -H "x-api-key: $INTERNAL_API_KEY" \
  -d '{
    "question": "Por que a transação abc123 falhou?",
    "transactionId": "abc123"
  }'
```

---

## Deploy

### Railway (banco de dados)
1. Criar projeto em [railway.app](https://railway.app)
2. Adicionar serviço PostgreSQL
3. Copiar `DATABASE_URL`

### Vercel (aplicação)
1. Conectar repositório no [vercel.com](https://vercel.com)
2. Configurar env vars: `DATABASE_URL`, `ANTHROPIC_API_KEY`, `INTERNAL_API_KEY`, `NEXT_PUBLIC_INTERNAL_API_KEY`
3. Deploy automático a cada push na `main`

---

## Documentação completa

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) com os 10 entregáveis do desafio:
arquitetura, fluxos, agentes, dados, decisão IA vs humano, resiliência, segurança, testes, roadmap e trade-offs.

---

*GLC Tecnologia · 2024*
