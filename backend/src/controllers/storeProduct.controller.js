const storeProductService = require('../services/storeProduct.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/responseHandler');

class StoreProductController {
    addProduct = asyncHandler(async (req, res) => {
        const storeProduct = await storeProductService.addProduct(req.body, req.user.userId, req.user.role);
        success(res, storeProduct, 'Product added to store successfully', 201);
    });

    getByStore = asyncHandler(async (req, res) => {
        const { storeId } = req.params;
        const filters = { active: req.query.active };

        const products = await storeProductService.getByStore(storeId, filters);
        success(res, products, 'Store products retrieved successfully');
    });

    getById = asyncHandler(async (req, res) => {
        const storeProduct = await storeProductService.getById(req.params.id);
        success(res, storeProduct, 'Store product retrieved successfully');
    });

    update = asyncHandler(async (req, res) => {
        const storeProduct = await storeProductService.update(req.params.id, req.body, req.user.userId, req.user.role);
        success(res, storeProduct, 'Store product updated successfully');
    });

    updateStock = asyncHandler(async (req, res) => {
        const { quantity } = req.body;
        const storeProduct = await storeProductService.updateStock(req.params.id, quantity, req.user.userId, req.user.role);
        success(res, storeProduct, 'Stock updated successfully');
    });

    delete = asyncHandler(async (req, res) => {
        await storeProductService.delete(req.params.id, req.user.userId, req.user.role);
        success(res, null, 'Store product deleted successfully');
    });
}

module.exports = new StoreProductController();
