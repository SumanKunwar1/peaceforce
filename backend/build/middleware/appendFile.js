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
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendFile = void 0;
const compressFile_1 = require("@config/compressFile");
const env_1 = require("@config/env");
const HttpMessage_1 = require("@utils/HttpMessage");
/**
 * To append the file to body and also compress the files simultaneously
 * @param fieldMappings contains the variable name of the file and the body to which it should be appended
 * @param fileSize this is the maximum allowed size of the images, if not provided it has max-image-size value, if provided we can customize it: this is in consideration to the different file sizes required for normal image and the slider image
 * @returns none
 */
const appendFile = (fieldMappings, fileSize = env_1.MAX_IMAGE_SIZE) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const files = req.files;
        for (const { fileField, bodyField, isArray } of fieldMappings) {
            const file = files === null || files === void 0 ? void 0 : files[fileField];
            if (file && Array.isArray(file) && file.length > 0) {
                const filenames = file.map((f) => f.filename);
                if (bodyField.includes(".")) {
                    const keys = bodyField.split(".");
                    let obj = req.body;
                    keys.forEach((key, index) => __awaiter(void 0, void 0, void 0, function* () {
                        if (index === keys.length - 1) {
                            obj[key] = !isArray ? filenames[0] : filenames;
                            if (bodyField !== "cv" && bodyField !== "coverLetter") {
                                try {
                                    yield compressImage(obj[key], fileSize);
                                }
                                catch (err) {
                                    return next(HttpMessage_1.httpMessages.BAD_REQUEST(`${err}`));
                                }
                            }
                        }
                        else {
                            obj[key] = obj[key] || {};
                            obj = obj[key];
                        }
                    }));
                }
                else {
                    req.body[bodyField] = !isArray ? filenames[0] : filenames;
                    if (bodyField !== "cv" && bodyField !== "coverLetter") {
                        try {
                            // Await the compression
                            yield compressImage(req.body[bodyField], fileSize);
                        }
                        catch (err) {
                            return next(HttpMessage_1.httpMessages.BAD_REQUEST(`${err}`));
                        }
                    }
                }
            }
        }
        next(); // Continue the flow after processing all fields
    });
};
exports.appendFile = appendFile;
/**
 * Compress the image and wait for the operation to complete
 */
const compressImage = (imageName, fileSize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (Array.isArray(imageName)) {
            // Handle array of image names, compress them all concurrently
            yield Promise.all(imageName.map((name) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, compressFile_1.compressImageMiddleware)(name, fileSize);
            })));
        }
        else {
            // Handle a single image file
            yield (0, compressFile_1.compressImageMiddleware)(imageName, fileSize);
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
