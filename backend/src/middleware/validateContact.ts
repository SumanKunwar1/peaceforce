import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

export const validateContact = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = contactValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const contactValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  page: Joi.string().required(),
  pageTitle: Joi.string().required(),
  message: Joi.string().allow("").optional(),
});
