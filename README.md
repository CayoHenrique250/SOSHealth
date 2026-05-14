# SOSHealth - Plataforma de Saúde Digital

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

> **Conectando pacientes a profissionais de saúde com tecnologia e acessibilidade.**

## Sobre o Projeto

SOSHealth é uma plataforma web moderna que facilita a conexão entre pacientes e profissionais de saúde. Desenvolvida com Next.js 16 e React 19, oferece uma experiência completa e acessível para agendamentos médicos, gestão de consultas e emergências.

## Principais Funcionalidades

### Para Pacientes
- **Busca Inteligente**: Encontre profissionais por especialidade, localização e disponibilidade
- **Agendamento Online**: Marque consultas em tempo real com calendário integrado
- **Gestão de Consultas**: Dashboard completo com histórico e consultas agendadas
- **Perfil Médico**: Mantenha seus dados de saúde organizados e seguros
- **Anamnese Digital**: Preencha informações médicas antes da consulta
- **Sistema de Avaliações**: Avalie profissionais após as consultas

### Para Profissionais
- **Dashboard Médico**: Visão completa da agenda e pacientes do dia
- **Gestão de Disponibilidade**: Configure horários, preços e modalidades (presencial/telemedicina)
- **Perfil Profissional**: Mantenha currículo e especialidades atualizados
- **Histórico de Consultas**: Acesse registros completos de atendimentos
- **Métricas e Feedbacks**: Acompanhe avaliações e estatísticas de desempenho

### Funcionalidades de Emergência e Acessibilidade
- **Botão SOS**: Acesso rápido a serviços de emergência (SAMU, Bombeiros, Polícia)
- **VLibras**: Tradução automática para Língua Brasileira de Sinais
- **Painel de Acessibilidade**: Recursos para usuários com necessidades especiais
- **Design Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop

## Tecnologias Utilizadas

### Core Framework
- **Next.js 16.2.6** - Framework React com App Router
- **React 19.2.4** - Biblioteca para interfaces de usuário
- **TypeScript 5** - Tipagem estática para JavaScript

### Gerenciamento de Estado e Dados
- **TanStack Query** - Cache e sincronização de dados do servidor
- **React Hook Form** - Gerenciamento eficiente de formulários
- **Zod** - Validação de schemas TypeScript-first

### Estilização e UI
- **Tailwind CSS 4** - Framework de CSS utilitário
- **Lucide React** - Ícones SVG otimizados
- **CSS Animations** - Animações customizadas para UX

### Experiência do Usuário
- **React Toastify** - Sistema de notificações elegante
- **React VLibras** - Widget de acessibilidade em Libras
- **Responsive Design** - Interface adaptável a todos os dispositivos

## Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm, yarn, pnpm ou bun

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/CayoHenrique250/SOSHealth.git
   cd sos-health
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

4. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código
```

## Estrutura do Projeto

```
sos-health/
├── src/
│   ├── app/                    # App Router (Next.js 16)
│   │   ├── layout.tsx          # Layout global
│   │   ├── page.tsx            # Página inicial
│   │   ├── login/              # Autenticação
│   │   ├── cadastro/           # Registro de usuários
│   │   ├── paciente/           # Fluxos do paciente
│   │   └── profissional/       # Fluxos do profissional
│   ├── components/             # Componentes reutilizáveis
│   │   ├── Header.tsx          # Cabeçalho da aplicação
│   │   ├── Footer.tsx          # Rodapé
│   │   ├── LoginForm.tsx       # Formulário de login
│   │   ├── SearchForm.tsx      # Busca de profissionais
│   │   ├── DoctorCarousel.tsx  # Carrossel de médicos
│   │   └── GlobalFloatingWidgets.tsx  # SOS + Acessibilidade
│   ├── context/                # Contextos React
│   │   └── AuthContext.tsx     # Autenticação global
│   └── services/               # Serviços e API
│       └── api.ts              # API mockada
├── public/                     # Arquivos estáticos
│   └── images/                 # Imagens da aplicação
├── package.json                # Dependências
└── README.md                   # Documentação
```

## Recursos Técnicos Implementados

### Hooks Essenciais
- ✅ **useState**: Gerenciamento de estado local em componentes
- ✅ **useEffect**: Efeitos colaterais e ciclo de vida
- ✅ **useMemo**: Otimização de performance em cálculos
- ✅ **useQuery**: Cache e sincronização de dados (TanStack Query)

### Formulários Avançados
- ✅ **React Hook Form**: Performance otimizada
- ✅ **Validação com Zod**: Schemas TypeScript-safe
- ✅ **Componentes de Input**: Reutilizáveis e tipados
- ✅ **Feedback de Erro**: UX intuitiva

### Componentização
- ✅ **Componentes Reutilizáveis**: Máximo reuso de código
- ✅ **Props Tipadas**: TypeScript em todos os componentes
- ✅ **Separação de Responsabilidades**: Clean Architecture

### Dados Mockados
- ✅ **API Simulada**: `src/services/api.ts` com dados realistas
- ✅ **Estado em Memória**: Simulação de persistência
- ✅ **Delays Realísticos**: Simulação de latência de rede

### Notificações
- ✅ **React Toastify**: Sistema completo de feedback
- ✅ **Tipos Variados**: Sucesso, erro, aviso e informação
- ✅ **Posicionamento**: Configurável por contexto

### Responsividade
- ✅ **Mobile First**: Design responsivo desde o início
- ✅ **Breakpoints Tailwind**: sm:, md:, lg:, xl:
- ✅ **Componentes Adaptativos**: Layout flexível

## Usuários de Teste

Para testar a aplicação, use as seguintes credenciais:

### Pacientes
```
E-mail: paciente@teste.com
Senha: senha123
```

### Profissionais
```
E-mail: medico@teste.com
Senha: senha123
```

## Segurança e Privacidade

- **Dados Sensíveis**: Todas as informações médicas são tratadas com máxima segurança
- **Autenticação**: Sistema robusto de login e sessão
- **Validação**: Input sanitization em todos os formulários
- **LGPD Compliance**: Respeito à Lei Geral de Proteção de Dados

## Acessibilidade

- **VLibras**: Tradução automática para Libras
- **Semântica HTML**: Estrutura acessível para screen readers
- **Contraste**: Cores adequadas para diferentes necessidades visuais
- **Navegação por Teclado**: Suporte completo à navegação sem mouse
- **Botão SOS**: Acesso rápido a emergências médicas

## Responsividade

A aplicação é totalmente responsiva e otimizada para:
-  **Mobile** (320px+)
-  **Tablet** (768px+)  
-  **Desktop** (1024px+)
-  **Large Screens** (1280px+)