"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const storeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user', // Reference to the User
        required: true,
    },
    storeName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    products: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'products', // Assuming 'product' model exists
        }],
    storeLink: {
        type: String,
        unique: true, // Ensure the store link is unique
    },
}, { timestamps: true });
// Pre-save middleware to generate store link
storeSchema.pre('save', function (next) {
    if (!this.storeLink) {
        // Generate a unique store link by appending the userId
        this.storeLink = `http://localhost:3000/store/${this.storeName.replace(/\s+/g, '-').toLowerCase()}-${this.userId}`;
    }
    next();
});
const storeModel = (0, mongoose_1.model)('Store', storeSchema);
exports.default = storeModel;
