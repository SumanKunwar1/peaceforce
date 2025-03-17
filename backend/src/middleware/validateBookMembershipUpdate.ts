import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";

export const validateBookMembershipUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.image && req.body.image.startsWith("/api/image")) {
    delete req.body.image;
  }
  if (
    req.body.paymentScreenshot &&
    req.body.paymentScreenshot.startsWith("/api/image")
  ) {
    delete req.body.paymentScreenshot;
  }
  const { error } = bookMembershipUpdateValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const bookMembershipUpdateValidationSchema = Joi.object({
  membershipId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional(),

  amount: Joi.number().min(0).optional(),
  paymentScreenshot: Joi.string().optional(),
  image: Joi.string().optional(),

  paymentMethod: Joi.string().valid("bank", "esewa", "khalti").optional(),

  mailingAddress: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    country: Joi.string().optional(),
  }).optional(),
});
