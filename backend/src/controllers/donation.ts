import { Request, Response, NextFunction } from "express";
import { donationService } from "@services";

export class DonationController {
  // Create a new donation
  static async createDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const donationData = req.body;
      const donation = await donationService.createDonation(donationData);
      res.locals.responseData = donation;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a list of all donations
  static async getDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const donations = await donationService.getDonations();
      res.locals.responseData = { donations };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get a single donation by ID
  static async getDonationById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { donationId } = req.params;
      const donation = await donationService.getDonationById(donationId);
      res.locals.responseData = { donation };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete a donation
  static async deleteDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const { donationId } = req.params;
      const deletedDonation = await donationService.deleteDonation(donationId);
      res.locals.responseData = deletedDonation;
      next();
    } catch (error) {
      next(error);
    }
  }
}
