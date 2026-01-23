// backend-selectia/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth'); // <--- ¡ESTA LÍNEA FALTABA!

// @route   POST api/auth/register
// @desc    Registrar usuario
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/change-password
// @desc    Cambiar contraseña
// @access  Privado (Requiere Token)
router.post('/change-password', auth, authController.changePassword);


router.delete('/me', auth, authController.deleteAccount); // <--- NUEVA RUTA


module.exports = router;