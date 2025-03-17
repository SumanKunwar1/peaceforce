import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "@src/utils/HttpMessage";
import mongoose from "mongoose";

export const validateJobApplicator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = jobApplicatorValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    return next(httpMessages.BAD_REQUEST(validationError));
  }
  req.body = value;
  next(); // Proceed if validation passes
};

const jobApplicatorValidationSchema = Joi.object({
  name: Joi.string().trim().required(), // name is required

  email: Joi.string().email().required(), // email is required

  phoneNumber: Joi.string().required(), // phoneNumber is required
  page: Joi.string().required(),
  pageTitle: Joi.string().required(),

  cv: Joi.string().trim().required(), // cv is required

  coverLetter: Joi.string().trim().allow("").optional(),

  jobPostId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required(),

  role: Joi.string()
    .valid("jobApplicator") // role must be "jobApplicator" if present
    .default("jobApplicator"), // If role is not provided, default to "jobApplicator"
});
