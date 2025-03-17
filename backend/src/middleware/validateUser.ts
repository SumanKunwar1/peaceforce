import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../utils/HttpMessage";

// User validation middleware
export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.password && req.body.password.length < 6) {
    // Example of a password length check, you can customize it
    delete req.body.password;
  }

  const { error } = userValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationError = error.details.map((err) => err.message).join("---");
    next(httpMessages.BAD_REQUEST(validationError));
  }

  next();
};

// User validation schema using Joi
const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(), // Valid phone number regex
  role: Joi.string()
    .valid("user", "admin", "jobApplicator", "volunteer", "donator")
    .required(),
  password: Joi.string().min(6).optional().when("role", {
    is: "admin",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  address: Joi.string().allow("").optional(),
  page: Joi.string()
    .allow("")
    .optional()
    .when("role", {
      is: Joi.not("admin"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  pageTitle: Joi.string()
    .allow("")
    .optional()
    .when("role", {
      is: Joi.not("admin"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  cv: Joi.string().required().when("role", {
    is: "jobApplicator",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  coverLetter: Joi.string().optional(),
  jobPostId: Joi.string().optional().when("role", {
    is: "jobApplicator",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
