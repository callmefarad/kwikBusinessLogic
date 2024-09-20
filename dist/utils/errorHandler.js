"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorDefinition_1 = require("@/utils/errorDefinition");
const error_interface_1 = require("@interfaces/error.interface");
const ErrorBuilder = (err, res) => {
    res.status(error_interface_1.HTTP.INTERNAL_SERVER_ERROR).json({
        name: err.name,
        message: err.message,
        status: err.status,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};
const errorHandler = (err, req, res
// next: NextFunction
) => {
    if (err instanceof errorDefinition_1.MainAppError) {
        ErrorBuilder(err, res);
    }
    else {
        res.status(error_interface_1.HTTP.INTERNAL_SERVER_ERROR).json({
            name: err.name || 'Error',
            message: err.message || 'An unexpected error occurred',
            status: error_interface_1.HTTP.INTERNAL_SERVER_ERROR,
            stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        });
    }
};
exports.errorHandler = errorHandler;
