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
exports.ensureUploadFolderExists = exports.uploadPath = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("@config/env");
// Resolve the absolute upload path dynamically
exports.uploadPath = path_1.default.join(__dirname, "../../../", env_1.UPLOAD_FOLDER);
// Ensure the upload folder exists, create it if not
const ensureUploadFolderExists = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_1.default.promises.access(exports.uploadPath, fs_1.default.constants.F_OK);
        console.log("Upload folder already exists");
    }
    catch (_a) {
        yield fs_1.default.promises.mkdir(exports.uploadPath, { recursive: true });
        console.log("Upload folder created successfully");
    }
});
exports.ensureUploadFolderExists = ensureUploadFolderExists;
