"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJobPost = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateJobPost = (req, res, next) => {
    const { error } = jobPostValidationSchema.validate(req.body, {
        abortEarly: false, // Show all validation errors
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next(); // Proceed if validation passes
};
exports.validateJobPost = validateJobPost;
const jobPostValidationSchema = joi_1.default.object({
    title: joi_1.default.string().trim().allow("").optional(), // Optional but must be valid if present
    department: joi_1.default.string().trim().allow("").optional(),
    location: joi_1.default.string().trim().allow("").optional(),
    type: joi_1.default.string()
        .valid("Full-time", "Part-time", "Contract")
        .allow("")
        .optional(), // Must be one of these values
    description: joi_1.default.string().trim().allow("").optional(), // Allows empty but must be valid if provided
    requirements: joi_1.default.array().items(joi_1.default.string().trim().allow("")).optional(), // Array of requirement strings
    responsibilities: joi_1.default.array().items(joi_1.default.string().trim().allow("")).optional(), // Array of responsibilities
    benefits: joi_1.default.array().items(joi_1.default.string().trim().allow("")).optional(), // Array of benefits
    postedDate: joi_1.default.string().trim().isoDate().allow("").optional(), // Optional ISO date
    deadline: joi_1.default.string().trim().isoDate().allow("").optional(), // Optional ISO date
    metaTitle: joi_1.default.string().allow("").optional(),
    metaDescription: joi_1.default.string().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
});
