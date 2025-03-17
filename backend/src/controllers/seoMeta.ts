import { Request, Response, NextFunction } from "express";
import { seoMetaService } from "../services";

export class SeoMetaController {
  static async getSeoMeta(req: Request, res: Response, next: NextFunction) {
    try {
      const seoMeta = await seoMetaService.getSeoMeta();
      res.locals.responseData = { seoMeta };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getSeoMetaByPage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { pageTitle } = req.params;
      const seoMeta = await seoMetaService.getSeoMetaByPage(pageTitle);
      res.locals.responseData = { seoMeta };
      next(); // Pass it to the next middleware/handler
    } catch (error) {
      next(error);
    }
  }

  static async createSeoMeta(req: Request, res: Response, next: NextFunction) {
    try {
      const seoMetaData = req.body;

      const updatedSeoMeta = await seoMetaService.createSeoMeta(seoMetaData);
      res.locals.responseData = updatedSeoMeta;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateSeoMeta(req: Request, res: Response, next: NextFunction) {
    try {
      const { seoMetaId } = req.params;
      const seoMetaData = req.body;

      const updatedSeoMeta = await seoMetaService.updateSeoMeta(
        seoMetaId,
        seoMetaData
      );
      res.locals.responseData = updatedSeoMeta;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteSeoMeta(req: Request, res: Response, next: NextFunction) {
    try {
      const { seoMetaId } = req.params;
      const deletedSeoMeta = await seoMetaService.deleteSeoMeta(seoMetaId);
      res.locals.responseData = deletedSeoMeta;
      next();
    } catch (error) {
      next(error);
    }
  }
}
