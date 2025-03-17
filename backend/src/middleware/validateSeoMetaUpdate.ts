import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

export const validateSeoMetaUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = seoMetaValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const seoMetaValidationSchema = Joi.object({
  pageTitle: Joi.string().trim().optional(),
  metaTitle: Joi.string().trim().allow("").optional(),
  metaDescription: Joi.string().trim().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().trim().allow("")).optional(),
  canonicalUrl: Joi.string().uri().allow("").optional(),
  robotsMeta: Joi.string()
    .valid(
      "index, follow",
      "noindex, follow",
      "index, nofollow",
      "noindex, nofollow"
    )
    .allow("")
    .optional(),

  ogTitle: Joi.string().trim().allow("").optional(),
  ogDescription: Joi.string().trim().allow("").optional(),
  ogImage: Joi.string().uri().allow("").optional(),
});
