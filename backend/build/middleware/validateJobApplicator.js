"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJobApplicator = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpMessage_1 = require("@src/utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
const validateJobApplicator = (req, res, next) => {
    const { error, value } = jobApplicatorValidationSchema.validate(req.body, {
        abortEarly: false, // Show all validation errors
    });
    if (error) {
        const validationError = error.details.map((err) => err.message).join("---");
        return next(HttpMessage_1.httpMessages.BAD_REQUEST(validationError));
    }
    req.body = value;
    next(); // Proceed if validation passes
};
exports.validateJobApplicator = validateJobApplicator;
const jobApplicatorValidationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(), // name is required
    email: joi_1.default.string().email().required(), // email is required
    phoneNumber: joi_1.default.string().required(), // phoneNumber is required
    page: joi_1.default.string().required(),
    pageTitle: joi_1.default.string().required(),
    cv: joi_1.default.string().trim().required(), // cv is required
    coverLetter: joi_1.default.string().trim().allow("").optional(),
    jobPostId: joi_1.default.string()
        .custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .required(),
    role: joi_1.default.string()
        .valid("jobApplicator") // role must be "jobApplicator" if present
        .default("jobApplicator"), // If role is not provided, default to "jobApplicator"
});
