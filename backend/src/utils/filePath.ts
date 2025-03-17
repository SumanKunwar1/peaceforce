import path from "path";
import fs from "fs";
import { UPLOAD_FOLDER } from "../config/env";

// Resolve the absolute upload path dynamically
export const uploadPath = path.join(__dirname, "../../../", UPLOAD_FOLDER);

// Ensure the upload folder exists, create it if not
export const ensureUploadFolderExists = async () => {
  try {
    await fs.promises.access(uploadPath, fs.constants.F_OK);
    console.log("Upload folder already exists");
  } catch {
    await fs.promises.mkdir(uploadPath, { recursive: true });
    console.log("Upload folder created successfully");
  }
};
