const restockOrderService = require('../services/restockOrder.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/responseHandler');

class RestockOrderController {
    create = asyncHandler(async (req, res) => {
        const result = await restockOrderService.create(req.body, req.user.userId);
        success(res, result, 'Restock order created successfully. Save the delivery code!', 201);
    });

    getById = asyncHandler(async (req, res) => {
        const order = await restockOrderService.getById(req.params.id);
        success(res, order, 'Restock order retrieved successfully');
    });

    getStoreOrders = asyncHandler(async (req, res) => {
        const { storeId } = req.params;
        const filters = { status: req.query.status, page: req.query.page, limit: req.query.limit };
        const result = await restockOrderService.getByStore(storeId, filters);
        paginated(res, result.orders, result.pagination, 'Store restock orders retrieved successfully');
    });

    getSupplierOrders = asyncHandler(async (req, res) => {
        const { supplierId } = req.params;
        const filters = { status: req.query.status, page: req.query.page, limit: req.query.limit };
        const result = await restockOrderService.getBySupplier(supplierId, filters);
        paginated(res, result.orders, result.pagination, 'Supplier orders retrieved successfully');
    });

    updateStatus = asyncHandler(async (req, res) => {
        const { status, reason } = req.body;
        const order = await restockOrderService.updateStatus(req.params.id, status, reason, req.user.userId);
        success(res, order, 'Restock order status updated successfully');
    });

    acceptOrder = asyncHandler(async (req, res) => {
        const order = await restockOrderService.acceptOrder(req.params.id, req.user.userId);
        success(res, order, 'Order accepted successfully');
    });

    rejectOrder = asyncHandler(async (req, res) => {
        const { reason } = req.body;
        const order = await restockOrderService.rejectOrder(req.params.id, reason, req.user.userId);
        success(res, order, 'Order rejected');
    });

    confirmDelivery = asyncHandler(async (req, res) => {
        const { deliveryCode } = req.body;
        const order = await restockOrderService.confirmDelivery(req.params.id, deliveryCode);
        success(res, order, 'Delivery confirmed successfully');
    });
}

module.exports = new RestockOrderController();
