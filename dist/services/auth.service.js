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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const user_model_1 = __importDefault(require("@models/user.model"));
const errorDefinition_1 = require("@utils/errorDefinition");
const util_1 = require("@utils/util");
const error_interface_1 = require("@interfaces/error.interface");
const _config_1 = require("@config");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthService {
    constructor() {
        this.users = user_model_1.default;
    }
    signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, util_1.isEmpty)(userData.email) || (0, util_1.isEmpty)(userData.password))
                throw new errorDefinition_1.MainAppError({
                    name: 'validationError',
                    message: 'all field is required',
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            const findUser = yield this.users.findOne({ email: userData.email });
            if (findUser)
                throw new errorDefinition_1.MainAppError({
                    name: 'validationError',
                    message: `this user ${userData.email} already exits`,
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            const hashedPassword = yield (0, bcrypt_1.hash)(userData.password, 10);
            const createUserData = yield this.users.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
            const _a = createUserData.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
            const tokenData = this.createToken(createUserData);
            return { token: tokenData.token, user: userWithoutPassword };
        });
    }
    login(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, util_1.isEmpty)(userData.email) || (0, util_1.isEmpty)(userData.password))
                throw new errorDefinition_1.MainAppError({
                    name: 'validationError',
                    message: 'all field is required',
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            const findUser = yield this.users.findOne({ email: userData.email });
            if (!findUser)
                throw new errorDefinition_1.MainAppError({
                    name: 'user not there',
                    message: `this ${userData.email} was not found`,
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            const isMatchingPassword = yield (0, bcrypt_1.compare)(userData.password, findUser.password);
            if (!isMatchingPassword)
                throw new errorDefinition_1.MainAppError({
                    name: ' Incorrect  Password',
                    message: `password did not match`,
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            const tokenData = this.createToken(findUser);
            const _a = findUser.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]); // Convert to plain object
            return { token: tokenData.token, findUser: userWithoutPassword };
        });
    }
    logout(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, util_1.isEmpty)(userData.email) || (0, util_1.isEmpty)(userData.password))
                throw new errorDefinition_1.MainAppError({
                    name: 'validationError',
                    message: 'all field is required',
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            const findUser = yield this.users.findOne({ email: userData.email, password: userData.password });
            if (!findUser) {
                throw new errorDefinition_1.MainAppError({
                    name: 'validationError',
                    message: `this ${userData.email} was not found`,
                    status: error_interface_1.HTTP.BAD_REQUEST,
                    isSuccess: false,
                });
            }
            return findUser;
        });
    }
    createToken(user) {
        const dataStoredInToken = { _id: user._id };
        const secretKey = _config_1.SECRET_KEY;
        const expiresIn = 60 * 60;
        return { expiresIn, token: (0, jsonwebtoken_1.sign)(dataStoredInToken, secretKey, { expiresIn }) };
    }
    createCookies(tokenData) {
        const cookieOptions = [
            `Authorization=${tokenData.token}`,
            'HttpOnly', // Prevents JavaScript access to the cookie
            `Max-Age=${tokenData.expiresIn}`, // Cookie expiration time in seconds
            'Path=/', // Path where the cookie is valid
            'SameSite=Lax', // Adjust based on your needs (Lax, Strict, None)
            // 'Secure', // Uncomment if using HTTPS
        ].join('; ');
        return cookieOptions;
    }
}
exports.default = AuthService;
