"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTour = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateTour = (req, res, next) => {
    if (req.body.image && req.body.image.startsWith("/api/image")) {
        delete req.body.image;
    }
    const { error } = tourValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details
            .map((err) => err.message)
            .join(" --- ");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateTour = validateTour;
const tourValidationSchema = joi_1.default.object({
    location: joi_1.default.string().allow("").optional(),
    title: joi_1.default.string().allow("").optional(),
    duration: joi_1.default.string().allow("").optional(),
    days: joi_1.default.number().integer().min(1).optional(),
    image: joi_1.default.string().allow("").optional(),
    startDate: joi_1.default.string().isoDate().allow("").optional(),
    status: joi_1.default.string()
        .valid("Upcoming", "Ongoing", "Completed", "Cancelled")
        .optional(),
    activities: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
    inclusions: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
    description: joi_1.default.string().allow("").optional(),
    highlights: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
    itinerary: joi_1.default.array()
        .items(joi_1.default.object({
        day: joi_1.default.number().integer().min(1).optional(),
        description: joi_1.default.string().allow("").optional(),
    }))
        .optional(),
    metaTitle: joi_1.default.string().allow("").optional(),
    metaDescription: joi_1.default.string().allow("").optional(),
    metaKeywords: joi_1.default.array().items(joi_1.default.string().allow("")).optional(),
});
