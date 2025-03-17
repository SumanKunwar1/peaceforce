import fs from "fs";
import path from "path";
import { uploadPath } from "./filePath";

/**
 * Utility to delete an image by filename.
 * @param fileName - The name of the file to be deleted.
 */
export const deleteFile = async (fileName: string): Promise<void> => {
  try {
    const filePath = path.join(uploadPath, fileName); // Resolve the full file path

    // Check if the file exists before attempting to delete
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath); // Delete the file
    }
  } catch (error) {
    console.log(error);
  }
};
