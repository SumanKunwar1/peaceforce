import { Request, Response, NextFunction } from "express";
import { sliderService } from "../services";
export class SliderController {
  // Create a new slider
  static async createSlider(req: Request, res: Response, next: NextFunction) {
    try {
      const sliderData = req.body;
      const slider = await sliderService.createSlider(sliderData);
      res.locals.responseData = slider;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get all sliders
  static async getSliders(req: Request, res: Response, next: NextFunction) {
    try {
      const sliders = await sliderService.getSliders();
      res.locals.responseData = { sliders };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a specific slider by ID
  static async getSliderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { sliderId } = req.params;
      const slider = await sliderService.getSliderById(sliderId);
      res.locals.responseData = { slider };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update an existing slider
  static async updateSlider(req: Request, res: Response, next: NextFunction) {
    try {
      const { sliderId } = req.params;
      const sliderData = req.body;
      const updatedSlider = await sliderService.updateSlider(
        sliderId,
        sliderData
      );
      res.locals.responseData = updatedSlider;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete a slider
  static async deleteSlider(req: Request, res: Response, next: NextFunction) {
    try {
      const { sliderId } = req.params;
      const deletedSlider = await sliderService.deleteSlider(sliderId);
      res.locals.responseData = deletedSlider;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Change the visibility of a slider
  static async changeSliderVisibility(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { sliderId } = req.params;
      const { isVisible } = req.body;
      const updatedSlider = await sliderService.updateSliderVisibility(
        sliderId,
        isVisible
      );
      res.locals.responseData = updatedSlider;
      next();
    } catch (error) {
      next(error);
    }
  }
}
