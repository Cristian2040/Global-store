const productService = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/responseHandler');

class ProductController {
    create = asyncHandler(async (req, res) => {
        const product = await productService.create(req.body);
        success(res, product, 'Product created successfully', 201);
    });

    getAll = asyncHandler(async (req, res) => {
        const filters = { category: req.query.category, company: req.query.company, search: req.query.search };
        const paginationOptions = { page: req.query.page, limit: req.query.limit };

        const result = await productService.getAll(filters, paginationOptions);
        paginated(res, result.products, result.pagination, 'Products retrieved successfully');
    });

    getById = asyncHandler(async (req, res) => {
        const product = await productService.getById(req.params.id);
        success(res, product, 'Product retrieved successfully');
    });

    update = asyncHandler(async (req, res) => {
        const product = await productService.update(req.params.id, req.body);
        success(res, product, 'Product updated successfully');
    });

    delete = asyncHandler(async (req, res) => {
        await productService.delete(req.params.id);
        success(res, null, 'Product deleted successfully');
    });

    getCategories = asyncHandler(async (req, res) => {
        const categories = await productService.getCategories();
        success(res, categories, 'Categories retrieved successfully');
    });

    getCompanies = asyncHandler(async (req, res) => {
        const companies = await productService.getCompanies();
        success(res, companies, 'Companies retrieved successfully');
    });
}

module.exports = new ProductController();
