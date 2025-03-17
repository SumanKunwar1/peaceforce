"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlogPost = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateBlogPost = (req, res, next) => {
    if (req.body.image && req.body.image.startsWith("/api/image")) {
        delete req.body.image;
    }
    const { error } = blogPostValidationSchema.validate(req.body, {
        abortEarly: false, // Show all validation errors, not just the first one
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next(); // Proceed if validation passes
};
exports.validateBlogPost = validateBlogPost;
const blogPostValidationSchema = joi_1.default.object({
    isEditable: joi_1.default.boolean().optional(),
    title: joi_1.default.string().allow("").optional(), // Required, min length 3, max 255
    excerpt: joi_1.default.string().allow("").optional(), // Allows empty string
    content: joi_1.default.string().optional(), // Required, at least 10 characters
    author: joi_1.default.object({
        name: joi_1.default.string().min(2).allow("").optional(), // Allows empty string
        avatar: joi_1.default.string().allow("").optional(), // Allows empty string
        role: joi_1.default.string().max(50).allow("").optional(), // Allows empty string
    }).optional(),
    image: joi_1.default.string().allow("").optional(), // Allows empty string
    category: joi_1.default.string().allow("").optional(), // Allows empty string
    tags: joi_1.default.array().items(joi_1.default.string().allow("")).optional(), // Array of strings, allows empty string in array
    readTime: joi_1.default.number().integer().optional(), // Optional, minimum 1 minute read
    metaTitle: joi_1.default.string().allow("").optional(),
    metaDescription: joi_1.default.string().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
});
