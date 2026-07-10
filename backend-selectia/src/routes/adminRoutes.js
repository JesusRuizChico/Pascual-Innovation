const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth'); // Asegúrate de que solo admins entren aquí
const checkRole = require('../middleware/roleAuth');

router.get('/dashboard-stats', auth, checkRole(['admin']), adminController.getDashboardStats);
router.get('/users', auth, checkRole(['admin']), adminController.getAllUsers);
router.get('/reports', auth, checkRole(['admin']), adminController.getPlatformReports);
router.get('/pending-companies', auth, checkRole(['admin']), adminController.getPendingCompanies);
router.post('/validate-company/:id', auth, checkRole(['admin']), adminController.validateCompany);

module.exports = router;