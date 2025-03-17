import { Router } from "express";
import { BookMembershipController } from "../controllers";
import upload from "../config/multerConfig";
import {
  isAuthenticated,
  validateBookMembership,
  validateBookMembershipUpdate,
  appendFile,
  trackFilesForDeletion,
} from "../middleware";

const router = Router();

// Create a new membership with image & payment screenshot upload
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "paymentScreenshot", maxCount: 1 },
  ]),
  trackFilesForDeletion([
    { fileField: "image" },
    { fileField: "paymentScreenshot" },
  ]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    {
      fileField: "paymentScreenshot",
      bodyField: "paymentScreenshot",
      isArray: false,
    },
  ]),
  validateBookMembership,
  BookMembershipController.createBookMembership
);

// Update a membership with new images if provided
router.patch(
  "/:bookMembershipId",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "paymentScreenshot", maxCount: 1 },
  ]),
  trackFilesForDeletion([
    { fileField: "image" },
    { fileField: "paymentScreenshot" },
  ]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    {
      fileField: "paymentScreenshot",
      bodyField: "paymentScreenshot",
      isArray: false,
    },
  ]),
  validateBookMembershipUpdate,
  BookMembershipController.updateBookMembership
);

// Get all membership bookings
router.get("/", isAuthenticated, BookMembershipController.getBookMemberships);

// Get a single membership booking by ID
router.get(
  "/:bookMembershipId",
  isAuthenticated,
  BookMembershipController.getBookMembershipById
);

// Delete a membership booking
router.delete(
  "/:bookMembershipId",
  isAuthenticated,
  BookMembershipController.deleteBookMembership
);

export default router;
