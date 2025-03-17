import { DOMAIN_NAME } from "./env";

export const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: DOMAIN_NAME,
        methods: ["GET", "POST", "PUT", "DELETE"],
      }
    : {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
      };
