"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("@controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("@middlewares/auth.middleware"));
class AuthRoutes {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}signup`, this.authController.signUpUser);
        this.router.post(`${this.path}login`, this.authController.loginUser);
        this.router.post(`${this.path}logout`, auth_middleware_1.default, this.authController.logOutUser);
    }
}
exports.default = AuthRoutes;
