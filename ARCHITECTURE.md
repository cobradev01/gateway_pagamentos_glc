# Arquitetura — Gateway de Pagamentos com IA
**GLC Tecnologia** · Desafio Técnico Desenvolvedor Pleno

---

## 1. Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTES (Tenants)                   │
│         Loja A          Loja B          Loja C          │
└──────────────┬──────────────┬──────────────┬────────────┘
               │ x-api-key    │              │
               ▼              ▼              ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS API (Vercel · Edge)                │
│                                                         │
│  POST /api/v1/transactions   GET /api/v1/transactions   │
│  GET  /api/v1/transactions/:id                          │
│  POST /api/agents/support    POST /api/v1/simulate      │
│  GET  /api/dashboard/stats                              │
└──────────────────────────┬──────────────────────────────┘
                           │
            ┌──────────────▼──────────────┐
            │     CAMADA DE AGENTES IA    │
            │                             │
            │  ┌──────────┐ ┌──────────┐  │
            │  │ FRAUD    │ │DETECTOR  │  │
            │  │ Agent    │ │ Agent    │  │
            │  └────┬─────┘ └────┬─────┘  │
            │       └──────┬─────┘        │
            │         ┌────▼─────┐        │
            │         │ORCHESTR. │        │
            │         │  Agent   │        │
            │         └────┬─────┘        │
            │    ┌─────────┘              │
            │  ┌─▼────────┐              │
            │  │SUPPORT   │              │
            │  │  Agent   │              │
            │  └──────────┘              │
            └──────────────┬─────────────┘
                           │ Claude Haiku API
                           │ (Anthropic)
            ┌──────────────▼──────────────┐
            │   PostgreSQL (Railway)       │
            │                             │
            │  tenants · transactions     │
            │  transaction_events         │
            │  agent_logs · audit_logs    │
            │  webhook_deliveries         │
            └─────────────────────────────┘
```

### Como a IA se conecta ao gateway

1. Toda transação criada via `POST /api/v1/transactions` aciona o `OrchestratorAgent`
2. O Orchestrator invoca paralelamente `FraudAgent` e, se necessário, `DetectorAgent`
3. Cada agente usa Claude Haiku com prompt especializado e retorna JSON estruturado
4. A decisão final é gravada na transação e dispara webhook para o tenant
5. Todos os logs ficam em `agent_logs` para auditoria completa

---

## 2. Fluxo com IA

```
Cliente → POST /api/v1/transactions
           │
           ▼
     [Validação + Idempotência]
           │
           ▼ status: PROCESSING (resposta 202 imediata)
     ┌─────────────────────────────────┐
     │         OrchestratorAgent       │
     │                                 │
     │  1. FraudAgent.analyze()        │
     │     → score 0-100               │
     │     → riskLevel: LOW/MED/HIGH   │
     │                                 │
     │  2. Se score > 60: BLOCK         │
     │     Se status FAILED:           │
     │       DetectorAgent.detect()    │
     │       → tipo de falha           │
     │       → retry delay             │
     │                                 │
     │  3. Decisão final:              │
     │     APPROVE / RETRY /           │
     │     BLOCK / ESCALATE_HUMAN      │
     └─────────────────────────────────┘
           │
           ▼
     Atualiza status da transação
     Dispara webhook (se tenant configurado)
     Grava agent_log para auditoria
```

---

## 3. Agentes

| Agente | Responsabilidade | Invocado quando |
|---|---|---|
| **FraudAgent** | Score de risco 0-100 por transação. Analisa velocidade, valor, horário, histórico do pagador | Sempre, em toda transação |
| **DetectorAgent** | Classifica tipo de falha: timeout, bloqueio emissor, erro banco, anomalia horário | Transação com status FAILED ou retryCount > 0 |
| **OrchestratorAgent** | Consolida resultados dos outros agentes e decide ação final | Sempre, após Fraud e Detector |
| **SupportAgent** | Diagnóstico técnico para o suporte interno + rascunho de resposta ao cliente | On-demand via `/api/agents/support` |

**Comunicação entre agentes:** síncrona, em memória, dentro do mesmo processo Node.js. O Orchestrator chama os demais em sequência (Fraud primeiro, Detector condicionalmente). Os resultados são passados por parâmetro, sem fila.

---

## 4. Dados

### Tabelas principais

| Tabela | Dados armazenados |
|---|---|
| `tenants` | ID, nome, API key (hash), webhook URL |
| `transactions` | Todos os dados do pagamento + riskScore + riskLevel |
| `transaction_events` | Histórico de mudanças de status (event sourcing leve) |
| `agent_logs` | Input, output, decision, confidence, tokens usados, latência |
| `audit_logs` | Ator, ação, recurso, IP — imutável |
| `webhook_deliveries` | Payload, status, tentativas, response code |

### Segurança e privacidade

- `payerDocument` (CPF/CNPJ) armazenado em campo separado, não aparece em logs
- `cardLast4` apenas — nunca PAN completo
- API keys hasheadas, nunca logadas
- Audit log imutável (sem UPDATE/DELETE na tabela)
- Variáveis sensíveis apenas em env, nunca no código

---

## 5. Decisão da IA

```
FraudScore < 30  →  APPROVE automaticamente
FraudScore 30-60 →  OrchestratorAgent decide (APPROVE com MONITOR ou RETRY)
FraudScore 61-80 →  BLOCK automático + notifica compliance
FraudScore > 80  →  BLOCK + abre investigação + humanRequired = true

