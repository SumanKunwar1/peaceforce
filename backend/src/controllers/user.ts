import { Request, Response, NextFunction } from "express";
import { userService } from "../services";

export class UserController {
  // Controller for creating a new user
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);
      res.locals.responseData = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Controller for getting all users
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      res.locals.responseData = { users };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Controller for getting a user by ID
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);
      res.locals.responseData = { user };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Controller for updating a user by ID
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const userData = req.body;
      const updatedUser = await userService.updateUser(userId, userData);
      res.locals.responseData = updatedUser;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Controller for deleting a user by ID
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const deletedUser = await userService.deleteUser(userId);
      res.locals.responseData = deletedUser;
      next();
    } catch (error) {
      next(error);
    }
  }
}
