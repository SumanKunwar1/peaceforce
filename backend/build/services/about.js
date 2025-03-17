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
exports.aboutService = void 0;
const _models_1 = require("@models"); // Assuming these are your models
const HttpMessage_1 = require("@utils/HttpMessage");
const deleteFile_1 = require("@utils/deleteFile");
class AboutService {
    // Create a new About section
    createAbout(aboutData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newAbout = new _models_1.About(aboutData);
                yield newAbout.save();
                return newAbout;
            }
            catch (error) {
                console.error("Error creating About section:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getAbout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aboutSections = yield _models_1.About.find();
                return aboutSections.map((about) => {
                    const aboutObj = about.toObject();
                    // Format image URL if image exists
                    aboutObj.image = aboutObj.image
                        ? `/api/image/${aboutObj.image}`
                        : aboutObj.image;
                    return aboutObj;
                });
            }
            catch (error) {
                console.error("Error fetching About sections:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getAboutById(aboutId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const about = yield _models_1.About.findById(aboutId);
                if (!about) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("About section");
                }
                const aboutObj = about.toObject();
                aboutObj.image = aboutObj.image
                    ? `/api/image/${aboutObj.image}`
                    : aboutObj.image;
                return aboutObj;
            }
            catch (error) {
                console.error("Error fetching About section by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateAbout(aboutData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let existingAbout = yield _models_1.About.findOne(); // Find the only About document
                if (aboutData.image) {
                    if (aboutData.image === "") {
                        if (existingAbout === null || existingAbout === void 0 ? void 0 : existingAbout.image) {
                            yield (0, deleteFile_1.deleteFile)(existingAbout.image);
                        }
                        aboutData.image = ""; // Set empty string
                    }
                    else if (!aboutData.image.startsWith("/api/image/")) {
                        if (existingAbout === null || existingAbout === void 0 ? void 0 : existingAbout.image) {
                            yield (0, deleteFile_1.deleteFile)(existingAbout.image);
                        }
                    }
                }
                if (existingAbout) {
                    existingAbout.set(aboutData);
                    yield existingAbout.save();
                    return existingAbout;
                }
                else {
                    const newAbout = new _models_1.About(aboutData);
                    yield newAbout.save();
                    return newAbout;
                }
            }
            catch (error) {
                console.error("Error updating/creating About section:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Delete an About section
    deleteAbout(aboutId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedAbout = yield _models_1.About.findByIdAndDelete(aboutId);
                if (!deletedAbout) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("About section");
                }
                return deletedAbout;
            }
            catch (error) {
                console.error("Error deleting About section:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
// Export an instance of AboutService
exports.aboutService = new AboutService();
