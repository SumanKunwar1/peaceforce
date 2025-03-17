"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBookMembership = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
const validateBookMembership = (req, res, next) => {
    const { error } = bookMembershipValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateBookMembership = validateBookMembership;
const bookMembershipValidationSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phoneNumber: joi_1.default.string().required(),
    page: joi_1.default.string().required(),
    pageTitle: joi_1.default.string().required(),
    image: joi_1.default.string().required(),
    membershipId: joi_1.default.string()
        .custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .required(),
    amount: joi_1.default.number().min(0).required(),
    paymentMethod: joi_1.default.string().valid("bank", "esewa", "khalti").required(),
    paymentScreenshot: joi_1.default.string().required(),
    mailingAddress: joi_1.default.object({
        street: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().optional(),
        postalCode: joi_1.default.string().required(),
        country: joi_1.default.string().required(),
    }).required(),
});
