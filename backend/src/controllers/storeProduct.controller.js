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

    getAll = asyncHandler(async (req, res) => {
        const filters = {
            search: req.query.search,
            category: req.query.category,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice
        };
        const pagination = {
            page: req.query.page,
            limit: req.query.limit
        };

        const result = await storeProductService.getAll(filters, pagination);
        // Using success for now as paginated helper structure might vary, or construct manual response
        // Checking responseHandler... usually paginated(res, docs, paginationInfo, msg)
        // Let's assume paginated helper exists locally imported in controller.
        // Re-reading controller imports: const { success } = require('../utils/responseHandler');
        // Need to add paginated to imports if not present.
        // Wait, line 3 only imports success: const { success } = require('../utils/responseHandler');
        // I should update imports too.

        res.status(200).json({
            success: true,
            data: result.products,
            pagination: result.pagination,
            message: 'Global products retrieved successfully'
        });
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
