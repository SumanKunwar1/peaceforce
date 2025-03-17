import { Request, Response, NextFunction } from "express";
import { bookEventService } from "@services";

export class BookEventController {
  static async createBookEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bookingData = req.body;
      const booking = await bookEventService.createBookEvent(bookingData);
      res.locals.responseData = booking;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a list of all bookings
  static async getBookEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await bookEventService.getBookEvents();
      res.locals.responseData = { bookings };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a single booking by ID
  static async getBookEventById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingId } = req.params;
      const booking = await bookEventService.getBookEventById(bookingId);
      res.locals.responseData = { booking };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update an event booking
  static async updateBookEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingId } = req.params;
      const bookingData = req.body;
      const updatedBookEvent = await bookEventService.updateBookEvent(
        bookingId,
        bookingData
      );
      res.locals.responseData = updatedBookEvent;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete an event booking
  static async deleteBookEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingId } = req.params;
      const deletedBookEvent = await bookEventService.deleteBookEvent(
        bookingId
      );
      res.locals.responseData = deletedBookEvent;
      next();
    } catch (error) {
      next(error);
    }
  }
}
