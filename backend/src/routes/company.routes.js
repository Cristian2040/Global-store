const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', companyController.getAll);

// Protected routes
router.use(authenticate);

router.get('/profile', authorize('company'), companyController.getProfile);
router.put('/profile', authorize('company'), companyController.updateProfile);
router.get('/suppliers', authorize('company'), companyController.getSuppliers);
router.put('/suppliers/:supplierId/status', authorize('company'), companyController.updateSupplierStatus);

module.exports = router;
