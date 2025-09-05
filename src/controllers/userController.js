const userRepository = require('../repositories/userRepository');

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
};