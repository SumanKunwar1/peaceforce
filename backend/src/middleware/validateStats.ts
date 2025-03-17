import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

export const validateStats = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate using Joi schema
  const { error } = statsValidationSchema.validate(req.body, {
    abortEarly: false, // to get all the validation errors at once
  });

  // If there's a validation error, return it
  if (error) {
    const validationError = error.details
      .map((err) => err.message)
      .join(" --- ");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next(); // Proceed to next middleware or route handler
};

// Validation schema using Joi
const statsValidationSchema = Joi.object({
  icon: Joi.string().allow("").optional(), // optional string
  endValue: Joi.number().allow("").optional(), // optional number
  label: Joi.string().allow("").optional(), // optional string
  description: Joi.string().allow("").optional(), // optional string
});
