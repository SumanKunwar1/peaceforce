import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";

export const validateEnrollmentUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = enrollmentValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next(); // Proceed if validation passes
};

const enrollmentValidationSchema = Joi.object({
  preferredLanguage: Joi.string().optional(),
  message: Joi.string().optional(),

  courseId: Joi.string()
    .custom((value, helpers) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional(), // categoryId is optional, but courseId is required if it's provided
});
