const express = require('express');
const { register, login, refresh, logout } = require('../controllers/authController');
const { validate } = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../schemas/userSchema');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);

module.exports = router;