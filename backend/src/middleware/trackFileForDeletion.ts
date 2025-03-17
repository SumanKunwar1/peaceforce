import { Request, Response, NextFunction } from "express";

export const trackFilesForDeletion = (
  fieldMappings: { fileField: string }[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [key: string]: Express.Multer.File[] };

    req.fileToDelete = req.fileToDelete || []; // Initialize if not exists

    fieldMappings.forEach(({ fileField }) => {
      const uploadedFiles = files?.[fileField];

      if (
        uploadedFiles &&
        Array.isArray(uploadedFiles) &&
        uploadedFiles.length > 0
      ) {
        uploadedFiles.forEach((file) => {
          req.fileToDelete!.push(file.filename); // Track each file in the array
        });
      }
    });

    next();
  };
};
