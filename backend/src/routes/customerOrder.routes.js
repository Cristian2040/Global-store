const express = require('express');
const router = express.Router();
const customerOrderController = require('../controllers/customerOrder.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { customerOrderValidators, objectId } = require('../utils/validators');
const Joi = require('joi');

router.use(authenticate);

// Customer routes
router.post('/', authorize('customer', 'admin'), validate(customerOrderValidators.create), customerOrderController.create);
router.get('/my/orders', authorize('customer', 'admin'), customerOrderController.getMyOrders);

// Store routes
router.get('/store/:storeId', authorize('store', 'admin'), validate(Joi.object({ storeId: objectId.required() }), 'params'), customerOrderController.getStoreOrders);

// Common routes
router.get('/:id', validate(Joi.object({ id: objectId.required() }), 'params'), customerOrderController.getById);
router.patch('/:id/status', authorize('store', 'admin'), validate(Joi.object({ id: objectId.required() }), 'params'), validate(customerOrderValidators.updateStatus), customerOrderController.updateStatus);
router.post('/:id/cancel', validate(Joi.object({ id: objectId.required() }), 'params'), validate(Joi.object({ reason: Joi.string().trim() })), customerOrderController.cancelOrder);

module.exports = router;
