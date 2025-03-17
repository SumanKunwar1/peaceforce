import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

export const validateInfoSection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.image && req.body.image.startsWith("/api/image")) {
    delete req.body.image;
  }

  const { error } = infoSectionValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const infoSectionValidationSchema = Joi.object({
  location: Joi.string().optional().allow(""),
  email: Joi.string().optional().allow(""),
  phoneNumber: Joi.string().optional().allow(""),

  socialLinks: Joi.object({
    instagram: Joi.string().optional().allow(""),
    facebook: Joi.string().optional().allow(""),
    twitter: Joi.string().optional().allow(""),
    linkedin: Joi.string().optional().allow(""),
    youtube: Joi.string().optional().allow(""),
  }).optional(),
});
