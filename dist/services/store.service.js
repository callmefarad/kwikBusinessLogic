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
const error_interface_1 = require("@interfaces/error.interface");
class StoreService {
    constructor() {
        this.users = user_model_1.default;
        this.store = store_model_1.default;
    }
    createStore(storeData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!storeData.storeName || !storeData.address || !storeData.country) {
                throw new errorDefinition_1.MainAppError({
                    name: 'validationError',
                    message: 'All fields (storeName, address, country) are required',
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            }
            const findUser = yield this.users.findOne({ _id: userId });
            if (!findUser)
                throw new errorDefinition_1.MainAppError({
                    name: 'user not there',
                    message: `this user does not exist`,
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            // Check if the store with the same storeName already exists for the user
            const existingStore = yield this.store.findOne({ userId });
            if (existingStore) {
                throw new errorDefinition_1.MainAppError({
                    name: 'validationError',
                    message: `User already have a store`,
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            }
            const createStoreData = yield this.store.create(Object.assign(Object.assign({}, storeData), { userId, products: [] }));
            return createStoreData;
        });
    }
}
exports.default = StoreService;
