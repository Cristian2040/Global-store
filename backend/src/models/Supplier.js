const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    country: String,
    state: String,
    municipality: String,
    neighborhood: String
}, { _id: false });

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    // usuario que accede al sistema
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    phone: {
        type: String,
        required: true
    },
    route: routeSchema,
    categories: [{
        type: String,
        index: true
    }],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Supplier", supplierSchema);
