"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const multerConfig_1 = __importDefault(require("@config/multerConfig"));
const _middleware_1 = require("@middleware");
const env_1 = require("@config/env");
const router = (0, express_1.Router)();
router.post("/", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "image", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }]), (0, _middleware_1.appendFile)([{ fileField: "image", bodyField: "image", isArray: false }], env_1.MAX_SLIDER_SIZE), (0, _middleware_1.parseJsonFields)(["buttons"]), _middleware_1.validateSlider, _controllers_1.SliderController.createSlider);
router.patch("/:sliderId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "image", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }]), (0, _middleware_1.appendFile)([{ fileField: "image", bodyField: "image", isArray: false }], env_1.MAX_SLIDER_SIZE), (0, _middleware_1.parseJsonFields)(["buttons"]), _middleware_1.validateSlider, _controllers_1.SliderController.updateSlider);
router.get("/", _controllers_1.SliderController.getSliders);
router.get("/:sliderId", _controllers_1.SliderController.getSliderById);
router.delete("/:sliderId", _middleware_1.isAuthenticated, _controllers_1.SliderController.deleteSlider);
router.patch("/:sliderId/visibility", _middleware_1.isAuthenticated, _controllers_1.SliderController.changeSliderVisibility);
exports.default = router;
