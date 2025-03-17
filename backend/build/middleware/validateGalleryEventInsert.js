"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGalleryEventInsert = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const validateGalleryEventInsert = (req, res, next) => {
    if (req.body.events !== undefined) {
        if (req.body.events.coverImage &&
            req.body.events.coverImage.startsWith("/api/image")) {
            delete req.body.events.coverImage;
        }
    }
    // Validate the request body using Joi schema
    const { error } = galleryValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        // Format validation errors and return them as a bad request response
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    // If validation passes, move to the next middleware or handler
    next();
};
exports.validateGalleryEventInsert = validateGalleryEventInsert;
const galleryValidationSchema = joi_1.default.object({
    events: joi_1.default.object({
        title: joi_1.default.string().allow("").optional(), // Optional title with empty string allowed
        description: joi_1.default.string().allow("").optional(), // Optional description with empty string allowed
        date: joi_1.default.date().optional(), // Optional date field
        coverImage: joi_1.default.string().allow("").optional(), // Optional coverImage (can be empty string)
    }).required(),
});
