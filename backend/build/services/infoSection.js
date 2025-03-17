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
exports.infoSectionService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
class InfoSectionService {
    getInfoSection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _models_1.InfoSection.findOne();
            }
            catch (error) {
                console.error("Error fetching info section:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateInfoSection(infoSectionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let infoSection = yield _models_1.InfoSection.findOne();
                if (!infoSection) {
                    infoSection = new _models_1.InfoSection(infoSectionData);
                    yield infoSection.save();
                }
                else {
                    infoSection = yield _models_1.InfoSection.findOneAndUpdate({}, infoSectionData, {
                        new: true,
                    });
                }
                if (!infoSection) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Info section");
                }
                return infoSection.toObject();
            }
            catch (error) {
                console.error("Error updating info section:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteInfoSection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const infoSectionToDelete = yield _models_1.InfoSection.findOne();
                if (!infoSectionToDelete) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Info section");
                }
                yield _models_1.InfoSection.deleteOne();
                return infoSectionToDelete.toObject();
            }
            catch (error) {
                console.error("Error deleting info section:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.infoSectionService = new InfoSectionService();
