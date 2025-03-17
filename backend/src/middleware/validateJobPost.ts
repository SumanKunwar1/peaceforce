import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

export const validateJobPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = jobPostValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next(); // Proceed if validation passes
};

const jobPostValidationSchema = Joi.object({
  title: Joi.string().trim().allow("").optional(), // Optional but must be valid if present
  department: Joi.string().trim().allow("").optional(),
  location: Joi.string().trim().allow("").optional(),

  type: Joi.string()
    .valid("Full-time", "Part-time", "Contract")
    .allow("")
    .optional(), // Must be one of these values

  description: Joi.string().trim().allow("").optional(), // Allows empty but must be valid if provided

  requirements: Joi.array().items(Joi.string().trim().allow("")).optional(), // Array of requirement strings

  responsibilities: Joi.array().items(Joi.string().trim().allow("")).optional(), // Array of responsibilities

  benefits: Joi.array().items(Joi.string().trim().allow("")).optional(), // Array of benefits

  postedDate: Joi.string().trim().isoDate().allow("").optional(), // Optional ISO date

  deadline: Joi.string().trim().isoDate().allow("").optional(), // Optional ISO date

  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().allow("")).optional(),
});
