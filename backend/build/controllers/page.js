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
exports.PageController = void 0;
const _services_1 = require("@services"); // Import the corresponding service
class PageController {
    static createPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageData = req.body;
                const page = yield _services_1.pageService.createPage(pageData);
                res.locals.responseData = page;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getPages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pages = yield _services_1.pageService.getPages();
                res.locals.responseData = { pages };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getPublishedPages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pages = yield _services_1.pageService.getPublishedPages();
                res.locals.responseData = { pages };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getPageBySlug(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const modifiedSlug = slug.replace(/%20| /g, "-");
                console.log("Original Slug:", slug);
                console.log("Modified Slug (Spaces or %20 to Hyphens):", modifiedSlug);
                // Fetch page data based on the modified slug
                const page = yield _services_1.pageService.getPageBySlug(modifiedSlug);
                res.locals.responseData = { page };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updatePage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pageId } = req.params;
                const pageData = req.body;
                const updatedPage = yield _services_1.pageService.updatePage(pageId, pageData);
                res.locals.responseData = updatedPage;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deletePage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pageId } = req.params;
                const deletedPage = yield _services_1.pageService.deletePage(pageId);
                res.locals.responseData = deletedPage;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PageController = PageController;
