"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePage = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@utils/HttpMessage");
// Slug regex: Only allows lowercase letters, numbers, and hyphens (-), no spaces or special characters
const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const pageValidationSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    slug: joi_1.default.string().trim().pattern(slugRegex).required().messages({
        "string.pattern.base": "Slug can only contain lowercase letters, numbers, and hyphens (-). No spaces or special characters allowed.",
    }),
    location: joi_1.default.string().valid("header", "footer").required(),
    parentPage: joi_1.default.string().trim().optional(),
    content: joi_1.default.string().trim().required(),
    status: joi_1.default.string().valid("draft", "published").required(),
    metaTitle: joi_1.default.string().trim().optional(),
    metaKeywords: joi_1.default.string().trim().optional(),
    metaDescription: joi_1.default.string().trim().optional(),
});
const validatePage = (req, res, next) => {
    const { error } = pageValidationSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
    });
    if (error) {
        const validationError = error.details
            .map((err) => err.message)
            .join(" --- ");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validatePage = validatePage;
