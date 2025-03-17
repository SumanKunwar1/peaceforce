import { Request, Response, NextFunction } from "express";
import { statsService } from "../services";

export class StatsController {
  // Create a new stat
  static async createStat(req: Request, res: Response, next: NextFunction) {
    try {
      const statData = req.body;
      const newStat = await statsService.createStat(statData);
      res.locals.responseData = newStat;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get all stats
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getStats();
      res.locals.responseData = { stats };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a single stat by ID
  static async getStatById(req: Request, res: Response, next: NextFunction) {
    try {
      const { statId } = req.params;
      const stat = await statsService.getStatById(statId);
      res.locals.responseData = stat;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update a stat by ID
  static async updateStat(req: Request, res: Response, next: NextFunction) {
    try {
      const { statId } = req.params;
      const statData = req.body;
      const updatedStat = await statsService.updateStat(statId, statData);
      res.locals.responseData = updatedStat;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete a stat by ID
  static async deleteStat(req: Request, res: Response, next: NextFunction) {
    try {
      const { statId } = req.params;
      const deletedStat = await statsService.deleteStat(statId);
      res.locals.responseData = deletedStat;
      next();
    } catch (error) {
      next(error);
    }
  }
}
