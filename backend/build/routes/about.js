"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const _middleware_1 = require("@middleware");
const multerConfig_1 = __importDefault(require("@config/multerConfig"));
const router = (0, express_1.Router)();
// router.post(
//   "/",
//   isAuthenticated,
//   upload.fields([{ name: "image", maxCount: 1 }]),
//   trackFilesForDeletion([{ fileField: "image" }]),
//   appendFile([{ fileField: "image", bodyField: "image", isArray: false }]),
//   validateAbout,
//   AboutController.createAbout
// );
router.put("/", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "image", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }]), (0, _middleware_1.parseJsonFields)([
    "aboutHero",
    "aboutContent",
    "missionsSection",
    "servicesSection",
    "visionSection",
]), (0, _middleware_1.appendFile)([{ fileField: "image", bodyField: "image", isArray: false }]), _middleware_1.validateAbout, _controllers_1.AboutController.updateAbout);
router.get("/", _controllers_1.AboutController.getAbout);
// router.get("/:aboutId", AboutController.getAboutById);
router.delete("/:aboutId", _middleware_1.isAuthenticated, _controllers_1.AboutController.deleteAbout);
exports.default = router;
