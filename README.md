# SOSHealth — Plataforma de Saúde Digital

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0+-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8+-2D3748?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Render](https://img.shields.io/badge/Render-API-000000?logo=render)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel)](https://vercel.com/)

> **Conectando pacientes a profissionais de saúde com tecnologia, segurança e acessibilidade.**

---

## Sobre o Projeto

**SOSHealth** é uma plataforma web full-stack que facilita a conexão entre pacientes e profissionais de saúde. O sistema oferece agendamento de consultas online, gestão de prontuários, acesso rápido a serviços de emergência e recursos completos de acessibilidade — tudo em uma interface moderna e responsiva.

O projeto é composto por dois módulos principais:

| Módulo | Tecnologia | Porta | Documentação |
|--------|-----------|-------|-------------|
| **Frontend** | Next.js 16 + React 19 (Vercel) | `3000` | [frontend/README.md](./frontend/README.md) |
| **Backend** | NestJS 11 + Prisma + PostgreSQL (Render + Supabase) | `3001` | [backend/README.md](./backend/README.md) |

---

## Principais Funcionalidades

### Para Pacientes
- **Busca Inteligente** — Encontre profissionais por especialidade, localização e disponibilidade
- **Agendamento Online** — Marque consultas em tempo real com calendário integrado
- **Anamnese Digital** — Preencha informações médicas antes da consulta
- **Dashboard Pessoal** — Histórico de consultas e próximos agendamentos
- **Avaliações** — Avalie profissionais após atendimentos

### Para Profissionais
- **Dashboard Médico** — Agenda completa e lista de pacientes do dia
- **Gestão de Disponibilidade** — Configure horários, preços e modalidades (presencial/telemedicina)
- **Perfil Profissional** — Currículo, especialidades e certificações
- **Métricas** — Acompanhe avaliações e estatísticas de desempenho

### Emergência e Acessibilidade
- **Botão SOS** — Acesso rápido ao SAMU, Bombeiros e Polícia
- **VLibras** — Tradução automática para Língua Brasileira de Sinais
- **Design Responsivo** — Otimizado para mobile, tablet e desktop

---

## Estrutura do Repositório

```
sos-health/
├── frontend/               # Aplicação Next.js (cliente)
│   ├── src/
│   │   ├── app/            # App Router (páginas e layouts)
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── context/        # Contextos React (Auth, etc.)
│   │   └── services/       # Serviços e chamadas à API
│   └── README.md
│
├── backend/                # API NestJS (servidor)
│   ├── src/
│   │   ├── auth/           # Autenticação JWT
│   │   ├── users/          # Módulo de usuários
│   │   ├── professionals/  # Módulo de profissionais
│   │   ├── appointments/   # Módulo de consultas
│   │   ├── dashboard/      # Módulo de dashboard
│   │   ├── filters/        # Exception filters globais
│   │   └── prisma/         # Serviço de banco de dados
│   ├── prisma/
│   │   └── schema.prisma   # Modelo do banco de dados
│   └── README.md
│
└── README.md               # Este arquivo
```

---

## Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior

### 1. Clone o repositório

```bash
git clone https://github.com/CayoHenrique250/SOSHealth.git
cd sos-health
```

### 2. Configure e inicie o Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

> API disponível em: `http://localhost:3001`  
> Swagger/OpenAPI em: `http://localhost:3001/api`

### 3. Configure e inicie o Frontend

```bash
cd frontend
npm install
npm run dev
```

> Aplicação disponível em: `http://localhost:3000`

---

## 🚀 Deploy em Produção

O projeto está configurado para deploy fácil nos seguintes provedores de nuvem modernos:

- **Frontend:** Vercel (CI/CD Automático). Basta conectar o repositório e configurar a variável `NEXT_PUBLIC_API_URL` apontando para o Render.
- **Backend:** Render. A pasta do backend inclui um `render.yaml` para configuração como Web Service. Requer a configuração de `DATABASE_URL` e `JWT_SECRET`.
- **Banco de Dados:** Supabase (PostgreSQL). O Prisma já está configurado para utilizar a string de pooler (`DATABASE_URL`) e a de conexão direta (`DIRECT_URL`) para migrations.

---

## Stack Tecnológica

### Frontend
| Tecnologia | Versão | Finalidade |
|-----------|--------|-----------|
| Next.js | 16.2.6 | Framework React (App Router) |
| React | 19.2.4 | Interface de usuário |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Estilização utilitária |
| TanStack Query | 5 | Cache e sincronização de dados |
| React Hook Form | 7 | Gerenciamento de formulários |
| Zod | 4 | Validação de schemas |
| React Toastify | 11 | Sistema de notificações |
| React VLibras | 2 | Acessibilidade em Libras |

### Backend
| Tecnologia | Versão | Finalidade |
|-----------|--------|-----------|
| NestJS | 11.0+ | Framework Node.js |
| TypeScript | 5.7+ | Linguagem |
| Prisma | 7.8+ | ORM e migrations |
| PostgreSQL | — | Banco de dados (hospedado no Supabase) |
| JWT / Passport | — | Autenticação |
| bcrypt | 6.0+ | Hash de senhas |
| Swagger | 11.4+ | Documentação da API |
| Jest | 30.0+ | Testes unitários e E2E |

---

## Modelo de Dados

O banco de dados é gerenciado pelo **Prisma ORM** com **PostgreSQL** e conta com os seguintes modelos principais:

```
User ──┬── Patient ──── Anamnese
       │              └── Appointment ── Review
       └── Professional ─── Curriculum
                          ├── Appointment
                          └── Availability

User ──── Notification
```

---

## Segurança

- **JWT + Passport** — Autenticação stateless com tokens de acesso
- **bcrypt** — Hash de senhas com salt rounds 10
- **Throttler** — Rate limiting para proteção contra força bruta
- **CORS** — Configurado para comunicação segura entre frontend e backend
- **ValidationPipe** — Validação de dados em múltiplas camadas
- **LGPD** — Tratamento responsável de dados de saúde

---

## Acessibilidade

- **VLibras** — Widget de tradução automática para Libras
- **HTML Semântico** — Estrutura acessível para leitores de tela
- **Contraste Adequado** — Cores pensadas para diferentes necessidades visuais
- **Navegação por Teclado** — Suporte completo sem uso de mouse
- **Botão SOS** — Acesso rápido a serviços de emergência

---

## Responsividade

A aplicação é totalmente responsiva e otimizada para:

| Dispositivo | Resolução |
|-------------|-----------|
| 📱 Mobile | 320px+ |
| 📟 Tablet | 768px+ |
| 💻 Desktop | 1024px+ |
| 🖥️ Large Screens | 1280px+ |
