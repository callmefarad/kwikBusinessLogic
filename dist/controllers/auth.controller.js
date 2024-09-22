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
class classAuthController {
    constructor() {
        this.authServices = new auth_service_1.default();
        this.signUpUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const createUserData = yield this.authServices.signup(userData);
                res.status(201).json({
                    user: createUserData.user, // user data without password
                    token: createUserData.token, // token for authentication
                    message: 'User created successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.loginUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const { token, findUser } = yield this.authServices.login(userData);
                // Create cookie and set it in the response
                const cookie = this.authServices.createCookies({ token, expiresIn: 60 * 60 });
                res.setHeader('Set-Cookie', [cookie]);
                res.status(200).json({
                    message: 'Login successfully',
                    token, // Return the token in the response
                    user: findUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.logOutUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.user;
                // Clear the cookie
                res.setHeader('Set-Cookie', ['Authorization=; Max-Age=0; Path=/; HttpOnly']);
                res.status(200).json({
                    // data: userData, // Return user data if needed
                    message: 'Logout successful',
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = classAuthController;
