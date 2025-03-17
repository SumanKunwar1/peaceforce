import { Router } from "express";
import { GalleryController } from "../controllers";
import upload from "../config/multerConfig";
import {
  appendFile,
  isAuthenticated,
  parseJsonFields,
  validateGalleryEventInsert,
  validateGallery,
  trackFilesForDeletion,
} from "../middleware";

const router = Router();

// Create a new gallery category name
router.post("/", isAuthenticated, GalleryController.createGalleryCategory);
//edit the category name
router.patch(
  "/:categoryId",
  isAuthenticated,
  GalleryController.updateGalleryCategory
);

//insert event to the category
router.patch(
  "/event/:categoryId",
  isAuthenticated,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "coverImage" }]),
  parseJsonFields(["events"]),
  appendFile([
    { fileField: "coverImage", bodyField: "events.coverImage", isArray: false },
  ]),
  validateGalleryEventInsert,
  GalleryController.insertGalleryEvent
);

//edit one event of the category
router.patch(
  "/:categoryId/event/:eventId",
  isAuthenticated,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "coverImage" }]),
  parseJsonFields(["events"]),
  appendFile([
    { fileField: "coverImage", bodyField: "events.coverImage", isArray: false },
  ]),
  validateGalleryEventInsert,
  GalleryController.updateGalleryEvent
);

//get all the gallery category
router.get("/", GalleryController.getGalleryCategories);

//get all dta of specific category
router.get("/:categoryId", GalleryController.getGalleryCategoryById);

router.get("/:categoryId/event/:eventId", GalleryController.getEventById);

//delete entire category
router.delete(
  "/:categoryId",
  isAuthenticated,
  GalleryController.deleteGalleryCategory
);

//insert image to teh event
router.patch(
  "/:categoryId/event/:eventId/images",
  isAuthenticated,
  upload.fields([{ name: "images", maxCount: 30 }]),
  trackFilesForDeletion([{ fileField: "images" }]),
  appendFile([{ fileField: "images", bodyField: "images", isArray: true }]),
  GalleryController.insertEventImages
);

// Delete images from an event
router.delete(
  "/:categoryId/event/:eventId/images",
  isAuthenticated,
  GalleryController.deleteEventImage
);

//delete entire event of a categroy
router.delete(
  "/:categoryId/event/:eventId",
  isAuthenticated,
  GalleryController.deleteEvent
);

export default router;
