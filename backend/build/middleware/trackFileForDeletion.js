"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackFilesForDeletion = void 0;
const trackFilesForDeletion = (fieldMappings) => {
    return (req, res, next) => {
        const files = req.files;
        req.fileToDelete = req.fileToDelete || []; // Initialize if not exists
        fieldMappings.forEach(({ fileField }) => {
            const uploadedFiles = files === null || files === void 0 ? void 0 : files[fileField];
            if (uploadedFiles &&
                Array.isArray(uploadedFiles) &&
                uploadedFiles.length > 0) {
                uploadedFiles.forEach((file) => {
                    req.fileToDelete.push(file.filename); // Track each file in the array
                });
            }
        });
        next();
    };
};
exports.trackFilesForDeletion = trackFilesForDeletion;
