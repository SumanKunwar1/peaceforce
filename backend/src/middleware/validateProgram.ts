import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

// Program validation middleware
export const validateProgram = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.image && req.body.image.startsWith("/api/image")) {
    delete req.body.image;
  }
  if (req.body.gallery !== undefined) {
    if (
      !req.body.gallery.every((file: string) => file.startsWith("/api/image/"))
    ) {
      delete req.body.gallery;
    }
  }
  const { error } = programValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

// Program validation schema using Joi
const programValidationSchema = Joi.object({
  title: Joi.string().allow("").optional(),
  shortDescription: Joi.string().allow("").optional(),
  fullDescription: Joi.string().allow("").optional(),

  startDate: Joi.string().optional(),
  endDate: Joi.string().optional(), // endDate is required

  time: Joi.string().allow("").optional(),
  venue: Joi.string().allow("").optional(),
  location: Joi.string().allow("").optional(),

  capacity: Joi.number().min(0).optional(), // capacity is optional, but it must be a positive number
  instructor: Joi.string().allow("").optional(),
  schedule: Joi.string().allow("").optional(),
  requirements: Joi.array().items(Joi.string()).optional(),
  image: Joi.string().optional(),
  gallery: Joi.array().items(Joi.string()).optional(), // array of image URLs or paths

  programGoals: Joi.array().items(Joi.string()).optional(),

  ticketTypes: Joi.string().optional(),

  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().allow("")).optional(),
});
