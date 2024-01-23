const express = require('express');
const router = express.Router();

const {
  registerValidation,
  loginValidation,
} = require('../middleware/authValidation');
const { login, register } = require('../controllers/auth');
const verifyToken = require('../middleware/auth');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

module.exports = router;
