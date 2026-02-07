const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    country: String,
    state: String,
    municipality: String,
    neighborhood: String,
    street: String,
    number: String
}, { _id: false });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ["customer", "admin", "store", "supplier"],
        default: "customer"
    },
    address: addressSchema,
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
