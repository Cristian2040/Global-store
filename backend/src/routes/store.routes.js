const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { storeValidators, objectId } = require('../utils/validators');
const Joi = require('joi');

// Public routes
router.get('/', storeController.getAll);
router.get('/:id',
    validate(Joi.object({ id: objectId.required() }), 'params'),
    storeController.getById
);

// Protected routes
router.use(authenticate);

router.post('/',
    authorize('admin', 'store'),
    validate(storeValidators.create),
    storeController.create
);

router.get('/my/stores',
    authorize('store', 'admin'),
    storeController.getMyStores
);

router.put('/:id',
    authorize('admin', 'store'),
    validate(Joi.object({ id: objectId.required() }), 'params'),
    validate(storeValidators.update),
    storeController.update
);

router.put('/:id/payment-methods',
    authorize('admin', 'store'),
    validate(Joi.object({ id: objectId.required() }), 'params'),
    validate(storeValidators.paymentMethods),
    storeController.updatePaymentMethods
);

router.put('/:id/order-options',
    authorize('admin', 'store'),
    validate(Joi.object({ id: objectId.required() }), 'params'),
    validate(storeValidators.orderOptions),
    storeController.updateOrderOptions
);

router.delete('/:id',
    authorize('admin'),
    validate(Joi.object({ id: objectId.required() }), 'params'),
    storeController.delete
);

module.exports = router;
