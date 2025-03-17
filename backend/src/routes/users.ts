import { Router } from "express";
import { UserController } from "../controllers";
import {
  validateJobApplicator,
  trackFilesForDeletion,
  appendFile,
  isAuthenticated,
  validateUser,
} from "../middleware";
import upload from "../config/multerConfig";

const router = Router();

router.post("/", validateUser, UserController.createUser);

router.post(
  "/job",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  trackFilesForDeletion([{ fileField: "cv" }, { fileField: "coverLetter" }]),
  appendFile([
    { fileField: "cv", bodyField: "cv", isArray: false },
    { fileField: "coverLetter", bodyField: "coverLetter", isArray: false },
  ]),
  validateJobApplicator,
  UserController.createUser
);

router.get("/", isAuthenticated, UserController.getUsers);

router.get("/:userId", isAuthenticated, UserController.getUserById);

router.patch("/:userId", isAuthenticated, UserController.updateUser);

// Route for deleting a user by ID
router.delete("/:userId", isAuthenticated, UserController.deleteUser);

export default router;
