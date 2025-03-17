"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
// User validation middleware
const validateUser = (req, res, next) => {
    if (req.body.password && req.body.password.length < 6) {
        // Example of a password length check, you can customize it
        delete req.body.password;
    }
    const { error } = userValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    next();
};
exports.validateUser = validateUser;
// User validation schema using Joi
const userValidationSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(50).required(),
    email: joi_1.default.string().email().required(),
    phoneNumber: joi_1.default.string().required(), // Valid phone number regex
    role: joi_1.default.string()
        .valid("user", "admin", "jobApplicator", "volunteer", "donator")
        .required(),
    password: joi_1.default.string().min(6).optional().when("role", {
        is: "admin",
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    address: joi_1.default.string().allow("").optional(),
    page: joi_1.default.string()
        .allow("")
        .optional()
        .when("role", {
        is: joi_1.default.not("admin"),
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    pageTitle: joi_1.default.string()
        .allow("")
        .optional()
        .when("role", {
        is: joi_1.default.not("admin"),
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    cv: joi_1.default.string().required().when("role", {
        is: "jobApplicator",
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    coverLetter: joi_1.default.string().optional(),
    jobPostId: joi_1.default.string().optional().when("role", {
        is: "jobApplicator",
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
});
