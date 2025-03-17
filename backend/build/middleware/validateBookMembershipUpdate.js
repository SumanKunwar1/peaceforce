"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBookMembershipUpdate = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
const validateBookMembershipUpdate = (req, res, next) => {
    if (req.body.image && req.body.image.startsWith("/api/image")) {
        delete req.body.image;
    }
    if (req.body.paymentScreenshot &&
        req.body.paymentScreenshot.startsWith("/api/image")) {
        delete req.body.paymentScreenshot;
    }
    const { error } = bookMembershipUpdateValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateBookMembershipUpdate = validateBookMembershipUpdate;
const bookMembershipUpdateValidationSchema = joi_1.default.object({
    membershipId: joi_1.default.string()
        .custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .optional(),
    amount: joi_1.default.number().min(0).optional(),
    paymentScreenshot: joi_1.default.string().optional(),
    image: joi_1.default.string().optional(),
    paymentMethod: joi_1.default.string().valid("bank", "esewa", "khalti").optional(),
    mailingAddress: joi_1.default.object({
        street: joi_1.default.string().optional(),
        city: joi_1.default.string().optional(),
        state: joi_1.default.string().optional(),
        postalCode: joi_1.default.string().optional(),
        country: joi_1.default.string().optional(),
    }).optional(),
});
