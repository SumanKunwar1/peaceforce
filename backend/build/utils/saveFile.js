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
exports.saveBase64Image = exports.saveFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath_1 = require("./filePath");
/**
 * Utility to save an uploaded file stream.
 * @param createReadStream - Function that creates a file stream.
 * @param filename - Original filename of the uploaded file.
 * @returns The saved file name.
 */
const saveFile = (createReadStream, filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(filePath_1.uploadPath, filename);
        const stream = createReadStream();
        const writeStream = fs_1.default.createWriteStream(filePath);
        // Pipe the uploaded file to disk
        yield new Promise((resolve, reject) => {
            stream.pipe(writeStream);
            stream.on("end", resolve);
            stream.on("error", reject);
        });
        return filename; // Return saved file name
    }
    catch (error) {
        throw new Error(`Error saving file: ${error}`);
    }
});
exports.saveFile = saveFile;
/**
 * Utility to save base64 image string to a file.
 * @param base64Image - The base64 string of the image.
 * @returns The file name of the saved image.
 */
const saveBase64Image = (base64Image) => __awaiter(void 0, void 0, void 0, function* () {
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
        const filePath = path_1.default.join(filePath_1.uploadPath, fileName); // Full path to save the image
        // Decode the base64 string and write it to the file
        const buffer = Buffer.from(data, "base64");
        yield fs_1.default.promises.writeFile(filePath, buffer);
        // Return only the file name (relative to the upload folder)
        return fileName;
    }
    catch (error) {
        throw new Error(`Error saving the image: ${error.message}`);
    }
});
exports.saveBase64Image = saveBase64Image;
