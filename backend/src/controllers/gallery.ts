import { Request, Response, NextFunction } from "express";
import { galleryCategoryService } from "@services";
import { httpMessages } from "@utils/HttpMessage";

export class GalleryController {
  // Create a new gallery category
  static async createGalleryCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name } = req.body;
      if (!name && typeof name === "string") {
        next(
          httpMessages.BAD_REQUEST(
            "validation Error: name is required or must be string "
          )
        );
      }
      const galleryCategory =
        await galleryCategoryService.createGalleryCategory(name);
      res.locals.responseData = galleryCategory;
      next();
    } catch (error) {
      next(error);
    }
  }
  static async updateGalleryCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;
      if (!name && typeof name === "string") {
        next(
          httpMessages.BAD_REQUEST(
            "validation Error: name is required or must be string "
          )
        );
      }
      const galleryCategory =
        await galleryCategoryService.updateGalleryCategory(categoryId, name);
      res.locals.responseData = galleryCategory;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get all gallery categories
  static async getGalleryCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const galleryCategories =
        await galleryCategoryService.getGalleryCategories();
      res.locals.responseData = { galleryCategories };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a gallery category by ID
  static async getGalleryCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params;
      const galleryCategory =
        await galleryCategoryService.getGalleryCategoryById(categoryId);
      res.locals.responseData = { galleryCategory };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update a gallery category
  static async insertGalleryEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params;
      const galleryCategoryData = req.body;
      const updatedGalleryCategory =
        await galleryCategoryService.insertGalleryEvent(
          categoryId,
          galleryCategoryData
        );
      res.locals.responseData = updatedGalleryCategory;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateGalleryEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId, eventId } = req.params;
      const galleryCategoryData = req.body;
      const updatedGalleryCategory =
        await galleryCategoryService.updateGalleryEvent(
          categoryId,
          eventId,
          galleryCategoryData
        );
      res.locals.responseData = updatedGalleryCategory;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete a gallery category
  static async deleteGalleryCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params;
      const deletedGalleryCategory =
        await galleryCategoryService.deleteGalleryCategory(categoryId);
      res.locals.responseData = deletedGalleryCategory;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Insert images into an event
  static async insertEventImages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId, eventId } = req.params;
      const { images } = req.body;

      if (!images) {
        throw httpMessages.BAD_REQUEST("validation error: images is required");
      }

      if (!Array.isArray(images)) {
        throw new Error("Images must be an array.");
      }

      const response = await galleryCategoryService.insertEventImages(
        eventId,
        categoryId,
        images
      );

      res.locals.responseData = response;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, eventId } = req.params;

      const response = await galleryCategoryService.getEventById(
        categoryId,
        eventId
      );

      res.locals.responseData = response;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete images from an event
  static async deleteEventImage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId, eventId } = req.params;
      const { images } = req.body;

      if (!Array.isArray(images)) {
        throw new Error("Images must be an array.");
      }

      const response = await galleryCategoryService.deleteEventImage(
        eventId,
        categoryId,
        images
      );

      res.locals.responseData = response;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, eventId } = req.params;

      const response = await galleryCategoryService.deleteEvent(
        eventId,
        categoryId
      );

      res.locals.responseData = response;
      next();
    } catch (error) {
      next(error);
    }
  }
}
