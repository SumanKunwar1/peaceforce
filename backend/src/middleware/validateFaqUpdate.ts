import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";

export const validateFAQUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = faqUpdateValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const faqUpdateValidationSchema = Joi.object({
  question: Joi.string().optional().messages({
    "string.empty": "Question is required.",
  }),

  answer: Joi.string().optional().messages({
    "string.empty": "Answer is required.",
  }),

  category: Joi.string().allow("").optional(),

  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
  metaKeywords: Joi.array().items(Joi.string().allow("")).optional(),
});
