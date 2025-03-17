"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBookingForm = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
const validateBookingForm = (req, res, next) => {
    const { error } = bookingValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateBookingForm = validateBookingForm;
const bookingValidationSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phoneNumber: joi_1.default.string().required(),
    page: joi_1.default.string().required(),
    pageTitle: joi_1.default.string().required(),
    participants: joi_1.default.number().min(1).required(),
    specialRequests: joi_1.default.string().allow("").optional(),
    tourId: joi_1.default.string()
        .custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .required(),
});
