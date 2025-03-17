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
exports.SeoMetaController = void 0;
const _services_1 = require("@services");
class SeoMetaController {
    static getSeoMeta(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seoMeta = yield _services_1.seoMetaService.getSeoMeta();
                res.locals.responseData = { seoMeta };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getSeoMetaByPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pageTitle } = req.params;
                const seoMeta = yield _services_1.seoMetaService.getSeoMetaByPage(pageTitle);
                res.locals.responseData = { seoMeta };
                next(); // Pass it to the next middleware/handler
            }
            catch (error) {
                next(error);
            }
        });
    }
    static createSeoMeta(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seoMetaData = req.body;
                const updatedSeoMeta = yield _services_1.seoMetaService.createSeoMeta(seoMetaData);
                res.locals.responseData = updatedSeoMeta;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateSeoMeta(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { seoMetaId } = req.params;
                const seoMetaData = req.body;
                const updatedSeoMeta = yield _services_1.seoMetaService.updateSeoMeta(seoMetaId, seoMetaData);
                res.locals.responseData = updatedSeoMeta;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteSeoMeta(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { seoMetaId } = req.params;
                const deletedSeoMeta = yield _services_1.seoMetaService.deleteSeoMeta(seoMetaId);
                res.locals.responseData = deletedSeoMeta;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SeoMetaController = SeoMetaController;
