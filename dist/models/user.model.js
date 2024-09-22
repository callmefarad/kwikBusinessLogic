"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        require: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        require: true,
        lowercase: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: { type: String, enum: ['user', 'storeOwner'], default: 'storeOwner', required: true }, // Role field
    store: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Store' },
});
const userModel = (0, mongoose_1.model)('user', userSchema);
exports.default = userModel;
