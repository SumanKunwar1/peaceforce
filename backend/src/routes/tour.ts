import { Router } from "express";
import { TourController } from "@controllers";
import upload from "@config/multerConfig";
import {
  appendFile,
  isAuthenticated,
  validateTour,
  trackFilesForDeletion,
  parseJsonFields,
} from "@middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  upload.fields([{ name: "image", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "image" }]),
  parseJsonFields([
    "activities",
    "inclusions",
    "highlights",
    "itinerary",
    "metaKeywords",
  ]),
  appendFile([{ fileField: "image", bodyField: "image", isArray: false }]),
  validateTour,
  TourController.createTour
);

router.patch(
  "/:tourId",
  isAuthenticated,
  upload.fields([{ name: "image", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "image" }]),
  parseJsonFields([
    "activities",
    "inclusions",
    "highlights",
    "itinerary",
    "metaKeywords",
  ]),
  appendFile([{ fileField: "image", bodyField: "image", isArray: false }]),
  validateTour,
  TourController.updateTour
);

router.get("/", TourController.getTours);

router.get("/:tourId", TourController.getTourById);

router.delete("/:tourId", isAuthenticated, TourController.deleteTour);

export default router;
