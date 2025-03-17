import { Request, Response, NextFunction } from "express";
import { blogPostService } from "../services";

export class BlogPostController {
  static async createBlogPost(req: Request, res: Response, next: NextFunction) {
    try {
      const blogPostData = req.body;
      const blogPost = await blogPostService.createBlogPost(blogPostData);
      res.locals.responseData = blogPost;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getBlogPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const blogPosts = await blogPostService.getBlogPosts();
      res.locals.responseData = { blogPosts };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getBlogPostById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { blogPostId } = req.params;
      const blogPost = await blogPostService.getBlogPostById(blogPostId);
      res.locals.responseData = { blogPost };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateBlogPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogPostId } = req.params;
      const blogPostData = req.body;
      const updatedBlogPost = await blogPostService.updateBlogPost(
        blogPostId,
        blogPostData
      );
      res.locals.responseData = updatedBlogPost;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteBlogPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogPostId } = req.params;
      const deletedBlogPost = await blogPostService.deleteBlogPost(blogPostId);
      res.locals.responseData = deletedBlogPost;
      next();
    } catch (error) {
      next(error);
    }
  }
}
