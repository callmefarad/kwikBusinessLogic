"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_PASSWORD = exports.DB_USER = exports.DB_NAME = exports.DB_PORT = exports.DB_HOST = exports.PORT = exports.NODE_ENV = exports.CREDENTIALS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV}.local` });
exports.CREDENTIALS = process.env.CREDENTIALS === 'true';
_a = process.env, exports.NODE_ENV = _a.NODE_ENV, exports.PORT = _a.PORT, exports.DB_HOST = _a.DB_HOST, exports.DB_PORT = _a.DB_PORT, exports.DB_NAME = _a.DB_NAME, exports.DB_USER = _a.DB_USER, exports.DB_PASSWORD = _a.DB_PASSWORD;
