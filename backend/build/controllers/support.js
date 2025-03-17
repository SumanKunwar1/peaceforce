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
exports.SupportController = void 0;
const _services_1 = require("@services"); // Importing the support service
class SupportController {
    // Fetch the single support document
    static getSupport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const support = yield _services_1.supportService.getSupport();
                res.locals.responseData = { support };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update the existing support document
    static updateSupport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supportData = req.body;
                const updatedSupport = yield _services_1.supportService.updateSupport(supportData);
                res.locals.responseData = updatedSupport;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete the support document
    static deleteSupport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedSupport = yield _services_1.supportService.deleteSupport();
                res.locals.responseData = deletedSupport;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SupportController = SupportController;
