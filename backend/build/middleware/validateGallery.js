"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGallery = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateGallery = (req, res, next) => {
    console.log(req.body);
    const { error } = galleryValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateGallery = validateGallery;
const galleryValidationSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    events: joi_1.default.object({
        title: joi_1.default.string().allow("").optional(),
        description: joi_1.default.string().allow("").optional(),
        date: joi_1.default.date().optional(),
        coverImage: joi_1.default.string().allow("").optional(),
        images: joi_1.default.array().items(joi_1.default.string().optional()).optional(),
    }).optional(),
});
