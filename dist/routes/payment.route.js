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
        this.router.post(`${this.path}card-payment`, this.paymentController.handleCardPaymentTest);
        this.router.get(`${this.path}:storeId/purchase`, this.paymentController.getPurchaseByStore);
        this.router.post(`${this.path}create-bank-payment`, this.paymentController.handleBankTransfer);
        this.router.post(`${this.path}webhook`, this.paymentController.webHookHandler);
        this.router.get(`${this.path}payments`, this.paymentController.getPayments);
        // this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOutUser);
    }
}
exports.default = PaymentRoutes;
