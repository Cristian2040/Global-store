const express = require('express');
const router = express.Router();
const supplierProductController = require('../controllers/supplierProduct.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { supplierProductValidators, objectId } = require('../utils/validators');
const Joi = require('joi');

router.use(authenticate);

router.post('/', authorize('admin', 'supplier'), validate(supplierProductValidators.create), supplierProductController.addProduct);
router.get('/supplier/:supplierId', validate(Joi.object({ supplierId: objectId.required() }), 'params'), supplierProductController.getBySupplier);
router.get('/:id', validate(Joi.object({ id: objectId.required() }), 'params'), supplierProductController.getById);
router.put('/:id', authorize('admin', 'supplier'), validate(Joi.object({ id: objectId.required() }), 'params'), validate(supplierProductValidators.update), supplierProductController.update);
router.delete('/:id', authorize('admin', 'supplier'), validate(Joi.object({ id: objectId.required() }), 'params'), supplierProductController.delete);

module.exports = router;
