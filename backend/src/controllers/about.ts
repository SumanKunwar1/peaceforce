import { Request, Response, NextFunction } from "express";
import { aboutService } from "@services"; // Assuming you have a service for About

export class AboutController {
  // Create a new About section
  static async createAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const aboutData = req.body;
      const about = await aboutService.createAbout(aboutData);
      res.locals.responseData = about;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get the About section
  static async getAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const about = await aboutService.getAbout();
      res.locals.responseData = { about };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get the About section by ID (if needed)
  static async getAboutById(req: Request, res: Response, next: NextFunction) {
    try {
      const { aboutId } = req.params; // Assuming aboutId is the parameter
      const about = await aboutService.getAboutById(aboutId);
      res.locals.responseData = { about };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update an existing About section
  static async updateAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const aboutData = req.body;
      const updatedAbout = await aboutService.updateAbout(aboutData);
      res.locals.responseData = updatedAbout;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete an About section
  static async deleteAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const { aboutId } = req.params; // Assuming aboutId is the parameter
      const deletedAbout = await aboutService.deleteAbout(aboutId);
      res.locals.responseData = deletedAbout;
      next();
    } catch (error) {
      next(error);
    }
  }
}
