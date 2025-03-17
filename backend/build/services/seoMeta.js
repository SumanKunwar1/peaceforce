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
exports.seoMetaService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
class SeoMetaService {
    getSeoMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _models_1.SeoMeta.find();
            }
            catch (error) {
                console.error("Error fetching SEO Meta:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getSeoMetaByPage(pageTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _models_1.SeoMeta.findOne({ pageTitle });
            }
            catch (error) {
                console.error("Error fetching SEO Meta:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateSeoMeta(seoMetaId, seoMetaData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let seoMeta = yield _models_1.SeoMeta.findById(seoMetaId);
                if (!seoMeta) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("SEO Meta");
                }
                yield _models_1.SeoMeta.findByIdAndUpdate(seoMetaId, seoMetaData);
                return seoMeta;
            }
            catch (error) {
                console.error("Error updating SEO Meta:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    createSeoMeta(seoMetaData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seoMeta = new _models_1.SeoMeta(seoMetaData);
                yield seoMeta.save();
                return seoMeta;
            }
            catch (error) {
                console.error("Error updating SEO Meta:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteSeoMeta(seoMetaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seoMetaToDelete = yield _models_1.SeoMeta.findById(seoMetaId);
                if (!seoMetaToDelete) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("SEO Meta");
                }
                yield _models_1.SeoMeta.deleteOne();
                return seoMetaToDelete.toObject();
            }
            catch (error) {
                console.error("Error deleting SEO Meta:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.seoMetaService = new SeoMetaService();
