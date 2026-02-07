const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store');
const Supplier = require('../models/Supplier');
const AppError = require('../utils/AppError');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/environment/env');
const logger = require('../utils/logger');

/**
 * Authentication Service
 * Handles user registration, login, and token management
 */
class AuthService {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Created user and token
     */
    async register(userData) {
        const { username, email, password, role, address } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new AppError('Email already registered', 409);
            }
            throw new AppError('Username already taken', 409);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'customer',
            address
        });

        // Generate token
        const token = this.generateToken(user._id);

        logger.info('User registered', { userId: user._id, email, role: user.role });

        // Return user without password
        const userObject = user.toObject();
        delete userObject.password;

        return {
            user: userObject,
            token,
            expiresIn: JWT_EXPIRES_IN
        };
    }

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User and token
     */
    async login(email, password) {
        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Check if user is active
        if (!user.active) {
            throw new AppError('Account is inactive', 403);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        // Get related data based on role
        let relatedData = null;
        if (user.role === 'store') {
            relatedData = await Store.findOne({ userId: user._id });
        } else if (user.role === 'supplier') {
            relatedData = await Supplier.findOne({ userId: user._id });
        }

        // Generate token
        const token = this.generateToken(user._id);

        logger.info('User logged in', { userId: user._id, email, role: user.role });

        // Return user without password
        const userObject = user.toObject();
        delete userObject.password;

        return {
            user: userObject,
            relatedData,
            token,
            expiresIn: JWT_EXPIRES_IN
        };
    }

    /**
     * Change user password
     * @param {string} userId - User ID
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<void>}
     */
    async changePassword(userId, oldPassword, newPassword) {
        const user = await User.findById(userId).select('+password');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            throw new AppError('Current password is incorrect', 401);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        user.password = hashedPassword;
        await user.save();

        logger.info('Password changed', { userId });
    }

    /**
     * Refresh JWT token
     * @param {string} token - Current JWT token
     * @returns {Promise<Object>} New token
     */
    async refreshToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            // Check if user still exists and is active
            const user = await User.findById(decoded.userId);

            if (!user || !user.active) {
                throw new AppError('User not found or inactive', 401);
            }

            // Generate new token
            const newToken = this.generateToken(user._id);

            return {
                token: newToken,
                expiresIn: JWT_EXPIRES_IN
            };
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new AppError('Token expired', 401);
            }
            throw new AppError('Invalid token', 401);
        }
    }

    /**
     * Generate JWT token
     * @param {string} userId - User ID
     * @returns {string} JWT token
     */
    generateToken(userId) {
        return jwt.sign(
            { userId: userId.toString() },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
    }

    /**
     * Verify JWT token
     * @param {string} token - JWT token
     * @returns {Object} Decoded token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (err) {
            throw new AppError('Invalid token', 401);
        }
    }
}

module.exports = new AuthService();
