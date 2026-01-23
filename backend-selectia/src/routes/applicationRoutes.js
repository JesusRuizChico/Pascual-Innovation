const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

// @route   POST api/applications
// @desc    Postularse a una vacante
// @access  Privado (Candidato)
router.post('/', auth, applicationController.applyToVacancy);

// @route   GET api/applications/me
// @desc    Ver mis postulaciones (Historial del candidato)
// @access  Privado (Candidato)
router.get('/me', auth, applicationController.getMyApplications);

// @route   GET api/applications/recruiter
// @desc    Ver todos los candidatos que aplicaron a mis vacantes
// @access  Privado (Reclutador)
router.get('/recruiter', auth, applicationController.getApplicationsByRecruiter);

// @route   GET api/applications/agenda
// @desc    Ver agenda de entrevistas (Candidatos en estado 'entrevista')
// @access  Privado (Reclutador)
router.get('/agenda', auth, applicationController.getRecruiterAgenda); // <--- NUEVA RUTA

// @route   PUT api/applications/:id/status
// @desc    Cambiar estado de una postulación (Mover en Kanban)
// @access  Privado (Reclutador)
router.put('/:id/status', auth, applicationController.updateStatus);

module.exports = router;