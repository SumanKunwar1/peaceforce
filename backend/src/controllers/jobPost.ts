import { Request, Response, NextFunction } from "express";
import { jobPostService } from "../services";

export class JobPostController {
  static async createJobPost(req: Request, res: Response, next: NextFunction) {
    try {
      const jobData = req.body;
      const jobPost = await jobPostService.createJobPost(jobData);
      res.locals.responseData = jobPost;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getJobPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const jobPosts = await jobPostService.getJobPosts();
      res.locals.responseData = { jobPosts };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getJobPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobPostId } = req.params;
      const jobPost = await jobPostService.getJobPostById(jobPostId);
      res.locals.responseData = { jobPost };
      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateJobPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobPostId } = req.params;
      const jobData = req.body;
      const updatedJobPost = await jobPostService.updateJobPost(
        jobPostId,
        jobData
      );
      res.locals.responseData = updatedJobPost;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async deleteJobPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobPostId } = req.params;
      const deletedJobPost = await jobPostService.deleteJobPost(jobPostId);
      res.locals.responseData = deletedJobPost;
      next();
    } catch (error) {
      next(error);
    }
  }
}
