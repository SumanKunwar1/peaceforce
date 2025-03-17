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
exports.deleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath_1 = require("./filePath");
/**
 * Utility to delete an image by filename.
 * @param fileName - The name of the file to be deleted.
 */
const deleteFile = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(filePath_1.uploadPath, fileName); // Resolve the full file path
        // Check if the file exists before attempting to delete
        if (fs_1.default.existsSync(filePath)) {
            yield fs_1.default.promises.unlink(filePath); // Delete the file
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteFile = deleteFile;
