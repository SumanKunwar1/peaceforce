import { Request, Response, NextFunction } from "express";
import { infoSectionService } from "@services";

export class InfoSectionController {
  static async getInfoSection(req: Request, res: Response, next: NextFunction) {
    try {
      const infoSection = await infoSectionService.getInfoSection();
      res.locals.responseData = { infoSection };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateInfoSection(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const infoSectionData = req.body;
      const updatedInfoSection = await infoSectionService.updateInfoSection(
        infoSectionData
      );
      res.locals.responseData = updatedInfoSection;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteInfoSection(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const deletedInfoSection = await infoSectionService.deleteInfoSection();
      res.locals.responseData = deletedInfoSection;
      next();
    } catch (error) {
      next(error);
    }
  }
}
