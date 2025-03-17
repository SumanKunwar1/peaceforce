import { Router } from "express";
import { ProgramController } from "@controllers";
import upload from "@config/multerConfig";
import {
  appendFile,
  isAuthenticated,
  parseJsonFields,
  validateProgram,
  trackFilesForDeletion,
} from "@middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  trackFilesForDeletion([{ fileField: "image" }, { fileField: "gallery" }]),
  parseJsonFields(["programGoals", "requirements", "metaKeywords"]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "gallery", bodyField: "gallery", isArray: true },
  ]),
  validateProgram,
  ProgramController.createProgram
);

// Update an existing program
router.patch(
  "/:programId",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  trackFilesForDeletion([{ fileField: "image" }, { fileField: "gallery" }]),
  parseJsonFields(["programGoals", "requirements", "metaKeywords"]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "gallery", bodyField: "gallery", isArray: true },
  ]),
  parseJsonFields(["gallery"]),
  validateProgram,
  ProgramController.updateProgram
);

router.get("/", ProgramController.getPrograms);

router.get("/:programId", ProgramController.getProgramById);

router.delete("/:programId", isAuthenticated, ProgramController.deleteProgram);

export default router;
