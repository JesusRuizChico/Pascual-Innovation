const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

// @route   POST api/chat
// @desc    Enviar mensaje al asistente IA
// @access  Privado
router.post('/', auth, chatController.handleChat);

module.exports = router;