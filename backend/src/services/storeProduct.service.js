const StoreProduct = require('../models/StoreProduct');
const Store = require('../models/Store');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const MAX_LIMIT = 50;
const MAX_Q_LENGTH = 100;

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

    /**
     * Unified search method for the catalog.
     * Supports:
     *   - q / search : keyword search (case-insensitive regex on product name)
     *   - category   : exact category match
     *   - company    : exact company/brand match
     *   - minPrice / maxPrice : price range in whole pesos
     *   - sort       : newest | price_asc | price_desc
     *   - page / limit : pagination (limit capped at 50)
     */
    async getAll(filters = {}, pagination = {}) {
        // --- Sanitize & validate inputs ---
        let { q, search, category, company, minPrice, maxPrice, sort } = filters;

        // Accept q OR search (q takes priority for rubric compliance)
        const keyword = (q || search || '').trim().slice(0, MAX_Q_LENGTH);

        // Sanitize numbers — treat non-numeric as undefined
        const parsedMin = minPrice !== undefined && minPrice !== '' ? Number(minPrice) : undefined;
        const parsedMax = maxPrice !== undefined && maxPrice !== '' ? Number(maxPrice) : undefined;

        // Reject clearly invalid price params
        if (parsedMin !== undefined && isNaN(parsedMin)) {
            throw new AppError('minPrice must be a valid number', 400);
        }
        if (parsedMax !== undefined && isNaN(parsedMax)) {
            throw new AppError('maxPrice must be a valid number', 400);
        }
        if (parsedMin !== undefined && parsedMax !== undefined && parsedMin > parsedMax) {
            throw new AppError('minPrice cannot be greater than maxPrice', 400);
        }

        // Sanitize pagination — cap limit, default to 1/20
        let page = Math.max(1, parseInt(pagination.page) || 1);
        let limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(pagination.limit) || 20));

        const query = { active: true, availableQuantity: { $gt: 0 } };

        // 1. Product-level filters — resolved via sub-query
        const productQuery = {};
        if (keyword) productQuery.name = { $regex: keyword, $options: 'i' };
        if (category && category !== 'Todas las categorías') productQuery.category = category;
        if (company && company !== 'Todas las compañías') productQuery.company = company;

        if (Object.keys(productQuery).length > 0) {
            const matchingProducts = await Product.find(productQuery).select('_id');
            const matchingIds = matchingProducts.map(p => p._id);

            if (matchingIds.length === 0) {
                return {
                    items: [],
                    total: 0,
                    pagination: { page, limit, total: 0, totalPages: 0 }
                };
            }
            query.productId = { $in: matchingIds };
        }

        // 2. Price range filter (stored in cents)
        if (parsedMin !== undefined || parsedMax !== undefined) {
            query.finalPriceCents = {};
            if (parsedMin !== undefined) query.finalPriceCents.$gte = parsedMin * 100;
            if (parsedMax !== undefined) query.finalPriceCents.$lte = parsedMax * 100;
        }

        // 3. Sorting
        const SORT_MAP = {
            price_asc: { finalPriceCents: 1 },
            price_desc: { finalPriceCents: -1 },
            newest: { createdAt: -1 }
        };
        const sortOption = SORT_MAP[sort] || SORT_MAP.newest;

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            StoreProduct.find(query)
                .populate('productId')
                .populate('storeId', 'storeName logo address')
                .sort(sortOption)
                .skip(skip)
                .limit(limit),
            StoreProduct.countDocuments(query)
        ]);

        return {
            items,
            total,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
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
