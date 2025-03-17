import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

const pageValidationSchema = Joi.object({
  title: Joi.string().trim().optional(),
  slug: Joi.string().trim().optional(),
  location: Joi.string().valid("header", "footer").optional(),
  parentPage: Joi.string().trim().optional(),
  content: Joi.string().trim().optional(),
  status: Joi.string().valid("draft", "published").optional(),
  metaTitle: Joi.string().trim().optional(),
  metaKeywords: Joi.string().trim().optional(),
  metaDescription: Joi.string().trim().optional(),
});

export const validatePageUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = pageValidationSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};
