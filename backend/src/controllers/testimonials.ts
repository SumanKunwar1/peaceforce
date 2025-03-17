import { Request, Response, NextFunction } from "express";
import { testimonialService } from "../services";

export class TestimonialController {
  // Get all testimonials
  static async getTestimonials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const testimonials = await testimonialService.getTestimonials();
      res.locals.responseData = testimonials;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get testimonial by ID
  static async getTestimonialById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const testimonial = await testimonialService.getTestimonialById(id);
      res.locals.responseData = testimonial;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Create a testimonial
  static async createTestimonial(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const testimonialData = req.body;
      const createdTestimonial = await testimonialService.createTestimonial(
        testimonialData
      );
      res.locals.responseData = createdTestimonial;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update a testimonial
  static async updateTestimonial(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const testimonialData = req.body;
      const updatedTestimonial = await testimonialService.updateTestimonial(
        id,
        testimonialData
      );
      res.locals.responseData = updatedTestimonial;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete a testimonial
  static async deleteTestimonial(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const deletedTestimonial = await testimonialService.deleteTestimonial(id);
      res.locals.responseData = deletedTestimonial;
      next();
    } catch (error) {
      next(error);
    }
  }
}
