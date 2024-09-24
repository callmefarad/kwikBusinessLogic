"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("@controllers/product.controller"));
const auth_middleware_1 = __importDefault(require("@middlewares/auth.middleware"));
const multer_1 = __importDefault(require("../utils/multer"));
class ProductRoutes {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.productController = new product_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}:storeId/create-store`, multer_1.default.single('image'), auth_middleware_1.default, this.productController.createProduct);
        this.router.get(`${this.path}stores/:storeId/products`, auth_middleware_1.default, this.productController.getProductsByStore);
        // this.router.post(`${this.path}logout`, this.authController.logOutUser);
    }
}
exports.default = ProductRoutes;
