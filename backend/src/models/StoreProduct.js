const mongoose = require("mongoose");

const storeProductSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },

    basePriceCents: {
        type: Number,
        default: 0,
        min: 0
    },
    finalPriceCents: {
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
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

storeProductSchema.index({ storeId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("StoreProduct", storeProductSchema);
