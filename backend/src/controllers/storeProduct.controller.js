const storeProductService = require('../services/storeProduct.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/responseHandler');
const AppError = require('../utils/AppError');

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

    /**
     * GET /api/store-products  (public)
     * GET /api/search          (public alias)
     *
     * Query params:
     *   q / search    – keyword (max 100 chars)
     *   category      – exact category string
     *   company       – exact brand/company string
     *   minPrice      – min price in pesos
     *   maxPrice      – max price in pesos
     *   sort          – newest | price_asc | price_desc
     *   page          – page number (default 1)
     *   limit         – items per page (default 20, max 50)
     */
    getAll = asyncHandler(async (req, res) => {
        const { q, search, category, company, minPrice, maxPrice, sort, page, limit } = req.query;

        // Basic security: reject absurdly large page numbers
        if (page && (isNaN(Number(page)) || Number(page) < 1)) {
            return res.status(400).json({
                success: false,
                message: 'El parámetro "page" debe ser un número entero positivo.'
            });
        }

        const filters = { q, search, category, company, minPrice, maxPrice, sort };
        const paginationOpts = { page, limit };

        const result = await storeProductService.getAll(filters, paginationOpts);

        return paginated(res, result.items, result.pagination, 'Productos obtenidos correctamente');
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
