import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

// Slider validation middleware
export const validateSlider = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.image && req.body.image.startsWith("/api/image")) {
    delete req.body.image; // Remove image from the body
  }
  const { error } = sliderValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const sliderValidationSchema = Joi.object({
  title: Joi.string().allow("").optional(),
  description: Joi.string().allow("").optional(),
  isVisible: Joi.boolean().optional(),
  image: Joi.string().allow("").optional(),
  buttons: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required(),
        link: Joi.string().required(),
        bgColor: Joi.string().required(),
      })
    )
    .optional(),
});
