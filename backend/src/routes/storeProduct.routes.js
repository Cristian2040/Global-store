const express = require('express');
const router = express.Router();
const storeProductController = require('../controllers/storeProduct.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { storeProductValidators, objectId } = require('../utils/validators');
const Joi = require('joi');

router.use(authenticate);

router.post('/', authorize('admin', 'store'), validate(storeProductValidators.create), storeProductController.addProduct);
router.get('/store/:storeId', validate(Joi.object({ storeId: objectId.required() }), 'params'), storeProductController.getByStore);
router.get('/:id', validate(Joi.object({ id: objectId.required() }), 'params'), storeProductController.getById);
router.put('/:id', authorize('admin', 'store'), validate(Joi.object({ id: objectId.required() }), 'params'), validate(storeProductValidators.update), storeProductController.update);
router.patch('/:id/stock', authorize('admin', 'store'), validate(Joi.object({ id: objectId.required() }), 'params'), validate(Joi.object({ quantity: Joi.number().integer().min(0).required() })), storeProductController.updateStock);
router.delete('/:id', authorize('admin', 'store'), validate(Joi.object({ id: objectId.required() }), 'params'), storeProductController.delete);

module.exports = router;
