import { Request, Response, NextFunction } from "express";
import { teamService } from "@services";

export class TeamController {
  static async createTeamMember(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const teamMemberData = req.body;
      const teamMember = await teamService.createTeamMember(teamMemberData);
      res.locals.responseData = teamMember;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getTeamMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const teamMembers = await teamService.getTeamMembers();
      res.locals.responseData = { teamMembers };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getTeamMemberById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { teamMemberId } = req.params;
      const teamMember = await teamService.getTeamMemberById(teamMemberId);
      res.locals.responseData = { teamMember };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateTeamMember(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { teamMemberId } = req.params;
      const teamMemberData = req.body;
      const updatedTeamMember = await teamService.updateTeamMember(
        teamMemberId,
        teamMemberData
      );
      res.locals.responseData = updatedTeamMember;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteTeamMember(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { teamMemberId } = req.params;
      const deletedTeamMember = await teamService.deleteTeamMember(
        teamMemberId
      );
      res.locals.responseData = deletedTeamMember;
      next();
    } catch (error) {
      next(error);
    }
  }
}
