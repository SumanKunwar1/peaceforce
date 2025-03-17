import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

export const validateGallery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const { error } = galleryValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const galleryValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),

  events: Joi.object({
    title: Joi.string().allow("").optional(),
    description: Joi.string().allow("").optional(),
    date: Joi.date().optional(),
    coverImage: Joi.string().allow("").optional(),
    images: Joi.array().items(Joi.string().optional()).optional(),
  }).optional(),
});
