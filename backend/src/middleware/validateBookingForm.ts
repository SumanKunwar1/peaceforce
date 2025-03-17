import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";
import mongoose from "mongoose";

export const validateBookingForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = bookingValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const bookingValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  page: Joi.string().required(),
  pageTitle: Joi.string().required(),
  participants: Joi.number().min(1).required(),
  specialRequests: Joi.string().allow("").optional(),
  tourId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required(),
});
