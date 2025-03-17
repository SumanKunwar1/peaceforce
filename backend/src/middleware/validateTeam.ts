import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

export const validateTeam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.image && req.body.image.startsWith("/api/image")) {
    delete req.body.image;
  }

  const { error } = teamValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const teamValidationSchema = Joi.object({
  name: Joi.string().optional().allow(""),
  role: Joi.string().optional().allow(""),
  image: Joi.string().optional().allow(""),
  bio: Joi.string().optional().allow(""),

  socialLinks: Joi.object({
    instagram: Joi.string().optional().allow(""),
    facebook: Joi.string().optional().allow(""),
    twitter: Joi.string().optional().allow(""),
    linkedin: Joi.string().optional().allow(""),
  }).optional(),

  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().allow("")).optional(),
});
