import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@utils/HttpMessage";
import mongoose from "mongoose";

export const validateProgramBookingUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = programBookingUpdateSchema.validate(req.body, {
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

const programBookingUpdateSchema = Joi.object({
  programId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional()
    .messages({
      "any.invalid": "Invalid programId format",
    }),

  participants: Joi.number().integer().min(1).optional().messages({
    "number.base": "Participants must be a number",
    "number.min": "Participants must be at least 1",
    "number.integer": "Participants must be an integer",
  }),

  specialRequirements: Joi.string().optional(),
});
