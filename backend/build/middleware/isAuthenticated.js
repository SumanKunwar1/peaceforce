"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@config/env");
const HttpMessage_1 = require("@utils/HttpMessage");
const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw HttpMessage_1.httpMessages.UNAUTHORIZED_NO_TOKEN;
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "null") {
        throw HttpMessage_1.httpMessages.UNAUTHORIZED_INVALID_TOKEN;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        console.log(decoded);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isAuthenticated = isAuthenticated;
