const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    country: String,
    state: String,
    municipality: String,
    neighborhood: String,
    street: String,
    number: String
}, { _id: false });

const companySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    taxId: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: addressSchema,
    description: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    logo: {
        type: String
    },
    suppliers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier"
    }],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Company", companySchema);
