"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAppError = void 0;
class MainAppError extends Error {
    constructor(args) {
        super(args.message);
        this.isSuccess = true;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name;
        this.message = args.message;
        this.status = args.status;
        if (args.isSuccess !== undefined) {
            this.isSuccess = args.isSuccess;
        }
        Error.captureStackTrace(this);
    }
}
exports.MainAppError = MainAppError;
