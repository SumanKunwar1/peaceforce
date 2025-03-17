import { Router } from "express";
import { StatsController } from "@controllers";
import { isAuthenticated, validateStats } from "@middleware";

const router = Router();

router.post("/", isAuthenticated, validateStats, StatsController.createStat);

router.get("/", StatsController.getStats);

router.get("/:statId", StatsController.getStatById);

router.patch(
  "/:statId",
  isAuthenticated,
  validateStats,
  StatsController.updateStat
);

router.delete("/:statId", isAuthenticated, StatsController.deleteStat);

export default router;
