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
exports.FAQController = void 0;
const _services_1 = require("@services");
class FAQController {
    static createFAQ(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faqData = req.body;
                const faq = yield _services_1.faqService.createFAQ(faqData);
                res.locals.responseData = faq;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getFAQs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faqs = yield _services_1.faqService.getFAQs();
                res.locals.responseData = { faqs };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getFAQById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { faqId } = req.params;
                const faq = yield _services_1.faqService.getFAQById(faqId);
                res.locals.responseData = { faq };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateFAQ(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { faqId } = req.params;
                const faqData = req.body;
                const updatedFAQ = yield _services_1.faqService.updateFAQ(faqId, faqData);
                res.locals.responseData = updatedFAQ;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteFAQ(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { faqId } = req.params;
                const deletedFAQ = yield _services_1.faqService.deleteFAQ(faqId);
                res.locals.responseData = deletedFAQ;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.FAQController = FAQController;
