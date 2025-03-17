"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProgram = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
// Program validation middleware
const validateProgram = (req, res, next) => {
    if (req.body.image && req.body.image.startsWith("/api/image")) {
        delete req.body.image;
    }
    if (req.body.gallery !== undefined) {
        if (!req.body.gallery.every((file) => file.startsWith("/api/image/"))) {
            delete req.body.gallery;
        }
    }
    const { error } = programValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateProgram = validateProgram;
// Program validation schema using Joi
const programValidationSchema = joi_1.default.object({
    title: joi_1.default.string().allow("").optional(),
    shortDescription: joi_1.default.string().allow("").optional(),
    fullDescription: joi_1.default.string().allow("").optional(),
    startDate: joi_1.default.string().optional(),
    endDate: joi_1.default.string().optional(), // endDate is required
    time: joi_1.default.string().allow("").optional(),
    venue: joi_1.default.string().allow("").optional(),
    location: joi_1.default.string().allow("").optional(),
    capacity: joi_1.default.number().min(0).optional(), // capacity is optional, but it must be a positive number
    instructor: joi_1.default.string().allow("").optional(),
    schedule: joi_1.default.string().allow("").optional(),
    requirements: joi_1.default.array().items(joi_1.default.string()).optional(),
    image: joi_1.default.string().optional(),
    gallery: joi_1.default.array().items(joi_1.default.string()).optional(), // array of image URLs or paths
    programGoals: joi_1.default.array().items(joi_1.default.string()).optional(),
    ticketTypes: joi_1.default.string().optional(),
    metaTitle: joi_1.default.string().allow("").optional(),
    metaDescription: joi_1.default.string().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
});
