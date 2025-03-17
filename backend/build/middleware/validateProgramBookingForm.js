"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProgramBookingForm = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
// Middleware to validate program booking form input
const validateProgramBookingForm = (req, res, next) => {
    const { error } = programBookingValidationSchema.validate(req.body, {
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
exports.validateProgramBookingForm = validateProgramBookingForm;
// Joi validation schema for IBookProgramFormInput
const programBookingValidationSchema = joi_1.default.object({
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
    programId: joi_1.default.string()
        .custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .required()
        .messages({
        "any.invalid": "Invalid programId format",
        "string.empty": "Program ID is required",
    }),
    participants: joi_1.default.number().integer().min(1).required().messages({
        "number.base": "Participants must be a number",
        "number.min": "Participants must be at least 1",
        "number.integer": "Participants must be an integer",
    }),
    specialRequirements: joi_1.default.string().optional(),
});
