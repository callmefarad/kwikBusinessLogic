"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("@services/product.service"));
class classProductController {
    constructor() {
        this.product = new product_service_1.default();
        this.createProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId } = req.params;
                const userId = req.user._id; // Assuming req.user is populated after authentication
                const productData = req.body;
                const file = req.file; // Assuming a single image file is uploaded
                // Call the service to create a product with the single image
                const product = yield this.product.createProduct(productData, userId, file, storeId);
                res.status(201).json({
                    message: 'Product created successfully',
                    data: product,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getProductsByStore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId } = req.params;
                const products = yield this.product.getProductsByStore(storeId);
                res.status(200).json({
                    message: 'Products fetched successfully',
                    data: products,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = classProductController;
