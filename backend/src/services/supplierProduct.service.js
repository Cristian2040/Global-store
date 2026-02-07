const SupplierProduct = require('../models/SupplierProduct');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class SupplierProductService {
    async addProduct(supplierProductData, requestingUserId, userRole) {
        const { supplierId, productId } = supplierProductData;

        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            throw new AppError('Supplier not found', 404);
        }

        if (userRole !== 'admin' && supplier.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new AppError('Product not found', 404);
        }

        const existing = await SupplierProduct.findOne({ supplierId, productId });
        if (existing) {
            throw new AppError('Product already added to supplier', 409);
        }

        const supplierProduct = await SupplierProduct.create(supplierProductData);
        logger.info('Product added to supplier', { supplierProductId: supplierProduct._id });

        return await SupplierProduct.findById(supplierProduct._id).populate('productId');
    }

    async getBySupplier(supplierId) {
        const products = await SupplierProduct.find({ supplierId })
            .populate('productId')
            .sort({ createdAt: -1 });

        return products;
    }

    async getById(supplierProductId) {
        const supplierProduct = await SupplierProduct.findById(supplierProductId)
            .populate('productId')
            .populate('supplierId');

        if (!supplierProduct) {
            throw new AppError('Supplier product not found', 404);
        }

        return supplierProduct;
    }

    async update(supplierProductId, updateData, requestingUserId, userRole) {
        const supplierProduct = await SupplierProduct.findById(supplierProductId).populate('supplierId');

        if (!supplierProduct) {
            throw new AppError('Supplier product not found', 404);
        }

        if (userRole !== 'admin' && supplierProduct.supplierId.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        delete updateData.supplierId;
        delete updateData.productId;

        const updated = await SupplierProduct.findByIdAndUpdate(
            supplierProductId,
            updateData,
            { new: true, runValidators: true }
        ).populate('productId');

        logger.info('Supplier product updated', { supplierProductId });

        return updated;
    }

    async delete(supplierProductId, requestingUserId, userRole) {
        const supplierProduct = await SupplierProduct.findById(supplierProductId).populate('supplierId');

        if (!supplierProduct) {
            throw new AppError('Supplier product not found', 404);
        }

        if (userRole !== 'admin' && supplierProduct.supplierId.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        await SupplierProduct.findByIdAndDelete(supplierProductId);
        logger.info('Supplier product deleted', { supplierProductId });
    }
}

module.exports = new SupplierProductService();
