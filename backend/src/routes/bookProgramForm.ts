import { Router } from "express";
import { BookProgramController } from "@controllers";
import {
  isAuthenticated,
  validateProgramBookingForm,
  validateProgramBookingUpdate,
} from "@middleware";

const router = Router();

router.post(
  "/",
  validateProgramBookingForm,
  BookProgramController.createBookProgram
);

router.patch(
  "/:bookingId",
  isAuthenticated,
  validateProgramBookingUpdate,
  BookProgramController.updateBookProgram
);

router.get("/",
  isAuthenticated, BookProgramController.getBookPrograms);

router.get("/:bookingId", 
  isAuthenticated,BookProgramController.getBookProgramById);

router.delete(
  "/:bookingId",
  isAuthenticated,
  BookProgramController.deleteBookProgram
);

export default router;
