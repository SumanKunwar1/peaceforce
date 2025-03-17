import { Router } from "express";
import { DonationController } from "../controllers";
import { isAuthenticated, validateDonation } from "../middleware";
import upload from "../config/multerConfig";
import { trackFilesForDeletion, appendFile } from "../middleware";

const router = Router();

router.post(
  "/",
  upload.fields([{ name: "screenshot", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "screenshot" }]),
  appendFile([
    { fileField: "screenshot", bodyField: "screenshot", isArray: false },
  ]),
  validateDonation,
  DonationController.createDonation
);

router.get("/", isAuthenticated, DonationController.getDonations);

router.get("/:donationId", isAuthenticated, DonationController.getDonationById);

router.delete(
  "/:donationId",
  isAuthenticated,
  DonationController.deleteDonation
);

export default router;
