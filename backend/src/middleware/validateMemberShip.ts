import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@utils/HttpMessage";

export const validateMembership = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = membershipValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const membershipValidationSchema = Joi.object({
  name: Joi.string().optional(),
  duration: Joi.string().optional(),
  fee: Joi.number().optional(),
  benefits: Joi.array().items(Joi.string()).optional(),
  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().allow("")).optional(),
});
