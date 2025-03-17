import { Router } from "express";
import { AboutController } from "../controllers";
import {
  appendFile,
  isAuthenticated,
  validateAbout,
  trackFilesForDeletion,
  parseJsonFields,
} from "../middleware";
import upload from "../config/multerConfig";

const router = Router();

// router.post(
//   "/",
//   isAuthenticated,
//   upload.fields([{ name: "image", maxCount: 1 }]),
//   trackFilesForDeletion([{ fileField: "image" }]),
//   appendFile([{ fileField: "image", bodyField: "image", isArray: false }]),
//   validateAbout,
//   AboutController.createAbout
// );

router.put(
  "/",
  isAuthenticated,
  upload.fields([{ name: "image", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "image" }]),
  parseJsonFields([
    "aboutHero",
    "aboutContent",
    "missionsSection",
    "servicesSection",
    "visionSection",
  ]),
  appendFile([{ fileField: "image", bodyField: "image", isArray: false }]),
  validateAbout,
  AboutController.updateAbout
);

router.get("/", AboutController.getAbout);

// router.get("/:aboutId", AboutController.getAboutById);

router.delete("/:aboutId", isAuthenticated, AboutController.deleteAbout);

export default router;
