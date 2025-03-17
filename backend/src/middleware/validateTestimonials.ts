import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@utils/HttpMessage";

export const validateTestimonial = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = testimonialValidationSchema.validate(req.body, {
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

const testimonialValidationSchema = Joi.object({
  quote: Joi.string().allow("").optional(),
  author: Joi.string().allow("").optional(),
  role: Joi.string().allow("").optional(),
});
