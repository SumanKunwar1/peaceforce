import { Request, Response, NextFunction } from "express";
import { membershipService } from "@services";

export class MembershipController {
  static async createMembership(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const membershipData = req.body;
      const membership = await membershipService.createMembership(
        membershipData
      );
      res.locals.responseData = membership;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getMemberships(req: Request, res: Response, next: NextFunction) {
    try {
      const memberships = await membershipService.getMemberships();
      res.locals.responseData = { memberships };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getMembershipById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { membershipId } = req.params;
      const membership = await membershipService.getMembershipById(
        membershipId
      );
      res.locals.responseData = { membership };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateMembership(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { membershipId } = req.params;
      const membershipData = req.body;
      const updatedMembership = await membershipService.updateMembership(
        membershipId,
        membershipData
      );
      res.locals.responseData = updatedMembership;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteMembership(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { membershipId } = req.params;
      const deletedMembership = await membershipService.deleteMembership(
        membershipId
      );
      res.locals.responseData = deletedMembership;
      next();
    } catch (error) {
      next(error);
    }
  }
}
