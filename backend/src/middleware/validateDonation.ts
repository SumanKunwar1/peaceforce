import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";
import mongoose from "mongoose";

// Middleware to validate program booking form input
export const validateDonation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = donationValidationSchema.validate(req.body, {
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

const donationValidationSchema = Joi.object({
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

  amount: Joi.number().integer().min(0).required().messages({
    "number.base": "Participants must be a number",
    "number.min": "Participants must be at least 0",
    "number.integer": "Participants must be an integer",
  }),
  screenshot: Joi.string().trim().required().messages({
    "string.empty": "screenshot is required",
  }),
});
