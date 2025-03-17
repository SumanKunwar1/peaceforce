import { Request, Response, NextFunction } from "express";
import { programService } from "@services"; // Importing the program service

export class ProgramController {
  static async createProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const programData = req.body;
      const program = await programService.createProgram(programData);
      res.locals.responseData = program;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getPrograms(req: Request, res: Response, next: NextFunction) {
    try {
      const programs = await programService.getPrograms();
      res.locals.responseData = { programs };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getProgramById(req: Request, res: Response, next: NextFunction) {
    try {
      const { programId } = req.params;
      const program = await programService.getProgramById(programId);
      res.locals.responseData = { program };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const { programId } = req.params;
      const programData = req.body;
      const updatedProgram = await programService.updateProgram(
        programId,
        programData
      );
      res.locals.responseData = updatedProgram;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const { programId } = req.params;
      const deletedProgram = await programService.deleteProgram(programId);
      res.locals.responseData = deletedProgram;
      next();
    } catch (error) {
      next(error);
    }
  }
}
