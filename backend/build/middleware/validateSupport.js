"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSupport = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateSupport = (req, res, next) => {
    var _a;
    if (((_a = req.body.hero) === null || _a === void 0 ? void 0 : _a.image) && req.body.hero.image.startsWith("/api/image")) {
        delete req.body.hero.image; // Remove hero image from the body if it's an API reference
    }
    const { error } = supportValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateSupport = validateSupport;
const supportValidationSchema = joi_1.default.object({
    hero: joi_1.default.object({
        title: joi_1.default.string().allow("").optional(),
        subtitle: joi_1.default.string().allow("").optional(),
        image: joi_1.default.string().allow("").optional(),
    }).optional(),
    impacts: joi_1.default.array()
        .items(joi_1.default.object({
        icon: joi_1.default.string().allow("").optional(),
        number: joi_1.default.string().allow("").optional(),
        title: joi_1.default.string().allow("").optional(),
        description: joi_1.default.string().allow("").optional(),
    }))
        .optional(),
    waysToSupport: joi_1.default.array()
        .items(joi_1.default.object({
        icon: joi_1.default.string().allow("").optional(),
        title: joi_1.default.string().allow("").optional(),
        description: joi_1.default.string().allow("").optional(),
        fullDescription: joi_1.default.string().allow("").optional(),
        benefits: joi_1.default.array().items(joi_1.default.string()).optional(),
    }))
        .optional(),
});
