import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";

export const validateBookingUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = bookingUpdateValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const bookingUpdateValidationSchema = Joi.object({
  tourId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional(),
  participants: Joi.number().min(1).optional(),
  specialRequests: Joi.string().allow("").optional(),
});
