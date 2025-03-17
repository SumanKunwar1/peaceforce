"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const filePath_1 = require("@utils/filePath");
// Set up storage configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Set the destination folder for file uploads
        cb(null, filePath_1.uploadPath); // Change this path as needed
    },
    filename: (req, file, cb) => {
        // Generate the filename as original name + timestamp to avoid duplicates
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// Filter to accept only image files
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed!"));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 7 * 1024 * 1024, // 5 MB file size limit
    },
});
exports.default = upload;
