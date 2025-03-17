import { Request, Response, NextFunction } from "express";
import { adminLoginService } from "../services";

export class AdminLoginController {
  // Controller for admin login
  static async loginAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const adminData = await adminLoginService.loginAdmin(email, password);
      res.locals.responseData = adminData; // Set admin data in response
      next();
    } catch (error) {
      next(error);
    }
  }
}
