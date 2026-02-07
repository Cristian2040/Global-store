const User = require('../models/User');
const Store = require('../models/Store');
const Supplier = require('../models/Supplier');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * User Service
 * Handles user-related business logic
 */
class UserService {
    /**
     * Get all users with filtering and pagination
     * @param {Object} filters - Filter criteria
     * @param {Object} pagination - Pagination options
     * @returns {Promise<Object>} Users and pagination info
     */
    async getAll(filters = {}, pagination = {}) {
        const { role, active, search } = filters;
        const { page = 1, limit = 10 } = pagination;

        // Build query
        const query = {};

        if (role) {
            query.role = role;
        }

        if (active !== undefined) {
            query.active = active;
        }

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 }),
            User.countDocuments(query)
        ]);

        return {
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total
            }
        };
    }

    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User object
     */
    async getById(userId) {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    /**
     * Get user profile with related data
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User profile with related data
     */
    async getProfile(userId) {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        let relatedData = null;

        // Get related data based on role
        if (user.role === 'store') {
            relatedData = await Store.findOne({ userId: user._id });
        } else if (user.role === 'supplier') {
            relatedData = await Supplier.findOne({ userId: user._id });
        }

        return {
            user,
            relatedData
        };
    }

    /**
     * Update user
     * @param {string} userId - User ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated user
     */
    async update(userId, updateData) {
        // Don't allow password or role updates through this method
        delete updateData.password;
        delete updateData.role;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        logger.info('User updated', { userId });

        return user;
    }

    /**
     * Soft delete user (deactivate)
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    async delete(userId) {
        const user = await User.findByIdAndUpdate(
            userId,
            { active: false },
            { new: true }
        );

        if (!user) {
            throw new AppError('User not found', 404);
        }

        logger.info('User deactivated', { userId });
    }

    /**
     * Permanently delete user (admin only)
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    async permanentDelete(userId) {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        logger.warn('User permanently deleted', { userId });
    }

    /**
     * Reactivate user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Reactivated user
     */
    async reactivate(userId) {
        const user = await User.findByIdAndUpdate(
            userId,
            { active: true },
            { new: true }
        ).select('-password');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        logger.info('User reactivated', { userId });

        return user;
    }
}

module.exports = new UserService();
