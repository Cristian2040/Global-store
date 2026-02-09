const User = require('../models/User');
const Store = require('../models/Store');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const CustomerOrder = require('../models/CustomerOrder');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/responseHandler');

class AdminDashboardController {
    /**
     * Get dashboard summary statistics
     * GET /api/admin/stats
     */
    getStats = asyncHandler(async (req, res) => {
        const [
            totalUsers,
            activeStores,
            totalSuppliers,
            totalProducts,
            ordersData
        ] = await Promise.all([
            User.countDocuments(),
            Store.countDocuments({ active: true }),
            Supplier.countDocuments({ status: 'ACTIVE' }),
            Product.countDocuments(),
            CustomerOrder.aggregate([
                { $match: { status: { $in: ['PAGADA', 'EN_PREPARACION', 'LISTA_PARA_RECOGER', 'EN_CAMINO', 'ENTREGADA'] } } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totals.totalCents' },
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const totalRevenue = ordersData.length > 0 ? ordersData[0].totalRevenue : 0;
        const commissions = Math.round(totalRevenue * 0.05); // Default 5% commission if no settings

        success(res, {
            totalUsers,
            activeStores,
            totalSuppliers,
            totalProducts,
            revenue: {
                total: totalRevenue,
                commissions: commissions
            }
        }, 'Admin statistics retrieved successfully');
    });

    /**
     * Get recent activity across the platform
     * GET /api/admin/recent-activity
     */
    getRecentActivity = asyncHandler(async (req, res) => {
        const [
            latestUsers,
            latestStores,
            latestSuppliers,
            latestOrders
        ] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(3).select('username createdAt'),
            Store.find().sort({ createdAt: -1 }).limit(3).select('storeName createdAt'),
            Supplier.find().sort({ createdAt: -1 }).limit(3).select('name createdAt'),
            CustomerOrder.find().sort({ createdAt: -1 }).limit(3).populate('customerId', 'username').select('folio createdAt totals.totalCents')
        ]);

        const activities = [
            ...latestUsers.map(u => ({ type: 'USER', title: `Nuevo usuario: ${u.username}`, at: u.createdAt, color: 'blue' })),
            ...latestStores.map(s => ({ type: 'STORE', title: `Nueva tienda: ${s.storeName}`, at: s.createdAt, color: 'green' })),
            ...latestSuppliers.map(s => ({ type: 'SUPPLIER', title: `Nuevo proveedor: ${s.name}`, at: s.createdAt, color: 'orange' })),
            ...latestOrders.map(o => ({ type: 'ORDER', title: `Nuevo pedido: ${o.folio || 'S/F'}`, at: o.createdAt, color: 'purple' }))
        ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 5);

        success(res, activities, 'Recent activity retrieved successfully');
    });
}

module.exports = new AdminDashboardController();
