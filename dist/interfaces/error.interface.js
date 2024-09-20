"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP = void 0;
var HTTP;
(function (HTTP) {
    HTTP[HTTP["OK"] = 200] = "OK";
    HTTP[HTTP["CREATED"] = 201] = "CREATED";
    HTTP[HTTP["REDIRECTED"] = 300] = "REDIRECTED";
    HTTP[HTTP["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTP[HTTP["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTP[HTTP["MOT_FOUND"] = 404] = "MOT_FOUND";
    HTTP[HTTP["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTP[HTTP["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HTTP[HTTP["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HTTP[HTTP["NETWORK_TIMEOUT"] = 599] = "NETWORK_TIMEOUT";
})(HTTP || (exports.HTTP = HTTP = {}));
