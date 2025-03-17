"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventBookingUpdate = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@utils/HttpMessage");
// Middleware to validate event booking updates
const validateEventBookingUpdate = (req, res, next) => {
    const { error } = eventBookingUpdateSchema.validate(req.body, {
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
exports.validateEventBookingUpdate = validateEventBookingUpdate;
// Joi validation schema for IBookingFormUpdate
const eventBookingUpdateSchema = joi_1.default.object({
    eventId: joi_1.default.string(),
    quantity: joi_1.default.number().integer().min(1).optional().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity must be at least 1",
        "number.integer": "Quantity must be an integer",
    }),
    specialRequirements: joi_1.default.string().optional(),
});
