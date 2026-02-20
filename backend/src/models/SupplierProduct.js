const mongoose = require("mongoose");

const supplierProductSchema = new mongoose.Schema({
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true, index: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },

    basePriceCents: {
        type: Number,
        required: true,
        min: 0
    },
    availableQuantity: {
        type: Number,
        default: 0,
        min: 0
    },

    expiryDate: {
        type: Date
    },
    code: {
        type: String
    } // sku interno proveedor (opcional)
}, {
    timestamps: true
});

supplierProductSchema.index({ supplierId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("SupplierProduct", supplierProductSchema);
