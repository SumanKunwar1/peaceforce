import { Router } from "express";
import { NewsLetterController } from "../controllers";
import { isAuthenticated, validateAbout } from "../middleware";

const router = Router();

router.post("/", NewsLetterController.createNewsLetter);

router.get("/", isAuthenticated, NewsLetterController.getNewsLetters);

router.get(
  "/:newsLetterId",
  isAuthenticated,
  NewsLetterController.getNewsLetterById
);

router.delete(
  "/:newsLetterId",
  isAuthenticated,
  NewsLetterController.deleteNewsLetter
);

export default router;
