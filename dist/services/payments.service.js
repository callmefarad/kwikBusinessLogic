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
const purchase_model_1 = __importDefault(require("@models/purchase.model"));
const errorDefinition_1 = require("@utils/errorDefinition");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const uuidv4_1 = require("uuidv4");
const KORAPAY_API_KEY = "sk_test_gQgnz1uGmqF5ckpKBtqFs9SXTM9CeY42TMyfY6SR";
const encrypt = "xQprX4eJNkZkCipZkdRPjS8BaRP2JLQf";
function encryptAES256(encryptionKey, paymentData) {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", encryptionKey, iv);
    const encrypted = cipher.update(paymentData);
    const ivToHex = iv.toString("hex");
    const encryptedToHex = Buffer.concat([encrypted, cipher.final()]).toString("hex");
    return `${ivToHex}:${encryptedToHex}:${cipher.getAuthTag().toString("hex")}`;
}
class PaymentService {
    constructor() {
        this.payments = [];
    }
    bankTransfer(amount, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const GenerateTransactionReference = (0, uuidv4_1.uuid)();
                const data = {
                    account_name: "kwik store account",
                    amount: amount,
                    currency: "NGN",
                    reference: GenerateTransactionReference,
                    customer: {
                        name: user.name,
                        email: user.email,
                    },
                };
                const config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: 'https://api.korapay.com/merchant/api/v1/charges/bank-transfer',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${KORAPAY_API_KEY}`, // Use your actual API key here
                    },
                    data: JSON.stringify(data),
                };
                let paymentResponse;
                yield (0, axios_1.default)(config).then(function (response) {
                    return __awaiter(this, void 0, void 0, function* () {
                        paymentResponse = response;
                    });
                }).catch(function (error) {
                    throw new errorDefinition_1.MainAppError({
                        name: 'Failed transaction',
                        message: `Transaction failed: ${error.message}`,
                        status: 404,
                        isSuccess: false,
                    });
                });
                return JSON.parse(JSON.stringify(paymentResponse === null || paymentResponse === void 0 ? void 0 : paymentResponse.data));
            }
            catch (error) {
                console.error('Error during bank transfer:', error.message);
                throw new Error(`Failed to process the bank transfer: ${error.message}`);
            }
        });
    }
    createPurchase(user, products, amount, storeOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create a new purchase document
                const purchase = new purchase_model_1.default({
                    customer: {
                        name: user.name,
                        email: user.email,
                        address: user.address,
                    },
                    storeOwner: {
                        storeId: storeOwner.storeId,
                    },
                    products: products.map((product) => ({
                        productId: product.productId,
                        productName: product.productName,
                        quantity: product.quantity,
                        price: product.price,
                    })),
                    totalAmount: amount,
                    paymentStatus: 'paid', // This can be updated based on actual payment status
                });
                // Save the purchase in the database
                yield purchase.save();
                return purchase;
            }
            catch (error) {
                console.error('Error creating purchase:', error.message);
                throw new Error(`Failed to create purchase: ${error.message}`);
            }
        });
    }
    addPayment(payment) {
        this.payments.push(payment);
    }
    // Fetch all payments
    getAllPayments() {
        return this.payments;
    }
    // Main webhook handling function
    webHooksUrls(event, data, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Validate the signature first
            const validationResponse = this.validateSignature(data, signature);
            if (!validationResponse.valid) {
                console.warn("Invalid signature received");
                return { status: 403, message: "Invalid signature" };
            }
            // Step 2: Process the webhook event and data
            return this.processEvent(event, data);
        });
    }
    // Helper function for validating webhook signature
    validateSignature(data, signature) {
        const secretKey = KORAPAY_API_KEY;
        const hash = crypto_1.default
            .createHmac("sha256", secretKey)
            .update(JSON.stringify(data)) // Validate ONLY the `data` object
            .digest("hex");
        console.log("Computed HMAC:", hash);
        console.log("Received signature:", signature);
        if (hash !== signature) {
            return { valid: false };
        }
        return { valid: true, computedHash: hash };
    }
    // Helper function for processing webhook events
    processEvent(event, data) {
        const paymentData = {
            reference: data.reference,
            amount: data.amount,
            status: data.status,
            customer: data.customer,
        };
        console.log("Received webhook event:", event, "with data:", paymentData);
        switch (event) {
            case "charge.success":
            case "transfer.success":
                console.log("Adding payment data to array", paymentData);
                this.addPayment(paymentData);
                return {
                    status: 200,
                    message: "Webhook processed successfully",
                    payment: paymentData,
                };
            case "charge.failed":
            case "transfer.failed":
                console.log("Transaction failed", paymentData);
                return { status: 200, message: "Transaction failed", payment: paymentData };
            default:
                console.warn("Unhandled event received");
                return { status: 400, message: "Unhandled event" };
        }
    }
    payWithCard(cardData, amount, user, products, storeOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const GenerateTransactionReference = (0, uuidv4_1.uuid)();
            const paymentData = {
                reference: GenerateTransactionReference,
                card: {
                    name: cardData.name,
                    number: cardData.number,
                    cvv: cardData.cvv,
                    pin: cardData.pin,
                    expiry_year: cardData.expiry_year,
                    expiry_month: cardData.expiry_month,
                },
                amount,
                currency: "NGN",
                redirect_url: "https://merchant-redirect-url.com",
                customer: {
                    name: user === null || user === void 0 ? void 0 : user.name,
                    email: user === null || user === void 0 ? void 0 : user.email,
                },
                metadata: {
                    internalRef: "JD-12-67",
                    age: 15,
                    fixed: true,
                },
            };
            const stringData = JSON.stringify(paymentData);
            //The data should be in buffer form according to Kora's pay
            const bufData = Buffer.from(stringData, "utf-8");
            const encryptedData = encryptAES256(encrypt, bufData);
            var config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://api.korapay.com/merchant/api/v1/charges/card",
                headers: {
                    Authorization: `Bearer ${KORAPAY_API_KEY}`,
                },
                data: {
                    charge_data: `${encryptedData}`,
                },
            };
            let paymemtresponse;
            yield (0, axios_1.default)(config).then(function (response) {
                return __awaiter(this, void 0, void 0, function* () {
                    paymemtresponse = response;
                });
            }).catch(function (error) {
                throw new errorDefinition_1.MainAppError({
                    name: 'Failed transaction',
                    message: `Transaction not failed ${error.message}`,
                    status: 404,
                    isSuccess: false,
                });
            });
            const check = JSON.parse(JSON.stringify(paymemtresponse === null || paymemtresponse === void 0 ? void 0 : paymemtresponse.data));
            console.log("djc", check);
            if (((_a = check === null || check === void 0 ? void 0 : check.data) === null || _a === void 0 ? void 0 : _a.status) === "success") {
                try {
                    const purchase = new purchase_model_1.default({
                        customer: {
                            name: user === null || user === void 0 ? void 0 : user.name,
                            email: user === null || user === void 0 ? void 0 : user.email,
                            address: user === null || user === void 0 ? void 0 : user.address
                        },
                        storeOwner: {
                            // name: storeOwner?.name,
                            storeId: storeOwner === null || storeOwner === void 0 ? void 0 : storeOwner.storeId,
                        },
                        products: products.map((product) => ({
                            productId: product.productId,
                            productName: product.productName,
                            quantity: product.quantity,
                            price: product.price,
                        })),
                        totalAmount: amount,
                        paymentStatus: "paid", // Mark as paid after successful transaction
                    });
                    yield purchase.save(); // Save the purchase details
                }
                catch (error) {
                    console.error("Error saving purchase details:", error);
                    throw new errorDefinition_1.MainAppError({
                        name: 'Database error',
                        message: `Failed to save purchase details: ${error}`,
                        status: 500,
                        isSuccess: false,
                    });
                }
            }
            return JSON.parse(JSON.stringify(paymemtresponse === null || paymemtresponse === void 0 ? void 0 : paymemtresponse.data));
        });
    }
    getPurchasesByStoreId(storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchases = yield purchase_model_1.default.find({ 'storeOwner.storeId': storeId });
                if (!purchases || purchases.length === 0) {
                    throw new Error('No purchases found for this store');
                }
                return purchases;
            }
            catch (error) {
                throw new Error(error.message || 'Error retrieving purchases');
            }
        });
    }
    payWithCardTest(chargeData, // The encrypted card data or payment token
    amount, currency, reference, customer, products, storeOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Prepare the data for the card charge
                const data = {
                    charge_data: chargeData,
                    amount: amount,
                    currency: currency,
                    reference: reference,
                    customer: {
                        name: customer.name,
                        email: customer.email,
                    },
                };
                // Configure the Axios request
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.korapay.com/merchant/api/v1/charges/card',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${KORAPAY_API_KEY}`, // Use the API key for authorization
                    },
                    data: JSON.stringify(data),
                };
                // Make the request and return the response
                const response = yield (0, axios_1.default)(config);
                return response.data;
            }
            catch (error) {
                console.error('Error during card payment:', error.message);
                throw new Error('Failed to process the card payment');
            }
        });
    }
}
exports.default = PaymentService;
