const StoreProduct = require('../models/StoreProduct');
const Store = require('../models/Store');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class StoreProductService {
    async addProduct(storeProductData, requestingUserId, userRole) {
        const { storeId, productId } = storeProductData;

        // Verify store exists
        const store = await Store.findById(storeId);
        if (!store) {
            throw new AppError('Store not found', 404);
        }

        // Check permissions
        if (userRole !== 'admin' && store.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            throw new AppError('Product not found', 404);
        }

        // Check if already exists
        const existing = await StoreProduct.findOne({ storeId, productId });
        if (existing) {
            throw new AppError('Product already added to store', 409);
        }

        const storeProduct = await StoreProduct.create(storeProductData);
        logger.info('Product added to store', { storeProductId: storeProduct._id });

        return await StoreProduct.findById(storeProduct._id).populate('productId');
    }

    async getByStore(storeId, filters = {}) {
        const { active } = filters;
        const query = { storeId };

        if (active !== undefined) query.active = active;

        const products = await StoreProduct.find(query)
            .populate('productId')
            .sort({ createdAt: -1 });

        return products;
    }

    async getById(storeProductId) {
        const storeProduct = await StoreProduct.findById(storeProductId)
            .populate('productId')
            .populate('storeId');

        if (!storeProduct) {
            throw new AppError('Store product not found', 404);
        }

        return storeProduct;
    }

    async update(storeProductId, updateData, requestingUserId, userRole) {
        const storeProduct = await StoreProduct.findById(storeProductId).populate('storeId');

        if (!storeProduct) {
            throw new AppError('Store product not found', 404);
        }

        if (userRole !== 'admin' && storeProduct.storeId.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        delete updateData.storeId;
        delete updateData.productId;

        const updated = await StoreProduct.findByIdAndUpdate(
            storeProductId,
            updateData,
            { new: true, runValidators: true }
        ).populate('productId');

        logger.info('Store product updated', { storeProductId });

        return updated;
    }

    async updateStock(storeProductId, quantity, requestingUserId, userRole) {
        return await this.update(
            storeProductId,
            { availableQuantity: quantity },
            requestingUserId,
            userRole
        );
    }

    async delete(storeProductId, requestingUserId, userRole) {
        const storeProduct = await StoreProduct.findById(storeProductId).populate('storeId');

        if (!storeProduct) {
            throw new AppError('Store product not found', 404);
        }

        if (userRole !== 'admin' && storeProduct.storeId.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        await StoreProduct.findByIdAndDelete(storeProductId);
        logger.info('Store product deleted', { storeProductId });
    }
}

module.exports = new StoreProductService();
