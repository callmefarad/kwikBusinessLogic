"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_controller_1 = __importDefault(require("@controllers/store.controller"));
const auth_middleware_1 = __importDefault(require("@middlewares/auth.middleware"));
class StoreRoutes {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.storeController = new store_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}create-store`, auth_middleware_1.default, this.storeController.createStore);
        this.router.get(`${this.path}store/get-single`, auth_middleware_1.default, this.storeController.getSingleStore);
        this.router.get(`${this.path}store`, this.storeController.getStoreByLink);
        // this.router.post(`${this.path}logout`, this.authController.logOutUser);
    }
}
exports.default = StoreRoutes;
