"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressImageMiddleware = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath_1 = require("@utils/filePath");
const deleteFile_1 = require("@utils/deleteFile");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const compressAndValidateImage = (filePath_2, compressedFilePath_1, imageType_1, fileSize_1, ...args_1) => __awaiter(void 0, [filePath_2, compressedFilePath_1, imageType_1, fileSize_1, ...args_1], void 0, function* (filePath, compressedFilePath, imageType, fileSize, retries = 1 // Number of retry attempts
) {
    try {
        const validFormats = {
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
                yield (0, sharp_1.default)(filePath)
                    .resize()
                    .toFormat(format, { quality: 50 })
                    .toFile(compressedFilePath);
                const compressedStats = fs_1.default.statSync(compressedFilePath);
                if (compressedStats.size > fileSize) {
                    throw new Error(`Compressed Image too large. Allowed Size: ${fileSize} -> fileSize: ${compressedStats.size}`);
                }
                return compressedFilePath;
            }
            catch (error) {
                if (attempt === retries) {
                    throw error;
                }
                console.warn(`Attempt ${attempt + 1} failed. Retrying in 3 seconds...`);
                yield delay(5000); // Wait for 3 seconds before retrying
            }
            attempt++;
        }
    }
    catch (error) {
        if (fs_1.default.existsSync(compressedFilePath)) {
            fs_1.default.unlinkSync(compressedFilePath);
        }
        console.error("Compression error:", error);
        throw error;
    }
});
/**
 * Middleware to compress an uploaded image.
 * @param imageName - The name of the image file.
 * @param fileSize - The maximum file size of the file after compression.
 */
const compressImageMiddleware = (imageName, fileSize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!imageName) {
            throw new Error("Image name is required");
        }
        const originalFilePath = path_1.default.join(filePath_1.uploadPath, imageName);
        const compressedFilePath = path_1.default.join(filePath_1.uploadPath, `compressed-${imageName}`);
        const imageType = path_1.default.extname(imageName);
        if (!fs_1.default.existsSync(originalFilePath)) {
            throw new Error("Image file not found");
        }
        const compressedPath = yield compressAndValidateImage(originalFilePath, compressedFilePath, imageType, fileSize);
        fs_1.default.renameSync(compressedPath, originalFilePath);
    }
    catch (error) {
        console.error("Middleware error:", error);
        (0, deleteFile_1.deleteFile)(path_1.default.join(filePath_1.uploadPath, imageName));
        throw error.message;
    }
});
exports.compressImageMiddleware = compressImageMiddleware;
