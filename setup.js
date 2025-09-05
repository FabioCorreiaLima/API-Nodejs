const fs = require('fs');
const path = require('path');

// Configurações do projeto
const projectStructure = {
  'src': {
    'config': {
      'database.js': `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;`
    },
    'controllers': {
      'authController.js': `const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    res.json(result);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(req.userId, refreshToken);
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};`,
      'userController.js': `const userRepository = require('../repositories/userRepository');

const getMe = async (req, res) => {
  try {
    const user = await userRepository.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMe
};`,
      'todoController.js': `const todoRepository = require('../repositories/todoRepository');

const createTodo = async (req, res) => {
  try {
    const todo = await todoRepository.create({
      ...req.body,
      owner: req.userId
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await todoRepository.findByOwner(req.userId);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTodo = async (req, res) => {
  try {
    const todo = await todoRepository.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo não encontrado' });
    }
    if (todo.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todo = await todoRepository.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo não encontrado' });
    }
    if (todo.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    const updatedTodo = await todoRepository.update(req.params.id, req.body);
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await todoRepository.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo não encontrado' });
    }
    if (todo.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    await todoRepository.delete(req.params.id);
    res.json({ message: 'Todo deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo
};`
    },
    'middlewares': {
      'auth.js': `const tokenService = require('../services/tokenService');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso necessário' });
  }

  const payload = tokenService.verifyAccessToken(token);
  if (!payload) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }

  req.userId = payload.userId;
  next();
};

module.exports = { authenticate };`,
      'validation.js': `const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Dados de entrada inválidos',
      errors: error.errors
    });
  }
};

module.exports = { validate };`
    },
    'models': {
      'User.js': `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  refreshTokens: [{
    type: String
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);`,
      'Todo.js': `const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema);`
    },
    'repositories': {
      'userRepository.js': `const User = require('../models/User');

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id).select('-password -refreshTokens');
  }

  async addRefreshToken(userId, token) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { refreshTokens: token } },
      { new: true }
    );
  }

  async removeRefreshToken(userId, token) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { refreshTokens: token } },
      { new: true }
    );
  }

  async clearRefreshTokens(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { refreshTokens: [] } },
      { new: true }
    );
  }
}

module.exports = new UserRepository();`,
      'todoRepository.js': `const Todo = require('../models/Todo');

class TodoRepository {
  async create(todoData) {
    const todo = new Todo(todoData);
    return await todo.save();
  }

  async findById(id) {
    return await Todo.findById(id);
  }

  async findByOwner(ownerId) {
    return await Todo.find({ owner: ownerId }).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Todo.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Todo.findByIdAndDelete(id);
  }
}

module.exports = new TodoRepository();`
    },
    'routes': {
      'auth.js': `const express = require('express');
const { register, login, refresh, logout } = require('../controllers/authController');
const { validate } = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../schemas/userSchema');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);

module.exports = router;`,
      'users.js': `const express = require('express');
const { getMe } = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', authenticate, getMe);

module.exports = router;`,
      'todos.js': `const express = require('express');
const { createTodo, getTodos, getTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { validate } = require('../middlewares/validation');
const { createTodoSchema, updateTodoSchema } = require('../schemas/todoSchema');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/', authenticate, validate(createTodoSchema), createTodo);
router.get('/', authenticate, getTodos);
router.get('/:id', authenticate, getTodo);
router.put('/:id', authenticate, validate(updateTodoSchema), updateTodo);
router.delete('/:id', authenticate, deleteTodo);

module.exports = router;`
    },
    'schemas': {
      'userSchema.js': `const zod = require('zod');

const registerSchema = zod.object({
  name: zod.string().min(1, "Nome é obrigatório"),
  email: zod.string().email("Email inválido"),
  password: zod.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

const loginSchema = zod.object({
  email: zod.string().email("Email inválido"),
  password: zod.string().min(1, "Senha é obrigatória")
});

module.exports = {
  registerSchema,
  loginSchema
};`,
      'todoSchema.js': `const zod = require('zod');

const createTodoSchema = zod.object({
  title: zod.string().min(1, "Título é obrigatório")
});

const updateTodoSchema = zod.object({
  title: zod.string().min(1, "Título é obrigatório").optional(),
  done: zod.boolean().optional()
});

module.exports = {
  createTodoSchema,
  updateTodoSchema
};`
    },
    'services': {
      'tokenService.js': `const jwt = require('jsonwebtoken');

class TokenService {
  generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m'
    });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();`,
      'authService.js': `const userRepository = require('../repositories/userRepository');
const tokenService = require('./tokenService');

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    const user = await userRepository.create(userData);
    const accessToken = tokenService.generateAccessToken(user._id);
    const refreshToken = tokenService.generateRefreshToken(user._id);

    await userRepository.addRefreshToken(user._id, refreshToken);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      accessToken,
      refreshToken
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Credenciais inválidas');
    }

    const accessToken = tokenService.generateAccessToken(user._id);
    const refreshToken = tokenService.generateRefreshToken(user._id);

    await userRepository.addRefreshToken(user._id, refreshToken);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      accessToken,
      refreshToken
    };
  }

  async refreshTokens(refreshToken) {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Refresh token inválido');
    }

    const user = await userRepository.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new Error('Refresh token inválido');
    }

    const newAccessToken = tokenService.generateAccessToken(user._id);
    const newRefreshToken = tokenService.generateRefreshToken(user._id);

    await userRepository.removeRefreshToken(user._id, refreshToken);
    await userRepository.addRefreshToken(user._id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout(userId, refreshToken) {
    if (refreshToken) {
      await userRepository.removeRefreshToken(userId, refreshToken);
    } else {
      await userRepository.clearRefreshTokens(userId);
    }
  }
}

module.exports = new AuthService();`
    },
    'app.js': `require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const todoRoutes = require('./routes/todos');

const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/me', userRoutes);
app.use('/todos', todoRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Servidor rodando na porta \${PORT}\`);
});`
  },
  '.env': `PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth-crud-api
ACCESS_TOKEN_SECRET=seu_access_token_secret_super_seguro_aqui_altere_isto
REFRESH_TOKEN_SECRET=seu_refresh_token_secret_super_seguro_aqui_altere_isto
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d`,
  'package.json': `{
  "name": "api-auth-crud",
  "version": "1.0.0",
  "description": "API de Autenticação e CRUD com Node.js, MongoDB e JWT",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "zod": "^3.22.4",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`,
  'README.md': `# API de Autenticação e CRUD

Esta é uma API REST construída com Node.js, Express, MongoDB e JWT para autenticação.

## Funcionalidades

- Registro e autenticação de usuários com JWT (access + refresh tokens)
- CRUD de todos protegido por autenticação
- Validação de entrada com Zod
- Padrão de repositórios para acesso a dados

## Instalação

1. Execute \`npm install\`
2. Configure as variáveis de ambiente no arquivo \`.env\`
3. Execute \`npm run dev\` para desenvolvimento

## Endpoints

### Autenticação

- \`POST /auth/register\` - Registrar novo usuário
- \`POST /auth/login\` - Login de usuário
- \`POST /auth/refresh\` - Refresh tokens
- \`POST /auth/logout\` - Logout

### Usuário

- \`GET /me\` - Obter dados do usuário autenticado

### Todos

- \`POST /todos\` - Criar novo todo
- \`GET /todos\` - Listar todos do usuário
- \`GET /todos/:id\` - Obter todo específico
- \`PUT /todos/:id\` - Atualizar todo
- \`DELETE /todos/:id\` - Deletar todo

## Variáveis de Ambiente

- \`PORT\` - Porta do servidor
- \`MONGODB_URI\` - URI de conexão com MongoDB
- \`ACCESS_TOKEN_SECRET\` - Segredo para access tokens
- \`REFRESH_TOKEN_SECRET\` - Segredo para refresh tokens
- \`ACCESS_TOKEN_EXPIRY\` - Expiração do access token (padrão: 15m)
- \`REFRESH_TOKEN_EXPIRY\` - Expiração do refresh token (padrão: 7d)`
};

// Função para criar a estrutura de pastas e arquivos
function createProjectStructure(basePath, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const currentPath = path.join(basePath, name);
    
    if (typeof content === 'object' && !Array.isArray(content)) {
      // É um diretório
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
        console.log(`Diretório criado: ${currentPath}`);
      }
      createProjectStructure(currentPath, content);
    } else {
      // É um arquivo
      fs.writeFileSync(currentPath, content);
      console.log(`Arquivo criado: ${currentPath}`);
    }
  }
}

// Executar a criação do projeto
console.log('Iniciando criação da estrutura do projeto...');
createProjectStructure(__dirname, projectStructure);
console.log('Estrutura do projeto criada com sucesso!');
console.log('\nPróximos passos:');
console.log('1. Execute: npm install');
console.log('2. Configure seu MongoDB e atualize a string de conexão no arquivo .env');
console.log('3. Execute: npm run dev');
console.log('4. A API estará disponível em http://localhost:3000');