"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTestimonial = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@utils/HttpMessage");
const validateTestimonial = (req, res, next) => {
    const { error } = testimonialValidationSchema.validate(req.body, {
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
exports.validateTestimonial = validateTestimonial;
const testimonialValidationSchema = joi_1.default.object({
    quote: joi_1.default.string().allow("").optional(),
    author: joi_1.default.string().allow("").optional(),
    role: joi_1.default.string().allow("").optional(),
});
