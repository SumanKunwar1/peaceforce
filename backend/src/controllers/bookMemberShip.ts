import { Request, Response, NextFunction } from "express";
import { bookMembershipService } from "../services";

export class BookMembershipController {
  // Create a new membership booking
  static async createBookMembership(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bookMembershipData = req.body;
      const bookMembership = await bookMembershipService.createBookMembership(
        bookMembershipData
      );
      res.locals.responseData = bookMembership;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get all membership bookings
  static async getBookMemberships(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bookMemberships = await bookMembershipService.getBookMemberships();
      res.locals.responseData = { bookMemberships };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a single membership booking by ID
  static async getBookMembershipById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookMembershipId } = req.params;
      const bookMembership = await bookMembershipService.getBookMembershipById(
        bookMembershipId
      );
      res.locals.responseData = { bookMembership };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update a membership booking by ID
  static async updateBookMembership(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookMembershipId } = req.params;
      const bookMembershipData = req.body;
      const updatedBookMembership =
        await bookMembershipService.updateBookMembership(
          bookMembershipId,
          bookMembershipData
        );
      res.locals.responseData = updatedBookMembership;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete a membership booking by ID
  static async deleteBookMembership(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookMembershipId } = req.params;
      const deletedBookMembership =
        await bookMembershipService.deleteBookMembership(bookMembershipId);
      res.locals.responseData = deletedBookMembership;
      next();
    } catch (error) {
      next(error);
    }
  }
}
