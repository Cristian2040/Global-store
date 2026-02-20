const productService = require('../services/product.service');
const Company = require('../models/Company');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/responseHandler');
const AppError = require('../utils/AppError');

class ProductController {
    create = asyncHandler(async (req, res) => {
        // If user is a company, force the company name
        if (req.user.role === 'company') {
            const company = await Company.findOne({ userId: req.user.userId });
            if (!company) {
                throw new AppError('Company profile not found', 404);
            }
            req.body.company = company.companyName;
        }

        const product = await productService.create(req.body);
        success(res, product, 'Product created successfully', 201);
    });

    getAll = asyncHandler(async (req, res) => {
        const filters = {
            category: req.query.category,
            company: req.query.company,
            search: req.query.search,
            min: req.query.min,
            max: req.query.max,
            tags: req.query.tags,
            sort: req.query.sort
        };
        const paginationOptions = { page: req.query.page, limit: req.query.limit };

        console.log('DEBUG: ProductController.getAll called with queries:', req.query);
        console.log('DEBUG: Filters constructed:', filters);

        const result = await productService.getAll(filters, paginationOptions);
        console.log(`DEBUG: Found ${result.products.length} products for company: ${filters.company}`);

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
