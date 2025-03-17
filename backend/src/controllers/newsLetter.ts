import { Request, Response, NextFunction } from "express";
import { newsLetterService } from "../services";
import { httpMessages } from "../utils/HttpMessage";

export class NewsLetterController {
  static async createNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        next(httpMessages.BAD_REQUEST("Email is absent or invalid"));
      }
      const newsLetter = await newsLetterService.createNewsLetter(email);
      res.locals.responseData = newsLetter;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getNewsLetters(req: Request, res: Response, next: NextFunction) {
    try {
      const newsLetters = await newsLetterService.getNewsLetters();
      res.locals.responseData = { newsLetters };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getNewsLetterById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { newsLetterId } = req.params;
      const newsLetter = await newsLetterService.getNewsLetterById(
        newsLetterId
      );
      res.locals.responseData = { newsLetter };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { newsLetterId } = req.params;
      const deletedNewsLetter = await newsLetterService.deleteNewsLetter(
        newsLetterId
      );
      res.locals.responseData = deletedNewsLetter;
      next();
    } catch (error) {
      next(error);
    }
  }
}
