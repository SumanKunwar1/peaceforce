import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

export const validateBlogPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.image && req.body.image.startsWith("/api/image")) {
    delete req.body.image;
  }
  const { error } = blogPostValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors, not just the first one
  });
  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    next(httpMessages.BAD_REQUEST(validationError));
  }

  next(); // Proceed if validation passes
};

const blogPostValidationSchema = Joi.object({
  isEditable: Joi.boolean().optional(),

  title: Joi.string().allow("").optional(), // Required, min length 3, max 255
  excerpt: Joi.string().allow("").optional(), // Allows empty string
  content: Joi.string().optional(), // Required, at least 10 characters

  author: Joi.object({
    name: Joi.string().min(2).allow("").optional(), // Allows empty string
    avatar: Joi.string().allow("").optional(), // Allows empty string
    role: Joi.string().max(50).allow("").optional(), // Allows empty string
  }).optional(),

  image: Joi.string().allow("").optional(), // Allows empty string

  category: Joi.string().allow("").optional(), // Allows empty string

  tags: Joi.array().items(Joi.string().allow("")).optional(), // Array of strings, allows empty string in array

  readTime: Joi.number().integer().optional(), // Optional, minimum 1 minute read

  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().allow("")).optional(),
});
