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
const jsonwebtoken_1 = require("jsonwebtoken");
const _config_1 = require("@config");
const HttpException_1 = require("@exceptions/HttpException");
const user_model_1 = __importDefault(require("@models/user.model"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const Authorization = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a['Authorization']) ||
        (req.headers['authorization'] ? req.headers['authorization'].split('Bearer ')[1] : null);
    // console.log("Authorization Header: ", req.header('Authorization'));
    // console.log("Extracted Token: ", Authorization);
    console.log(Authorization);
    try {
        if (Authorization) {
            const secretKey = _config_1.SECRET_KEY;
            try {
                const verificationResponse = (0, jsonwebtoken_1.verify)(Authorization, secretKey);
                console.log("Decoded Token: ", verificationResponse);
                const userId = verificationResponse._id;
                const findUser = yield user_model_1.default.findById(userId);
                console.log("User Found: ", findUser);
                if (findUser) {
                    req.user = findUser; // Attach user to the request
                    next();
                }
                else {
                    next(new HttpException_1.HttpException(401, 'User not found for the provided token'));
                }
            }
            catch (error) {
                next(new HttpException_1.HttpException(401, 'Invalid authentication token'));
            }
        }
        else {
            next(new HttpException_1.HttpException(404, 'Authentication token missing'));
        }
    }
    catch (error) {
        next(new HttpException_1.HttpException(401, 'Wrong authentication token pass'));
    }
});
exports.default = authMiddleware;
