import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

export const validateGalleryEventInsert = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.events !== undefined) {
    if (
      req.body.events.coverImage &&
      req.body.events.coverImage.startsWith("/api/image")
    ) {
      delete req.body.events.coverImage;
    }
  }

  // Validate the request body using Joi schema
  const { error } = galleryValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    // Format validation errors and return them as a bad request response
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  // If validation passes, move to the next middleware or handler
  next();
};

const galleryValidationSchema = Joi.object({
  events: Joi.object({
    title: Joi.string().allow("").optional(), // Optional title with empty string allowed
    description: Joi.string().allow("").optional(), // Optional description with empty string allowed
    date: Joi.date().optional(), // Optional date field
    coverImage: Joi.string().allow("").optional(), // Optional coverImage (can be empty string)
  }).required(),
});
