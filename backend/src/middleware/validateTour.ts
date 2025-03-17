import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

export const validateTour = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.image && req.body.image.startsWith("/api/image")) {
    delete req.body.image;
  }
  const { error } = tourValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details
      .map((err) => err.message)
      .join(" --- ");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const tourValidationSchema = Joi.object({
  location: Joi.string().allow("").optional(),

  title: Joi.string().allow("").optional(),

  duration: Joi.string().allow("").optional(),

  days: Joi.number().integer().min(1).optional(),

  image: Joi.string().allow("").optional(),

  startDate: Joi.string().isoDate().allow("").optional(),

  status: Joi.string()
    .valid("Upcoming", "Ongoing", "Completed", "Cancelled")
    .optional(),

  activities: Joi.array().items(Joi.string().allow("")).optional(),

  inclusions: Joi.array().items(Joi.string().allow("")).optional(),

  description: Joi.string().allow("").optional(),

  highlights: Joi.array().items(Joi.string().allow("")).optional(),

  itinerary: Joi.array()
    .items(
      Joi.object({
        day: Joi.number().integer().min(1).optional(),
        description: Joi.string().allow("").optional(),
      })
    )
    .optional(),

  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().allow("")).optional(),
});
