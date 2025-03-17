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
exports.blogPostService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
const deleteFile_1 = require("@utils/deleteFile");
class BlogPostService {
    createBlogPost(blogPostData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBlogPost = new _models_1.BlogPost(Object.assign({}, blogPostData));
                yield newBlogPost.save();
                return newBlogPost;
            }
            catch (error) {
                console.error("Error creating blog post:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getBlogPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogPosts = yield _models_1.BlogPost.find();
                // Modify the response to include full URLs for images
                return blogPosts.map((post) => {
                    var _a;
                    const blogPost = post.toObject();
                    return Object.assign(Object.assign({}, blogPost), { image: blogPost.image
                            ? `/api/image/${blogPost.image}`
                            : blogPost.image, author: Object.assign(Object.assign({}, blogPost.author), { avatar: ((_a = blogPost.author) === null || _a === void 0 ? void 0 : _a.avatar)
                                ? `/api/image/${blogPost.author.avatar}`
                                : blogPost.author.avatar }) });
                });
            }
            catch (error) {
                console.error("Error fetching blog posts:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getBlogPostById(blogPostId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const blogPost = yield _models_1.BlogPost.findById(blogPostId);
                if (!blogPost) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Blog post");
                }
                const blogPostObj = blogPost.toObject();
                if (blogPostObj.image) {
                    blogPostObj.image = `/api/image/${blogPostObj.image}`;
                }
                if ((_a = blogPostObj.author) === null || _a === void 0 ? void 0 : _a.avatar) {
                    blogPostObj.author.avatar = `/api/image/${blogPostObj.author.avatar}`;
                }
                return blogPostObj;
            }
            catch (error) {
                console.error("Error fetching blog post by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateBlogPost(blogPostId, blogPostData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const existingBlogPost = yield _models_1.BlogPost.findById(blogPostId);
                if (!existingBlogPost) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Blog post");
                }
                // Handle avatar field
                // Handle avatar field
                if ((_a = blogPostData.author) === null || _a === void 0 ? void 0 : _a.avatar) {
                    console.log("Processing avatar field...");
                    if (blogPostData.author.avatar === "") {
                        console.log("Avatar field is empty. Deleting existing avatar if present...");
                        if ((_b = existingBlogPost.author) === null || _b === void 0 ? void 0 : _b.avatar) {
                            console.log(`Deleting existing avatar: ${existingBlogPost.author.avatar}`);
                            yield (0, deleteFile_1.deleteFile)(existingBlogPost.author.avatar);
                        }
                        blogPostData.author.avatar = ""; // Set empty string
                        console.log("Avatar has been cleared. New avatar is set to an empty string.");
                    }
                    else if (!blogPostData.author.avatar.startsWith("/api/image/")) {
                        console.log("Avatar URL seems to be a new file path, updating avatar...");
                        if ((_c = existingBlogPost.author) === null || _c === void 0 ? void 0 : _c.avatar) {
                            console.log(`Deleting old avatar: ${existingBlogPost.author.avatar}`);
                            yield (0, deleteFile_1.deleteFile)(existingBlogPost.author.avatar);
                        }
                        // Save new avatar filename (assuming it's already saved somewhere)
                        console.log(`New avatar image file: ${blogPostData.author.avatar}`);
                        blogPostData.author.avatar = blogPostData.author.avatar;
                    }
                }
                // Handle image field
                if (blogPostData.image) {
                    console.log("Processing image field...");
                    if (blogPostData.image === "") {
                        console.log("Image field is empty. Deleting existing image if present...");
                        if (existingBlogPost.image) {
                            console.log(`Deleting existing image: ${existingBlogPost.image}`);
                            yield (0, deleteFile_1.deleteFile)(existingBlogPost.image);
                        }
                        blogPostData.image = ""; // Set empty string
                        console.log("Image has been cleared. New image is set to an empty string.");
                    }
                    else if (!blogPostData.image.startsWith("/api/image/")) {
                        console.log("Image URL seems to be a new file path, updating image...");
                        if (existingBlogPost.image) {
                            console.log(`Deleting old image: ${existingBlogPost.image}`);
                            yield (0, deleteFile_1.deleteFile)(existingBlogPost.image);
                        }
                        // Save new image filename (assuming it's already saved somewhere)
                        console.log(`New image file: ${blogPostData.image}`);
                        blogPostData.image = blogPostData.image;
                    }
                }
                // Update the blog post in the database
                const updatedBlogPost = yield _models_1.BlogPost.findByIdAndUpdate(blogPostId, blogPostData, { new: true });
                if (!updatedBlogPost) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Blog post");
                }
                return updatedBlogPost;
            }
            catch (error) {
                console.error("Error updating blog post:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteBlogPost(blogPostId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const blogPostToDelete = yield _models_1.BlogPost.findById(blogPostId);
                if (!blogPostToDelete) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Blog post");
                }
                // Delete image and avatar files if they exist
                if (blogPostToDelete.image) {
                    yield (0, deleteFile_1.deleteFile)(blogPostToDelete.image);
                }
                if ((_a = blogPostToDelete.author) === null || _a === void 0 ? void 0 : _a.avatar) {
                    yield (0, deleteFile_1.deleteFile)(blogPostToDelete.author.avatar);
                }
                // Delete the blog post itself
                yield _models_1.BlogPost.findByIdAndDelete(blogPostId);
                return blogPostToDelete;
            }
            catch (error) {
                console.error("Error deleting blog post:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.blogPostService = new BlogPostService();
