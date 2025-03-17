"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDonation = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
// Middleware to validate program booking form input
const validateDonation = (req, res, next) => {
    const { error } = donationValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details
            .map((err) => err.message)
            .join(" --- ");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateDonation = validateDonation;
const donationValidationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        "string.empty": "Name is required",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Invalid email format",
        "string.empty": "Email is required",
    }),
    phoneNumber: joi_1.default.string().trim().required().messages({
        "string.empty": "Phone number is required",
    }),
    page: joi_1.default.string().trim().required().messages({
        "string.empty": "Page is required",
    }),
    pageTitle: joi_1.default.string().trim().required().messages({
        "string.empty": "Page title is required",
    }),
    amount: joi_1.default.number().integer().min(0).required().messages({
        "number.base": "Participants must be a number",
        "number.min": "Participants must be at least 0",
        "number.integer": "Participants must be an integer",
    }),
    screenshot: joi_1.default.string().trim().required().messages({
        "string.empty": "screenshot is required",
    }),
});
