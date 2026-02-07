const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        country: String,
        state: String,
        municipality: String,
        neighborhood: String,
        street: String,
        number: String,
    },
    { _id: false }
);

const storeSchema = new mongoose.Schema(
    {
        storeName: {
            type: String,
            required: true,
            trim: true
        },
        ownerName: {
            type: String,
            required: true,
            trim: true
        },

        // referencia al usuario que administra la tienda
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        description: {
            type: String,
            maxlength: 500
        },
        address: addressSchema,
        schedule: {
            type: String
        },
        logo: {
            type: String,
            default: "default-store.png"
        },

        /**
         * Métodos de pago configurables por la tienda
         * La tienda puede habilitar/deshabilitar cada uno desde su panel.
         */
        paymentMethods: [
            {
                method: {
                    type: String,
                    enum: ["CASH", "CARD", "TRANSFER", "OTHER"],
                    required: true,
                },
                enabled: { type: Boolean, default: false },

                // opcional: info para mostrar en el checkout
                label: { type: String, trim: true }, // ej. "Tarjeta (Clip)"
                notes: { type: String, trim: true }, // ej. "Solo Visa/Mastercard"
            },
        ],

        /**
         * Opciones de pedido configurables por la tienda
         * (Pickup/Delivery) y ajustes de delivery.
         */
        orderOptions: {
            pickupEnabled: { type: Boolean, default: true },
            deliveryEnabled: { type: Boolean, default: false },

            allowScheduledOrders: { type: Boolean, default: false },

            deliveryConfig: {
                feeCents: { type: Number, default: 0, min: 0 },
                minOrderCents: { type: Number, default: 0, min: 0 },
                zones: [{ type: String, trim: true, index: true }], // colonias/zonas
                etaMinMinutes: { type: Number, default: 0, min: 0 },
                etaMaxMinutes: { type: Number, default: 0, min: 0 },
                notes: { type: String, trim: true },
            },
        },

        rating: { type: Number, min: 0, max: 5, default: 5 },
        active: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

/**
 * Evita duplicados del mismo método por tienda:
 * (ej. 2 entradas CASH)
 */
storeSchema.index({ _id: 1, "paymentMethods.method": 1 }, { unique: true });

module.exports = mongoose.model("Store", storeSchema);
