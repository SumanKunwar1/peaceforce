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
exports.AboutController = void 0;
const _services_1 = require("@services"); // Assuming you have a service for About
class AboutController {
    // Create a new About section
    static createAbout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aboutData = req.body;
                const about = yield _services_1.aboutService.createAbout(aboutData);
                res.locals.responseData = about;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get the About section
    static getAbout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const about = yield _services_1.aboutService.getAbout();
                res.locals.responseData = { about };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get the About section by ID (if needed)
    static getAboutById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { aboutId } = req.params; // Assuming aboutId is the parameter
                const about = yield _services_1.aboutService.getAboutById(aboutId);
                res.locals.responseData = { about };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update an existing About section
    static updateAbout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aboutData = req.body;
                const updatedAbout = yield _services_1.aboutService.updateAbout(aboutData);
                res.locals.responseData = updatedAbout;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete an About section
    static deleteAbout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { aboutId } = req.params; // Assuming aboutId is the parameter
                const deletedAbout = yield _services_1.aboutService.deleteAbout(aboutId);
                res.locals.responseData = deletedAbout;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AboutController = AboutController;
