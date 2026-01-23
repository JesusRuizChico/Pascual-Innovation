// backend-selectia/src/routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const candidateController = require('../controllers/candidateController');
const upload = require('../middleware/upload');

// @route   GET api/candidates/me
// @desc    Obtener perfil del usuario actual
// @access  Privado (Candidato)
router.get('/me', auth, candidateController.getMyProfile);

// @route   POST api/candidates
// @desc    Crear o actualizar perfil
// @access  Privado (Candidato)
router.post('/', auth, candidateController.updateProfile);

router.post('/upload-cv', auth, upload.single('cv'), async (req, res) => {
    try {
        const Candidate = require('../models/Candidate'); // Importar modelo aquí
        
        if (!req.file) {
            return res.status(400).json({ msg: 'No se subió ningún archivo' });
        }

        // Construir la URL completa
        // En producción cambiarías localhost por tu dominio real
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Actualizar el perfil del candidato con la URL
        let profile = await Candidate.findOne({ user: req.user.id });
        
        if (profile) {
            profile.cv_url = fileUrl;
            await profile.save();
            return res.json({ msg: 'CV subido correctamente', cv_url: fileUrl });
        } else {
            return res.status(400).json({ msg: 'Primero debes crear tu perfil básico' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al subir archivo');
    }
});


// ...

// @route   POST api/candidates/upload-photo
// @desc    Subir foto de perfil
router.post('/upload-photo', auth, upload.single('photo'), async (req, res) => {
    try {
        const Candidate = require('../models/Candidate');
        if (!req.file) return res.status(400).json({ msg: 'No se subió imagen' });

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Actualizar solo el campo photo_url
        let profile = await Candidate.findOne({ user: req.user.id });
        if (profile) {
            profile.photo_url = fileUrl;
            await profile.save();
            return res.json({ msg: 'Foto actualizada', photo_url: fileUrl });
        }
        res.status(400).json({ msg: 'Crea tu perfil primero' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al subir foto');
    }
});



// ...


// --- NUEVA RUTA ---
router.put('/discard/:vacancyId', auth, candidateController.discardVacancy);
// ------------------


module.exports = router;