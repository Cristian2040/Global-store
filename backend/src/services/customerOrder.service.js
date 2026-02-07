const CustomerOrder = require('../models/CustomerOrder');
const StoreProduct = require('../models/StoreProduct');
const Store = require('../models/Store');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class CustomerOrderService {
    async create(orderData, customerId) {
        const { storeId, items, fulfillment, payment, notes } = orderData;

        const store = await Store.findById(storeId);
        if (!store || !store.active) {
            throw new AppError('Store not found or inactive', 404);
        }

        // Validate and enrich items
        const enrichedItems = [];
        let subtotalCents = 0;

        for (const item of items) {
            const storeProduct = await StoreProduct.findById(item.storeProductId)
                .populate('productId');

            if (!storeProduct || !storeProduct.active) {
                throw new AppError(`Product ${item.storeProductId} not available`, 400);
            }

            if (storeProduct.availableQuantity < item.quantity) {
                throw new AppError(`Insufficient stock for product ${storeProduct.productId.name}`, 400);
            }

            const itemSubtotal = storeProduct.finalPriceCents * item.quantity;
            subtotalCents += itemSubtotal;

            enrichedItems.push({
                storeProductId: storeProduct._id,
                productId: storeProduct.productId._id,
                nameSnapshot: storeProduct.productId.name,
                unitSnapshot: storeProduct.productId.unit,
                companySnapshot: storeProduct.productId.company,
                categorySnapshot: storeProduct.productId.category,
                quantity: item.quantity,
                unitPriceCents: storeProduct.finalPriceCents,
                subtotalCents: itemSubtotal
            });
        }

        const deliveryFeeCents = fulfillment?.type === 'DELIVERY' ? (store.orderOptions?.deliveryConfig?.feeCents || 0) : 0;
        const totalCents = subtotalCents + deliveryFeeCents;

        const order = await CustomerOrder.create({
            customerId,
            storeId,
            items: enrichedItems,
            totals: {
                subtotalCents,
                taxCents: 0,
                deliveryFeeCents,
                discountCents: 0,
                totalCents
            },
            fulfillment,
            payment,
            notes,
            history: [{ status: 'CREADA', at: new Date() }]
        });

        // Update stock
        for (const item of items) {
            await StoreProduct.findByIdAndUpdate(item.storeProductId, {
                $inc: { availableQuantity: -item.quantity }
            });
        }

        logger.info('Customer order created', { orderId: order._id, customerId, storeId });

        return await CustomerOrder.findById(order._id).populate('storeId').populate('customerId', 'username email');
    }

    async getById(orderId) {
        const order = await CustomerOrder.findById(orderId)
            .populate('storeId')
            .populate('customerId', 'username email');

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        return order;
    }

    async getByCustomer(customerId, filters = {}) {
        const { status, page = 1, limit = 10 } = filters;
        const query = { customerId };

        if (status) query.status = status;

        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            CustomerOrder.find(query)
                .populate('storeId', 'storeName')
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 }),
            CustomerOrder.countDocuments(query)
        ]);

        return { orders, pagination: { page: parseInt(page), limit: parseInt(limit), total } };
    }

    async getByStore(storeId, filters = {}) {
        const { status, page = 1, limit = 10 } = filters;
        const query = { storeId };

        if (status) query.status = status;

        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            CustomerOrder.find(query)
                .populate('customerId', 'username email')
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 }),
            CustomerOrder.countDocuments(query)
        ]);

        return { orders, pagination: { page: parseInt(page), limit: parseInt(limit), total } };
    }

    async updateStatus(orderId, status, reason, userId) {
        const order = await CustomerOrder.findById(orderId);

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        order.status = status;
        order.history.push({ status, at: new Date(), byUserId: userId, reason });

        if (status === 'ENTREGADA') {
            order.fulfillment.deliveredAt = new Date();
        }

        await order.save();

        logger.info('Order status updated', { orderId, status });

        return order;
    }

    async cancelOrder(orderId, reason, userId) {
        const order = await CustomerOrder.findById(orderId);

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        if (['ENTREGADA', 'CANCELADA'].includes(order.status)) {
            throw new AppError('Cannot cancel this order', 400);
        }

        // Restore stock
        for (const item of order.items) {
            await StoreProduct.findByIdAndUpdate(item.storeProductId, {
                $inc: { availableQuantity: item.quantity }
            });
        }

        return await this.updateStatus(orderId, 'CANCELADA', reason, userId);
    }
}

module.exports = new CustomerOrderService();
