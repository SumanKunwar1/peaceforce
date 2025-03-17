import { Router } from "express";
import { BlogPostController } from "@controllers";
import upload from "@config/multerConfig";
import {
  appendFile,
  isAuthenticated,
  validateBlogPost,
  trackFilesForDeletion,
  parseJsonFields,
} from "@middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  trackFilesForDeletion([{ fileField: "image" }, { fileField: "avatar" }]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "avatar", bodyField: "author.avatar", isArray: false },
  ]),
  parseJsonFields(["metaKeywords"]),
  validateBlogPost,
  BlogPostController.createBlogPost
);

router.patch(
  "/:blogPostId",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  trackFilesForDeletion([{ fileField: "image" }, { fileField: "avatar" }]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "avatar", bodyField: "author.avatar", isArray: false },
  ]),
  parseJsonFields(["metaKeywords"]),
  validateBlogPost,
  BlogPostController.updateBlogPost
);

router.get("/", BlogPostController.getBlogPosts);

router.get("/:blogPostId", BlogPostController.getBlogPostById);

router.delete(
  "/:blogPostId",
  isAuthenticated,
  BlogPostController.deleteBlogPost
);

export default router;
