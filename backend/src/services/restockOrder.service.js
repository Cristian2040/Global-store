const RestockOrder = require('../models/RestockOrder');
const Store = require('../models/Store');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

class RestockOrderService {
    async create(orderData, createdByUserId) {
        const { storeId, supplierId, supplierRouteId, items, delivery, notes } = orderData;

        const [store, supplier] = await Promise.all([
            Store.findById(storeId),
            Supplier.findById(supplierId)
        ]);

        if (!store || !store.active) {
            throw new AppError('Store not found or inactive', 404);
        }

        if (!supplier || !supplier.active) {
            throw new AppError('Supplier not found or inactive', 404);
        }

        // Enrich items with product snapshots
        const enrichedItems = [];
        let subtotalCents = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                throw new AppError(`Product ${item.productId} not found`, 404);
            }

            const itemSubtotal = item.unitPriceCents * item.quantity;
            subtotalCents += itemSubtotal;

            enrichedItems.push({
                productId: product._id,
                nameSnapshot: product.name,
                unitSnapshot: product.unit,
                companySnapshot: product.company,
                categorySnapshot: product.category,
                quantity: item.quantity,
                unitPriceCents: item.unitPriceCents,
                subtotalCents: itemSubtotal
            });
        }

        const totalCents = subtotalCents;

        // Generate delivery code
        const deliveryCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const hashedCode = await bcrypt.hash(deliveryCode, 10);

        const order = await RestockOrder.create({
            storeId,
            supplierId,
            supplierRouteId,
            items: enrichedItems,
            totals: {
                subtotalCents,
                taxCents: 0,
                shippingCents: 0,
                totalCents
            },
            delivery,
            deliveryCode: hashedCode,
            createdByUserId,
            history: [{ status: 'CREADA', at: new Date(), byUserId: createdByUserId }]
        });

        logger.info('Restock order created', { orderId: order._id, storeId, supplierId, deliveryCode });

        return {
            order: await RestockOrder.findById(order._id).populate('storeId').populate('supplierId'),
            deliveryCode // Return plain code once for store to save
        };
    }

    async getById(orderId) {
        const order = await RestockOrder.findById(orderId)
            .populate('storeId')
            .populate('supplierId');

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        return order;
    }

    async getByStore(storeId, filters = {}) {
        const { status, page = 1, limit = 10 } = filters;
        const query = { storeId };

        if (status) query.status = status;

        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            RestockOrder.find(query)
                .populate('supplierId', 'name companyName')
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 }),
            RestockOrder.countDocuments(query)
        ]);

        return { orders, pagination: { page: parseInt(page), limit: parseInt(limit), total } };
    }

    async getBySupplier(supplierId, filters = {}) {
        const { status, page = 1, limit = 10 } = filters;
        const query = { supplierId };

        if (status) query.status = status;

        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            RestockOrder.find(query)
                .populate('storeId', 'storeName ownerName')
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 }),
            RestockOrder.countDocuments(query)
        ]);

        return { orders, pagination: { page: parseInt(page), limit: parseInt(limit), total } };
    }

    async updateStatus(orderId, status, reason, userId) {
        const order = await RestockOrder.findById(orderId);

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        order.status = status;
        order.history.push({ status, at: new Date(), byUserId: userId, reason });

        if (status === 'ENTREGADA') {
            order.delivery.deliveredAt = new Date();
        }

        await order.save();

        logger.info('Restock order status updated', { orderId, status });

        return order;
    }

    async acceptOrder(orderId, userId) {
        const order = await RestockOrder.findById(orderId);

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        if (order.status !== 'ENVIADA') {
            throw new AppError('Order must be in ENVIADA status', 400);
        }

        order.supplierConfirmedByUserId = userId;

        return await this.updateStatus(orderId, 'ACEPTADA', 'Supplier accepted order', userId);
    }

    async rejectOrder(orderId, reason, userId) {
        return await this.updateStatus(orderId, 'RECHAZADA', reason, userId);
    }

    async confirmDelivery(orderId, deliveryCode) {
        const order = await RestockOrder.findById(orderId).select('+deliveryCode');

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        if (order.status !== 'EN_RUTA') {
            throw new AppError('Order must be in EN_RUTA status', 400);
        }

        const isCodeValid = await bcrypt.compare(deliveryCode, order.deliveryCode);

        if (!isCodeValid) {
            throw new AppError('Invalid delivery code', 401);
        }

        return await this.updateStatus(orderId, 'ENTREGADA', 'Delivery confirmed with code', null);
    }
}

module.exports = new RestockOrderService();
