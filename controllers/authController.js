const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar se o email ou nome de usuário já existem
    const existingUser = await authRepository.findUserByUsername(username) || await authRepository.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Nome de usuário ou e-mail já existe' });

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o novo usuário
    const newUser = await authRepository.createUser(username, email, hashedPassword);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user;
    if (email) {
      user = await authRepository.findUserByEmail(email);
    } else if (username) {
      user = await authRepository.findUserByUsername(username);
    }

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};
