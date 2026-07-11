// backend-selectia/src/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const statsController = require('../controllers/statsController');

// @route   GET api/stats/recruiter
// @desc    Estadísticas personales del reclutador
// @access  Privado (Reclutador)
router.get('/recruiter', auth, statsController.getRecruiterStats);

// @route   GET api/stats/admin
// @desc    Estadísticas globales del sistema
// @access  Privado (Admin)
router.get('/admin', auth, statsController.getAdminStats);

// ...

router.get('/report', auth, statsController.downloadReport); // <--- NUEVA RUTA

// @route   GET api/stats/conversion
// @desc    Reporte avanzado de conversión de candidatos por vacante
// @access  Privado (Reclutador)
router.get('/conversion', auth, statsController.getConversionReport);

module.exports = router;