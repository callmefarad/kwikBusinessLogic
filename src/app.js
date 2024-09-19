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
const _config_1 = require("@config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = require("mongoose");
const _databases_1 = require("@databases");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = _config_1.PORT || 7000;
        this.env = _config_1.NODE_ENV || 'development';
        //this function automatic run
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.connectToDatabase();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("🚀 App listening onn the port " + this.port);
        });
    }
    connectToDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.env !== 'production') {
                (0, mongoose_1.set)('debug', true);
            }
            try {
                const conn = yield (0, mongoose_1.connect)(_databases_1.dbConnect.url);
                console.log('Database connecteD successfully!');
                console.log(`MongoDBcf connected: ${conn.connection.host}`);
            }
            catch (error) {
                console.log('Error connecting to the database:op', error);
            }
        });
    }
    initializeMiddlewares() {
        this.app.use((0, morgan_1.default)('combined'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use((0, helmet_1.default)());
        // this.app.use(cookieParser());
    }
    initializeRoutes() {
        this.app.get('/api', (req, res) => {
            res.json({ message: 'App is running!' }); // Simple JSON response
        });
    }
}
exports.default = App;
