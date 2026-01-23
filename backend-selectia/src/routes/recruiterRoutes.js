const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recruiterController = require('../controllers/recruiterController');
const upload = require('../middleware/upload'); // Reutilizamos el mismo middleware de subida

// Todas las rutas requieren login
router.get('/me', auth, recruiterController.getMe);
router.post('/', auth, recruiterController.updateProfile);
router.post('/upload-logo', auth, upload.single('logo'), recruiterController.uploadLogo);

module.exports = router;