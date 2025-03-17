import { Request, Response, NextFunction } from "express";
import { courseCategoryService } from "../services"; // This should be the updated import

export class CourseController {
  // Create a new course category
  static async createCourseCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const courseCategoryData = req.body;
      const courseCategory = await courseCategoryService.createCourseCategory(
        courseCategoryData
      );
      res.locals.responseData = courseCategory;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get all course categories
  static async getCourseCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const courseCategories =
        await courseCategoryService.getCourseCategories();
      res.locals.responseData = { courseCategories };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a course category by ID
  static async getCourseCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params; // Assuming categoryId is the parameter
      const courseCategory = await courseCategoryService.getCourseById(
        categoryId
      );
      res.locals.responseData = { courseCategory };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update an existing course category
  static async updateCourseCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params; // Assuming categoryId is the parameter
      const courseCategoryData = req.body;
      const updatedCourseCategory =
        await courseCategoryService.updateCourseCategory(
          categoryId,
          courseCategoryData
        );
      res.locals.responseData = updatedCourseCategory;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete a course category
  static async deleteCourseCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params; // Assuming categoryId is the parameter
      const deletedCourseCategory =
        await courseCategoryService.deleteCourseCategory(categoryId);
      res.locals.responseData = deletedCourseCategory;
      next();
    } catch (error) {
      next(error);
    }
  }
}
