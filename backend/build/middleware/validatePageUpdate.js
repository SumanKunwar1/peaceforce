"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePageUpdate = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@utils/HttpMessage");
const pageValidationSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    slug: joi_1.default.string().trim().optional(),
    location: joi_1.default.string().valid("header", "footer").optional(),
    parentPage: joi_1.default.string().trim().optional(),
    content: joi_1.default.string().trim().optional(),
    status: joi_1.default.string().valid("draft", "published").optional(),
    metaTitle: joi_1.default.string().trim().optional(),
    metaKeywords: joi_1.default.string().trim().optional(),
    metaDescription: joi_1.default.string().trim().optional(),
});
const validatePageUpdate = (req, res, next) => {
    const { error } = pageValidationSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validatePageUpdate = validatePageUpdate;
