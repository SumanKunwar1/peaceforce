import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

// Reusable content schema
const contentSchema = Joi.object({
  title: Joi.string().min(3).allow("").optional(),
  description: Joi.string().allow("").optional(),
  icon: Joi.string().allow("").optional(),
});

// Schema for aboutHero content (no icon field)
const aboutHeroSchema = Joi.object({
  title: Joi.string().min(3).allow("").optional(),
  description: Joi.string().allow("").optional(),
});

export const validateAbout = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.image && req.body.image.startsWith("/api/image")) {
    delete req.body.image;
  }
  const { error } = aboutValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const aboutValidationSchema = Joi.object({
  image: Joi.string().optional(),
  aboutHero: aboutHeroSchema.optional(), // No icon for aboutHero
  aboutContent: Joi.array().items(contentSchema).optional(),
  missionsSection: Joi.array().items(contentSchema).optional(),
  servicesSection: Joi.array().items(contentSchema).optional(),
  visionSection: Joi.array().items(contentSchema).optional(),
});
