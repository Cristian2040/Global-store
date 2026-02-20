const companyService = require('../services/company.service');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/responseHandler');

class CompanyController {
    // Get current company profile
    getProfile = asyncHandler(async (req, res) => {
        const company = await companyService.getByUserId(req.user.userId);
        if (!company) {
            throw new AppError('Company profile not found', 404);
        }
        success(res, company, 'Company profile retrieved successfully');
    });

    // Update company profile
    updateProfile = asyncHandler(async (req, res) => {
        const company = await companyService.update(req.user.userId, req.body);
        success(res, company, 'Company profile updated successfully');
    });

    // Get all companies (public or admin)
    getAll = asyncHandler(async (req, res) => {
        const companies = await companyService.getAll();
        success(res, companies, 'Companies retrieved successfully');
    });

    // Get company suppliers
    getSuppliers = asyncHandler(async (req, res) => {
        const suppliers = await companyService.getSuppliers(req.user.userId, req.query);
        success(res, suppliers, 'Company suppliers retrieved successfully');
    });

    // Update supplier status
    updateSupplierStatus = asyncHandler(async (req, res) => {
        const { supplierId } = req.params;
        const { status } = req.body;
        const supplier = await companyService.updateSupplierStatus(req.user.userId, supplierId, status);
        success(res, supplier, 'Supplier status updated successfully');
    });
}

module.exports = new CompanyController();
