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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsLetterService = void 0;
const _models_1 = require("@models");
const mongoose_1 = __importDefault(require("mongoose"));
class NewsLetterService {
    createNewsLetter(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsLetter = new _models_1.NewsLetter({
                email,
            });
            yield newsLetter.save();
            return newsLetter;
        });
    }
    getNewsLetters() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _models_1.NewsLetter.find();
        });
    }
    getNewsLetterById(newsLetterId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(newsLetterId)) {
                throw new Error("Invalid newsLetterId format.");
            }
            const newsLetter = yield _models_1.NewsLetter.findById(newsLetterId);
            if (!newsLetter) {
                throw new Error("NewsLetter not found.");
            }
            return newsLetter;
        });
    }
    deleteNewsLetter(newsLetterId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(newsLetterId)) {
                throw new Error("Invalid newsLetterId format.");
            }
            const newsLetterToDelete = yield _models_1.NewsLetter.findById(newsLetterId);
            if (!newsLetterToDelete) {
                throw new Error("NewsLetter not found.");
            }
            const deletedNewsLetter = yield _models_1.NewsLetter.findByIdAndDelete(newsLetterId);
            if (!deletedNewsLetter) {
                throw new Error("NewsLetter not found.");
            }
            return deletedNewsLetter;
        });
    }
}
exports.newsLetterService = new NewsLetterService();
