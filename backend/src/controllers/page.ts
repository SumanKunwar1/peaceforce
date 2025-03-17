import { Request, Response, NextFunction } from "express";
import { pageService } from "../services"; // Import the corresponding service

export class PageController {
  static async createPage(req: Request, res: Response, next: NextFunction) {
    try {
      const pageData = req.body;
      const page = await pageService.createPage(pageData);
      res.locals.responseData = page;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getPages(req: Request, res: Response, next: NextFunction) {
    try {
      const pages = await pageService.getPages();
      res.locals.responseData = { pages };
      next();
    } catch (error) {
      next(error);
    }
  }
  static async getPublishedPages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pages = await pageService.getPublishedPages();
      res.locals.responseData = { pages };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getPageBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const modifiedSlug = slug.replace(/%20| /g, "-");

      console.log("Original Slug:", slug);
      console.log("Modified Slug (Spaces or %20 to Hyphens):", modifiedSlug);

      // Fetch page data based on the modified slug
      const page = await pageService.getPageBySlug(modifiedSlug);
      res.locals.responseData = { page };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updatePage(req: Request, res: Response, next: NextFunction) {
    try {
      const { pageId } = req.params;
      const pageData = req.body;
      const updatedPage = await pageService.updatePage(pageId, pageData);
      res.locals.responseData = updatedPage;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deletePage(req: Request, res: Response, next: NextFunction) {
    try {
      const { pageId } = req.params;
      const deletedPage = await pageService.deletePage(pageId);
      res.locals.responseData = deletedPage;
      next();
    } catch (error) {
      next(error);
    }
  }
}
