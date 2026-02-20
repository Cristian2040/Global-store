const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { userValidators, objectId } = require('../utils/validators');
const Joi = require('joi');

/**
 * User Routes
 * All user-related endpoints with role-based protection
 */

// All routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/profile', userController.getProfile);

// Get all users (admin only)
router.get('/',
    authorize('admin'),
    validate(userValidators.query, 'query'),
    userController.getAll
);

// Get user by ID (admin or self)
router.get('/:id',
    validate(Joi.object({ id: objectId.required() }), 'params'),
    userController.getById
);

// Update user (admin or self)
router.put('/:id',
    validate(Joi.object({ id: objectId.required() }), 'params'),
    validate(userValidators.update),
    userController.update
);

// Soft delete user (admin only)
router.delete('/:id',
    authorize('admin'),
    validate(Joi.object({ id: objectId.required() }), 'params'),
    userController.delete
);

// Permanently delete user (admin only)
router.delete('/:id/permanent',
    authorize('admin'),
    validate(Joi.object({ id: objectId.required() }), 'params'),
    userController.permanentDelete
);

// Reactivate user (admin only)
router.post('/:id/reactivate',
    authorize('admin'),
    validate(Joi.object({ id: objectId.required() }), 'params'),
    userController.reactivate
);

module.exports = router;
