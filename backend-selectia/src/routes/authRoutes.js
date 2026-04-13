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
// ... tus rutas existentes (register, login, change-password, me) ...

// @route   POST api/auth/forgot-password
// @desc    Enviar correo de recuperación
// @access  Public
router.post('/forgot-password', authController.forgotPassword);

// @route   POST api/auth/reset-password/:token
// @desc    Restablecer la contraseña con el token
// @access  Public
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;