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
        this.handleBankTransfer = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, customer } = req.body;
                // Ensure customer object contains name and email
                if (!customer || !customer.name || !customer.email) {
                    res.status(400).json({ success: false, message: 'Customer name and email are required.' });
                    return;
                }
                // Call the bankTransfer method from PaymentService
                const result = yield this.paymentService.bankTransfer(amount, customer);
                // Send success response to client
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                next(error); // Pass the error to the error-handling middleware
            }
        });
        // Method to handle card payment
        // public handleCardPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        //   try {
        //     const { chargeData, amount, currency, reference, customer } = req.body;
        //     // // Call the payWithCard method from PaymentService
        //     // const result = await this.paymentService.payWithCardTest(chargeData, amount, currency, reference, customer);
        //     // // Send the response back to the client
        //     // res.status(200).json({ success: true, data: result });
        //   } catch (error) {
        //     next(error); // Pass the error to the error handling middleware
        //   }
        //   };
        this.getPurchaseByStore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId } = req.params;
                const purchases = yield this.paymentService.getPurchasesByStoreId(storeId);
                res.status(200).json({
                    message: 'Purchases retrieved successfully',
                    isSuccess: true,
                    data: purchases,
                });
            }
            catch (error) {
                res.status(404).json({
                    message: `ops ${error.message}`,
                    isSuccess: false,
                });
            }
        });
        this.getPayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payments = yield this.paymentService.getPayments();
                res.json(payments);
            }
            catch (error) {
                console.error('Error fetching payments:', error.message);
                res.status(500).json({ message: error.message });
            }
        });
        // Webhook handler
        this.webHookHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Request Headers:', req.headers); // Log all headers
            const { event, data } = req.body; // Destructure the event and data from the request body
            const signature = req.headers['x-korapay-signature'];
            if (!signature) {
                console.warn('Received signature is undefined');
                return res.status(403).json({ message: 'No signature provided' });
            }
            try {
                // Process the event based on its type
                const result = yield this.paymentService.webHooksUrls(event, data, signature);
                return res.status(result.status).json({ message: result.message, payment: result.payment });
            }
            catch (error) {
                console.error('Error in webhook controller:', error.message);
                return res.status(500).json({ message: error.message });
            }
        });
        this.handleCardPaymentTest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, number, cvv, pin, expiry_year, expiry_month, amount, user, cart, storeOwner } = req.body;
                const products = Array.isArray(cart) ? cart : [cart];
                // Call the payWithCard method from the PaymentService
                const result = yield this.paymentService.payWithCard({ name, number, cvv, pin, expiry_year, expiry_month }, amount, user, products, storeOwner);
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
