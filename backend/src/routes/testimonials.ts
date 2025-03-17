import { Router } from "express";
import { TestimonialController } from "../controllers";
import { validateTestimonial } from "../middleware";

const router = Router();

router.get("/", TestimonialController.getTestimonials);

router.get("/:id", TestimonialController.getTestimonialById);

router.post("/", validateTestimonial, TestimonialController.createTestimonial);

router.patch(
  "/:id",
  validateTestimonial,
  TestimonialController.updateTestimonial
);

router.delete("/:id", TestimonialController.deleteTestimonial);

export default router;
