const Supplier = require('../models/Supplier');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class SupplierService {
    async create(supplierData) {
        const user = await User.findById(supplierData.userId);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        if (user.role !== 'supplier' && user.role !== 'admin') {
            throw new AppError('User must have supplier role', 403);
        }

        const existingSupplier = await Supplier.findOne({ userId: supplierData.userId });
        if (existingSupplier) {
            throw new AppError('User already has a supplier profile', 409);
        }

        const supplier = await Supplier.create(supplierData);
        logger.info('Supplier created', { supplierId: supplier._id });

        return supplier;
    }

    async getAll(filters = {}, pagination = {}) {
        const { active, category, search, companyName } = filters;
        const { page = 1, limit = 10 } = pagination;

        const query = {};

        if (active !== undefined) query.active = active;
        if (category) query.categories = category;
        if (companyName) query.companyName = companyName; // Apply companyName filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const [suppliers, total] = await Promise.all([
            Supplier.find(query)
                .populate('userId', 'username email')
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 }),
            Supplier.countDocuments(query)
        ]);

        return { suppliers, pagination: { page: parseInt(page), limit: parseInt(limit), total } };
    }

    async getById(supplierId) {
        const supplier = await Supplier.findById(supplierId)
            .populate('userId', 'username email');

        if (!supplier) {
            throw new AppError('Supplier not found', 404);
        }

        return supplier;
    }

    async getByUserId(userId) {
        const suppliers = await Supplier.find({ userId });
        return suppliers;
    }

    async update(supplierId, updateData, requestingUserId, userRole) {
        const supplier = await Supplier.findById(supplierId);

        if (!supplier) {
            throw new AppError('Supplier not found', 404);
        }

        if (userRole !== 'admin' && supplier.userId.toString() !== requestingUserId) {
            throw new AppError('Insufficient permissions', 403);
        }

        delete updateData.userId;

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            supplierId,
            updateData,
            { new: true, runValidators: true }
        );

        logger.info('Supplier updated', { supplierId });

        return updatedSupplier;
    }

    async delete(supplierId) {
        const supplier = await Supplier.findByIdAndUpdate(
            supplierId,
            { active: false },
            { new: true }
        );

        if (!supplier) {
            throw new AppError('Supplier not found', 404);
        }

        logger.info('Supplier deactivated', { supplierId });
    }
}

module.exports = new SupplierService();
