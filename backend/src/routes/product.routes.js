const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { productValidators, objectId } = require('../utils/validators');
const Joi = require('joi');

router.get('/', validate(productValidators.query, 'query'), productController.getAll);
router.get('/categories', productController.getCategories);
router.get('/companies', productController.getCompanies);
router.get('/:id', validate(Joi.object({ id: objectId.required() }), 'params'), productController.getById);

router.use(authenticate);

router.post('/', authorize('admin', 'store', 'supplier', 'company'), validate(productValidators.create), productController.create);
router.put('/:id', authorize('admin', 'store', 'supplier', 'company'), validate(Joi.object({ id: objectId.required() }), 'params'), validate(productValidators.update), productController.update);
router.delete('/:id', authorize('admin', 'company'), validate(Joi.object({ id: objectId.required() }), 'params'), productController.delete);

module.exports = router;
