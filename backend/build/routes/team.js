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
router.post("/", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "image", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }]), (0, _middleware_1.parseJsonFields)(["socialLinks", "metaKeywords"]), (0, _middleware_1.appendFile)([{ fileField: "image", bodyField: "image", isArray: false }]), _middleware_1.validateTeam, _controllers_1.TeamController.createTeamMember);
router.patch("/:teamMemberId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "image", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }]), (0, _middleware_1.parseJsonFields)(["socialLinks", "metaKeywords"]), (0, _middleware_1.appendFile)([{ fileField: "image", bodyField: "image", isArray: false }]), _middleware_1.validateTeam, _controllers_1.TeamController.updateTeamMember);
router.get("/", _controllers_1.TeamController.getTeamMembers);
router.get("/:teamMemberId", _controllers_1.TeamController.getTeamMemberById);
router.delete("/:teamMemberId", _middleware_1.isAuthenticated, _controllers_1.TeamController.deleteTeamMember);
exports.default = router;
