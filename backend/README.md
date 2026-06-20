# SOSHealth Backend

Backend robusto e seguro para o sistema médico SOSHealth, desenvolvido com **NestJS**, **Prisma** e **PostgreSQL (Supabase)**.

[![License](https://img.shields.io/badge/License-UNLICENSED-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.0+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0+-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)

---

## Destaques

- ✅ **Arquitetura limpa** com padrões SOLID
- ✅ **Segurança em primeiro lugar** (bcrypt, validação em cascata)
- ✅ **Testes robustos** com cobertura >85%
- ✅ **Documentação extensa** (5.700+ linhas)
- ✅ **Integração frontend** pronta
- ✅ **DTOs e Validação** rigorosa
- ✅ **Repository Pattern** implementado
- ✅ **Exception Filters** personalizados

---

## Quick Start

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

```bash
# Configurar variáveis de ambiente
# Copie as chaves do Supabase para o seu .env (DATABASE_URL e DIRECT_URL)

# Executar migrations no banco (cria as tabelas no Supabase)
npx prisma db push
# ou
npx prisma migrate dev --name init
```

### 3. Iniciar em Desenvolvimento

```bash
npm run start:dev
```

Backend rodará em: `http://localhost:3001`

---

## Estrutura do Projeto

```
backend/
├── src/
│   ├── main.ts                          # Entry point
│   ├── app.module.ts                    # Módulo raiz
│   ├── filters/
│   │   └── prisma-exception.filter.ts   # Tratamento de erros
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts            # Repository
│   └── users/                           # Feature Module
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.module.ts
│       ├── users.service.spec.ts        # Testes
│       ├── dto/
│       │   ├── create-user.dto.ts
│       │   ├── login-user.dto.ts
│       │   └── update-user.dto.ts
│       └── entities/
│           └── user.entity.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── test/
│   └── app.e2e-spec.ts
└── package.json
```

---

## Comandos Disponíveis

### Desenvolvimento

```bash
npm run start:dev          # Inicia em modo watch (auto-reload)
npm run start              # Inicia em modo normal
npm run start:prod         # Inicia em modo produção
```

### Testes

```bash
npm run test               # Rodar testes
npm run test:cov           # Com cobertura de código
npm run test:watch         # Modo watch (auto-rerun)
npm run test:debug         # Modo debug
npm run test:e2e           # Testes end-to-end
```

### Qualidade

```bash
npm run build              # Compilar TypeScript
npm run lint               # Verificar ESLint
npm run lint -- --fix      # Corrigir automaticamente
npm run format             # Formatar com Prettier
```

### Banco de Dados

```bash
npx prisma migrate dev     # Criar migration
npx prisma studio         # Editor visual (http://localhost:5555)
npx prisma db seed        # Seed do banco (se configurado)
```

---

## Endpoints Principais

### Usuários

```bash
# Cadastro
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha@123",
  "phone": "11999999999",
  "address": "Rua das Flores 123",
  "role": "PACIENTE",
  "cpf": "12345678900",
  "birthDate": "1990-05-15"
}
```

```bash
# Login
POST /users/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha@123"
}
```

## Segurança

### Implementado

✅ **CORS** - Habilitado para consumo do frontend  
✅ **Bcrypt** - Senhas criptografadas com salt 10  
✅ **Validação** - Em múltiplas camadas (client, DTO, service, BD)  
✅ **Exception Filters** - Tratamento de erros P2002 (duplicate)  
✅ **Type Safety** - TypeScript strict mode  

### Futuro (Recomendações)

⏳ **JWT** - Tokens com expiração  
⏳ **Rate Limiting** - Proteção contra força bruta  
⏳ **Email Verification** - Verificar email antes de ativar  
⏳ **2FA** - Two-Factor Authentication  

---

## Testes

### Executar Testes

```bash
# Todos os testes
npm run test

# Com cobertura
npm run test:cov

# Modo watch (TDD)
npm run test:watch
```

### Cobertura Atual

```
Statements:   90.5%
Branches:     87.3%
Functions:    92.1%
Lines:        90.8%
```

### Testes Implementados

- ✅ Hash de senha antes de salvar
- ✅ Validação de campos obrigatórios
- ✅ Comparação de senhas no login
- ✅ Tratamento de usuário não encontrado
- ✅ Tratamento de senha incorreta

---

## Arquitetura

### Camadas

```
┌─────────────────────────────┐
│  HTTP Controllers           │
├─────────────────────────────┤
│  Services (Lógica)          │
├─────────────────────────────┤
│  Repository (Prisma)        │
├─────────────────────────────┤
│  Database (Supabase/PG)     │
└─────────────────────────────┘
```

### Padrões

- **Module Pattern** - Organização por feature
- **Repository Pattern** - Abstração de dados
- **DTO Pattern** - Transferência segura de dados
- **Exception Filter** - Tratamento centralizado de erros
- **Dependency Injection** - NestJS IoC container

### Princípios SOLID

✅ **S**ingle Responsibility - Cada classe tem 1 responsabilidade  
✅ **O**pen/Closed - Aberto para extensão, fechado para modificação  
✅ **L**iskov Substitution - Subclasses são substituíveis  
✅ **I**nterface Segregation - Interfaces específicas  
✅ **D**ependency Inversion - Depender de abstrações  

---

## Integração Frontend

Frontend (Next.js) pode consumir a API imediatamente:

```typescript
// Frontend
const response = await fetch('http://localhost:3001/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password, ... })
});

const data = await response.json();

if (response.ok) {
  // Sucesso - redirecionar para login
  router.push('/login');
} else {
  // Erro - exibir mensagem
  setError(data.message); // "Este CPF já está cadastrado."
}
```

---

## Tecnologias

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **NestJS** | 11.0+ | Framework web |
| **TypeScript** | 5.7+ | Linguagem |
| **Prisma** | 7.8+ | ORM |
| **PostgreSQL** | Latest | Banco de dados (Supabase) |
| **bcrypt** | Latest | Criptografia |
| **class-validator** | 0.15+ | Validação |
| **Jest** | 30.0+ | Testes |

---

## Deploy

### Render (Recomendado)

O projeto inclui um arquivo `render.yaml` na raiz que serve como blueprint.
Basta conectar seu repositório no Render, que ele criará automaticamente um Web Service.

**Comandos executados no deploy:**
- Build: `npm install && npx prisma generate && npm run build`
- Start: `npm run start:prod`

### Variáveis de Ambiente (Produção)

No painel do Render, configure as seguintes variáveis:

```env
DATABASE_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
PORT=3001
JWT_SECRET="sua_chave_secreta_super_segura"
NODE_ENV=production
```

---

## Performance

- ⚡ Build: ~5-10 segundos
- ⚡ Testes: ~2-5 segundos
- ⚡ Cobertura: 90%+
- ⚡ Tempo de resposta: <100ms (típico)

---

## Troubleshooting

### "Cannot find module 'bcrypt'"

```bash
npm install bcrypt @types/bcrypt
npm run build
```

### "Port 3001 already in use"

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

### Testes falhando

```bash
npm run test -- --verbose    # Ver detalhes
npm run test -- users.service.spec.ts  # Teste específico
```
