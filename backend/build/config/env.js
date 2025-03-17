"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BREVO_API_KEY = exports.MAX_SLIDER_SIZE = exports.MAX_IMAGE_SIZE = exports.ADMIN_EMAIL = exports.UPLOAD_FOLDER = exports.JWT_SECRET = exports.JWT_EXPIRES_IN = exports.DOMAIN_NAME = exports.NODE_ENV = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = parseInt(process.env.PORT || "4000", 10);
if (isNaN(exports.PORT)) {
    throw new Error("Invalid or missing PORT environment variable");
}
exports.MONGO_URI = process.env.MONGO_URI;
if (!exports.MONGO_URI) {
    throw new Error("Missing MONGO_URI environment variable");
}
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.DOMAIN_NAME = process.env.DOMAIN_NAME;
exports.JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN);
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.UPLOAD_FOLDER = process.env.UPLOAD_FOLDER;
exports.ADMIN_EMAIL = process.env.ADMIN_EMAIL;
exports.MAX_IMAGE_SIZE = process.env.MAX_IMAGE_SIZE
    ? parseInt(process.env.MAX_IMAGE_SIZE)
    : 1048576;
exports.MAX_SLIDER_SIZE = process.env.MAX_SLIDER_SIZE
    ? parseInt(process.env.MAX_SLIDER_SIZE)
    : 2097152;
exports.BREVO_API_KEY = process.env.BREVO_API_KEY;
