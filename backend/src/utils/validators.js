const Joi = require('joi');

/**
 * Validation schemas using Joi
 * All validation rules for the application
 */

// Common schemas
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format');
const email = Joi.string().email().lowercase().trim();
const password = Joi.string().min(8).max(128);

// Address schema
const addressSchema = Joi.object({
    country: Joi.string().trim(),
    state: Joi.string().trim(),
    municipality: Joi.string().trim(),
    neighborhood: Joi.string().trim(),
    street: Joi.string().trim(),
    number: Joi.string().trim(),
    notes: Joi.string().trim()
});

// ============================================
// AUTH VALIDATORS
// ============================================
const authValidators = {
    register: Joi.object({
        username: Joi.string().min(2).max(50).trim().required(),
        email: email.required(),
        password: password.required(),
        role: Joi.string().valid('customer', 'admin', 'store', 'supplier').default('customer'),
        address: addressSchema
    }),

    login: Joi.object({
        email: email.required(),
        password: Joi.string().required()
    }),

    changePassword: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: password.required()
    })
};

// ============================================
// USER VALIDATORS
// ============================================
const userValidators = {
    update: Joi.object({
        username: Joi.string().min(2).max(50).trim(),
        email: email,
        address: addressSchema,
        active: Joi.boolean()
    }).min(1),

    query: Joi.object({
        role: Joi.string().valid('customer', 'admin', 'store', 'supplier'),
        active: Joi.boolean(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        search: Joi.string().trim()
    })
};

// ============================================
// STORE VALIDATORS
// ============================================
const storeValidators = {
    create: Joi.object({
        storeName: Joi.string().trim().required(),
        ownerName: Joi.string().trim().required(),
        userId: objectId.required(),
        description: Joi.string().max(500).trim(),
        address: addressSchema,
        schedule: Joi.string().trim(),
        logo: Joi.string().trim()
    }),

    update: Joi.object({
        storeName: Joi.string().trim(),
        ownerName: Joi.string().trim(),
        description: Joi.string().max(500).trim(),
        address: addressSchema,
        schedule: Joi.string().trim(),
        logo: Joi.string().trim(),
        rating: Joi.number().min(0).max(5),
        active: Joi.boolean()
    }).min(1),

    paymentMethods: Joi.object({
        paymentMethods: Joi.array().items(
            Joi.object({
                method: Joi.string().valid('CASH', 'CARD', 'TRANSFER', 'OTHER').required(),
                enabled: Joi.boolean().default(false),
                label: Joi.string().trim(),
                notes: Joi.string().trim()
            })
        ).required()
    }),

    orderOptions: Joi.object({
        pickupEnabled: Joi.boolean(),
        deliveryEnabled: Joi.boolean(),
        allowScheduledOrders: Joi.boolean(),
        deliveryConfig: Joi.object({
            feeCents: Joi.number().integer().min(0),
            minOrderCents: Joi.number().integer().min(0),
            zones: Joi.array().items(Joi.string().trim()),
            etaMinMinutes: Joi.number().integer().min(0),
            etaMaxMinutes: Joi.number().integer().min(0),
            notes: Joi.string().trim()
        })
    })
};

// ============================================
// SUPPLIER VALIDATORS
// ============================================
const supplierValidators = {
    create: Joi.object({
        name: Joi.string().trim().required(),
        companyName: Joi.string().trim().required(),
        email: email.required(),
        userId: objectId.required(),
        phone: Joi.string().trim().required(),
        route: Joi.object({
            country: Joi.string().trim(),
            state: Joi.string().trim(),
            municipality: Joi.string().trim(),
            neighborhood: Joi.string().trim()
        }),
        categories: Joi.array().items(Joi.string().trim())
    }),

    update: Joi.object({
        name: Joi.string().trim(),
        companyName: Joi.string().trim(),
        email: email,
        phone: Joi.string().trim(),
        route: Joi.object({
            country: Joi.string().trim(),
            state: Joi.string().trim(),
            municipality: Joi.string().trim(),
            neighborhood: Joi.string().trim()
        }),
        categories: Joi.array().items(Joi.string().trim()),
        active: Joi.boolean()
    }).min(1)
};

// ============================================
// PRODUCT VALIDATORS
// ============================================
const productValidators = {
    create: Joi.object({
        name: Joi.string().trim().required(),
        category: Joi.string().trim(),
        company: Joi.string().trim(),
        unit: Joi.string().trim(),
        barcode: Joi.string().trim(),
        image: Joi.string().trim()
    }),

    update: Joi.object({
        name: Joi.string().trim(),
        category: Joi.string().trim(),
        company: Joi.string().trim(),
        unit: Joi.string().trim(),
        barcode: Joi.string().trim(),
        image: Joi.string().trim()
    }).min(1),

    query: Joi.object({
        category: Joi.string().trim(),
        company: Joi.string().trim(),
        search: Joi.string().trim(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10)
    })
};

// ============================================
// STORE PRODUCT VALIDATORS
// ============================================
const storeProductValidators = {
    create: Joi.object({
        storeId: objectId.required(),
        productId: objectId.required(),
        basePriceCents: Joi.number().integer().min(0).default(0),
        finalPriceCents: Joi.number().integer().min(0).required(),
        availableQuantity: Joi.number().integer().min(0).default(0),
        expiryDate: Joi.date(),
        active: Joi.boolean().default(true)
    }),

    update: Joi.object({
        basePriceCents: Joi.number().integer().min(0),
        finalPriceCents: Joi.number().integer().min(0),
        availableQuantity: Joi.number().integer().min(0),
        expiryDate: Joi.date(),
        active: Joi.boolean()
    }).min(1)
};

// ============================================
// SUPPLIER PRODUCT VALIDATORS
// ============================================
const supplierProductValidators = {
    create: Joi.object({
        supplierId: objectId.required(),
        productId: objectId.required(),
        basePriceCents: Joi.number().integer().min(0).required(),
        availableQuantity: Joi.number().integer().min(0).default(0),
        expiryDate: Joi.date(),
        code: Joi.string().trim()
    }),

    update: Joi.object({
        basePriceCents: Joi.number().integer().min(0),
        availableQuantity: Joi.number().integer().min(0),
        expiryDate: Joi.date(),
        code: Joi.string().trim()
    }).min(1)
};

// ============================================
// CUSTOMER ORDER VALIDATORS
// ============================================
const customerOrderValidators = {
    create: Joi.object({
        customerId: objectId.required(),
        storeId: objectId.required(),
        items: Joi.array().items(
            Joi.object({
                storeProductId: objectId.required(),
                quantity: Joi.number().integer().min(1).required()
            })
        ).min(1).required(),
        fulfillment: Joi.object({
            type: Joi.string().valid('PICKUP', 'DELIVERY').default('PICKUP'),
            address: addressSchema,
            requestedTime: Joi.date(),
            notes: Joi.string().trim()
        }),
        payment: Joi.object({
            method: Joi.string().valid('CASH', 'CARD', 'TRANSFER', 'OTHER').default('CASH')
        }),
        notes: Joi.string().trim()
    }),

    updateStatus: Joi.object({
        status: Joi.string().valid(
            'CREADA', 'PENDIENTE_PAGO', 'PAGADA', 'EN_PREPARACION',
            'LISTA_PARA_RECOGER', 'EN_CAMINO', 'ENTREGADA', 'CANCELADA', 'REEMBOLSADA'
        ).required(),
        reason: Joi.string().trim()
    })
};

// ============================================
// RESTOCK ORDER VALIDATORS
// ============================================
const restockOrderValidators = {
    create: Joi.object({
        storeId: objectId.required(),
        supplierId: objectId.required(),
        supplierRouteId: objectId.required(),
        requestedDayOfWeek: Joi.number().integer().min(1).max(7),
        items: Joi.array().items(
            Joi.object({
                productId: objectId.required(),
                quantity: Joi.number().integer().min(1).required(),
                unitPriceCents: Joi.number().integer().min(0).required()
            })
        ).min(1).required(),
        delivery: Joi.object({
            requestedDeliveryDate: Joi.date(),
            notes: Joi.string().trim()
        }),
        notes: Joi.string().trim()
    }),

    updateStatus: Joi.object({
        status: Joi.string().valid(
            'CREADA', 'ENVIADA', 'ACEPTADA', 'RECHAZADA',
            'EN_PREPARACION', 'EN_RUTA', 'ENTREGADA', 'CANCELADA'
        ).required(),
        reason: Joi.string().trim()
    }),

    confirmDelivery: Joi.object({
        deliveryCode: Joi.string().min(4).max(12).required()
    })
};

module.exports = {
    authValidators,
    userValidators,
    storeValidators,
    supplierValidators,
    productValidators,
    storeProductValidators,
    supplierProductValidators,
    customerOrderValidators,
    restockOrderValidators,
    objectId
};
