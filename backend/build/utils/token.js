"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateAuthtoken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@config/env");
const GenerateAuthtoken = (email) => {
    return jsonwebtoken_1.default.sign({ email }, env_1.JWT_SECRET, {
        expiresIn: env_1.JWT_EXPIRES_IN,
    });
};
exports.GenerateAuthtoken = GenerateAuthtoken;
