import { Request, Response, NextFunction } from "express";
import { supportService } from "../services"; // Importing the support service

export class SupportController {
  // Fetch the single support document
  static async getSupport(req: Request, res: Response, next: NextFunction) {
    try {
      const support = await supportService.getSupport();
      res.locals.responseData = { support };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update the existing support document
  static async updateSupport(req: Request, res: Response, next: NextFunction) {
    try {
      const supportData = req.body;
      const updatedSupport = await supportService.updateSupport(supportData);
      res.locals.responseData = updatedSupport;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete the support document
  static async deleteSupport(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedSupport = await supportService.deleteSupport();
      res.locals.responseData = deletedSupport;
      next();
    } catch (error) {
      next(error);
    }
  }
}
