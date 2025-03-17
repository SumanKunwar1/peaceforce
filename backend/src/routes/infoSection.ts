import { Router } from "express";
import { InfoSectionController } from "../controllers";
import {
  isAuthenticated,
  validateInfoSection,
  parseJsonFields,
} from "../middleware";

const router = Router();

router.get("/", InfoSectionController.getInfoSection);

router.put(
  "/",
  isAuthenticated,
  validateInfoSection,
  InfoSectionController.updateInfoSection
);

router.delete("/", isAuthenticated, InfoSectionController.deleteInfoSection);

export default router;
