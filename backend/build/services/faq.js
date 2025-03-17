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
exports.faqService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
class FAQService {
    createFAQ(faqData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { question, answer, category } = faqData;
            if (!question || !answer) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Question and Answer are required.");
            }
            const faq = new _models_1.FAQ({ question, answer, category });
            yield faq.save();
            return faq;
        });
    }
    // Get all FAQs
    getFAQs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _models_1.FAQ.find();
        });
    }
    // Get a single FAQ by ID
    getFAQById(faqId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(faqId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid FAQ ID format.");
            }
            const faq = yield _models_1.FAQ.findById(faqId);
            if (!faq) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("FAQ not found.");
            }
            return faq;
        });
    }
    updateFAQ(faqId, faqData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(faqId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid FAQ ID format.");
            }
            const updatedFAQ = yield _models_1.FAQ.findByIdAndUpdate(faqId, faqData, {
                new: true,
            });
            if (!updatedFAQ) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("FAQ not found.");
            }
            return updatedFAQ;
        });
    }
    deleteFAQ(faqId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(faqId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid FAQ ID format.");
            }
            const deletedFAQ = yield _models_1.FAQ.findByIdAndDelete(faqId);
            if (!deletedFAQ) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("FAQ not found.");
            }
            return deletedFAQ;
        });
    }
}
exports.faqService = new FAQService();
