"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("@controllers/payment.controller"));
class PaymentRoutes {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.paymentController = new payment_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}create-payment`, this.paymentController.handleCardPaymentTest);
        // this.router.post(`${this.path}login`, this.authController.loginUser);
        // this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOutUser);
    }
}
exports.default = PaymentRoutes;
