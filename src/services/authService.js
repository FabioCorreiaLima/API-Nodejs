const userRepository = require('../repositories/userRepository');
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

module.exports = new AuthService();