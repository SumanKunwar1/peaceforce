import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";

export const validateBookMembership = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = bookMembershipValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

const bookMembershipValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  page: Joi.string().required(),
  pageTitle: Joi.string().required(),
  image: Joi.string().required(),

  membershipId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required(),

  amount: Joi.number().min(0).required(),

  paymentMethod: Joi.string().valid("bank", "esewa", "khalti").required(),
  paymentScreenshot: Joi.string().required(),

  mailingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});
