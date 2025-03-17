import { Router } from "express";
import { EventController } from "../controllers";
import { handleResponse } from "../utils/handleResponse";
import { handleError } from "../utils/handleError";
import upload from "../config/multerConfig";
import {
  appendFile,
  isAuthenticated,
  parseJsonFields,
  validateEvent,
  trackFilesForDeletion,
} from "../middleware";

const router = Router();

// Create a new event
router.post(
  "/",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  trackFilesForDeletion([{ fileField: "image" }, { fileField: "gallery" }]),
  parseJsonFields(["ticketTypes", "metaKeywords"]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "gallery", bodyField: "gallery", isArray: true },
  ]),
  validateEvent,
  EventController.createEvent
);

// Update an existing event
router.patch(
  "/:eventId",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  trackFilesForDeletion([{ fileField: "image" }, { fileField: "gallery" }]),
  parseJsonFields(["ticketTypes", "metaKeywords"]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "gallery", bodyField: "gallery", isArray: true }, // Assuming we update gallery too
  ]),
  parseJsonFields(["gallery"]),
  validateEvent,
  EventController.updateEvent
);

// Get all events
router.get("/", EventController.getEvents);

// Get a specific event by ID
router.get("/:eventId", EventController.getEventById);

// Delete an event
router.delete("/:eventId", isAuthenticated, EventController.deleteEvent);

export default router;
