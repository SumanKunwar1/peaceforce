import sharp, { FormatEnum } from "sharp";
import fs from "fs";
import path from "path";
import { uploadPath } from "@utils/filePath";
import { deleteFile } from "@utils/deleteFile";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const compressAndValidateImage = async (
  filePath: string,
  compressedFilePath: string,
  imageType: string,
  fileSize: number,
  retries = 1 // Number of retry attempts
) => {
  try {
    const validFormats: Record<string, keyof FormatEnum> = {
      ".jpeg": "jpeg",
      ".jpg": "jpeg",
      ".png": "png",
      ".webp": "webp",
      ".tiff": "tiff",
      ".avif": "avif",
      ".heif": "heif",
    };

    const format = validFormats[imageType.toLowerCase()];
    if (!format) {
      throw new Error(`Unsupported image type: ${imageType}`);
    }

    let attempt = 0;
    while (attempt <= retries) {
      try {
        await sharp(filePath)
          .resize()
          .toFormat(format, { quality: 50 })
          .toFile(compressedFilePath);

        const compressedStats = fs.statSync(compressedFilePath);

        if (compressedStats.size > fileSize) {
          throw new Error(
            `Compressed Image too large. Allowed Size: ${fileSize} -> fileSize: ${compressedStats.size}`
          );
        }

        return compressedFilePath;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        console.warn(`Attempt ${attempt + 1} failed. Retrying in 3 seconds...`);
        await delay(5000); // Wait for 3 seconds before retrying
      }
      attempt++;
    }
  } catch (error) {
    if (fs.existsSync(compressedFilePath)) {
      fs.unlinkSync(compressedFilePath);
    }
    console.error("Compression error:", error);
    throw error;
  }
};

/**
 * Middleware to compress an uploaded image.
 * @param imageName - The name of the image file.
 * @param fileSize - The maximum file size of the file after compression.
 */
export const compressImageMiddleware = async (
  imageName: string,
  fileSize: number
) => {
  try {
    if (!imageName) {
      throw new Error("Image name is required");
    }

    const originalFilePath = path.join(uploadPath, imageName);
    const compressedFilePath = path.join(uploadPath, `compressed-${imageName}`);
    const imageType = path.extname(imageName);

    if (!fs.existsSync(originalFilePath)) {
      throw new Error("Image file not found");
    }

    const compressedPath = await compressAndValidateImage(
      originalFilePath,
      compressedFilePath,
      imageType,
      fileSize
    );

    fs.renameSync(compressedPath!, originalFilePath);
  } catch (error: any) {
    console.error("Middleware error:", error);
    deleteFile(path.join(uploadPath, imageName));
    throw error.message;
  }
};
