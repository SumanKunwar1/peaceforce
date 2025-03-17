import { Request, Response, NextFunction } from "express";
import { tourService } from "../services";

export class TourController {
  static async createTour(req: Request, res: Response, next: NextFunction) {
    try {
      const tourData = req.body;
      const tour = await tourService.createTour(tourData);
      res.locals.responseData = tour;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getTours(req: Request, res: Response, next: NextFunction) {
    try {
      const tours = await tourService.getTours();
      res.locals.responseData = { tours };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getTourById(req: Request, res: Response, next: NextFunction) {
    try {
      const { tourId } = req.params;
      const tour = await tourService.getTourById(tourId);
      res.locals.responseData = { tour };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateTour(req: Request, res: Response, next: NextFunction) {
    try {
      const { tourId } = req.params;
      const tourData = req.body;
      const updatedTour = await tourService.updateTour(tourId, tourData);
      res.locals.responseData = updatedTour;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteTour(req: Request, res: Response, next: NextFunction) {
    try {
      const { tourId } = req.params;
      const deletedTour = await tourService.deleteTour(tourId);
      res.locals.responseData = deletedTour;
      next();
    } catch (error) {
      next(error);
    }
  }
}
