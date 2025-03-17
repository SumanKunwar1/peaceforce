import { Router } from "express";
import { JobPostController } from "../controllers";
import { isAuthenticated, validateJobPost } from "../middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  validateJobPost,
  JobPostController.createJobPost
);

router.patch(
  "/:jobPostId",
  isAuthenticated,
  validateJobPost,
  JobPostController.updateJobPost
);

router.get("/", JobPostController.getJobPosts);

router.get("/:jobPostId", JobPostController.getJobPostById);

router.delete("/:jobPostId", isAuthenticated, JobPostController.deleteJobPost);

export default router;
