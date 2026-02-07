const mongoose = require("mongoose");

const restockItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },

        // snapshots opcionales (por si el producto cambia después)
        nameSnapshot: {
            type: String,
            trim: true
        },
        unitSnapshot: {
            type: String,
            trim: true
        },
        companySnapshot: {
            type: String,
            trim: true
        },
        categorySnapshot: {
            type: String,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        // precios en centavos (recomendado)
        unitPriceCents: {
            type: Number,
            required: true,
            min: 0
        },
        subtotalCents: {
            type: Number,
            required: true,
            min: 0
        },

        // opcional: SKU/código interno del proveedor
        supplierCode: {
            type: String,
            trim: true
        },
    },
    { _id: false }
);

const restockOrderSchema = new mongoose.Schema(
    {
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
            index: true,
        },

        // Ruta seleccionada (de las rutas del proveedor que cubren a la tienda)
        supplierRouteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SupplierRouteSchedule",
            required: true,
            index: true,
        },

        // 1=Lun..7=Dom (opcional)
        requestedDayOfWeek: {
            type: Number,
            min: 1,
            max: 7
        },

        // multi-tenant opcional
        tenantId: {
            type: String,
            index: true
        },

        folio: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "CREADA",
                "ENVIADA",
                "ACEPTADA",
                "RECHAZADA",
                "EN_PREPARACION",
                "EN_RUTA",
                "ENTREGADA",
                "CANCELADA",
            ],
            default: "CREADA",
            index: true,
        },

        items: {
            type: [restockItemSchema],
            validate: [
                (arr) => Array.isArray(arr) && arr.length > 0,
                "La orden debe tener al menos un producto",
            ],
        },

        totals: {
            subtotalCents: {
                type: Number,
                required:
                    true,
                min: 0
            },
            taxCents: {
                type: Number,
                default: 0,
                min: 0
            },
            shippingCents: {
                type: Number,
                default: 0,
                min: 0
            },
            totalCents: {
                type: Number,
                required: true,
                min: 0
            },
        },

        delivery: {
            requestedDeliveryDate: { type: Date },
            estimatedDeliveryDate: { type: Date },
            deliveredAt: { type: Date },
            notes: { type: String, trim: true },
        },

        // Se valida en confirmación de entrega (no guardes plano si no quieres)
        deliveryCode: {
            type: String,
            trim: true,
            minlength: 4,
            maxlength: 12,
            select: false
        },

        createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        supplierConfirmedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        notes: { type: String, trim: true },

        history: [
            {
                status: { type: String, required: true },
                at: { type: Date, default: Date.now },
                byUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                reason: { type: String, trim: true },
            },
        ],
    },
    { timestamps: true }
);

restockOrderSchema.index({ storeId: 1, createdAt: -1 });
restockOrderSchema.index({ supplierId: 1, createdAt: -1 });
restockOrderSchema.index({ supplierRouteId: 1, createdAt: -1 });
restockOrderSchema.index({ tenantId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("RestockOrder", restockOrderSchema);
