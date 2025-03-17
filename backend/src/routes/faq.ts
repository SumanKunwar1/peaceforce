import { Router } from "express";
import { FAQController } from "@controllers";
import { isAuthenticated, validateFAQ, validateFAQUpdate } from "@middleware";

const router = Router();

router.post("/", isAuthenticated, validateFAQ, FAQController.createFAQ);

router.patch(
  "/:faqId",
  isAuthenticated,
  validateFAQUpdate,
  FAQController.updateFAQ
);

router.get("/", FAQController.getFAQs);

router.get("/:faqId", FAQController.getFAQById);

router.delete("/:faqId", isAuthenticated, FAQController.deleteFAQ);

export default router;
