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
    bankTransfer(accountName, amount, currency, reference, customer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    account_name: accountName,
                    amount: amount,
                    currency: currency,
                    reference: reference,
                    customer: {
                        name: customer.name,
                        email: customer.email,
                    },
                };
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.korapay.com/merchant/api/v1/charges/bank-transfer',
                    headers: {
                        'Content-Type': 'application/json', // Make sure you're sending JSON
                        'Authorization': `Bearer ${KORAPAY_API_KEY}`, // Replace with your API key
                    },
                    data: JSON.stringify(data),
                };
                const response = yield (0, axios_1.default)(config);
                return response.data; // Return the response for further processing
            }
            catch (error) {
                console.error('Error during bank transfer:', error.message);
                throw new Error('Failed to process the bank transfer');
            }
        });
    }
    payWithCard(cardData, amount, user) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    message: 'Transaction not failed',
                    status: 404,
                    isSuccess: false,
                });
            });
            return JSON.parse(JSON.stringify(paymemtresponse === null || paymemtresponse === void 0 ? void 0 : paymemtresponse.data));
        });
    }
    payWithCardTest(chargeData, // The encrypted card data or payment token
    amount, currency, reference, customer) {
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
