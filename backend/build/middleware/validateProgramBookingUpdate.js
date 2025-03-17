"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProgramBookingUpdate = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
const validateProgramBookingUpdate = (req, res, next) => {
    const { error } = programBookingUpdateSchema.validate(req.body, {
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
exports.validateProgramBookingUpdate = validateProgramBookingUpdate;
const programBookingUpdateSchema = joi_1.default.object({
    programId: joi_1.default.string()
        .custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .optional()
        .messages({
        "any.invalid": "Invalid programId format",
    }),
    participants: joi_1.default.number().integer().min(1).optional().messages({
        "number.base": "Participants must be a number",
        "number.min": "Participants must be at least 1",
        "number.integer": "Participants must be an integer",
    }),
    specialRequirements: joi_1.default.string().optional(),
});
