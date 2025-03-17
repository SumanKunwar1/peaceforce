import { Router } from "express";
import { BookingFormController } from "@controllers";
import {
  isAuthenticated,
  validateBookingForm,
  validateBookingUpdate,
} from "@middleware";

const router = Router();

router.post(
  "/",
  validateBookingForm,
  BookingFormController.createBookingForm
);

router.patch(
  "/:bookingFormId",
  isAuthenticated,
  validateBookingUpdate,
  BookingFormController.updateBookingForm
);

router.get("/",
  isAuthenticated, BookingFormController.getBookingForms);

router.get("/:bookingFormId",
  isAuthenticated, BookingFormController.getBookingFormById);

router.delete(
  "/:bookingFormId",
  isAuthenticated,
  BookingFormController.deleteBookingForm
);

export default router;
