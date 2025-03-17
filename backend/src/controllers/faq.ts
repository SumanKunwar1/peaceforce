import { Request, Response, NextFunction } from "express";
import { faqService } from "@services";

export class FAQController {
  static async createFAQ(req: Request, res: Response, next: NextFunction) {
    try {
      const faqData = req.body;
      const faq = await faqService.createFAQ(faqData);
      res.locals.responseData = faq;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getFAQs(req: Request, res: Response, next: NextFunction) {
    try {
      const faqs = await faqService.getFAQs();
      res.locals.responseData = { faqs };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getFAQById(req: Request, res: Response, next: NextFunction) {
    try {
      const { faqId } = req.params;
      const faq = await faqService.getFAQById(faqId);
      res.locals.responseData = { faq };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateFAQ(req: Request, res: Response, next: NextFunction) {
    try {
      const { faqId } = req.params;
      const faqData = req.body;
      const updatedFAQ = await faqService.updateFAQ(faqId, faqData);
      res.locals.responseData = updatedFAQ;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteFAQ(req: Request, res: Response, next: NextFunction) {
    try {
      const { faqId } = req.params;
      const deletedFAQ = await faqService.deleteFAQ(faqId);
      res.locals.responseData = deletedFAQ;
      next();
    } catch (error) {
      next(error);
    }
  }
}
