import { Request, Response, NextFunction } from "express";
import { bookingFormService } from "../services";

export class BookingFormController {
  static async createBookingForm(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bookingFormData = req.body;
      const bookingForm = await bookingFormService.createBookingForm(
        bookingFormData
      );
      res.locals.responseData = bookingForm;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getBookingForms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bookingForms = await bookingFormService.getBookingForms();
      res.locals.responseData = { bookingForms };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getBookingFormById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingFormId } = req.params;
      const bookingForm = await bookingFormService.getBookingFormById(
        bookingFormId
      );
      res.locals.responseData = { bookingForm };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateBookingForm(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingFormId } = req.params;
      const bookingFormData = req.body;
      const updatedBookingForm = await bookingFormService.updateBookingForm(
        bookingFormId,
        bookingFormData
      );
      res.locals.responseData = updatedBookingForm;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteBookingForm(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingFormId } = req.params;
      const deletedBookingForm = await bookingFormService.deleteBookingForm(
        bookingFormId
      );
      res.locals.responseData = deletedBookingForm;
      next();
    } catch (error) {
      next(error);
    }
  }
}
