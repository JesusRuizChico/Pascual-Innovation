// backend-selectia/src/routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const candidateController = require('../controllers/candidateController');
const upload = require('../middleware/upload');
// --- IMPORTAR EL MIDDLEWARE DE CLOUDINARY ---
const uploadCloud = require('../middleware/uploadCloud'); 

// Obtener perfil
router.get('/me', auth, candidateController.getMyProfile);

// Crear/Actualizar perfil
router.post('/', auth, candidateController.updateProfile);

// --- RUTAS DE CARGA DE ARCHIVOS (Modificadas para Cloudinary) ---
// Usamos uploadCloud.single('photo') para subir la imagen a la nube
router.post('/upload-photo', auth, uploadCloud.single('photo'), candidateController.uploadPhoto);

// Usamos uploadCloud.single('cv') para subir el PDF a la nube
router.post('/upload-cv', auth, upload.single('cv'), candidateController.uploadCV);

// Descartar Vacante
router.put('/discard/:vacancyId', auth, candidateController.discardVacancy);

module.exports = router;