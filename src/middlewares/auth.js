const tokenService = require('../services/tokenService');

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

module.exports = { authenticate };