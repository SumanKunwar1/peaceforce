"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const multerConfig_1 = __importDefault(require("@config/multerConfig"));
const _middleware_1 = require("@middleware");
const router = (0, express_1.Router)();
router.post("/", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "image", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }]), (0, _middleware_1.parseJsonFields)([
    "activities",
    "inclusions",
    "highlights",
    "itinerary",
    "metaKeywords",
]), (0, _middleware_1.appendFile)([{ fileField: "image", bodyField: "image", isArray: false }]), _middleware_1.validateTour, _controllers_1.TourController.createTour);
router.patch("/:tourId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "image", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }]), (0, _middleware_1.parseJsonFields)([
    "activities",
    "inclusions",
    "highlights",
    "itinerary",
    "metaKeywords",
]), (0, _middleware_1.appendFile)([{ fileField: "image", bodyField: "image", isArray: false }]), _middleware_1.validateTour, _controllers_1.TourController.updateTour);
router.get("/", _controllers_1.TourController.getTours);
router.get("/:tourId", _controllers_1.TourController.getTourById);
router.delete("/:tourId", _middleware_1.isAuthenticated, _controllers_1.TourController.deleteTour);
exports.default = router;
