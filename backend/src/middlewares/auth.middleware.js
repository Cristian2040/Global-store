const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/environment/env');
const AppError = require('../utils/AppError');
const { error } = require('../utils/responseHandler');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return error(res, 'No token provided', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return error(res, 'Token expired', 401);
            }
            return error(res, 'Invalid token', 401);
        }

        // Get user from database
        const user = await User.findById(decoded.userId);

        if (!user) {
            return error(res, 'User not found', 401);
        }

        if (!user.active) {
            return error(res, 'User account is inactive', 403);
        }

        // Attach user to request
        req.user = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            username: user.username
        };

        next();
    } catch (err) {
        logger.error('Authentication error', err);
        return error(res, 'Authentication failed', 500);
    }
};

/**
 * Authorization middleware factory
 * Checks if user has required role(s)
 * 
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return error(res, 'Authentication required', 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            logger.warn('Authorization failed', {
                userId: req.user.userId,
                userRole: req.user.role,
                requiredRoles: allowedRoles
            });
            return error(res, 'Insufficient permissions', 403);
        }

        next();
    };
};

/**
 * Optional authentication middleware
 * Attaches user if token is provided, but doesn't fail if not
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (user && user.active) {
                req.user = {
                    userId: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    username: user.username
                };
            }
        } catch (err) {
            // Ignore token errors for optional auth
        }

        next();
    } catch (err) {
        logger.error('Optional auth error', err);
        next();
    }
};

module.exports = {
    authenticate,
    authorize,
    optionalAuth
};
