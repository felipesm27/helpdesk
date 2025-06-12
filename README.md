# HelpDesk API

API RESTful para gerenciamento de chamados técnicos (HelpDesk), desenvolvida com Node.js, Express, Prisma e TypeScript, seguindo o desafio prático do sistema de chamados.

## 🧠 Funcionalidades

### 🔐 Autenticação

- Registro de usuário com papel (`admin`, `tecnico`, `cliente`)
- Login com JWT
- Troca de senha autenticada
- Recuperação de senha com envio por e-mail (Nodemailer)
- Middlewares: `ensureAuthenticated`, `ensureRole`
- Validação de variáveis de ambiente como `JWT_SECRET`

### 👤 Usuário

- Visualizar perfil (`GET /users/profile`)
- Atualizar nome (`PUT /users/profile`)
- Excluir conta (`DELETE /users/profile`)
- Avatar (atualmente não implementado por decisão)

### 👥 Personas

#### Cliente

- Criar chamados (`POST /tickets/cliente`)
- Listar chamados (`GET /tickets/cliente`)
- Ver detalhe de chamado (`GET /tickets/cliente/:id`) [pendente]
- Campos obrigatórios: técnico, horário, serviços, descrição, título

#### Técnico

- Ver chamados atribuídos (em planejamento)
- Atualizar status de chamados (em planejamento)

#### Admin

- CRUD de serviços (em planejamento)
- Gerenciamento de clientes e técnicos (em planejamento)

## 🗄️ Tecnologias

- Node.js + Express
- TypeScript
- Prisma ORM + PostgreSQL
- Zod (validações)
- JWT + Bcrypt
- Nodemailer (com Ethereal)
- Docker (PostgreSQL em dev)

## ▶️ Como executar

```bash
# Instale as dependências
npm install

# Configure o .env
cp .env.example .env

# Crie o banco com Docker
docker compose up -d

# Rode as migrações e o seed
npx prisma migrate dev --name init
npx tsx prisma/seed.ts

# Rode o servidor
npx tsx src/server.ts
```

## 📂 Estrutura do projeto

```
src/
├── controllers/
│   ├── auth/
│   ├── users/
│   ├── cliente/
├── routes/
│   ├── auth.routes.ts
│   ├── users.routes.ts
│   └── tickets/
│       ├── tickets.cliente.routes.ts
├── services/
│   ├── auth/
│   ├── users/
│   └── cliente/
├── schemas/
├── middlewares/
├── lib/
├── utils/
└── @types/
```

---

> Projeto em andamento. Personas sendo implementadas uma por vez. Última rota finalizada: `POST /tickets/cliente`
