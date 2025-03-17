"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEvent = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateEvent = (req, res, next) => {
    if (req.body.image && req.body.image.startsWith("/api/image")) {
        delete req.body.image;
    }
    if (req.body.gallery !== undefined) {
        if (!req.body.gallery.every((file) => file.startsWith("/api/image/"))) {
            delete req.body.gallery;
        }
    }
    const { error } = eventValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateEvent = validateEvent;
const eventValidationSchema = joi_1.default.object({
    title: joi_1.default.string().allow("").optional(),
    shortDescription: joi_1.default.string().allow("").optional(),
    fullDescription: joi_1.default.string().allow("").optional(),
    date: joi_1.default.string().allow("").optional(),
    time: joi_1.default.string().allow("").optional(),
    image: joi_1.default.string().allow("").optional(),
    location: joi_1.default.string().allow("").optional(),
    venue: joi_1.default.string().allow("").optional(),
    artist: joi_1.default.string().allow("").optional(),
    ticketTypes: joi_1.default.array()
        .items(joi_1.default.object({
        type: joi_1.default.string().valid("VVIP", "VIP", "Regular").required(),
        price: joi_1.default.number().min(0).required(),
        benefits: joi_1.default.array().items(joi_1.default.string()).optional(),
        available: joi_1.default.number().min(0).required(),
    }))
        .optional(),
    gallery: joi_1.default.array().items(joi_1.default.string()).optional(),
    metaTitle: joi_1.default.string().allow("").optional(),
    metaDescription: joi_1.default.string().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
});
