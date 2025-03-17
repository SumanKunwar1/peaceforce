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
exports.supportService = void 0;
const _models_1 = require("@models");
const deleteFile_1 = require("@utils/deleteFile");
const HttpMessage_1 = require("@utils/HttpMessage");
class SupportService {
    // Fetch the single support document
    getSupport() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const support = yield _models_1.Support.findOne(); // Since there's only one document
                if (!support) {
                    return null;
                }
                const supportObj = support.toObject();
                supportObj.hero.image = supportObj.hero.image
                    ? `/api/image/${supportObj.hero.image}`
                    : supportObj.hero.image;
                return supportObj;
            }
            catch (error) {
                console.error("Error fetching support:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Update the single support document
    updateSupport(supportData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                let existingSupport = yield _models_1.Support.findOne();
                if (!existingSupport) {
                    existingSupport = new _models_1.Support(); // Create a new document if none exists
                }
                if ((_a = supportData.hero) === null || _a === void 0 ? void 0 : _a.image) {
                    if (((_b = supportData.hero) === null || _b === void 0 ? void 0 : _b.image) === "") {
                        if (existingSupport.hero.image) {
                            yield (0, deleteFile_1.deleteFile)(existingSupport.hero.image);
                        }
                        supportData.hero.image = "";
                    }
                    else if (!supportData.hero.image.startsWith("/api/image/")) {
                        if (existingSupport.hero.image) {
                            yield (0, deleteFile_1.deleteFile)(existingSupport.hero.image);
                        }
                    }
                }
                Object.assign(existingSupport, supportData); // Merge new data with existing data
                yield existingSupport.save();
                return existingSupport;
            }
            catch (error) {
                console.error("Error updating support:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Delete the single support document
    deleteSupport() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const supportToDelete = yield _models_1.Support.findOne();
                if (!supportToDelete) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Support");
                }
                if ((_a = supportToDelete.hero) === null || _a === void 0 ? void 0 : _a.image) {
                    yield (0, deleteFile_1.deleteFile)(supportToDelete.hero.image);
                }
                yield _models_1.Support.findByIdAndDelete(supportToDelete._id);
                return `Support document has been deleted`;
            }
            catch (error) {
                console.error("Error deleting support:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.supportService = new SupportService();
