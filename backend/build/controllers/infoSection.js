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
exports.InfoSectionController = void 0;
const _services_1 = require("@services");
class InfoSectionController {
    static getInfoSection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const infoSection = yield _services_1.infoSectionService.getInfoSection();
                res.locals.responseData = { infoSection };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateInfoSection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const infoSectionData = req.body;
                const updatedInfoSection = yield _services_1.infoSectionService.updateInfoSection(infoSectionData);
                res.locals.responseData = updatedInfoSection;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteInfoSection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedInfoSection = yield _services_1.infoSectionService.deleteInfoSection();
                res.locals.responseData = deletedInfoSection;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.InfoSectionController = InfoSectionController;
