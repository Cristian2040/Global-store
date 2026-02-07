const supplierProductService = require('../services/supplierProduct.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/responseHandler');

class SupplierProductController {
    addProduct = asyncHandler(async (req, res) => {
        const supplierProduct = await supplierProductService.addProduct(req.body, req.user.userId, req.user.role);
        success(res, supplierProduct, 'Product added to supplier successfully', 201);
    });

    getBySupplier = asyncHandler(async (req, res) => {
        const { supplierId } = req.params;
        const products = await supplierProductService.getBySupplier(supplierId);
        success(res, products, 'Supplier products retrieved successfully');
    });

    getById = asyncHandler(async (req, res) => {
        const supplierProduct = await supplierProductService.getById(req.params.id);
        success(res, supplierProduct, 'Supplier product retrieved successfully');
    });

    update = asyncHandler(async (req, res) => {
        const supplierProduct = await supplierProductService.update(req.params.id, req.body, req.user.userId, req.user.role);
        success(res, supplierProduct, 'Supplier product updated successfully');
    });

    delete = asyncHandler(async (req, res) => {
        await supplierProductService.delete(req.params.id, req.user.userId, req.user.role);
        success(res, null, 'Supplier product deleted successfully');
    });
}

module.exports = new SupplierProductController();
