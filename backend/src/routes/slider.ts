import { Router } from "express";
import { SliderController } from "@controllers";
import upload from "@config/multerConfig";
import {
  isAuthenticated,
  parseJsonFields,
  trackFilesForDeletion,
  appendFile,
  validateSlider,
} from "@middleware";
import { MAX_SLIDER_SIZE } from "@config/env";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  upload.fields([{ name: "image", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "image" }]),
  appendFile(
    [{ fileField: "image", bodyField: "image", isArray: false }],
    MAX_SLIDER_SIZE
  ),
  parseJsonFields(["buttons"]),
  validateSlider,
  SliderController.createSlider
);

router.patch(
  "/:sliderId",
  isAuthenticated,
  upload.fields([{ name: "image", maxCount: 1 }]),
  trackFilesForDeletion([{ fileField: "image" }]),
  appendFile(
    [{ fileField: "image", bodyField: "image", isArray: false }],
    MAX_SLIDER_SIZE
  ),
  parseJsonFields(["buttons"]),
  validateSlider,
  SliderController.updateSlider
);

router.get("/", SliderController.getSliders);

router.get("/:sliderId", SliderController.getSliderById);

router.delete("/:sliderId", isAuthenticated, SliderController.deleteSlider);

router.patch(
  "/:sliderId/visibility",
  isAuthenticated,
  SliderController.changeSliderVisibility
);

export default router;
