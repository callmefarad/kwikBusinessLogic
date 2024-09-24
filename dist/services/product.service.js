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
const user_model_1 = __importDefault(require("@models/user.model"));
const store_model_1 = __importDefault(require("@models/store.model"));
const errorDefinition_1 = require("@utils/errorDefinition");
const product_model_1 = __importDefault(require("@models/product.model"));
const cloudinary_1 = __importDefault(require("@utils/cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
class ProductService {
    constructor() {
        this.users = user_model_1.default;
        this.store = store_model_1.default;
        this.product = product_model_1.default;
    }
    createProduct(productData, userId, file, storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!productData.name || !productData.description || !productData.price || !productData.category) {
                throw new errorDefinition_1.MainAppError({
                    name: 'validationError',
                    message: 'All fields (name, description,  price, category) are required',
                    status: 400,
                    isSuccess: false,
                });
            }
            const store = yield store_model_1.default.findOne({ _id: storeId, userId });
            if (!store) {
                throw new errorDefinition_1.MainAppError({
                    name: 'StoreNotFoundError',
                    message: 'Store not found or you do not have permission to add products to this store.',
                    status: 404,
                    isSuccess: false,
                });
            }
            let image;
            if (file) {
                const uploadedImage = yield cloudinary_1.default.uploader.upload(file.path);
                image = {
                    url: uploadedImage.secure_url,
                    publicId: uploadedImage.public_id,
                };
            }
            else {
                throw new errorDefinition_1.MainAppError({
                    name: 'imageError',
                    message: 'Product image is required',
                    status: 400,
                    isSuccess: false,
                });
            }
            const createdProduct = yield this.product.create(Object.assign(Object.assign({}, productData), { storeId,
                image, createdBy: userId }));
            store.products.push(new mongoose_1.default.Types.ObjectId(`${createdProduct._id}`));
            yield store.save();
            return createdProduct;
            ;
        });
    }
    getProductsByStore(storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the store exists
            const store = yield store_model_1.default.findById(storeId);
            if (!store) {
                throw new errorDefinition_1.MainAppError({
                    name: 'StoreNotFoundError',
                    message: 'Store not found',
                    status: 404,
                    isSuccess: false,
                });
            }
            // Find products and populate related fields
            const products = yield this.product
                .find({ storeId })
                .populate('storeId', 'storeName') // Populating store information (selecting specific fields like name and location)
                .populate('createdBy', 'fullName email'); // Populating user who created the product (selecting fullName and email)
            if (!products || products.length === 0) {
                throw new errorDefinition_1.MainAppError({
                    name: 'NoProductsFound',
                    message: 'No products found for this store',
                    status: 404,
                    isSuccess: false,
                });
            }
            return products;
        });
    }
}
exports.default = ProductService;
