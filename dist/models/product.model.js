"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    storeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Store', // Reference to the Store model
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    productLink: {
        type: String,
        unique: true, // Ensure the product link is unique
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user', // Reference to the user who created the product
        required: true,
    },
}, { timestamps: true });
// Pre-save middleware to generate product link
productSchema.pre('save', function (next) {
    if (!this.productLink) {
        // Generate a unique product link by appending the product name and storeId
        this.productLink = `http://localhost:3000/product/${this.name.replace(/\s+/g, '-').toLowerCase()}-${this.storeId}`;
    }
    next();
});
const productModel = (0, mongoose_1.model)('products', productSchema);
exports.default = productModel;
