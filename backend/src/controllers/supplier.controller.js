const supplierService = require('../services/supplier.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/responseHandler');

class SupplierController {
    create = asyncHandler(async (req, res) => {
        const supplier = await supplierService.create(req.body);
        success(res, supplier, 'Supplier created successfully', 201);
    });

    getAll = asyncHandler(async (req, res) => {
        const filters = {
            active: req.query.active,
            category: req.query.category,
            search: req.query.search,
            companyName: req.query.companyName // Add companyName filter
        };
        const paginationOptions = { page: req.query.page, limit: req.query.limit };

        const result = await supplierService.getAll(filters, paginationOptions);
        paginated(res, result.suppliers, result.pagination, 'Suppliers retrieved successfully');
    });

    getById = asyncHandler(async (req, res) => {
        const supplier = await supplierService.getById(req.params.id);
        success(res, supplier, 'Supplier retrieved successfully');
    });

    getMySuppliers = asyncHandler(async (req, res) => {
        const suppliers = await supplierService.getByUserId(req.user.userId);
        success(res, suppliers, 'Your suppliers retrieved successfully');
    });

    update = asyncHandler(async (req, res) => {
        const supplier = await supplierService.update(req.params.id, req.body, req.user.userId, req.user.role);
        success(res, supplier, 'Supplier updated successfully');
    });

    delete = asyncHandler(async (req, res) => {
        await supplierService.delete(req.params.id);
        success(res, null, 'Supplier deactivated successfully');
    });

    getProducts = asyncHandler(async (req, res) => {
        const products = await supplierService.getProducts(req.params.id);
        success(res, products, 'Supplier products retrieved successfully');
    });
}

module.exports = new SupplierController();
