const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authValidators } = require('../utils/validators');

/**
 * Auth Routes
 * All authentication-related endpoints
 */

// Public routes
router.post('/register',
    validate(authValidators.register),
    authController.register
);

router.post('/login',
    validate(authValidators.login),
    authController.login
);

router.post('/refresh',
    authController.refreshToken
);

// Protected routes
router.post('/change-password',
    authenticate,
    validate(authValidators.changePassword),
    authController.changePassword
);

router.post('/logout',
    authenticate,
    authController.logout
);

router.get('/me',
    authenticate,
    authController.getMe
);

module.exports = router;
