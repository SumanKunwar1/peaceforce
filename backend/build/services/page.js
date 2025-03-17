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
exports.pageService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
class PageService {
    createPage(pageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPage = new _models_1.Page(pageData);
                yield newPage.save();
                return newPage.toObject();
            }
            catch (error) {
                console.error("Error creating page:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getPages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _models_1.Page.find();
            }
            catch (error) {
                console.error("Error fetching pages:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getPublishedPages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _models_1.Page.find({ status: "published" });
            }
            catch (error) {
                console.error("Error fetching pages:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getPageBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Fetch the page directly using findOne, which returns a single document");
                const page = yield this.getPublishedPages(); // assuming this returns an array of pages
                // If the page is not found, throw an error
                if (!page) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Page not found");
                }
                // Find the page by slug from the array (if you're still fetching a list)
                const foundPage = page.find((p) => p.slug === slug);
                if (!foundPage) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Page not found with the given slug");
                }
                // Return the found page as an object (no need for array methods)
                console.log("Page:", foundPage);
                return foundPage; // Return the found page object
            }
            catch (error) {
                console.error("Error fetching page by slug:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updatePage(pageId, pageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPage = yield _models_1.Page.findByIdAndUpdate(pageId, pageData, {
                    new: true,
                });
                if (!updatedPage) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Page not found");
                }
                return updatedPage.toObject();
            }
            catch (error) {
                console.error("Error updating page:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deletePage(pageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageToDelete = yield _models_1.Page.findById(pageId);
                if (!pageToDelete) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Page not found");
                }
                yield _models_1.Page.findByIdAndDelete(pageId);
                return pageToDelete.toObject();
            }
            catch (error) {
                console.error("Error deleting page:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.pageService = new PageService();
