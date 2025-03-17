"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTeam = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateTeam = (req, res, next) => {
    if (req.body.image && req.body.image.startsWith("/api/image")) {
        delete req.body.image;
    }
    const { error } = teamValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateTeam = validateTeam;
const teamValidationSchema = joi_1.default.object({
    name: joi_1.default.string().optional().allow(""),
    role: joi_1.default.string().optional().allow(""),
    image: joi_1.default.string().optional().allow(""),
    bio: joi_1.default.string().optional().allow(""),
    socialLinks: joi_1.default.object({
        instagram: joi_1.default.string().optional().allow(""),
        facebook: joi_1.default.string().optional().allow(""),
        twitter: joi_1.default.string().optional().allow(""),
        linkedin: joi_1.default.string().optional().allow(""),
    }).optional(),
    metaTitle: joi_1.default.string().allow("").optional(),
    metaDescription: joi_1.default.string().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
});
