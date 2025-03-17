import { Request, Response, NextFunction } from "express";
import { contactService } from "@services";

export class ContactController {
  static async createContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contactData = req.body;
      const contact = await contactService.createContact(contactData);
      res.locals.responseData = contact;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const contacts = await contactService.getContacts();
      res.locals.responseData = { contacts };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getContactById(req: Request, res: Response, next: NextFunction) {
    try {
      const { contactId } = req.params;
      const contact = await contactService.getContactById(contactId);
      res.locals.responseData = { contact };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteContact(req: Request, res: Response, next: NextFunction) {
    try {
      const { contactId } = req.params;
      const deletedContact = await contactService.deleteContact(contactId);
      res.locals.responseData = deletedContact;
      next();
    } catch (error) {
      next(error);
    }
  }
}
