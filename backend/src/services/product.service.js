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
        const { category, company, search } = filters;
        const { page = 1, limit = 10 } = pagination;

        const query = {};

        if (category) query.category = category;
        if (company) query.company = company;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { barcode: search }
            ];
        }

        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            Product.find(query)
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 }),
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
