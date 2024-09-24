"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinary = cloudinary_1.default.v2;
cloudinary.config({
    cloud_name: "ndtech",
    api_key: "325692748593977",
    api_secret: "umNXDmlZgBcvD-DrYhwoehT0HDM"
});
exports.default = cloudinary;
