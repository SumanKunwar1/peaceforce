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
exports.BlogPostController = void 0;
const _services_1 = require("@services");
class BlogPostController {
    static createBlogPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogPostData = req.body;
                const blogPost = yield _services_1.blogPostService.createBlogPost(blogPostData);
                res.locals.responseData = blogPost;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getBlogPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogPosts = yield _services_1.blogPostService.getBlogPosts();
                res.locals.responseData = { blogPosts };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getBlogPostById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { blogPostId } = req.params;
                const blogPost = yield _services_1.blogPostService.getBlogPostById(blogPostId);
                res.locals.responseData = { blogPost };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateBlogPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { blogPostId } = req.params;
                const blogPostData = req.body;
                const updatedBlogPost = yield _services_1.blogPostService.updateBlogPost(blogPostId, blogPostData);
                res.locals.responseData = updatedBlogPost;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteBlogPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { blogPostId } = req.params;
                const deletedBlogPost = yield _services_1.blogPostService.deleteBlogPost(blogPostId);
                res.locals.responseData = deletedBlogPost;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.BlogPostController = BlogPostController;
