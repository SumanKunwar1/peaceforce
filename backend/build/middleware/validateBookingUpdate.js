"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBookingUpdate = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
const validateBookingUpdate = (req, res, next) => {
    const { error } = bookingUpdateValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateBookingUpdate = validateBookingUpdate;
const bookingUpdateValidationSchema = joi_1.default.object({
    tourId: joi_1.default.string()
        .custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .optional(),
    participants: joi_1.default.number().min(1).optional(),
    specialRequests: joi_1.default.string().allow("").optional(),
});