Confiança do agente < 70%  →  humanRequired = true
Valor > R$10.000 com risco MEDIUM+  →  humanRequired = true
Divergência entre agentes  →  ESCALATE_HUMAN
Chargeback ou fraude confirmada  →  humanRequired = true
```

**Quando a IA NÃO decide sozinha:**
- Valor acima de limites configurados por tenant
- `humanRequired: true` retornado por qualquer agente
- Qualquer erro/exception no pipeline de IA → fallback para aprovação manual

---

## 6. Resiliência

### Retry
- `retryCount` / `maxRetries` (default 3) por transação
- DetectorAgent define `suggestedRetryDelay` (ex: 30s, 120s, 300s)
- Retry com backoff exponencial: 30s → 2min → 5min

### Idempotência
- Campo `externalId` por tenant com unique constraint `(tenantId, externalId)`
- Se chamada duplicada: retorna a transação existente com HTTP 200
- Garante que retries do cliente não geram pagamentos duplicados

### Filas
- Webhooks com retry automático: tentativa 1 imediata, tentativa 2 após 5min, tentativa 3 após 30min
- Status `ABANDONED` após max tentativas

### Escala
- API stateless → escala horizontal no Vercel (serverless)
- Banco com pool de conexões (Prisma connection pool)
- Agentes de IA independentes → paralelizáveis por transação
- `agent_logs` em índice por `createdAt` para queries de dashboard

---

## 7. Segurança

### Proteção de dados
- TLS obrigatório (Vercel + Railway)
- Credenciais exclusivamente em variáveis de ambiente
- PAN de cartão nunca armazenado, apenas `cardLast4`
- `payerDocument` isolado, não aparece em respostas públicas

### Prevenção de fraude
- FraudAgent roda em toda transação sem exceção
- Bloqueio automático em score > 60
- Rate limiting por API key (middleware do Vercel)
- HMAC na assinatura de webhooks (header `X-GLC-Signature`)

### Limites da IA
- IA nunca processa reembolso sozinha acima de R$1.000
- IA nunca cancela assinaturas
- Toda decisão `humanRequired: true` gera alerta operacional
- Todas as decisões ficam em `agent_logs` com input completo para auditoria

---

## 8. Testes

### Estratégia
```
Unitário:  Agentes com mock do Anthropic SDK (input/output controlado)
Integração: API routes com banco de teste (Railway staging)
E2E: Cypress simulando fluxo completo PIX/cartão/boleto
```

### Cenários críticos
- Fraude confirmada: score deve ser > 80 e status = FAILED
- Timeout bancário: DetectorAgent deve sugerir RETRY com delay
- Chamada duplicada: deve retornar transação existente (idempotência)
- IA fora do ar: fallback para aprovação manual, não derrubar o gateway
- Webhook falhando: fila com retry automático, não bloquear a transação

### Como testar o projeto atual
```bash
# 1. Configurar variáveis de ambiente (.env.local)
# 2. Rodar migrações
npx prisma migrate dev

# 3. Simular transação via API
curl -X POST http://localhost:3000/api/v1/simulate \
  -H "x-api-key: $INTERNAL_API_KEY"

# 4. Verificar logs dos agentes no dashboard
open http://localhost:3000/dashboard
```

---

## 9. Roadmap

### MVP (entregue neste desafio)
- [x] Gateway simulado com PIX, cartão e boleto
- [x] 4 agentes de IA com Claude Haiku
- [x] Score de fraude por transação
- [x] Dashboard em tempo real
- [x] Idempotência e event sourcing
- [x] Audit log completo
- [x] Deploy Vercel + Railway

### Fase 2 (próximos 3 meses)
- [ ] Integração real com PSPs (Pagar.me, Stripe, Cielo)
- [ ] Fila de mensagens (BullMQ/Redis) para retry assíncrono
- [ ] Alertas via Slack/WhatsApp para decisões humanRequired
- [ ] Modelo de ML treinado com histórico próprio de fraudes
- [ ] API de relatórios por tenant

### Fase 3 (escala)
- [ ] Multi-região (Vercel Edge Functions)
- [ ] Cache de embeddings para o SupportAgent (RAG)
- [ ] Fine-tuning do modelo com dados do gateway
- [ ] SLA de latência < 500ms para decisão de IA
- [ ] SOC 2 Type II + PCI DSS

---

## 10. Trade-offs

| Decisão | Alternativa | Por que escolhi |
|---|---|---|
| Claude Haiku para agentes | GPT-4o Mini | Haiku é mais barato, latência < 1s, JSON output confiável |
| Decisão síncrona no request | Fila assíncrona | Para o desafio: simplicidade e demo funcional. Em produção real: fila BullMQ |
| PostgreSQL no Railway | DynamoDB / Redis | Relacional é necessário para auditoria e queries de dashboard |
| Next.js API Routes | API separada (Express) | Monorepo simplifica deploy e é suficiente para o volume inicial |
| Resposta 202 imediata | Aguardar IA | Garante que o cliente não fica travado se a IA demorar |
| Sem autenticação no dashboard | Auth.js / Supabase Auth | Escopo do desafio; em produção seria obrigatório |

---

*GLC Tecnologia · gateway_pagamentos_glc · 2024*
