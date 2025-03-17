import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";

// Middleware to validate event booking updates
export const validateEventBookingUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = eventBookingUpdateSchema.validate(req.body, {
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

// Joi validation schema for IBookingFormUpdate
const eventBookingUpdateSchema = Joi.object({
  eventId: Joi.string(),

  quantity: Joi.number().integer().min(1).optional().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "number.integer": "Quantity must be an integer",
  }),

  specialRequirements: Joi.string().optional(),
});
