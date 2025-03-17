"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSlider = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
// Slider validation middleware
const validateSlider = (req, res, next) => {
    if (req.body.image && req.body.image.startsWith("/api/image")) {
        delete req.body.image; // Remove image from the body
    }
    const { error } = sliderValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateSlider = validateSlider;
const sliderValidationSchema = joi_1.default.object({
    title: joi_1.default.string().allow("").optional(),
    description: joi_1.default.string().allow("").optional(),
    isVisible: joi_1.default.boolean().optional(),
    image: joi_1.default.string().allow("").optional(),
    buttons: joi_1.default.array()
        .items(joi_1.default.object({
        text: joi_1.default.string().required(),
        link: joi_1.default.string().required(),
        bgColor: joi_1.default.string().required(),
    }))
        .optional(),
});
