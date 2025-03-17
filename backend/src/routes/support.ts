import { Router } from "express";
import { SupportController } from "@controllers";
import upload from "@config/multerConfig";
import {
  appendFile,
  isAuthenticated,
  validateSupport,
  trackFilesForDeletion,
  parseJsonFields,
} from "@middleware";

const router = Router();

router.put(
  "/",
  isAuthenticated,
  upload.fields([{ name: "image", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "image" }]),
  parseJsonFields(["hero", "impacts", "waysToSupport"]),
  appendFile([{ fileField: "image", bodyField: "hero.image", isArray: false }]),
  validateSupport,
  SupportController.updateSupport
);

router.get("/", SupportController.getSupport);

router.delete(
  "/",
  isAuthenticated,
  SupportController.deleteSupport // Controller method to delete support
);

export default router;
