import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

export const validateCourseCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.image && req.body.image.startsWith("/api/image")) {
    delete req.body.image;
  }

  if (
    req.body.instructor.image &&
    req.body.instructor.image.startsWith("/api/image")
  ) {
    delete req.body.instructor.image;
  }
  const { error } = courseCategoryValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const courseCategoryValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  image: Joi.string().allow("").optional(),
  duration: Joi.string().allow("").optional(),
  language: Joi.array().items(Joi.string().optional()).optional(),
  highlights: Joi.array().items(Joi.string().optional()).optional(),
  materials: Joi.array().items(Joi.string().optional()).optional(),
  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().allow("")).optional(),

  instructor: Joi.object({
    name: Joi.string().min(2).max(100).allow("").optional(),
    title: Joi.string().max(100).allow("").optional(),
    bio: Joi.string().max(1000).allow("").optional(),
    image: Joi.string().allow("").optional(),
  }).optional(),
});
