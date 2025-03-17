import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";

export const validateEnrollmentForm = (
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
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().optional(),
  page: Joi.string().required(),
  pageTitle: Joi.string().required(),

  preferredLanguage: Joi.string().required(),
  message: Joi.string().optional(),

  courseId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required(),
});
