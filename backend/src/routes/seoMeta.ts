import express from "express";
import { SeoMetaController } from "../controllers";
import {
  isAuthenticated,
  validateSeoMeta,
  validateSeoMetaUpdate,
} from "../middleware";

const router = express.Router();

router.get("/", SeoMetaController.getSeoMeta);

router.get("/:pageTitle", SeoMetaController.getSeoMetaByPage);

router.post(
  "/",
  isAuthenticated,
  validateSeoMeta,
  SeoMetaController.createSeoMeta
);

router.patch(
  "/:seoMetaId",
  isAuthenticated,
  validateSeoMetaUpdate,
  SeoMetaController.updateSeoMeta
);

router.delete("/:seoMetaId", isAuthenticated, SeoMetaController.deleteSeoMeta);

export default router;
