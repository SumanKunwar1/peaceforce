import { Router } from "express";
import { EnrollmentController } from "../controllers";
import {
  isAuthenticated,
  validateEnrollmentForm,
  validateEnrollmentUpdate,
} from "../middleware";

const router = Router();

router.post("/", validateEnrollmentForm, EnrollmentController.createEnrollment);

router.patch(
  "/:enrollmentId",
  isAuthenticated,
  validateEnrollmentUpdate,
  EnrollmentController.updateEnrollment
);

router.get("/", isAuthenticated, EnrollmentController.getEnrollments);

router.get(
  "/:enrollmentId",
  isAuthenticated,
  EnrollmentController.getEnrollmentById
);

router.delete(
  "/:enrollmentId",
  isAuthenticated,
  EnrollmentController.deleteEnrollment
);

export default router;
