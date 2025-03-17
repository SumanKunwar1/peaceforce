import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { httpMessages } from "../utils/HttpMessage";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw httpMessages.UNAUTHORIZED_NO_TOKEN;
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "null") {
    throw httpMessages.UNAUTHORIZED_INVALID_TOKEN;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    next();
  } catch (error) {
    next(error);
  }
};
