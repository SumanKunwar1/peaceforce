"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnrollmentUpdate = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
const validateEnrollmentUpdate = (req, res, next) => {
    const { error } = enrollmentValidationSchema.validate(req.body, {
        abortEarly: false, // Show all validation errors
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next(); // Proceed if validation passes
};
exports.validateEnrollmentUpdate = validateEnrollmentUpdate;
const enrollmentValidationSchema = joi_1.default.object({
    preferredLanguage: joi_1.default.string().optional(),
    message: joi_1.default.string().optional(),
    courseId: joi_1.default.string()
        .custom((value, helpers) => {
        if (value && !mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .optional(), // categoryId is optional, but courseId is required if it's provided
});
