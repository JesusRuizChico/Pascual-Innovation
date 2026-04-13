const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth'); // Asegúrate de que solo admins entren aquí

router.get('/dashboard-stats', auth, adminController.getDashboardStats);
router.get('/users', auth, adminController.getAllUsers);
router.get('/reports', auth, adminController.getPlatformReports);
router.get('/pending-companies', auth, adminController.getPendingCompanies);
router.post('/validate-company/:id', auth, adminController.validateCompany);

module.exports = router;