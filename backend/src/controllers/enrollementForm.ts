import { Request, Response, NextFunction } from "express";
import { enrollmentService } from "../services";

export class EnrollmentController {
  static async createEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const enrollmentData = req.body;
      const enrollment = await enrollmentService.createEnrollment(
        enrollmentData
      );
      res.locals.responseData = enrollment;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getEnrollments(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollments = await enrollmentService.getEnrollments();
      res.locals.responseData = { enrollments };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getEnrollmentById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { enrollmentId } = req.params;
      const enrollment = await enrollmentService.getEnrollmentById(
        enrollmentId
      );
      res.locals.responseData = { enrollment };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { enrollmentId } = req.params;
      const enrollmentData = req.body;
      const updatedEnrollment = await enrollmentService.updateEnrollment(
        enrollmentId,
        enrollmentData
      );
      res.locals.responseData = updatedEnrollment;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { enrollmentId } = req.params;
      const deletedEnrollment = await enrollmentService.deleteEnrollment(
        enrollmentId
      );
      res.locals.responseData = deletedEnrollment;
      next();
    } catch (error) {
      next(error);
    }
  }
}
