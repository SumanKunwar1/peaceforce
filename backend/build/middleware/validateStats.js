"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStats = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateStats = (req, res, next) => {
    // Validate using Joi schema
    const { error } = statsValidationSchema.validate(req.body, {
        abortEarly: false, // to get all the validation errors at once
    });
    // If there's a validation error, return it
    if (error) {
        const validationError = error.details
            .map((err) => err.message)
            .join(" --- ");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next(); // Proceed to next middleware or route handler
};
exports.validateStats = validateStats;
// Validation schema using Joi
const statsValidationSchema = joi_1.default.object({
    icon: joi_1.default.string().allow("").optional(), // optional string
    endValue: joi_1.default.number().allow("").optional(), // optional number
    label: joi_1.default.string().allow("").optional(), // optional string
    description: joi_1.default.string().allow("").optional(), // optional string
});
