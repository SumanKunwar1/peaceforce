import { Router } from "express";
import { CourseController } from "@controllers";
import upload from "@config/multerConfig";
import {
  appendFile,
  isAuthenticated,
  parseJsonFields,
  validateCourseCategory,
  trackFilesForDeletion,
} from "@middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "instructorImage", maxCount: 10 },
  ]),
  trackFilesForDeletion([
    { fileField: "image" },
    { fileField: "instructorImage" },
  ]),
  parseJsonFields([
    "metaKeywords",
    "instructor",
    "language",
    "highlights",
    "materials",
  ]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    {
      fileField: "instructorImage",
      bodyField: "instructor.image",
      isArray: false,
    },
  ]),
  validateCourseCategory,
  CourseController.createCourseCategory
);

// Update an existing course category
router.patch(
  "/:categoryId",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "instructorImage", maxCount: 10 },
  ]),
  trackFilesForDeletion([
    { fileField: "image" },
    { fileField: "instructorImage" },
  ]),
  parseJsonFields([
    "metaKeywords",
    "instructor",
    "language",
    "highlights",
    "materials",
  ]),
  appendFile([
    { fileField: "image", bodyField: "image", isArray: false },
    {
      fileField: "instructorImage",
      bodyField: "instructor.image",
      isArray: false,
    },
  ]),
  validateCourseCategory,
  CourseController.updateCourseCategory
);

router.get("/", CourseController.getCourseCategories);

router.get("/:categoryId", CourseController.getCourseCategoryById);

router.delete(
  "/:categoryId",
  isAuthenticated,
  CourseController.deleteCourseCategory
);

export default router;
