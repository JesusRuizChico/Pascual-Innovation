// backend-selectia/src/routes/recruiterRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recruiterController = require('../controllers/recruiterController');

// --- CAMBIO: USAR UPLOADCLOUD EN VEZ DE UPLOAD LOCAL ---
const uploadCloud = require('../middleware/uploadCloud'); 

// Todas las rutas requieren login
router.get('/me', auth, recruiterController.getMe);
router.post('/', auth, recruiterController.updateProfile);

// --- CAMBIO: Usar uploadCloud.single('logo') ---
router.post('/upload-logo', auth, uploadCloud.single('logo'), recruiterController.uploadLogo);

module.exports = router;