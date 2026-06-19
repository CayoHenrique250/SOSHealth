# 🏥 SOSHealth Frontend

Interface moderna e acessível para o sistema médico SOSHealth, desenvolvida com **Next.js**, **React**, e **Tailwind CSS**.

---

## ✨ Destaques

- ✅ **Framework**: Next.js 16 (App Router)
- ✅ **Estilização**: Tailwind CSS 4
- ✅ **Gerenciamento de Estado/Cache**: React Query (@tanstack/react-query)
- ✅ **Formulários e Validação**: React Hook Form + Zod
- ✅ **Acessibilidade**: Integração com React-VLibras
- ✅ **Tipagem**: TypeScript 5
- ✅ **Testes**: Jest + Testing Library

---

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz da pasta `frontend` se necessário (geralmente copiando de um `.env.example`).
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Iniciar em Desenvolvimento

```bash
npm run dev
```

Frontend rodará em: `http://localhost:3000`

---

## Scripts Disponíveis

```bash
npm run dev        # Inicia o servidor de desenvolvimento
npm run build      # Cria o build de produção
npm run start      # Inicia o servidor de produção
npm run lint       # Executa o ESLint para encontrar problemas no código
npm run test       # Executa os testes unitários com Jest
npm run test:cov   # Executa os testes com relatório de cobertura
```

---

## Testes

Para rodar a suíte de testes:

```bash
# Rodar todos os testes
npm run test

# Rodar com cobertura (coverage)
npm run test:cov
```
