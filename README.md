# 🔐 API de Autenticação e CRUD com Node.js

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7%2B-brightgreen)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-blue)](https://jwt.io/)

Uma API RESTful robusta para autenticação de usuários e gerenciamento de tarefas (todos), construída com as melhores práticas de segurança e arquitetura.

## ✨ Funcionalidades

- **🔐 Autenticação JWT** - Access e Refresh tokens
- **👤 Gerenciamento de Usuários** - Registro, login e perfil
- **✅ CRUD de Tarefas** - Operações completas de Todos
- **🛡️ Validação de Dados** - Com Zod para entradas seguras
- **♻️ Padrão Repository** - Arquitetura limpa e maintainable
- **🔒 Middlewares de Segurança** - Autenticação e autorização
- **🌐 CORS Habilitado** - Pronto para frontend

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- MongoDB 5+
- npm ou yarn

### Instalação

1. **Clone o repositório**
git clone https://github.com/FabioCorreiaLima/API-Nodejs.git
cd API-Nodejs

## Instalação

1. Execute `npm install`
2. Configure as variáveis de ambiente no arquivo `.env`
3. Execute `npm run dev` para desenvolvimento

## Endpoints

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário
- `POST /auth/refresh` - Refresh tokens
- `POST /auth/logout` - Logout

### Usuário

- `GET /me` - Obter dados do usuário autenticado

### Todos

- `POST /todos` - Criar novo todo
- `GET /todos` - Listar todos do usuário
- `GET /todos/:id` - Obter todo específico
- `PUT /todos/:id` - Atualizar todo
- `DELETE /todos/:id` - Deletar todo

## Variáveis de Ambiente

- `PORT` - Porta do servidor
- `MONGODB_URI` - URI de conexão com MongoDB
- `ACCESS_TOKEN_SECRET` - Chave para access tokens
- `REFRESH_TOKEN_SECRET` - Chave para refresh tokens
- `ACCESS_TOKEN_EXPIRY` - Expiração do access token (padrão: 15m)
- `REFRESH_TOKEN_EXPIRY` - Expiração do refresh token (padrão: 7d)