const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const verifyToken = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', registerValidator, register);

// @route   POST /api/auth/login
router.post('/login', loginValidator, login);

// @route   GET /api/auth/me
router.get('/me', verifyToken, getMe);

module.exports = router;
