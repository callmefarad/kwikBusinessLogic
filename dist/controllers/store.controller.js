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
const auth_service_1 = __importDefault(require("@/services/auth.service"));
const store_service_1 = __importDefault(require("@/services/store.service"));
class classAuthController {
    constructor() {
        this.authServices = new auth_service_1.default();
        this.storeService = new store_service_1.default();
        this.createStore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id; // User is attached to the request from auth 
                // const userId = "66eed91b2c4082e112a77432";
                const storeData = req.body;
                const newStore = yield this.storeService.createStore(storeData, userId);
                res.status(201).json({
                    message: 'Store created successfully',
                    store: newStore,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getSingleStore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id; // Assuming req.user is populated after authentication middleware
                const store = yield this.storeService.getSingleStore(userId);
                if (!store) {
                    res.status(404).json({ message: 'Store not found' });
                }
                res.status(200).json({
                    message: 'Store fetched successfully',
                    data: store,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getStoreByLink = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeLink } = req.query; // Extract storeLink from query string
                if (!storeLink) {
                    res.status(400).json({ message: 'storeLink is required' });
                }
                const store = yield this.storeService.getStoreByLink(storeLink);
                if (!store) {
                    res.status(404).json({ message: 'Store not found' });
                }
                res.status(200).json({
                    message: 'Store fetched successfully',
                    data: store,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = classAuthController;
