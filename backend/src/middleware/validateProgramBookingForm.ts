import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";

// Middleware to validate program booking form input
export const validateProgramBookingForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = programBookingValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details
      .map((err) => err.message)
      .join(" --- ");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

// Joi validation schema for IBookProgramFormInput
const programBookingValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),

  phoneNumber: Joi.string().trim().required().messages({
    "string.empty": "Phone number is required",
  }),

  page: Joi.string().trim().required().messages({
    "string.empty": "Page is required",
  }),

  pageTitle: Joi.string().trim().required().messages({
    "string.empty": "Page title is required",
  }),

  programId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "Invalid programId format",
      "string.empty": "Program ID is required",
    }),

  participants: Joi.number().integer().min(1).required().messages({
    "number.base": "Participants must be a number",
    "number.min": "Participants must be at least 1",
    "number.integer": "Participants must be an integer",
  }),

  specialRequirements: Joi.string().optional(),
});
