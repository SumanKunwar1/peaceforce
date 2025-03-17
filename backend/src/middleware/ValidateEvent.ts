import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

export const validateEvent = (
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
  const { error } = eventValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const eventValidationSchema = Joi.object({
  title: Joi.string().allow("").optional(),
  shortDescription: Joi.string().allow("").optional(),
  fullDescription: Joi.string().allow("").optional(),

  date: Joi.string().allow("").optional(),
  time: Joi.string().allow("").optional(),

  image: Joi.string().allow("").optional(),

  location: Joi.string().allow("").optional(),
  venue: Joi.string().allow("").optional(),

  artist: Joi.string().allow("").optional(),

  ticketTypes: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid("VVIP", "VIP", "Regular").required(),
        price: Joi.number().min(0).required(),
        benefits: Joi.array().items(Joi.string()).optional(),
        available: Joi.number().min(0).required(),
      })
    )
    .optional(),

  gallery: Joi.array().items(Joi.string()).optional(),

  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().allow("")).optional(),
});
