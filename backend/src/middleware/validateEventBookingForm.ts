import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";

// Middleware to validate event booking form input
export const validateEventBookingForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = eventBookingValidationSchema.validate(req.body, {
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

// Joi validation schema for IBookEventFormInput
const eventBookingValidationSchema = Joi.object({
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

  eventId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "Invalid eventId format",
      "string.empty": "Event ID is required",
    }),

  ticketType: Joi.string().valid("VVIP", "VIP", "Regular").required().messages({
    "any.only": "Ticket type must be one of: VVIP, VIP, Regular",
    "string.empty": "Ticket type is required",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "number.integer": "Quantity must be an integer",
  }),

  specialRequirements: Joi.string().optional(),
});
