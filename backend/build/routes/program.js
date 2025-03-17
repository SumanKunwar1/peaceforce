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
router.post("/", _middleware_1.isAuthenticated, multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }, { fileField: "gallery" }]), (0, _middleware_1.parseJsonFields)(["programGoals", "requirements", "metaKeywords"]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "gallery", bodyField: "gallery", isArray: true },
]), _middleware_1.validateProgram, _controllers_1.ProgramController.createProgram);
// Update an existing program
router.patch("/:programId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }, { fileField: "gallery" }]), (0, _middleware_1.parseJsonFields)(["programGoals", "requirements", "metaKeywords"]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "gallery", bodyField: "gallery", isArray: true },
]), (0, _middleware_1.parseJsonFields)(["gallery"]), _middleware_1.validateProgram, _controllers_1.ProgramController.updateProgram);
router.get("/", _controllers_1.ProgramController.getPrograms);
router.get("/:programId", _controllers_1.ProgramController.getProgramById);
router.delete("/:programId", _middleware_1.isAuthenticated, _controllers_1.ProgramController.deleteProgram);
exports.default = router;
