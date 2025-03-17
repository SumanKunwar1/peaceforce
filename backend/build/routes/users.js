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
router.post("/", _middleware_1.validateUser, _controllers_1.UserController.createUser);
router.post("/job", multerConfig_1.default.fields([
    { name: "cv", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "cv" }, { fileField: "coverLetter" }]), (0, _middleware_1.appendFile)([
    { fileField: "cv", bodyField: "cv", isArray: false },
    { fileField: "coverLetter", bodyField: "coverLetter", isArray: false },
]), _middleware_1.validateJobApplicator, _controllers_1.UserController.createUser);
router.get("/", _middleware_1.isAuthenticated, _controllers_1.UserController.getUsers);
router.get("/:userId", _middleware_1.isAuthenticated, _controllers_1.UserController.getUserById);
router.patch("/:userId", _middleware_1.isAuthenticated, _controllers_1.UserController.updateUser);
// Route for deleting a user by ID
router.delete("/:userId", _middleware_1.isAuthenticated, _controllers_1.UserController.deleteUser);
exports.default = router;
