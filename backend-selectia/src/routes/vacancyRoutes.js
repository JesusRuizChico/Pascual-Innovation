// backend-selectia/src/routes/vacancyRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importamos el middleware
const vacancyController = require('../controllers/vacancyController');

// @route   POST api/vacancies
// @desc    Crear una vacante
// @access  Privado (Solo Reclutadores)
router.post('/', auth, vacancyController.createVacancy);

// @route   GET api/vacancies/mine
// @desc    Obtener vacantes del usuario logueado
// @access  Privado
router.get('/mine', auth, vacancyController.getMyVacancies);

// @route   GET api/vacancies
// @desc    Obtener todas las vacantes públicas (Candidatos)
// @access  Público (o Privado si quieres que solo logueados busquen)
router.get('/', vacancyController.getAllVacancies);

module.exports = router;