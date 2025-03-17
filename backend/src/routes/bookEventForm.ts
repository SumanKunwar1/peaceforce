import { Router } from "express";
import { BookEventController } from "../controllers";
import {
  isAuthenticated,
  validateEventBookingForm,
  validateEventBookingUpdate,
} from "../middleware";

const router = Router();

// Create a new booking form
router.post("/", validateEventBookingForm, BookEventController.createBookEvent);

// Update an existing booking form
router.patch(
  "/:bookingId",
  isAuthenticated,
  validateEventBookingUpdate,
  BookEventController.updateBookEvent
);

// Get all booking forms
router.get("/", isAuthenticated, BookEventController.getBookEvents);

// Get a booking form by its ID
router.get(
  "/:bookingId",
  isAuthenticated,
  BookEventController.getBookEventById
);

// Delete a booking form
router.delete(
  "/:bookingId",
  isAuthenticated,
  BookEventController.deleteBookEvent
);

export default router;
