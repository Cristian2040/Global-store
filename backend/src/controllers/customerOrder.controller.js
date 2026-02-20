const customerOrderService = require('../services/customerOrder.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/responseHandler');

class CustomerOrderController {
    create = asyncHandler(async (req, res) => {
        const order = await customerOrderService.create(req.body, req.user.userId);
        success(res, order, 'Order created successfully', 201);
    });

    getById = asyncHandler(async (req, res) => {
        const order = await customerOrderService.getById(req.params.id);
        success(res, order, 'Order retrieved successfully');
    });

    getMyOrders = asyncHandler(async (req, res) => {
        const filters = { status: req.query.status, page: req.query.page, limit: req.query.limit };
        const result = await customerOrderService.getByCustomer(req.user.userId, filters);
        paginated(res, result.orders, result.pagination, 'Your orders retrieved successfully');
    });

    getStoreOrders = asyncHandler(async (req, res) => {
        const { storeId } = req.params;
        const filters = { status: req.query.status, page: req.query.page, limit: req.query.limit };
        const result = await customerOrderService.getByStore(storeId, filters);
        paginated(res, result.orders, result.pagination, 'Store orders retrieved successfully');
    });

    updateStatus = asyncHandler(async (req, res) => {
        const { status, reason } = req.body;
        const order = await customerOrderService.updateStatus(req.params.id, status, reason, req.user.userId);
        success(res, order, 'Order status updated successfully');
    });

    cancelOrder = asyncHandler(async (req, res) => {
        const { reason } = req.body;
        const order = await customerOrderService.cancelOrder(req.params.id, reason, req.user.userId);
        success(res, order, 'Order cancelled successfully');
    });
}

module.exports = new CustomerOrderController();
