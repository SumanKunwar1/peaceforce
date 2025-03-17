"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMembership = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@utils/HttpMessage");
const validateMembership = (req, res, next) => {
    const { error } = membershipValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateMembership = validateMembership;
const membershipValidationSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    duration: joi_1.default.string().optional(),
    fee: joi_1.default.number().optional(),
    benefits: joi_1.default.array().items(joi_1.default.string()).optional(),
    metaTitle: joi_1.default.string().allow("").optional(),
    metaDescription: joi_1.default.string().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
});
