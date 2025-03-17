"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAbout = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
// Reusable content schema
const contentSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).allow("").optional(),
    description: joi_1.default.string().allow("").optional(),
    icon: joi_1.default.string().allow("").optional(),
});
// Schema for aboutHero content (no icon field)
const aboutHeroSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).allow("").optional(),
    description: joi_1.default.string().allow("").optional(),
});
const validateAbout = (req, res, next) => {
    if (req.body.image && req.body.image.startsWith("/api/image")) {
        delete req.body.image;
    }
    const { error } = aboutValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateAbout = validateAbout;
const aboutValidationSchema = joi_1.default.object({
    image: joi_1.default.string().optional(),
    aboutHero: aboutHeroSchema.optional(), // No icon for aboutHero
    aboutContent: joi_1.default.array().items(contentSchema).optional(),
    missionsSection: joi_1.default.array().items(contentSchema).optional(),
    servicesSection: joi_1.default.array().items(contentSchema).optional(),
    visionSection: joi_1.default.array().items(contentSchema).optional(),
});
