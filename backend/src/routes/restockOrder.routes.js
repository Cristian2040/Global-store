const express = require('express');
const router = express.Router();
const restockOrderController = require('../controllers/restockOrder.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { restockOrderValidators, objectId } = require('../utils/validators');
const Joi = require('joi');

router.use(authenticate);

// Store routes
router.post('/', authorize('store', 'admin'), validate(restockOrderValidators.create), restockOrderController.create);
router.get('/store/:storeId', authorize('store', 'admin'), validate(Joi.object({ storeId: objectId.required() }), 'params'), restockOrderController.getStoreOrders);

// Supplier routes
router.get('/supplier/:supplierId', authorize('supplier', 'admin'), validate(Joi.object({ supplierId: objectId.required() }), 'params'), restockOrderController.getSupplierOrders);
router.post('/:id/accept', authorize('supplier', 'admin'), validate(Joi.object({ id: objectId.required() }), 'params'), restockOrderController.acceptOrder);
router.post('/:id/reject', authorize('supplier', 'admin'), validate(Joi.object({ id: objectId.required() }), 'params'), validate(Joi.object({ reason: Joi.string().required() })), restockOrderController.rejectOrder);

// Common routes
router.get('/:id', validate(Joi.object({ id: objectId.required() }), 'params'), restockOrderController.getById);
router.patch('/:id/status', authorize('store', 'supplier', 'admin'), validate(Joi.object({ id: objectId.required() }), 'params'), validate(restockOrderValidators.updateStatus), restockOrderController.updateStatus);
router.post('/:id/confirm-delivery', authorize('store', 'admin'), validate(Joi.object({ id: objectId.required() }), 'params'), validate(restockOrderValidators.confirmDelivery), restockOrderController.confirmDelivery);

module.exports = router;
