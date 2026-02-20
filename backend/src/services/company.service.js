const Company = require('../models/Company');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class CompanyService {
    async create(companyData) {
        // userId must be unique, handled by schema
        const company = await Company.create(companyData);
        logger.info('Company profile created', { companyId: company._id });
        return company;
    }

    async getByUserId(userId) {
        const company = await Company.findOne({ userId });
        return company;
    }

    async update(userId, updateData) {
        const company = await Company.findOneAndUpdate(
            { userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!company) {
            throw new AppError('Company profile not found', 404);
        }

        logger.info('Company profile updated', { companyId: company._id });
        return company;
    }

    async getAll() {
        return await Company.find({ active: true })
            .select('companyName description logo address')
            .sort('companyName');
    }

    async getSuppliers(userId, query = {}) {
        const { search } = query;
        let match = {};

        if (search) {
            match = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const company = await Company.findOne({ userId }).populate({
            path: 'suppliers',
            match
        });

        if (!company) {
            throw new AppError('Company profile not found', 404);
        }
        return company.suppliers;
    }

    async updateSupplierStatus(userId, supplierId, status) {
        if (!['ACTIVE', 'REJECTED'].includes(status)) {
            throw new AppError('Invalid status', 400);
        }

        const company = await Company.findOne({ userId });
        if (!company) {
            throw new AppError('Company profile not found', 404);
        }

        // Verify supplier belongs to company
        if (!company.suppliers.includes(supplierId)) {
            throw new AppError('Supplier not associated with this company', 404);
        }

        const supplier = await require('../models/Supplier').findByIdAndUpdate(
            supplierId,
            { status, active: status === 'ACTIVE' },
            { new: true }
        );

        if (!supplier) {
            throw new AppError('Supplier not found', 404);
        }

        logger.info('Supplier status updated', { supplierId, status, companyId: company._id });
        return supplier;
    }
}

module.exports = new CompanyService();
