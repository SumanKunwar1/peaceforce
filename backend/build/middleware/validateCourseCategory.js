"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCourseCategory = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateCourseCategory = (req, res, next) => {
    if (req.body.image && req.body.image.startsWith("/api/image")) {
        delete req.body.image;
    }
    if (req.body.instructor.image &&
        req.body.instructor.image.startsWith("/api/image")) {
        delete req.body.instructor.image;
    }
    const { error } = courseCategoryValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateCourseCategory = validateCourseCategory;
const courseCategoryValidationSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().allow("").optional(),
    image: joi_1.default.string().allow("").optional(),
    duration: joi_1.default.string().allow("").optional(),
    language: joi_1.default.array().items(joi_1.default.string().optional()).optional(),
    highlights: joi_1.default.array().items(joi_1.default.string().optional()).optional(),
    materials: joi_1.default.array().items(joi_1.default.string().optional()).optional(),
    metaTitle: joi_1.default.string().allow("").optional(),
    metaDescription: joi_1.default.string().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
    instructor: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).allow("").optional(),
        title: joi_1.default.string().max(100).allow("").optional(),
        bio: joi_1.default.string().max(1000).allow("").optional(),
        image: joi_1.default.string().allow("").optional(),
    }).optional(),
});
