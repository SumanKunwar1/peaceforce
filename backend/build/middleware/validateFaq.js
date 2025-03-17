"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFAQ = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateFAQ = (req, res, next) => {
    const { error } = faqValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateFAQ = validateFAQ;
const faqValidationSchema = joi_1.default.object({
    question: joi_1.default.string().required().messages({
        "string.empty": "Question is required.",
    }),
    answer: joi_1.default.string().required().messages({
        "string.empty": "Answer is required.",
    }),
    category: joi_1.default.string().allow("").optional(),
    metaTitle: joi_1.default.string().allow("").optional(),
    metaDescription: joi_1.default.string().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
});
