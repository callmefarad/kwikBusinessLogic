"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (error, req, res, next) => {
    try {
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        const name = error.name || 'Error';
        console.log(`[${req.method}] ${req.path} >> StatusCode say:: ${status}, Message:: ${message}`);
        res.status(status).json({ name, message, status, isSuccess: error.isSuccess });
    }
    catch (error) {
        next(error);
    }
};
exports.default = errorMiddleware;
