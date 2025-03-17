"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventBookingForm = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
// Middleware to validate event booking form input
const validateEventBookingForm = (req, res, next) => {
    const { error } = eventBookingValidationSchema.validate(req.body, {
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
exports.validateEventBookingForm = validateEventBookingForm;
// Joi validation schema for IBookEventFormInput
const eventBookingValidationSchema = joi_1.default.object({
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
    eventId: joi_1.default.string()
        .custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .required()
        .messages({
        "any.invalid": "Invalid eventId format",
        "string.empty": "Event ID is required",
    }),
    ticketType: joi_1.default.string().valid("VVIP", "VIP", "Regular").required().messages({
        "any.only": "Ticket type must be one of: VVIP, VIP, Regular",
        "string.empty": "Ticket type is required",
    }),
    quantity: joi_1.default.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity must be at least 1",
        "number.integer": "Quantity must be an integer",
    }),
    specialRequirements: joi_1.default.string().optional(),
});
