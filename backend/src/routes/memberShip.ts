import { Router } from "express";
import { MembershipController } from "@controllers";
import { isAuthenticated, validateMembership } from "@middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  validateMembership,
  MembershipController.createMembership
);

router.patch(
  "/:membershipId",
  isAuthenticated,
  validateMembership,
  MembershipController.updateMembership
);

router.get("/", MembershipController.getMemberships);

router.get("/:membershipId", MembershipController.getMembershipById);

router.delete(
  "/:membershipId",
  isAuthenticated,
  MembershipController.deleteMembership
);

export default router;
