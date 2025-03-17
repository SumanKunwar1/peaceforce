import fs from "fs";
import path from "path";
import { uploadPath } from "./filePath";

/**
 * Utility to save an uploaded file stream.
 * @param createReadStream - Function that creates a file stream.
 * @param filename - Original filename of the uploaded file.
 * @returns The saved file name.
 */
export const saveFile = async (
  createReadStream: Function,
  filename: string
): Promise<string> => {
  try {
    const filePath = path.join(uploadPath, filename);
    const stream = createReadStream();
    const writeStream = fs.createWriteStream(filePath);

    // Pipe the uploaded file to disk
    await new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      stream.on("end", resolve);
      stream.on("error", reject);
    });

    return filename; // Return saved file name
  } catch (error) {
    throw new Error(`Error saving file: ${error}`);
  }
};

/**
 * Utility to save base64 image string to a file.
 * @param base64Image - The base64 string of the image.
 * @returns The file name of the saved image.
 */
export const saveBase64Image = async (base64Image: string): Promise<string> => {
  try {
    // Extract the image format and the base64 data
    const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches) {
      throw new Error("Invalid base64 string");
    }

    const type = matches[1];
    const data = matches[2];

    // Generate a unique filename for the image (using timestamp + extension)
    const extension = type.split("/")[1]; // Get the file extension (e.g., 'png', 'jpeg')
    const fileName = `${Date.now()}.${extension}`; // Correcting extra brace error
    const filePath = path.join(uploadPath, fileName); // Full path to save the image

    // Decode the base64 string and write it to the file
    const buffer = Buffer.from(data, "base64");
    await fs.promises.writeFile(filePath, buffer);

    // Return only the file name (relative to the upload folder)
    return fileName;
  } catch (error: any) {
    throw new Error(`Error saving the image: ${error.message}`);
  }
};
