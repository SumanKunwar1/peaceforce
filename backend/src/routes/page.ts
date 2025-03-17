import { Router } from "express";
import { PageController } from "../controllers";
import { isAuthenticated, validatePage } from "../middleware";

const router = Router();

router.post("/", isAuthenticated, validatePage, PageController.createPage);

router.get("/", isAuthenticated, PageController.getPages);

router.get("/published/status", PageController.getPublishedPages);

router.get("/:slug", PageController.getPageBySlug);

router.patch(
  "/:pageId",
  isAuthenticated,
  validatePage,
  PageController.updatePage
);

router.delete("/:pageId", isAuthenticated, PageController.deletePage);

export default router;
