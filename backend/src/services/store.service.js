const Store = require('../models/Store');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Store Service
 * Handles store-related business logic
 */
class StoreService {
    /**
     * Create new store
     * @param {Object} storeData - Store data
     * @returns {Promise<Object>} Created store
     */
    async create(storeData) {
        // Verify user exists and has store role
        const user = await User.findById(storeData.userId);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        if (user.role !== 'store' && user.role !== 'admin') {
            throw new AppError('User must have store role', 403);
        }

        // Check if user already has a store
        const existingStore = await Store.findOne({ userId: storeData.userId });
        if (existingStore) {
            throw new AppError('User already has a store', 409);
        }

        const store = await Store.create(storeData);

        logger.info('Store created', { storeId: store._id, userId: storeData.userId });

        return store;
    }

    /**
     * Get all stores with filtering and pagination
     */
    async getAll(filters = {}, pagination = {}) {
        const { active, search } = filters;
        const { page = 1, limit = 10 } = pagination;

        const query = {};

        if (active !== undefined) {
            query.active = active;
        }

        if (search) {
            query.$or = [
                { storeName: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const [stores, total] = await Promise.all([
            Store.find(query)
                .populate('userId', 'username email')
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 }),
            Store.countDocuments(query)
        ]);

        return {
            stores,
            pagination: { page: parseInt(page), limit: parseInt(limit), total }
        };
    }

    /**
     * Get store by ID
     */
    async getById(storeId) {
        const store = await Store.findById(storeId)
            .populate('userId', 'username email');

        if (!store) {
            throw new AppError('Store not found', 404);
        }

        return store;
    }

    /**
     * Get stores by user ID
     */
    async getByUserId(userId) {
        const stores = await Store.find({ userId });
        return stores;
    }

    /**
     * Update store
     */
    async update(storeId, updateData, requestingUserId, userRole) {
        const store = await Store.findById(storeId);

        if (!store) {
            throw new AppError('Store not found', 404);
        }

        // Check permissions
        if (userRole !== 'admin' && store.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        // Don't allow userId changes
        delete updateData.userId;

        const updatedStore = await Store.findByIdAndUpdate(
            storeId,
            updateData,
            { new: true, runValidators: true }
        );

        logger.info('Store updated', { storeId });

        return updatedStore;
    }

    /**
     * Update payment methods
     */
    async updatePaymentMethods(storeId, paymentMethods, requestingUserId, userRole) {
        const store = await Store.findById(storeId);

        if (!store) {
            throw new AppError('Store not found', 404);
        }

        if (userRole !== 'admin' && store.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        store.paymentMethods = paymentMethods;
        await store.save();

        logger.info('Payment methods updated', { storeId });

        return store;
    }

    /**
     * Update order options
     */
    async updateOrderOptions(storeId, orderOptions, requestingUserId, userRole) {
        const store = await Store.findById(storeId);

        if (!store) {
            throw new AppError('Store not found', 404);
        }

        if (userRole !== 'admin' && store.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        store.orderOptions = { ...store.orderOptions, ...orderOptions };
        await store.save();

        logger.info('Order options updated', { storeId });

        return store;
    }

    /**
     * Delete store (soft delete)
     */
    async delete(storeId) {
        const store = await Store.findByIdAndUpdate(
            storeId,
            { active: false },
            { new: true }
        );

        if (!store) {
            throw new AppError('Store not found', 404);
        }

        logger.info('Store deactivated', { storeId });
    }
}

module.exports = new StoreService();
