const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { supplierValidators, objectId } = require('../utils/validators');
const Joi = require('joi');

router.get('/', supplierController.getAll);
router.get('/:id', validate(Joi.object({ id: objectId.required() }), 'params'), supplierController.getById);
router.get('/:id/products', validate(Joi.object({ id: objectId.required() }), 'params'), supplierController.getProducts);

router.use(authenticate);

router.post('/', authorize('admin', 'supplier'), validate(supplierValidators.create), supplierController.create);
router.get('/my/suppliers', authorize('supplier', 'admin'), supplierController.getMySuppliers);
router.put('/:id', authorize('admin', 'supplier'), validate(Joi.object({ id: objectId.required() }), 'params'), validate(supplierValidators.update), supplierController.update);
router.delete('/:id', authorize('admin'), validate(Joi.object({ id: objectId.required() }), 'params'), supplierController.delete);

module.exports = router;
