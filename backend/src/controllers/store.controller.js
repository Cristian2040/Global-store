const storeService = require('../services/store.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/responseHandler');

class StoreController {
    create = asyncHandler(async (req, res) => {
        const store = await storeService.create(req.body);
        success(res, store, 'Store created successfully', 201);
    });

    getAll = asyncHandler(async (req, res) => {
        const filters = { active: req.query.active, search: req.query.search };
        const paginationOptions = { page: req.query.page, limit: req.query.limit };

        const result = await storeService.getAll(filters, paginationOptions);
        paginated(res, result.stores, result.pagination, 'Stores retrieved successfully');
    });

    getById = asyncHandler(async (req, res) => {
        const store = await storeService.getById(req.params.id);
        success(res, store, 'Store retrieved successfully');
    });

    getMyStores = asyncHandler(async (req, res) => {
        const stores = await storeService.getByUserId(req.user.userId);
        success(res, stores, 'Your stores retrieved successfully');
    });

    update = asyncHandler(async (req, res) => {
        const store = await storeService.update(
            req.params.id,
            req.body,
            req.user.userId,
            req.user.role
        );
        success(res, store, 'Store updated successfully');
    });

    updatePaymentMethods = asyncHandler(async (req, res) => {
        const store = await storeService.updatePaymentMethods(
            req.params.id,
            req.body.paymentMethods,
            req.user.userId,
            req.user.role
        );
        success(res, store, 'Payment methods updated successfully');
    });

    updateOrderOptions = asyncHandler(async (req, res) => {
        const store = await storeService.updateOrderOptions(
            req.params.id,
            req.body,
            req.user.userId,
            req.user.role
        );
        success(res, store, 'Order options updated successfully');
    });

    delete = asyncHandler(async (req, res) => {
        await storeService.delete(req.params.id);
        success(res, null, 'Store deactivated successfully');
    });
}

module.exports = new StoreController();
