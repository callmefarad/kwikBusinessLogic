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
// import 'tsconfig-paths/register'; 
const app_1 = __importDefault(require("@/app"));
const auth_route_1 = __importDefault(require("@/routes/auth.route"));
const store_route_1 = __importDefault(require("@/routes/store.route"));
const product_router_1 = __importDefault(require("@/routes/product.router"));
const app = new app_1.default([new auth_route_1.default(), new store_route_1.default(), new product_router_1.default()]);
app.listen();
function shutdownServer(signal) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Received ${signal}. Shutting down servver...`);
            // await app.closeDatabaseConnection();
            console.log('Server stopped gracefully.');
            process.exit(0);
        }
        catch (error) {
            console.log('Error during server shutdown:', error);
            process.exit(1);
        }
    });
}
function handleUncaughtError(error) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Server shutting down due to uncaught exception:', error);
        //   await app.closeDatabaseConnection();
        process.exit(1);
    });
}
function handleUnhandledRejection(reason, promise) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Unhandled promise rejection:', reason);
        console.log('Promise:', promise);
        //   await app.closeDatabaseConnection();
        process.exit(1);
    });
}
/* ------------------------ Handle uncaught rejection ----------------------- */
process.on('uncaughtException', handleUncaughtError);
/* ------------------- Handle unhandled promise rejections ------------------- */
process.on('unhandledRejection', handleUnhandledRejection);
/* ----------------------------- Handle SIGINT ----------------------------- */
process.on('SIGINT', () => shutdownServer('SIGINT'));
/* ------------------- Handle SIGTERM (termination signal) ------------------ */
process.on('SIGTERM', () => shutdownServer('SIGTERM'));
