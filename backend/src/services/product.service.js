const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class ProductService {
    async create(productData) {
        // Check if product with same barcode exists
        if (productData.barcode) {
            const existing = await Product.findOne({ barcode: productData.barcode });
            if (existing) {
                throw new AppError('Product with this barcode already exists', 409);
            }
        }

        const product = await Product.create(productData);
        logger.info('Product created', { productId: product._id });

        return product;
    }

    async getAll(filters = {}, pagination = {}) {
        const { category, company, search, min, max, tags, sort } = filters;
        const { page = 1, limit = 10 } = pagination;

        const query = {};

        if (category) query.category = category;
        if (company) query.company = company;
        if (min || max) {
            query.price = {};
            if (min) query.price.$gte = Number(min);
            if (max) query.price.$lte = Number(max);
        }
        if (tags) {
            const tagsArray = tags.split(',').map(t => t.trim());
            if (tagsArray.length > 0) {
                query.tags = { $in: tagsArray };
            }
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
                { barcode: search }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort) {
            switch (sort) {
                case 'price_asc': sortOption = { price: 1 }; break;
                case 'price_desc': sortOption = { price: -1 }; break;
                case 'newest': sortOption = { createdAt: -1 }; break;
                case 'oldest': sortOption = { createdAt: 1 }; break;
                case 'relevance': break; // handled by default or could be text score
                default: sortOption = { createdAt: -1 };
            }
        }

        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            Product.find(query)
                .limit(limit)
                .skip(skip)
                .sort(sortOption),
            Product.countDocuments(query)
        ]);

        return { products, pagination: { page: parseInt(page), limit: parseInt(limit), total } };
    }

    async getById(productId) {
        const product = await Product.findById(productId);

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        return product;
    }

    async update(productId, updateData) {
        const product = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        logger.info('Product updated', { productId });

        return product;
    }

    async delete(productId) {
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        logger.info('Product deleted', { productId });
    }

    async getCategories() {
        const categories = await Product.distinct('category');
        return categories.filter(Boolean);
    }

    async getCompanies() {
        const companies = await Product.distinct('company');
        return companies.filter(Boolean);
    }
}

module.exports = new ProductService();
