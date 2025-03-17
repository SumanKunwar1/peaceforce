"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const multerConfig_1 = __importDefault(require("@config/multerConfig"));
const _middleware_1 = require("@middleware");
const router = (0, express_1.Router)();
router.post("/", _middleware_1.isAuthenticated, multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }, { fileField: "avatar" }]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "avatar", bodyField: "author.avatar", isArray: false },
]), (0, _middleware_1.parseJsonFields)(["metaKeywords"]), _middleware_1.validateBlogPost, _controllers_1.BlogPostController.createBlogPost);
router.patch("/:blogPostId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }, { fileField: "avatar" }]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "avatar", bodyField: "author.avatar", isArray: false },
]), (0, _middleware_1.parseJsonFields)(["metaKeywords"]), _middleware_1.validateBlogPost, _controllers_1.BlogPostController.updateBlogPost);
router.get("/", _controllers_1.BlogPostController.getBlogPosts);
router.get("/:blogPostId", _controllers_1.BlogPostController.getBlogPostById);
router.delete("/:blogPostId", _middleware_1.isAuthenticated, _controllers_1.BlogPostController.deleteBlogPost);
exports.default = router;
