import { Router } from "express";
import { TeamController } from "../controllers";
import upload from "../config/multerConfig";
import {
  appendFile,
  isAuthenticated,
  validateTeam,
  trackFilesForDeletion,
  parseJsonFields,
} from "../middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  upload.fields([{ name: "image", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "image" }]),
  parseJsonFields(["socialLinks", "metaKeywords"]),
  appendFile([{ fileField: "image", bodyField: "image", isArray: false }]),
  validateTeam,
  TeamController.createTeamMember
);

router.patch(
  "/:teamMemberId",
  isAuthenticated,
  upload.fields([{ name: "image", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "image" }]),
  parseJsonFields(["socialLinks", "metaKeywords"]),
  appendFile([{ fileField: "image", bodyField: "image", isArray: false }]),
  validateTeam,
  TeamController.updateTeamMember
);

router.get("/", TeamController.getTeamMembers);

router.get("/:teamMemberId", TeamController.getTeamMemberById);

router.delete(
  "/:teamMemberId",
  isAuthenticated,
  TeamController.deleteTeamMember
);

export default router;
