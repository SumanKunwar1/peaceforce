import dotenv from "dotenv";
dotenv.config();

export const PORT: number = parseInt(process.env.PORT || "4000", 10);
if (isNaN(PORT)) {
  throw new Error("Invalid or missing PORT environment variable");
}

export const MONGO_URI: string = process.env.MONGO_URI!;
if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI environment variable");
}

export const NODE_ENV: string = process.env.NODE_ENV || "development";

export const DOMAIN_NAME: string = process.env.DOMAIN_NAME!;

export const JWT_EXPIRES_IN: number = parseInt(process.env.JWT_EXPIRES_IN!);

export const JWT_SECRET: string = process.env.JWT_SECRET!;

export const UPLOAD_FOLDER: string = process.env.UPLOAD_FOLDER!;

export const ADMIN_EMAIL: string = process.env.ADMIN_EMAIL!;

export const MAX_IMAGE_SIZE: number = process.env.MAX_IMAGE_SIZE
  ? parseInt(process.env.MAX_IMAGE_SIZE)
  : 1048576;

export const MAX_SLIDER_SIZE: number = process.env.MAX_SLIDER_SIZE
  ? parseInt(process.env.MAX_SLIDER_SIZE)
  : 2097152;

export const BREVO_API_KEY: string = process.env.BREVO_API_KEY!;
