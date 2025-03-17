import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

// Slug regex: Only allows lowercase letters, numbers, and hyphens (-), no spaces or special characters
const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const pageValidationSchema = Joi.object({
  title: Joi.string().trim().required(),
  slug: Joi.string().trim().pattern(slugRegex).required().messages({
    "string.pattern.base":
      "Slug can only contain lowercase letters, numbers, and hyphens (-). No spaces or special characters allowed.",
  }),
  location: Joi.string().valid("header", "footer").required(),
  parentPage: Joi.string().trim().optional(),
  content: Joi.string().trim().required(),
  status: Joi.string().valid("draft", "published").required(),
  metaTitle: Joi.string().trim().optional(),
  metaKeywords: Joi.string().trim().optional(),
  metaDescription: Joi.string().trim().optional(),
});

export const validatePage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = pageValidationSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const validationError = error.details
      .map((err) => err.message)
      .join(" --- ");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};
