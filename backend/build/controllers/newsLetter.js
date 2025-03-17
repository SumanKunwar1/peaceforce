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
exports.NewsLetterController = void 0;
const _services_1 = require("@services");
const HttpMessage_1 = require("@src/utils/HttpMessage");
class NewsLetterController {
    static createNewsLetter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email || typeof email !== "string") {
                    next(HttpMessage_1.httpMessages.BAD_REQUEST("Email is absent or invalid"));
                }
                const newsLetter = yield _services_1.newsLetterService.createNewsLetter(email);
                res.locals.responseData = newsLetter;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getNewsLetters(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newsLetters = yield _services_1.newsLetterService.getNewsLetters();
                res.locals.responseData = { newsLetters };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getNewsLetterById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newsLetterId } = req.params;
                const newsLetter = yield _services_1.newsLetterService.getNewsLetterById(newsLetterId);
                res.locals.responseData = { newsLetter };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteNewsLetter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newsLetterId } = req.params;
                const deletedNewsLetter = yield _services_1.newsLetterService.deleteNewsLetter(newsLetterId);
                res.locals.responseData = deletedNewsLetter;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.NewsLetterController = NewsLetterController;
