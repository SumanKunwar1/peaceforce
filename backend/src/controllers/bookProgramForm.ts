import { Request, Response, NextFunction } from "express";
import { bookProgramService } from "../services";

export class BookProgramController {
  // Create a new program booking
  static async createBookProgram(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bookingData = req.body;
      const booking = await bookProgramService.createBookProgram(bookingData);
      res.locals.responseData = booking;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a list of all program bookings
  static async getBookPrograms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bookings = await bookProgramService.getBookPrograms();
      res.locals.responseData = { bookings };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a single program booking by ID
  static async getBookProgramById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingId } = req.params;
      const booking = await bookProgramService.getBookProgramById(bookingId);
      res.locals.responseData = { booking };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update a program booking
  static async updateBookProgram(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingId } = req.params;
      const bookingData = req.body;
      const updatedBooking = await bookProgramService.updateBookProgram(
        bookingId,
        bookingData
      );
      res.locals.responseData = updatedBooking;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete a program booking
  static async deleteBookProgram(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingId } = req.params;
      const deletedBooking = await bookProgramService.deleteBookProgram(
        bookingId
      );
      res.locals.responseData = deletedBooking;
      next();
    } catch (error) {
      next(error);
    }
  }
}
