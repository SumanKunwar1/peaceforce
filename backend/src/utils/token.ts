import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env";

export const GenerateAuthtoken = (email: string): string => {
  return jwt.sign({ email }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
