const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        index: true
    },
    company: {
        type: String,
        trim: true
    },
    unit: {
        type: String,
        trim: true
    }, // ml, kg, pieza
    barcode: {
        type: String,
        unique: true,
        sparse: true
    }, // o code
    image: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
