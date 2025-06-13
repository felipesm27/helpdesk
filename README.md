# HelpDesk API – Documentação Completa (Backend)

Esta é a documentação completa da API desenvolvida para o sistema de chamados HelpDesk.  
A API foi construída com Node.js, Express, TypeScript, Prisma ORM e validada com Zod.

---

## 🔐 Autenticação

### POST /auth/login

- Login com e-mail e senha
- Retorna token JWT

### POST /auth/forgot-password

- Envia e-mail com link para redefinir senha

### POST /auth/reset-password

- Redefine a senha com token enviado por e-mail

---

## 👤 Perfil: Cliente

### POST /tickets/cliente

- Criação de chamado
- Campos: `title`, `description`, `technicianId`, `hourId`, `services[]`

### GET /tickets/cliente

- Listagem de chamados do cliente autenticado

### PUT /users/profile

- Atualização de perfil (nome, senha)
- Rota genérica usada por todos os usuários

### DELETE /users/profile

- Exclusão da própria conta

---

## 👨‍🔧 Perfil: Técnico

### GET /tickets/tecnico

- Lista chamados atribuídos ao técnico autenticado

### GET /tickets/tecnico/:id

- Detalhes de um chamado atribuído

### PATCH /tickets/tecnico/:id/status

- Atualiza status: `ABERTO`, `EM_ATENDIMENTO`, `ENCERRADO`

### GET /tickets/tecnico/:id/logs

- Histórico de alterações de status do chamado

---

## 🛡️ Perfil: Admin

### Usuários (clientes e técnicos)

#### GET /admin/users/clientes

#### GET /admin/users/tecnicos

- Lista usuários por tipo

#### PUT /admin/users/:id

- Atualiza nome e senha

#### DELETE /admin/users/:id

- Exclui usuário do sistema

---

### Serviços

#### POST /admin/services

- Cria novo serviço
- Valida nome duplicado

#### PUT /admin/services/:id

- Edita nome e preço do serviço

#### DELETE /admin/services/:id

- Desativa o serviço (`active: false`)

#### PATCH /admin/services/:id/activate

- Reativa o serviço (`active: true`)

---

### Horários (schedules)

#### GET /admin/schedules

- Lista todos os horários ativos cadastrados por técnicos

#### POST /admin/schedules

- Cria horário para um técnico
- Horários válidos: `"07:00"` até `"18:00"`
- Impede duplicidade (mesmo técnico + hora)

#### DELETE /admin/schedules/:id

- Desativa o horário (`active: false`)

#### PATCH /admin/schedules/:id/activate

- Reativa o horário (`active: true`)

---

## 📝 Backlog Técnico (pendências)

### 🔧 Melhorias futuras

- [ ] Adicionar `disabled: boolean` no model `User` (para soft delete de cliente/técnico)
- [ ] Atualizar listagens de usuários para ignorar `disabled = true`
- [ ] Criar relação direta entre `Ticket` e `Schedule` (`scheduleId`) para controle de agenda
- [ ] Impedir exclusão de horário se estiver vinculado a um Ticket
- [ ] Adicionar paginação em listagens longas (clientes, técnicos, serviços)
- [ ] Testes automatizados com Jest (unitários e integração)

---

## 📦 Tecnologias utilizadas

- Node.js + Express
- TypeScript
- Prisma ORM + PostgreSQL
- Zod (validação)
- JWT para autenticação
- Nodemailer (reset de senha)
- Docker (opcional para banco e deploy)

---

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
