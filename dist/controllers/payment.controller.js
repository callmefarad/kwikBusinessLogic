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
const payments_service_1 = __importDefault(require("@services/payments.service"));
// Define the PaymentController class
class PaymentController {
    constructor() {
        this.paymentService = new payments_service_1.default();
        // Method to handle card payment
        this.handleCardPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { chargeData, amount, currency, reference, customer } = req.body;
                // Call the payWithCard method from PaymentService
                const result = yield this.paymentService.payWithCardTest(chargeData, amount, currency, reference, customer);
                // Send the response back to the client
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                next(error); // Pass the error to the error handling middleware
            }
        });
        this.handleCardPaymentTest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, number, cvv, pin, expiry_year, expiry_month, amount, user } = req.body;
                // Call the payWithCard method from the PaymentService
                const result = yield this.paymentService.payWithCard({ name, number, cvv, pin, expiry_year, expiry_month }, amount, user);
                // Send the response back to the client
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                next(error); // Pass the error to the error handling middleware
            }
        });
    }
}
exports.default = PaymentController;
