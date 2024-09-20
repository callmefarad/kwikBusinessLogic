"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const _config_1 = require("@config");
exports.dbConnect = {
    url: _config_1.NODE_ENV === 'production'
        ? `mongodb+srv://${_config_1.DB_USER}:${_config_1.DB_PASSWORD}@cluster0.uq6gi.mongodb.net/${_config_1.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
        : `mongodb://${_config_1.DB_HOST}:${_config_1.DB_PORT}/${_config_1.DB_NAME}`, // For development
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};
