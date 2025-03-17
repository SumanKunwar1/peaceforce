"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const deleteFile_1 = require("@utils/deleteFile");
function handleError(err, req, res, next) {
    console.log(`Error while ✌ ${req.originalUrl} ✌`, err);
    // if (err instanceof multer.MulterError) {
    //   const message = err.field || "File upload error";
    //   // DeleteFileFromFiles(req);
    //   res.status(400).json({ error: message });
    //   return;
    // }
    if (req.fileToDelete && req.fileToDelete.length > 0) {
        req.fileToDelete.forEach((file) => {
            (0, deleteFile_1.deleteFile)(file); // Call deleteFile for each file in the array
        });
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ error: message });
}
