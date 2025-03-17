import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

export const validateSupport = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.hero?.image && req.body.hero.image.startsWith("/api/image")) {
    delete req.body.hero.image; // Remove hero image from the body if it's an API reference
  }

  const { error } = supportValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const supportValidationSchema = Joi.object({
  hero: Joi.object({
    title: Joi.string().allow("").optional(),
    subtitle: Joi.string().allow("").optional(),
    image: Joi.string().allow("").optional(),
  }).optional(),

  impacts: Joi.array()
    .items(
      Joi.object({
        icon: Joi.string().allow("").optional(),
        number: Joi.string().allow("").optional(),
        title: Joi.string().allow("").optional(),
        description: Joi.string().allow("").optional(),
      })
    )
    .optional(),

  waysToSupport: Joi.array()
    .items(
      Joi.object({
        icon: Joi.string().allow("").optional(),
        title: Joi.string().allow("").optional(),
        description: Joi.string().allow("").optional(),
        fullDescription: Joi.string().allow("").optional(),
        benefits: Joi.array().items(Joi.string()).optional(),
      })
    )
    .optional(),
});
