"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSeoMeta = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateSeoMeta = (req, res, next) => {
    const { error } = seoMetaValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateSeoMeta = validateSeoMeta;
const seoMetaValidationSchema = joi_1.default.object({
    pageTitle: joi_1.default.string().trim().required(),
    metaTitle: joi_1.default.string().trim().allow("").optional(),
    metaDescription: joi_1.default.string().trim().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().trim().allow("")).optional(),
    canonicalUrl: joi_1.default.string().uri().allow("").optional(),
    robotsMeta: joi_1.default.string()
        .valid("index, follow", "noindex, follow", "index, nofollow", "noindex, nofollow")
        .allow("")
        .optional(),
    ogTitle: joi_1.default.string().trim().allow("").optional(),
    ogDescription: joi_1.default.string().trim().allow("").optional(),
    ogImage: joi_1.default.string().uri().allow("").optional(),
});
